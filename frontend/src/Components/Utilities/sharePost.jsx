import React from 'react'
import { useModalData } from '../../store/hooks'

export default function SharePost(props) {
  const modal = useModalData()

  return (
    <div className="bg-[#111827] border border-[#1f2e47] rounded-2xl p-4 w-full hover:border-[#2a3d5c] transition-all duration-200">
      {/* Avatar + prompt */}
      <div className="flex items-center gap-3 mb-4">
        <img
          className="h-10 w-10 rounded-full object-cover ring-2 ring-[#2a3d5c] shrink-0"
          src={props.avatar}
          alt="avatar"
        />
        <button
          type="button"
          onClick={() => modal.open('post-anything', props.modalData)}
          className="flex-1 text-left bg-[#1a2540] text-slate-500 text-sm px-4 py-2.5 rounded-xl hover:bg-[#1e2d4a] hover:text-slate-300 transition-all duration-200 border border-[#2a3d5c]"
        >
          What's on your mind?
        </button>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#1f2e47] mb-3"></div>

      {/* Action buttons */}
      <div className="flex items-center justify-around">
        <button
          type="button"
          onClick={() => modal.open('post-image', props.modalData)}
          className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
        >
          <i className="fa-regular fa-image text-base"></i>
          <span className="hidden sm:inline">Photo</span>
        </button>
        <button
          type="button"
          onClick={() => modal.open('post-video', props.modalData)}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
        >
          <i className="fa-regular fa-video text-base"></i>
          <span className="hidden sm:inline">Video</span>
        </button>
        <button
          type="button"
          onClick={() => modal.open('post-anything', props.modalData)}
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
        >
          <i className="fa-regular fa-pen-to-square text-base"></i>
          <span className="hidden sm:inline">Post</span>
        </button>
      </div>
    </div>
  )
}
