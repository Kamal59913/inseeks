import React from 'react'
import LeftBar from './Utilities/LeftBar'
import SearchBar from './Utilities/SearchBar'

export default function SearchResults() {
  // Placeholder people data — replace with actual API data
  const people = [
    { name: 'Edward Ford', location: 'Los Angeles, CA', avatar: 'https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png' },
    { name: 'Sophia Patel', location: 'New York, NY', avatar: 'https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png' },
    { name: 'Marcus Lee', location: 'San Francisco, CA', avatar: 'https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png' },
    { name: 'Aisha Rahman', location: 'Chicago, IL', avatar: 'https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png' },
  ]

  return (
    <div className="flex h-screen bg-[#090e1a] overflow-hidden">
      <LeftBar/>

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-20 lg:pb-0">
        <SearchBar/>

        <div className="max-w-4xl mx-auto w-full px-4 py-6 space-y-8">
          {/* People Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                <i className="fa-solid fa-user-group text-indigo-400 text-sm"></i>
                People
              </h2>
              <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">See all →</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {people.map((person, i) => (
                <div key={i} className="flex items-center gap-3 bg-[#111827] border border-[#1f2e47] rounded-xl p-4 hover:border-[#2a3d5c] transition-all group">
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="h-12 w-12 rounded-xl object-cover ring-2 ring-[#2a3d5c] group-hover:ring-indigo-500 transition-all shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-200 truncate">{person.name}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <i className="fa-solid fa-location-dot text-[10px]"></i>
                      {person.location}
                    </p>
                  </div>
                  <button className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-all shrink-0">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Posts Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                <i className="fa-solid fa-newspaper text-indigo-400 text-sm"></i>
                Posts
              </h2>
              <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">See all →</button>
            </div>

            <div className="bg-[#111827] border border-[#1f2e47] rounded-xl flex flex-col items-center justify-center py-20 text-slate-500">
              <i className="fa-regular fa-file-lines text-4xl mb-3 text-slate-600"></i>
              <p className="text-sm">Search for posts above to see results here</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
