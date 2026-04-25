import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'
import { useAppForm } from '../../hooks/useAppForm'
import { commentSchema } from '../../utils/formSchemas'
import { preprocessTrimmedFormData } from '../../utils/formValidation'

export default function RightSideCommentBar(props) {
  const fallback = 'https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png'
  const [socket, setSocket] = useState()
  const [comments, setComments] = useState([])
  const { register, handleSubmit, reset, watch, formState: { errors } } = useAppForm({
    schema: commentSchema,
    defaultValues: { comment: '' },
  })

  const currentComment = watch('comment') || ''
  const savecomment = `${process.env.REACT_APP_API_URL}/comment/post-comment`
  const getcomment = `${process.env.REACT_APP_API_URL}/comment/retrieve-comment`
  const url = process.env.REACT_APP_BASE_URL

  useEffect(() => {
    const socketInstance = io(url)
    setSocket(socketInstance)
    socketInstance.on('connect', () => console.log('Connected', socketInstance.id))
    socketInstance.on('chat message', (data) => {
      if (data.Post_Id === props.currentPostId) {
        setComments((prev) => [...prev, data])
      }
    })
    return () => socketInstance.disconnect()
  }, [])

  useEffect(() => {
    axios.post(getcomment, { Post_Id: props.currentPostId }, { withCredentials: true })
      .then((res) => setComments(res.data.data))
      .catch(() => {})
  }, [])

  const handlesubmit = (values) => {
    if (!socket) return
    const { comment } = preprocessTrimmedFormData(values)
    const data = {
      Post_Id: props.currentPostId,
      username: props.currentUser?.username,
      avatar: props.currentUser?.avatar,
      content: comment,
    }
    socket.emit('chat message', data)
    axios.post(savecomment, data, { withCredentials: true }).catch(() => {})
    reset()
  }

  return (
    <div className="flex flex-col h-full w-80 bg-[#0d1829] border-l border-[#1f2e47]">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f2e47]">
        <div className="flex items-center gap-2">
          <i className="fa-regular fa-comment text-indigo-400"></i>
          <span className="text-sm font-semibold text-slate-200">Comments</span>
          {comments.length > 0 && (
            <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-medium">{comments.length}</span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 no-scrollbar">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-500">
            <i className="fa-regular fa-comment-dots text-3xl mb-2 text-slate-600"></i>
            <p className="text-sm">No comments yet</p>
            <p className="text-xs mt-1">Be the first to comment!</p>
          </div>
        ) : (
          [...comments].reverse().map((c, i) => (
            <div key={i} className="group">
              <div className="flex items-start gap-2.5">
                <img src={c.avatar || fallback} alt={c.username} className="h-8 w-8 rounded-lg object-cover ring-1 ring-[#2a3d5c] shrink-0 mt-0.5"/>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-slate-200">{c.username}</span>
                    <span className="text-[10px] text-slate-500">just now</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{c.content}</p>
                  <div className="flex items-center gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-red-400 transition-colors">
                      <i className="fa-regular fa-heart"></i> Like
                    </button>
                    <button className="text-[10px] text-slate-500 hover:text-indigo-400 transition-colors">Reply</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit(handlesubmit)} className="px-4 py-3 border-t border-[#1f2e47]">
        <div className="flex items-center gap-2 bg-[#1a2540] border border-[#2a3d5c] rounded-xl px-3 py-2 focus-within:border-indigo-500 transition-all">
          <img src={props.currentUser?.avatar || fallback} alt="" className="h-6 w-6 rounded-full object-cover shrink-0"/>
          <div className="flex-1">
            <input
              type="text"
              {...register('comment')}
              placeholder="Write a commentâ€¦"
              maxLength={281}
              className="w-full bg-transparent text-slate-200 text-xs placeholder-slate-500 focus:outline-none"
            />
            {errors.comment ? <p className="mt-1 text-[10px] text-red-400">{errors.comment.message}</p> : null}
          </div>
          <button type="submit" disabled={!currentComment.trim()} className="text-indigo-400 hover:text-indigo-300 disabled:text-slate-600 transition-colors">
            <i className="fa-solid fa-paper-plane text-sm"></i>
          </button>
        </div>
      </form>
    </div>
  )
}
