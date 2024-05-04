import React from 'react'
import LeftBar from './Utilities/LeftBar'
import { Link } from 'react-router-dom'
import style from './cssModules/messages.module.scss'
export default function messages() {
  return (
    <div className='flex flex-col lg:flex-row md:flex-col h-screen overflow-hidden'>
        <LeftBar/>
        <div className="w-[32%] h-[644px] flex flex-col gap-[7px] cursor-context-menu overflow-x-hidden mt-0 mb-7 mx-0 pb-7">
            <div className="h-[47px] w-[32vw] text-[black] flex flex-row gap-[7px] mt-7">
                <label></label> <br/>
                <input type="text"
                    name="Occupation"
                    placeholder="Search in Social..."
                    className="h-[42px] w-[16vw] text-[black] pl-[35px] pr-[70px] rounded-lg border-none"/><br/>
                <button className="h-[44.8px] w-[44.8px] bg-[#53d768] text-[white] text-xl rounded-lg border-none">
                    <i className='fa-solid fa-comment'></i></button>
                <i class="fa-solid fa-magnifying-glass message-search-icon"></i>
            </div>
            <div className="text-[26px] font-bold text-[#f7f7f7] ml-3.5 mr-0 mt-[22.4px] mb-0">Inbox</div>
            <div className="text-[#f7f7f7] flex flex-row gap-[15.4px] text-[13px] font-semibold cursor-context-menu mt-[8.4px] mb-0 mx-0 pl-3.5"> 
                <div className="border-b-[2.2px] border-b-[white] border-solid">Direct Messages</div>
                <div className="border-b-[2.2px] border-b-[white] border-solid">Group Chat</div>
                <div className='a-m'>Archived</div>
            </div>
            <div className="w-[28vw] flex flex-row ml-[8.4px] mr-0 mt-[21px] mb-0 rounded-[7px]">
                    <img className="h-[42px] w-[42px] bg-[powderblue] ml-[7px] mr-0 my-0 rounded-lg"
                        src='profile-pic.png'
                    />
                    <div className="flex flex-col">
                    <div className="flex flex-row">
                        <p className="text-[#f7f7f7] h-[16.8px] w-[20vw] text-sm font-semibold cursor-context-menu ml-[7px] mr-0 mt-[2.1px] mb-0">Edward Ford</p>
                        <p className="h-[16.8px] w-[10vw] text-xs font-semibold text-[#8f92a1] cursor-context-menu mt-[4.2px] mb-0 mx-0">5:30 pm</p>
                     </div>
                     <div className="flex flex-row">
                        <p className="w-[21.8vw] text-xs text-[#f7f7f7] ml-[7px] mr-0 mt-[5.6px] mb-0"> Thank you for sharing this information </p>
                        <button className="h-[15.4px] min-w-[16.1px] text-[10px] text-[white] bg-[red] rounded mt-[5.6px] mb-0 mx-0 border-none">1</button>
                        <div className="mt-[-20.3px] ml-[-24vw] h-[8.4px] w-[8.4px] bg-[#53d768] mr-0 mb-0 rounded-[50%] border-[0.2px] border-solid border-[white]"></div>
                     </div>
                     </div>
                     
              </div>
              <div className="w-[28vw] flex flex-row ml-[8.4px] mr-0 mt-[21px] mb-0 rounded-[7px]">
                    <img className={style.messageInboxUserImage}
                        src='profile-pic.png'
                    />
                    <div className={style.messageInboxUserNameAndPostedTime}>
                    <div className={style.wrapperUserNameAndTime}>
                        <p className={style.messageInboxUserName}>Edward Ford</p>
                        <p className={style.messageInboxUserPostedTime}>5:30 pm</p>
                     </div>
                     <div className={style.wrapperPostedMessageAndCount}>
                        <p className={style.messageInboxUserPostedMessage}> Thank you for sharing this information </p>
                        <button className={style.coutingTheSentMessages}>1</button>
                        <div className={style.messageUserOnlineOrNot}></div>
                     </div>
                     </div>
                     
              </div>

        </div>
        <div className={style.messageInboxOpen}>
            {/* <NANDP/> */}
            <div className={style.messageInboxOpenChat}>
                <div className={style.messageInboxOpenChatOne}>
                    <div className={style.messageInboxOpenUserDetails}>
                        <img src='profile-pic.png' className={style.messageInboxOpenUserimage}/>
                        <div className={style.messageInboxOpenNameAndUser}>
                            <p className={style.messageInboxOpenName}>Kamallochan Boruah</p>
                            <p className={style.messageInboxOpenOnlineOffline}>online</p>
                        </div>
                    </div>
                    <div className={style.messageInbboxOpenUserChats}>
                    <div className={style.messageInboxOpenNameSection}>
                    <img className={style.messageInboxOpenUserImage}
                        src='profile-pic.png'
                    />
                    <div className={style.messageInboxUserNameAndPostedTime}>
                    <div className={style.wrapperUserNameAndTime}>
                        <p className={style.messageInboxOpenUserName}>Edward Ford</p>
                        <p className={style.messageInboxUserPostedTime}>5:30 pm</p>
                     </div>
                     <div className={style.wrapperPostedMessageAndCount}>
                        <p className={style.messageInboxOpenUserPostedMessage}> Thank you for sharing this information </p>
                     </div>
                     </div>
              </div>
              <div className={style.messageInboxOpenNameSection}>
                    <img className={style.messageInboxOpenUserImage}
                        src='profile-pic.png'
                    />
                    <div className={style.messageInboxUserNameAndPostedTime}>
                    <div className={style.wrapperUserNameAndTime}>
                        <p className={style.messageInboxOpenUserName}>Edward Ford</p>
                        <p className={style.messageInboxUserPostedTime}>5:30 pm</p>
                     </div>
                     <div className={style.wrapperPostedMessageAndCount}>
                        <p className={style.messageInboxOpenUserPostedMessage}> Thank you for sharing this information </p>
                     </div>
                     </div>
              </div>
                    </div>
                    
                </div>
                <div className={style.messageInboxOpenChatTwo}>
                    <i class="fa-solid fa-user-plus message-inbox-open-right-logos"></i>
                    <i class="fa-solid fa-phone message-inbox-open-right-logos"></i>
                    {/* <Link to='/videocalling'><i class="fa-solid fa-video message-inbox-open-right-logos"></i></Link> */}
                    <i class="fa-solid fa-ellipsis-vertical message-inbox-open-right-logos"></i>
                </div>
            </div>
            <div className={style.messageInboxOpenSearchBar}>
              <label for={style.messageInboxOpenSearchBarInput}></label> <br/>
                  <input type="text"
                  name="Occupation"
                  placeholder="Start writing..."
                  id={style.messageInboxOpenSearchBarInput}/><br/>
                  <i class="fa-regular fa-face-smile message-inbox-open-smile-emoji"></i>
                  <button className={style.messageInboxOpenSearchBarSubmitButton}> <i className='fa-solid fa-plus'></i></button>
            </div>
        </div>
    </div>
  )
}
