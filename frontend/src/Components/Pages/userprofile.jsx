import React, { useEffect, useState } from 'react'
import LeftBar from '../Utilities/LeftBar'
import SearchBar from '../Utilities/SearchBar'
import Post from '../PostComponents/post'
import PostImage from '../PostComponents/postImages'
import Videos from '../PostComponents/postvideo'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'

const FILTERS = [
  { key: 'explore', label: 'All Posts' },
  { key: 'images',  label: 'Photos' },
  { key: 'videos',  label: 'Videos' },
  { key: 'blogs',   label: 'Blogs' },
]

export default function UserProfile() {
  const { username }  = useParams()
  const fallback = 'https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png'
  const [posts, setposts]           = useState()
  const [profileuser, setProfileuser] = useState({})
  const [buttonfollow, setButtonfollow] = useState(false)
  const [activeFilter, setActiveFilter] = useState('explore')

  const userUrl             = `${process.env.REACT_APP_API_URL}/users/profile`
  const getallpostsUser     = `${process.env.REACT_APP_API_URL}/createpost/getalluserposts`
  const getallimagepostsUser= `${process.env.REACT_APP_API_URL}/createpost/getuserposts/images`
  const getallvideopostsUser= `${process.env.REACT_APP_API_URL}/createpost/getuserposts/videos`
  const getallblogpostsUser = `${process.env.REACT_APP_API_URL}/createpost/getuserposts/blogs`
  const followUser          = `${process.env.REACT_APP_API_URL}/follow/user/connect`

  useEffect(() => {
    axios.get(`${userUrl}/${username}`, { withCredentials: true })
      .then(res => {
        setProfileuser(res.data.data)
        setButtonfollow(!!res.data.data.isFollowed)
      }).catch(() => {})
  }, [username])

  useEffect(() => {
    axios.get(`${getallpostsUser}/${username}`, { withCredentials: true })
      .then(res => setposts(res.data.done)).catch(() => {})
  }, [username])

  const filterPosts = (key) => {
    setActiveFilter(key)
    const urls = {
      explore: `${getallpostsUser}/${username}`,
      images:  `${getallimagepostsUser}/${username}`,
      videos:  `${getallvideopostsUser}/${username}`,
      blogs:   `${getallblogpostsUser}/${username}`,
    }
    axios.get(urls[key], { withCredentials: true }).then(res => setposts(res.data.done)).catch(() => {})
  }

  const toggleFollow = () => {
    const newState = !buttonfollow
    setButtonfollow(newState)
    axios.post(followUser, { userId: profileuser._id, toggle: buttonfollow }, { withCredentials: true }).catch(() => {})
  }

  const totalPosts = (profileuser.PostsCount || 0) + (profileuser.ImagePostCount || 0) + (profileuser.VideoPostsCount || 0)

  return (
    <div className="flex h-screen bg-[#090e1a] overflow-hidden">
      <LeftBar/>
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-20 lg:pb-0">
        <SearchBar/>

        <div className="max-w-3xl mx-auto w-full px-4 py-6">
          {/* Profile Hero */}
          <div className="bg-[#111827] border border-[#1f2e47] rounded-2xl overflow-hidden mb-6">
            <div className="h-32 bg-gradient-to-r from-purple-900/50 via-indigo-900/40 to-[#111827] relative">
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent"></div>
            </div>

            <div className="px-6 pb-6 -mt-12 relative">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div className="flex items-end gap-4">
                  <img
                    src={profileuser.avatar || fallback}
                    alt={profileuser.fullname}
                    className="h-24 w-24 rounded-2xl object-cover ring-4 ring-[#090e1a] bg-[#1a2540]"
                  />
                  <div className="pb-1">
                    <h1 className="text-xl font-bold text-white">{profileuser.fullname || username}</h1>
                    <p className="text-sm text-slate-400">@{profileuser.username || username}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pb-1">
                  <button
                    onClick={toggleFollow}
                    className={`flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-xl transition-all duration-200
                      ${buttonfollow
                        ? 'bg-[#1a2540] border border-[#2a3d5c] text-slate-300 hover:border-red-500/50 hover:text-red-400'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
                  >
                    {buttonfollow ? <><i className="fa-solid fa-check text-xs"></i> Connected</> : <>Connect</>}
                  </button>
                  <button className="h-9 w-9 flex items-center justify-center rounded-xl border border-[#2a3d5c] hover:border-indigo-500/50 text-slate-400 hover:text-indigo-400 transition-all">
                    <i className="fa-regular fa-envelope text-sm"></i>
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 mt-5">
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{totalPosts}</p>
                  <p className="text-xs text-slate-400">Posts</p>
                </div>
                <div className="w-px h-8 bg-[#1f2e47]"></div>
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{profileuser.followersCount || 0}</p>
                  <p className="text-xs text-slate-400">Followers</p>
                </div>
                <div className="w-px h-8 bg-[#1f2e47]"></div>
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{profileuser.channelsFollowedToCount || 0}</p>
                  <p className="text-xs text-slate-400">Following</p>
                </div>
                {profileuser.about && (
                  <>
                    <div className="w-px h-8 bg-[#1f2e47]"></div>
                    <p className="text-sm text-slate-300 line-clamp-2 flex-1">{profileuser.about}</p>
                  </>
                )}
              </div>

              {/* Followers grid */}
              {profileuser.followerslist?.length > 0 && (
                <div className="mt-4">
                  <Link to="/h/follow" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 mb-2 block">
                    Connections ({profileuser.followersCount || 0}) →
                  </Link>
                  <div className="flex gap-2 flex-wrap">
                    {profileuser.followerslist.slice(0, 8).map((user, i) => (
                      <img key={i} src={user?.avatar || fallback} alt="" className="h-9 w-9 rounded-lg object-cover ring-1 ring-[#2a3d5c]"/>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#111827] border border-[#1f2e47] rounded-xl mb-4">
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => filterPosts(f.key)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${activeFilter === f.key ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-[#1a2540]'}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Posts */}
          {posts ? (
            <div className="space-y-4">
              {posts.map((post, i) => {
                const author = post.author?.[0]
                if (!author) return null
                const common = {
                  key: post._id, postId: post._id, type: post.type,
                  author: author.username, avatar: author.avatar || fallback,
                  time: post.createdAt, views: post.views,
                  changeToggleBlogPost: () => {}, changeToggleImagePost: () => {}, changeToggleVideoPost: () => {},
                }
                if (post.type === 'image')    return <PostImage {...common} title={post.title} images={post.images}/>
                if (post.type === 'video')    return <Videos {...common} description={post.description} video={post.video}/>
                if (post.type === 'blogpost') return <Post {...common} title={post.title} description={post.description} image={post.image}/>
                return null
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <i className="fa-regular fa-rectangle-list text-5xl mb-4 text-slate-600"></i>
              <p className="text-base font-medium">No posts yet</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
