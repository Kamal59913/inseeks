import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { useModalData } from '../../store/hooks';

export default function PostVideos(props) {
  const modal = useModalData()
  const [likedata, setlikedata] = useState(null);
  const [likecount, setlikecount] = useState(null)
  const [isliked, setIsLiked] = useState(null)
  const [likebuttontoggle, setlikebuttontoggle] = useState(false)

  const getlikedetails = `${process.env.REACT_APP_API_URL}/like/getlike`
  const likepost = `${process.env.REACT_APP_API_URL}/like/toggle/like`

  const LikeAPost = async (data) => {
    axios.post(likepost, data, { withCredentials: true })
      .then(res => console.log("liked", res)).catch(err => console.log(err))
  }

  const getLikes = () => {
    const data = { PostId: props.postId, type: props.type }
    axios.post(getlikedetails, data, { withCredentials: true })
      .then(res => {
        setlikedata(res.data.data)
        setlikecount(res.data.data.length)
        if (res.data.data[0]) setIsLiked(res.data.data[0].isLiked)
      }).catch(err => console.log(err))
  }

  useEffect(() => { getLikes() }, [likebuttontoggle])

  const onLikeClick = () => {
    const newLikeStatus = !isliked
    setIsLiked(newLikeStatus)
    setlikecount(newLikeStatus ? likecount + 1 : likecount - 1)
    LikeAPost({ PostId: props.postId, type: props.type })
  }

  const sendData = () =>
    modal.open('view-video-post', {
      temp: props,
    })

  return (
    <div className="bg-[#111827] border border-[#1f2e47] rounded-2xl overflow-hidden hover:border-[#2a3d5c] transition-all duration-200 w-full animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <Link to={`/user/${props.author}`}>
          <img className="h-10 w-10 rounded-full object-cover ring-2 ring-[#2a3d5c] hover:ring-indigo-500 transition-all" src={props.avatar} alt={props.author}/>
        </Link>
        <div className="flex-1 min-w-0">
          <Link to={`/user/${props.author}`} className="text-sm font-semibold text-slate-200 hover:text-indigo-400 transition-colors">{props.author}</Link>
          <p className="text-xs text-slate-500 mt-0.5">{new Date(props.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
        </div>
        <button className="text-slate-500 hover:text-slate-300 p-1.5 rounded-lg hover:bg-[#1a2540] transition-all">
          <i className="fa-solid fa-ellipsis-vertical text-sm"></i>
        </button>
      </div>

      {/* Description */}
      {props.description && (
        <p className="px-4 pb-3 text-sm text-slate-400 line-clamp-2">{props.description}</p>
      )}

      {/* Video */}
      {props.video && (
        <div className="px-4 pb-3">
          <video
            src={props.video}
            controls
            className="w-full h-52 rounded-xl object-cover bg-black"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-[#1f2e47]">
        <div className="flex items-center gap-1">
          <button
            onClick={onLikeClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
              ${isliked ? 'text-red-400 bg-red-500/10' : 'text-slate-400 hover:text-red-400 hover:bg-red-500/10'}`}
          >
            <i className={`${isliked ? 'fa-solid' : 'fa-regular'} fa-heart text-base`}></i>
            {likecount !== null && <span>{likecount}</span>}
          </button>
          <button
            onClick={sendData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all duration-200"
          >
            <i className="fa-regular fa-comment text-base"></i>
          </button>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          {props.views !== undefined && <span className="flex items-center gap-1"><i className="fa-regular fa-eye"></i>{props.views}</span>}
          <button className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 px-3 py-1.5 rounded-lg transition-all duration-200">
            <i className="fa-regular fa-share-from-square text-base"></i>
          </button>
        </div>
      </div>
    </div>
  )
}
