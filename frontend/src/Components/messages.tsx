import React from 'react';
import LeftBar from './Utilities/LeftBar';
import { Link } from 'react-router-dom';
import ImageWithFallback from './Common/ImageWithFallback';

import { useMessagesQuery } from '../hooks/useMessagesQuery';
import PageLoader from './Common/PageLoader';

export default function Messages() {
  const { data: messages, isLoading } = useMessagesQuery();

  return (
    <div className="flex flex-col lg:flex-row md:flex-col h-screen overflow-hidden">
      <LeftBar />
      {/* Inbox sidebar */}
      <div className="w-[32%] h-full flex flex-col gap-[7px] cursor-context-menu overflow-y-auto mt-0 mb-7 mx-0 pb-20">
        {/* Search bar */}
        <div className="h-[47px] w-full text-black flex flex-row gap-[7px] mt-7 px-3.5">
          <div className="relative flex-1">
            <input
              type="text"
              name="search"
              placeholder="Search in Social..."
              className="h-[42px] w-full text-black pl-[35px] pr-4 rounded-lg bg-[#1a2540] text-slate-200 border-none focus:outline-none"
            />
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-3.5 text-gray-400 text-sm"></i>
          </div>
          <button className="h-[42px] w-[42px] bg-[#53d768] text-white text-xl rounded-lg border-none shrink-0">
            <i className="fa-solid fa-comment"></i>
          </button>
        </div>

        {/* Header */}
        <div className="text-[26px] font-bold text-[#f7f7f7] ml-3.5 mr-0 mt-[22.4px] mb-0">Inbox</div>

        {/* Tabs */}
        <div className="text-[#f7f7f7] flex flex-row gap-[15.4px] text-[13px] font-semibold cursor-context-menu mt-[8.4px] mb-4 mx-0 pl-3.5">
          <div className="border-b-[2.2px] border-b-indigo-500 border-solid pb-1">Direct Messages</div>
          <div className="text-slate-500 hover:text-slate-300">Group Chat</div>
          <div className="text-slate-500 hover:text-slate-300">Archived</div>
        </div>

        {isLoading ? (
          <div className="p-10 flex justify-center"><PageLoader /></div>
        ) : messages && messages.length > 0 ? (
          messages?.map((msg) => (
            <div key={msg.id} className="w-full flex flex-row px-3.5 py-3 hover:bg-[#111827] transition-all rounded-xl cursor-pointer group">
              <div className="relative shrink-0">
                <ImageWithFallback
                  variant="avatar"
                  className="h-[42px] w-[42px] rounded-lg object-cover ring-2 ring-[#2a3d5c]"
                  src="profile-pic.png"
                  alt=""
                />
                {msg.isOnline && (
                  <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-[#53d768] border-2 border-[#090e1a] rounded-full"></div>
                )}
              </div>
              <div className="flex flex-col flex-1 min-w-0 ml-3">
                <div className="flex flex-row justify-between items-center">
                  <p className="text-[#f7f7f7] text-sm font-semibold truncate">
                    {msg.sender}
                  </p>
                  <p className="text-[10px] font-semibold text-[#8f92a1]">
                    {msg.time}
                  </p>
                </div>
                <div className="flex flex-row justify-between items-center mt-1">
                  <p className="text-xs text-slate-400 truncate pr-2">
                    {msg.message}
                  </p>
                  {msg.unreadCount > 0 && (
                    <span className="h-4 min-w-[16px] px-1 text-[10px] flex items-center justify-center text-white bg-red-500 rounded-full">
                      {msg.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-16 text-center text-slate-500">
            <p className="text-sm">No conversations yet</p>
          </div>
        )}
      </div>

      {/* Open chat panel */}
      <div className="fixed flex flex-col gap-[7px] h-[700px] right-0 w-[51vw]">
        <div className="mt-[21px] ml-[14px] h-[534.8px] w-[50vw] flex flex-row gap-[21px]">
          {/* Left chat column */}
          <div className="h-full w-[27vw] flex flex-col">
            {/* User header */}
            <div className="h-[49px] w-[26vw] flex flex-row">
              <ImageWithFallback variant="avatar" src="profile-pic.png" alt="" className="ml-[23.8px] h-[49px] w-[49px] rounded-[14px]" />
              <div className="ml-[8.4px] h-[49px] w-[75%] flex flex-col text-[#f7f7f7]">
                <p className="mt-[6.3px] text-[15px] font-semibold">Kamallochan Boruah</p>
                <p className="text-xs text-[#f7f7f7]">online</p>
              </div>
            </div>

            {/* Chat messages */}
            <div className="flex flex-col">
              {[1, 2].map((_, i) => (
                <div key={i} className="w-[343px] mt-[39.2px] ml-[16.8px] rounded-[7px] flex flex-row">
                  <ImageWithFallback
                    variant="avatar"
                    className="ml-[16.8px] h-[35px] w-[35px] rounded-lg bg-[powderblue]"
                    src="profile-pic.png"
                    alt=""
                  />
                  <div className="flex flex-col">
                    <div className="flex flex-row">
                      <p className="text-[#f7f7f7] mt-[2.1px] mx-[7px] h-[16.8px] text-[13px] font-semibold cursor-context-menu">
                        Edward Ford
                      </p>
                      <p className="mt-[4.2px] h-[16.8px] w-[10vw] text-xs font-semibold text-[#8f92a1] cursor-context-menu">
                        5:30 pm
                      </p>
                    </div>
                    <div className="flex flex-row">
                      <p className="w-[40vw] mt-[4.2px] ml-[7px] text-xs text-[#f7f7f7]">
                        {' '}
                        Thank you for sharing this information{' '}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right action icons */}
          <div className="h-[10%] w-[20vw] flex flex-row gap-4 text-white text-lg">
            <i className="fa-solid fa-user-plus"></i>
            <i className="fa-solid fa-phone"></i>
            <i className="fa-solid fa-ellipsis-vertical"></i>
          </div>
        </div>

        {/* Message input bar */}
        <div className="ml-[14px] h-[49px] w-[44vw] flex flex-row gap-[7px]">
          <input
            type="text"
            name="message"
            placeholder="Start writing..."
            className="ml-[18.2px] h-[42px] w-[420px] pl-[14px] pr-[42px] bg-[#8f92a120] text-white rounded-[7px] border-none focus:outline-none"
          />
          <i className="fa-regular fa-face-smile text-gray-400 mt-3 ml-[-2rem]"></i>
          <button className="bg-[#53d768] border-none ml-[25.2px] h-[42px] w-[42px] text-xl rounded-lg text-white">
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
