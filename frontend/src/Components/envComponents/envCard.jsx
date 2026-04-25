import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function EnvCard(props) {
  const navigate = useNavigate()
  const [jointoggle, setjointoggle] = useState(false)
  const [loading, setLoading] = useState(false)
  const urltojoin = `${process.env.REACT_APP_API_URL}/env/create-user-join`

  useEffect(() => { setjointoggle(props.isJoined) }, [])

  const onclicking = (e) => {
    e.stopPropagation()
    setLoading(true)
    axios.post(urltojoin, { title: props.title }, { withCredentials: true })
      .then(() => setjointoggle(v => !v))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  return (
    <div
      onClick={() => navigate(`/env-home-page/${props.title}`)}
      className="bg-[#111827] border border-[#1f2e47] rounded-2xl overflow-hidden hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-200 cursor-pointer group"
    >
      {/* Cover Image */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={props.avatar || 'https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png'}
          alt={props.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent"></div>

        {jointoggle && (
          <span className="absolute top-3 right-3 text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            Joined
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-sm font-bold text-slate-100 mb-1">{props.title}</h3>
        <p className="text-xs text-slate-400 line-clamp-2 mb-4">{props.description}</p>

        {/* Member avatars */}
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {[
              'https://overreacted.io/static/profile-pic-c715447ce38098828758e525a1128b87.jpg',
              'https://leerob.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Favatar.b1d1472f.jpg&w=256&q=75',
              'https://nextjs.org/_next/image?url=https%3A%2F%2Fwww.datocms-assets.com%2F35255%2F1665059775-delba.jpg&w=640&q=75',
            ].map((src, i) => (
              <img key={i} src={src} alt="" className="h-7 w-7 rounded-full ring-2 ring-[#111827] object-cover"/>
            ))}
            <div className="h-7 w-7 rounded-full ring-2 ring-[#111827] bg-[#1a2540] flex items-center justify-center">
              <span className="text-[9px] font-bold text-slate-400">+</span>
            </div>
          </div>

          <button
            onClick={onclicking}
            className={`text-xs font-semibold px-4 py-1.5 rounded-xl transition-all duration-200
              ${jointoggle
                ? 'bg-[#1a2540] border border-[#2a3d5c] text-slate-300 hover:border-red-500/50 hover:text-red-400'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
          >
            {loading ? '…' : jointoggle ? 'Leave' : 'Join'}
          </button>
        </div>
      </div>
    </div>
  )
}
