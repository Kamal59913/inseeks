import React, { useState } from 'react'
import RIGHTCOMMENTBAR from '../Utilities/RightSideCommentBar'
import { useModalData } from '../../store/hooks'
import AppModal from '../Modal/AppModal'

export default function ImagePost({ modalId, data }) {
  const modal = useModalData()
  const fallback = 'https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png'
  const [counter, setCounter] = useState(0)
  const temp = data?.temp
  const images = temp?.images || []

  const prev = () => setCounter((c) => Math.max(0, c - 1))
  const next = () => setCounter((c) => Math.min(images.length - 1, c + 1))

  return (
    <AppModal onClose={() => modal.closeById(modalId)} contentClassName="max-w-5xl w-[92vw] h-[90vh] overflow-hidden rounded-2xl border border-[#2a3d5c] bg-[#111827]" outsideClick={true}>
      <div className="flex h-full">
        <div className="flex-1 bg-[#111827] flex flex-col overflow-y-auto">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-[#1f2e47] sticky top-0 bg-[#111827] z-10">
            <img src={temp.avatar || fallback} alt={temp.author} className="h-10 w-10 rounded-full object-cover ring-2 ring-[#2a3d5c]"/>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-200">{temp.author}</p>
              <p className="text-xs text-slate-500">
                {temp.time ? new Date(temp.time).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Just now'}
              </p>
            </div>
          </div>

          <div className="flex-1 flex flex-col px-6 py-5 space-y-4">
            {images.length > 0 && (
              <div className="relative">
                <img src={images[counter]} alt={`image-${counter}`} className="w-full max-h-[50vh] object-contain rounded-xl bg-black"/>
                {images.length > 1 && <>
                  <button onClick={prev} disabled={counter === 0} className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white disabled:opacity-30 transition-all">
                    <i className="fa-solid fa-chevron-left text-sm"></i>
                  </button>
                  <button onClick={next} disabled={counter === images.length - 1} className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white disabled:opacity-30 transition-all">
                    <i className="fa-solid fa-chevron-right text-sm"></i>
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button key={i} onClick={() => setCounter(i)} className={`h-1.5 rounded-full transition-all ${i === counter ? 'w-4 bg-indigo-400' : 'w-1.5 bg-white/40'}`}/>
                    ))}
                  </div>
                </>}
              </div>
            )}
            {temp.title && <p className="text-sm font-semibold text-slate-200">{temp.title}</p>}
          </div>
        </div>

        <RIGHTCOMMENTBAR currentUser={temp.currentUser} currentPostId={temp.postId}/>
      </div>
    </AppModal>
  )
}
