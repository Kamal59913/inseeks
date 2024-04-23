import React from 'react'
import SIDEBAR from './Parts/LeftBar'
import NOTIFICATION from './subParts/notifcationandprofile'
import { Link } from 'react-router-dom'
import NANDP from './subParts/notifcationandprofile'
import style from './cssModules/messages.module.scss'
export default function messages() {
  return (
    <div className={style.messagePageContainer}>
        <SIDEBAR/>
        <div className={style.messageInbox}>
            <div className={style.messageIndexSearchBar}>
                <label for={style.messageSearchbarInput}></label> <br/>
                <input type="text"
                    name="Occupation"
                    placeholder="Search in Social..."
                    id={style.messageSearchbarInput}/><br/>
                <button className={style.messageSearchbarButton}><i className='fa-solid fa-comment'></i></button>
                <i class="fa-solid fa-magnifying-glass message-search-icon"></i>
            </div>
            <div className={style.MessageInboxHeaderIndex}>Inbox</div>
            <div className={style.messageInboxTopics}> 
                <div className={style.dM}>Direct Messages</div>
                <div className={style.ggc}>Group Chat</div>
                <div className='a-m'>Archived</div>
            </div>
            <div className={style.MessageInboxMessagesNameSection}>
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
              <div className={style.MessageInboxMessagesNameSection}>
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
            <NANDP/>
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
