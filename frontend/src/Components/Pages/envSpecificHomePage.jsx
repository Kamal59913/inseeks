import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from "react-router-dom"
import axios from 'axios'
import LeftBar from '../Utilities/LeftBar'
import SearchBar from '../Utilities/SearchBar'
import Post from '../PostComponents/post'
import PostImage from '../PostComponents/postImages'
import Videos from '../PostComponents/postvideo'
import SharePost from '../Utilities/sharePost'

const FILTERS = [
  { key: 'explore', label: 'All', icon: 'fa-border-all' },
  { key: 'images', label: 'Photos', icon: 'fa-image' },
  { key: 'videos', label: 'Videos', icon: 'fa-video' },
  { key: 'blogs', label: 'Blogs', icon: 'fa-newspaper' },
]

export default function EnvHomepage() {
  const { envname } = useParams()
  const navigate = useNavigate()
  const fallback = 'https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png'

  const [posts, setposts] = useState()
  const [currentUser, setCurrentUser] = useState()
  const [activeFilter, setActiveFilter] = useState('explore')

  const logoutUrl = `${process.env.REACT_APP_API_URL}/users/logout`
  const getallposts = `${process.env.REACT_APP_API_URL}/env/getposts/env/${envname}`
  const getallblogposts = `${process.env.REACT_APP_API_URL}/env/getposts/env/blogs/${envname}`
  const getallimageposts = `${process.env.REACT_APP_API_URL}/env/getposts/env/images/${envname}`
  const getallvideoposts = `${process.env.REACT_APP_API_URL}/env/getposts/env/videos/${envname}`
  const currentuser = `${process.env.REACT_APP_API_URL}/users/current-user`

  useEffect(() => {
    axios.get(currentuser, { withCredentials: true }).then((res) => setCurrentUser(res.data.data))
  }, [])

  useEffect(() => {
    axios.post(getallposts, null, { withCredentials: true })
      .then((res) => setposts(res.data.done)).catch(() => {})
  }, [envname])

  const logout = () => {
    navigate('/')
    axios.post(logoutUrl, null, { withCredentials: true }).catch(() => {})
  }

  const filterPosts = (key) => {
    setActiveFilter(key)
    const urls = { explore: getallposts, images: getallimageposts, videos: getallvideoposts, blogs: getallblogposts }
    axios.post(urls[key], null, { withCredentials: true }).then((res) => setposts(res.data.done)).catch(() => {})
  }

  const updatepost = (newposts) => setposts((prev) => (prev ? [...newposts, ...prev] : newposts))

  return (
    <div className="flex h-screen bg-[#090e1a] overflow-hidden">
      <LeftBar logout={logout}/>

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-20 lg:pb-0">
        <SearchBar/>

        <div className="mx-4 mt-4 bg-gradient-to-r from-indigo-900/60 via-purple-900/30 to-[#111827] border border-[#1f2e47] rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <i className="fa-solid fa-seedling text-indigo-400 text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white capitalize">{envname}</h1>
              <p className="text-sm text-slate-400 mt-0.5">Community feed</p>
            </div>
            <Link to="/environments" className="ml-auto flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-400 transition-colors">
              <i className="fa-solid fa-arrow-left text-xs"></i>
              All Environments
            </Link>
          </div>
        </div>

        <div className="max-w-2xl mx-auto w-full px-4 py-6 space-y-4">
          <div className="flex items-center gap-1 p-1 bg-[#111827] border border-[#1f2e47] rounded-xl">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => filterPosts(f.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${activeFilter === f.key ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-[#1a2540]'}`}
              >
                <i className={`fa-solid ${f.icon} text-xs`}></i>
                <span className="hidden sm:inline">{f.label}</span>
              </button>
            ))}
          </div>

          <SharePost
            avatar={currentUser?.avatar || fallback}
            modalData={{ updatepost, envname }}
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
                  author: author.username,
                  avatar: author.avatar || fallback,
                  time: post.createdAt,
                  views: post.views,
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
              <p className="text-base font-medium">No posts in this environment yet</p>
              <p className="text-sm mt-1">Be the first to post!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
