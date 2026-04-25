import React, { useContext, useEffect, useState } from 'react'
import LeftBar from '../Utilities/LeftBar'
import SearchBar from '../Utilities/SearchBar'
import DataContext from '../../Context/myContext'
import axios from 'axios'

export default function MyFriends() {
  const togglefollow = `${process.env.REACT_APP_API_URL}/follow/user/connecttoggle`

  const [activeTab, setActiveTab] = useState('discover')
  const [friendRequestToggle, setfriendRequestToggle] = useState({})
  const [disconnectToggle, setdisconnectToggle] = useState({})
  const { data, fetchData, avatar, datanotfollowed, fetchDataNotFollowed } = useContext(DataContext)

  useEffect(() => { fetchData(); fetchDataNotFollowed() }, [])

  const connectionRequest = (id) => {
    setfriendRequestToggle(prev => ({ ...prev, [id]: !prev[id] }))
    const toggle = friendRequestToggle[id] ? 'connect' : 'connected'
    axios.post(togglefollow, { userId: id, toggle }, { withCredentials: true }).catch(() => {})
  }

  const disconnectionRequest = (id) => {
    setdisconnectToggle(prev => ({ ...prev, [id]: !prev[id] }))
    const toggle = disconnectToggle[id] ? 'connect' : 'disconnected'
    axios.post(togglefollow, { userId: id, toggle }, { withCredentials: true }).catch(() => {})
  }

  const UserCard = ({ user, isConnected, onAction }) => (
    <div className="bg-[#111827] border border-[#1f2e47] rounded-2xl p-5 flex flex-col items-center text-center hover:border-[#2a3d5c] transition-all duration-200 group">
      <div className="relative mb-3">
        <img
          src={user.avatar || avatar}
          alt={user.username}
          className="h-16 w-16 rounded-full object-cover ring-2 ring-[#2a3d5c] group-hover:ring-indigo-500 transition-all"
        />
        <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 border-2 border-[#111827]"></div>
      </div>
      <p className="text-sm font-bold text-slate-200 mb-0.5">{user.fullname || user.username}</p>
      <p className="text-xs text-slate-500 mb-3">@{user.username}</p>
      <button
        onClick={() => onAction(user._id)}
        className={`w-full py-2 rounded-xl text-xs font-semibold transition-all duration-200
          ${isConnected
            ? 'bg-[#1a2540] border border-[#2a3d5c] text-slate-300 hover:border-red-500/50 hover:text-red-400'
            : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
      >
        {isConnected ? 'Disconnect' : 'Connect'}
      </button>
    </div>
  )

  const discover  = datanotfollowed || []
  const connected = data || []

  return (
    <div className="flex h-screen bg-[#090e1a] overflow-hidden">
      <LeftBar/>
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-20 lg:pb-0">
        <SearchBar/>

        <div className="max-w-5xl mx-auto w-full px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">Network</h1>
            <p className="text-sm text-slate-400 mt-1">Discover people and manage your connections</p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#111827] border border-[#1f2e47] rounded-xl mb-6 w-fit">
            <button
              onClick={() => setActiveTab('discover')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${activeTab === 'discover' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-[#1a2540]'}`}
            >
              Discover
            </button>
            <button
              onClick={() => setActiveTab('connected')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2
                ${activeTab === 'connected' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-[#1a2540]'}`}
            >
              Connected
              {connected.length > 0 && (
                <span className="text-xs bg-indigo-500/30 px-1.5 py-0.5 rounded-full">{connected.length}</span>
              )}
            </button>
          </div>

          {/* Grid */}
          {activeTab === 'discover' ? (
            discover.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {discover.map(user => (
                  <UserCard
                    key={user._id}
                    user={user}
                    isConnected={friendRequestToggle[user._id]}
                    onAction={connectionRequest}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-slate-500">
                <i className="fa-regular fa-user text-5xl mb-4 text-slate-600"></i>
                <p>No new people to discover</p>
              </div>
            )
          ) : (
            connected.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {connected.map(user => (
                  <UserCard
                    key={user._id}
                    user={user}
                    isConnected={!disconnectToggle[user._id]}
                    onAction={disconnectionRequest}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-slate-500">
                <i className="fa-regular fa-user-group text-5xl mb-4 text-slate-600"></i>
                <p>No connections yet</p>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  )
}
