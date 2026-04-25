import React, { useEffect, useState } from 'react'
import SearchBar from '../Utilities/SearchBar';
import LeftBar from '../Utilities/LeftBar';
import EnvCard from '../envComponents/envCard';
import axios from 'axios'
import { useModalData } from '../../store/hooks';

export default function Environments() {
  const modal = useModalData()
  const [holdEnvData, setholdEnvData] = useState()
  const [search, setSearch] = useState('')
  const getEnvs = `${process.env.REACT_APP_API_URL}/env/getEnvs`

  const refreshEnvs = () => {
    axios.get(getEnvs, { withCredentials: true })
      .then((res) => setholdEnvData(res.data.data))
      .catch(() => {})
  }

  useEffect(() => {
    refreshEnvs()
  }, [])

  const filtered = holdEnvData?.filter((e) =>
    e.name?.toLowerCase().includes(search.toLowerCase()) ||
    e.description?.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="flex h-screen bg-[#090e1a] overflow-hidden">
      <LeftBar/>
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-20 lg:pb-0">
        <SearchBar/>

        <div className="max-w-6xl mx-auto w-full px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Environments</h1>
              <p className="text-sm text-slate-400 mt-1">Join communities that match your interests</p>
            </div>
            <button
              onClick={() => modal.open('create-env', { onCreated: refreshEnvs })}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 shrink-0"
            >
              <i className="fa-solid fa-plus text-xs"></i>
              Create Environment
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 flex items-center gap-3 bg-[#111827] border border-[#1f2e47] rounded-xl px-4 py-2.5 focus-within:border-indigo-500 transition-all">
              <i className="fa-solid fa-magnifying-glass text-slate-500 text-sm"></i>
              <input
                type="text"
                placeholder="Search environments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-slate-200 text-sm placeholder-slate-500 border-none focus:outline-none"
              />
            </div>
          </div>

          {filtered?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((env, i) => (
                <EnvCard
                  key={i}
                  title={env.name}
                  description={env.description}
                  avatar={env.envAvatar}
                  isJoined={env.isJoined}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <i className="fa-solid fa-seedling text-5xl mb-4 text-slate-600"></i>
              <p className="text-base font-medium">No environments found</p>
              <p className="text-sm mt-1">Create one to get started!</p>
              <button
                onClick={() => modal.open('create-env', { onCreated: refreshEnvs })}
                className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
              >
                Create Environment
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
