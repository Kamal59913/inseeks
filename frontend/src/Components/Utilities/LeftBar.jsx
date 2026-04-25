import React from "react"
import { Link, useLocation } from "react-router-dom"

const navItems = [
  { to: '/h',           icon: 'fa-house',              label: 'Home' },
  { to: '/environments',icon: 'fa-seedling',            label: 'Explore' },
  { to: '/h/follow',    icon: 'fa-user-group',          label: 'Network' },
  { to: '/profile',     icon: 'fa-circle-user',         label: 'Profile' },
  { to: '/settings',    icon: 'fa-gear',                label: 'Settings' },
]

export default function LeftBar(props) {
  const location = useLocation()

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col shrink-0 w-60 h-screen bg-[#090e1a] border-r border-[#1f2e47] sticky top-0 py-6 px-3 gap-1">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-3 mb-8">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-seedling text-white text-sm"></i>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Inseeks</span>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(({ to, icon, label }) => {
            const isActive = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${isActive
                    ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-[#1a2540]'
                  }`}
              >
                <i className={`fa-solid ${icon} w-5 text-center ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-indigo-400'} transition-colors`}></i>
                {label}
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400"></div>}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        {props.logout && (
          <button
            onClick={props.logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full"
          >
            <i className="fa-solid fa-right-from-bracket w-5 text-center"></i>
            Logout
          </button>
        )}
      </aside>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#090e1a]/95 backdrop-blur border-t border-[#1f2e47] flex items-center justify-around px-2 py-2">
        {navItems.map(({ to, icon, label }) => {
          const isActive = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all duration-200
                ${isActive ? 'text-indigo-400' : 'text-slate-500'}`}
            >
              <i className={`fa-solid ${icon} text-lg`}></i>
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          )
        })}
        {props.logout && (
          <button
            onClick={props.logout}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-slate-500 transition-all duration-200"
          >
            <i className="fa-solid fa-right-from-bracket text-lg"></i>
            <span className="text-[10px] font-medium">Logout</span>
          </button>
        )}
      </nav>
    </>
  )
}
