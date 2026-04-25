import React from 'react'
import LeftBar from './Utilities/LeftBar'
import { Link } from 'react-router-dom'

export default function Messages() {
  return (
    <div className='flex flex-col lg:flex-row md:flex-col h-screen overflow-hidden'>
        <LeftBar/>
        {/* Inbox sidebar */}
        <div className="w-[32%] h-[644px] flex flex-col gap-[7px] cursor-context-menu overflow-x-hidden mt-0 mb-7 mx-0 pb-7">
            {/* Search bar */}
            <div className="h-[47px] w-[32vw] text-black flex flex-row gap-[7px] mt-7">
                <label></label> <br/>
                <input type="text"
                    name="search"
                    placeholder="Search in Social..."
                    className="h-[42px] w-[16vw] text-black pl-[35px] pr-[70px] rounded-lg border-none"/>
                <br/>
                <button className="h-[44.8px] w-[44.8px] bg-[#53d768] text-white text-xl rounded-lg border-none">
                    <i className='fa-solid fa-comment'></i>
                </button>
                <i className="fa-solid fa-magnifying-glass absolute mt-2 ml-1 text-gray-400 text-sm"></i>
            </div>

            {/* Header */}
            <div className="text-[26px] font-bold text-[#f7f7f7] ml-3.5 mr-0 mt-[22.4px] mb-0">Inbox</div>

            {/* Tabs */}
            <div className="text-[#f7f7f7] flex flex-row gap-[15.4px] text-[13px] font-semibold cursor-context-menu mt-[8.4px] mb-0 mx-0 pl-3.5">
                <div className="border-b-[2.2px] border-b-white border-solid">Direct Messages</div>
                <div className="border-b-[2.2px] border-b-white border-solid">Group Chat</div>
                <div>Archived</div>
            </div>

            {/* Message row 1 */}
            <div className="w-[28vw] flex flex-row ml-[8.4px] mr-0 mt-[21px] mb-0 rounded-[7px]">
                <img className="h-[42px] w-[42px] bg-[powderblue] ml-[7px] mr-0 my-0 rounded-lg" src='profile-pic.png'/>
                <div className="flex flex-col">
                    <div className="flex flex-row">
                        <p className="text-[#f7f7f7] h-[16.8px] w-[20vw] text-sm font-semibold cursor-context-menu ml-[7px] mr-0 mt-[2.1px] mb-0">Edward Ford</p>
                        <p className="h-[16.8px] w-[10vw] text-xs font-semibold text-[#8f92a1] cursor-context-menu mt-[4.2px] mb-0 mx-0">5:30 pm</p>
                    </div>
                    <div className="flex flex-row">
                        <p className="w-[21.8vw] text-xs text-[#f7f7f7] ml-[7px] mr-0 mt-[5.6px] mb-0"> Thank you for sharing this information </p>
                        <button className="h-[15.4px] min-w-[16.1px] text-[10px] text-white bg-red-500 rounded mt-[5.6px] mb-0 mx-0 border-none">1</button>
                        <div className="mt-[-20.3px] ml-[-24vw] h-[8.4px] w-[8.4px] bg-[#53d768] mr-0 mb-0 rounded-full border-[0.2px] border-solid border-white"></div>
                    </div>
                </div>
            </div>

            {/* Message row 2 */}
            <div className="w-[28vw] flex flex-row ml-[8.4px] mr-0 mt-[21px] mb-0 rounded-[7px]">
                <img className="ml-[7px] h-[42px] w-[42px] rounded-lg bg-[powderblue]" src='profile-pic.png'/>
                <div className="flex flex-col">
                    <div className="flex flex-row">
                        <p className="text-[#f7f7f7] h-[16.8px] w-[20vw] text-sm font-semibold cursor-context-menu ml-[7px] mr-0 mt-[2.1px] mb-0">Edward Ford</p>
                        <p className="h-[16.8px] w-[10vw] text-xs font-semibold text-[#8f92a1] cursor-context-menu mt-[4.2px] mb-0 mx-0">5:30 pm</p>
                    </div>
                    <div className="flex flex-row">
                        <p className="w-[21.8vw] text-xs text-[#f7f7f7] ml-[7px] mr-0 mt-[5.6px] mb-0"> Thank you for sharing this information </p>
                        <button className="h-[15.4px] min-w-[16.1px] text-[10px] text-white bg-red-500 rounded mt-[5.6px] mb-0 mx-0 border-none">1</button>
                        <div className="mt-[-20.3px] ml-[-24vw] h-[8.4px] w-[8.4px] bg-[#53d768] mr-0 mb-0 rounded-full border-[0.2px] border-solid border-white"></div>
                    </div>
                </div>
            </div>
        </div>

        {/* Open chat panel */}
        <div className="fixed flex flex-col gap-[7px] h-[700px] right-0 w-[51vw]">
            <div className="mt-[21px] ml-[14px] h-[534.8px] w-[50vw] flex flex-row gap-[21px]">
                {/* Left chat column */}
                <div className="h-full w-[27vw] flex flex-col">
                    {/* User header */}
                    <div className="h-[49px] w-[26vw] flex flex-row">
                        <img src='profile-pic.png' className="ml-[23.8px] h-[49px] w-[49px] rounded-[14px]"/>
                        <div className="ml-[8.4px] h-[49px] w-[75%] flex flex-col text-[#f7f7f7]">
                            <p className="mt-[6.3px] text-[15px] font-semibold">Kamallochan Boruah</p>
                            <p className="text-xs text-[#f7f7f7]">online</p>
                        </div>
                    </div>

                    {/* Chat messages */}
                    <div className="flex flex-col">
                        {[1, 2].map((_, i) => (
                            <div key={i} className="w-[343px] mt-[39.2px] ml-[16.8px] rounded-[7px] flex flex-row">
                                <img className="ml-[16.8px] h-[35px] w-[35px] rounded-lg bg-[powderblue]" src='profile-pic.png'/>
                                <div className="flex flex-col">
                                    <div className="flex flex-row">
                                        <p className="text-[#f7f7f7] mt-[2.1px] mx-[7px] h-[16.8px] text-[13px] font-semibold cursor-context-menu">Edward Ford</p>
                                        <p className="mt-[4.2px] h-[16.8px] w-[10vw] text-xs font-semibold text-[#8f92a1] cursor-context-menu">5:30 pm</p>
                                    </div>
                                    <div className="flex flex-row">
                                        <p className="w-[40vw] mt-[4.2px] ml-[7px] text-xs text-[#f7f7f7]"> Thank you for sharing this information </p>
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
                <input type="text"
                    name="message"
                    placeholder="Start writing..."
                    className="ml-[18.2px] h-[42px] w-[420px] pl-[14px] pr-[42px] bg-[#8f92a120] text-white rounded-[7px] border-none focus:outline-none"/>
                <i className="fa-regular fa-face-smile text-gray-400 mt-3 ml-[-2rem]"></i>
                <button className="bg-[#53d768] border-none ml-[25.2px] h-[42px] w-[42px] text-xl rounded-lg text-white">
                    <i className='fa-solid fa-plus'></i>
                </button>
            </div>
        </div>
    </div>
  )
}
