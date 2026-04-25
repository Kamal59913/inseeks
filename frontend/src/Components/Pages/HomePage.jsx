import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import axios from 'axios'
import LeftBar from '../Utilities/LeftBar';
import SearchBar from '../Utilities/SearchBar';
import Post from '../PostComponents/post'
import PostImage from '../PostComponents/postImages';
import Videos from '../PostComponents/postvideo';
import SharePost from '../Utilities/sharePost';

const FILTERS = [
  { key: 'explore', label: 'All', icon: 'fa-border-all' },
  { key: 'images', label: 'Photos', icon: 'fa-image' },
  { key: 'videos', label: 'Videos', icon: 'fa-video' },
  { key: 'blogs', label: 'Blogs', icon: 'fa-newspaper' },
]

export default function Homepage() {
  const navigate = useNavigate()
  const [posts, setposts] = useState()
  const [activeFilter, setActiveFilter] = useState('explore')
  const [avatar] = useState('https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png')
  const [currentUser, setCurrentUser] = useState()
  const [userList, setUserList] = useState(null)
  const [buttonStates, setButtonStates] = useState({})

  const logoutUrl = `${process.env.REACT_APP_API_URL}/users/logout`
  const getallposts = `${process.env.REACT_APP_API_URL}/createpost/getposts/h`
  const getallblogposts = `${process.env.REACT_APP_API_URL}/createpost/getposts/h/blogs`
  const getallimageposts = `${process.env.REACT_APP_API_URL}/createpost/getposts/h/images`
  const getallvideoposts = `${process.env.REACT_APP_API_URL}/createpost/getposts/h/videos`
  const currentuser = `${process.env.REACT_APP_API_URL}/users/current-user`
  const userlist = `${process.env.REACT_APP_API_URL}/users/getuserlist`
  const followUser = `${process.env.REACT_APP_API_URL}/follow/user/connect`

  useEffect(() => {
    axios.get(currentuser, { withCredentials: true }).then((res) => setCurrentUser(res.data.data))
  }, [])

  useEffect(() => {
    axios.post(getallposts, null, { withCredentials: true })
      .then((res) => setposts(res.data.done))
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get(userlist, { withCredentials: true }).then((res) => setUserList(res.data.data)).catch(() => {})
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const logout = () => {
    navigate("/")
    axios.post(logoutUrl, null, { withCredentials: true }).catch(() => {})
  }

  const filterPosts = (key) => {
    const urls = { explore: getallposts, images: getallimageposts, videos: getallvideoposts, blogs: getallblogposts }
    setActiveFilter(key)
    axios.post(urls[key], null, { withCredentials: true })
      .then((res) => setposts(res.data.done))
      .catch((err) => console.log(err))
  }

  const connectionRequest = (id) => {
    setButtonStates((prev) => ({ ...prev, [id]: !prev[id] }))
    axios.post(followUser, { userId: id, toggle: false }, { withCredentials: true }).catch(() => {})
  }

  const updatepost = (newposts) => setposts((prev) => (prev ? [...newposts, ...prev] : newposts))

  return (
    <div className="flex h-screen bg-[#090e1a] overflow-hidden">
      <LeftBar logout={logout}/>

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-20 lg:pb-0">
        <SearchBar/>

        <div className="max-w-2xl mx-auto w-full px-4 py-6 space-y-4">
          <div className="flex items-center gap-1 p-1 bg-[#111827] border border-[#1f2e47] rounded-xl">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => filterPosts(f.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${activeFilter === f.key
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-[#1a2540]'}`}
              >
                <i className={`fa-solid ${f.icon} text-xs`}></i>
                <span className="hidden sm:inline">{f.label}</span>
              </button>
            ))}
          </div>

          <SharePost
            avatar={currentUser?.avatar || avatar}
            modalData={{ updatepost }}
          />

          {posts ? (
            <div className="space-y-4">
              {posts.map((post) => {
                const author = post.author?.[0]
                if (!author) return null
                const common = {
                  key: post._id,
                  postId: post._id,
                  type: post.type,
                  _id: author._id,
                  author: author.username,
                  avatar: author.avatar || avatar,
                  time: post.createdAt,
                  editTime: post.updatedAt,
                  views: post.views,
                  isLiked: post.isLiked,
                  likesCount: post.likesCount,
                  currentUser,
                }
                if (post.type === 'image') {
                  return <PostImage {...common} title={post.title} images={post.images}/>
                }
                if (post.type === 'video') {
                  return <Videos {...common} description={post.description} video={post.video}/>
                }
                if (post.type === 'blogpost') {
                  return <Post {...common} title={post.title} description={post.description} image={post.image}/>
                }
                return null
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <i className="fa-regular fa-compass text-5xl mb-4 text-slate-600"></i>
              <p className="text-base font-medium">No posts yet</p>
              <p className="text-sm mt-1">Be the first to share something!</p>
            </div>
          )}
        </div>
      </main>

      <aside className="hidden xl:flex flex-col shrink-0 w-72 h-screen border-l border-[#1f2e47] bg-[#090e1a] py-6 px-4 overflow-y-auto">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">People to Follow</h3>
        <div className="space-y-2">
          {userList?.map((user) => (
            <div key={user._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#111827] transition-all group">
              <img
                src={user.avatar || avatar}
                alt={user.username}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-[#2a3d5c]"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-200 truncate">{user.username}</p>
                <p className="text-xs text-slate-500 truncate">
                  {user.about?.length > 30 ? `${user.about.slice(0, 30)}â€¦` : user.about}
                </p>
              </div>
              <button
                onClick={() => connectionRequest(user._id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 shrink-0
                  ${buttonStates[user._id]
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
              >
                {buttonStates[user._id] ? 'Connected' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
        {userList?.length > 0 && (
          <Link to="/h/follow" className="mt-4 text-center text-sm text-indigo-400 hover:text-indigo-300 transition-colors block">
            See all people â†’
          </Link>
        )}
      </aside>
    </div>
  )
}
