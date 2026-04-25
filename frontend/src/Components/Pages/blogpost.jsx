import React from 'react'
import RIGHTCOMMENTBAR from '../Utilities/RightSideCommentBar'
import { useModalData } from '../../store/hooks'
import AppModal from '../Modal/AppModal'

export default function BlogPost({ modalId, data }) {
  const modal = useModalData()
  const fallback = 'https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png'
  const temp = data?.temp

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

          <div className="px-6 py-5 space-y-4 flex-1">
            {temp.image && <img src={temp.image} alt={temp.title} className="w-full max-h-72 object-cover rounded-xl"/>}
            {temp.title && <h2 className="text-xl font-bold text-slate-100">{temp.title}</h2>}
            {temp.description && <p className="text-sm text-slate-400 leading-relaxed">{temp.description}</p>}
          </div>
        </div>

        <RIGHTCOMMENTBAR currentUser={temp.currentUser} currentPostId={temp.postId}/>
      </div>
    </AppModal>
  )
}
