import React from 'react'
import SIDEBAR from './Parts/LeftBar'
import NOTIFICATION from './subParts/notifcationandprofile'

export default function messages() {
  return (
    <div className='messagePageContainer'>
        <SIDEBAR/>
        <div className='message-inbox'>
            <div className='message-index-search-bar'>
                <i class="fa-solid fa-magnifying-glass message-search-icon"></i>
                <label for="message-searchbar-input"></label> <br/>
                <input type="text"
                    name="Occupation"
                    placeholder="Search in Social..."
                    id="message-searchbar-input"/><br/>
                <button className='message-searchbar-button'><i className='fa-solid fa-comment'></i></button>
            </div>
            <div className='message-inbox-header-index'>Inbox</div>
            <div className='message-inbox-topics'> 
                <div className='message-inboxdirect-messages g-d-m'>Direct Messages</div>
                <div className='message-inboxgroup-chat g-g-c'>Group Chat</div>
                <div className='message-inboxarchived g-a-m'>Archived</div>
            </div>
            <div className='message-inbox-messages-name-section'>
                    <img className='message-inbox-users-group-image'
                        src='profile-pic.png'
                    />
                    <img className='message-inbox-users-group-image-2'
                        src='profile-pic.png'
                    />
                    <button className='message-inbox-users-group-image-3'>1<i className='fa-sollid fa-plus'></i></button>
                    <div className='message-inbox-user-group-image'></div>
                    <div className='message-inbox-user-name-and-posted-time'>
                    <div className='wrapper-user-name-and-time'>
                        <p className='message-inbox-user-name'>Edward Ford</p>
                        <p className='message-inbox-user-posted-time'>5:30 pm</p>
                     </div>
                     <div className='wrapper-posted-message-and-count'>
                        <p className='message-inbox-user-posted-message'> Thank you for sharing this information </p>
                        <button className='couting-the-sent-messages'>1</button>
                     </div>
                     </div>
            </div>
            <div className='message-inbox-messages-name-section'>
                    <img className='message-inbox-users-group-image'
                        src='profile-pic.png'
                    />
                    <img className='message-inbox-users-group-image-2'
                        src='profile-pic.png'
                    />
                    <button className='message-inbox-users-group-image-3'>1<i className='fa-sollid fa-plus'></i></button>
                    <div className='message-inbox-user-group-image'></div>
                    <div className='message-inbox-user-name-and-posted-time'>
                    <div className='wrapper-user-name-and-time'>
                        <p className='message-inbox-user-name'>Edward Ford</p>
                        <p className='message-inbox-user-posted-time'>5:30 pm</p>
                     </div>
                     <div className='wrapper-posted-message-and-count'>
                        <p className='message-inbox-user-posted-message'> Thank you for sharing this information </p>
                        <button className='couting-the-sent-messages'>1</button>
                     </div>
                     </div>
            </div>



        </div>
        <div className='message-inbox-open'>
            <div className='message-inbox-notification-profile'>
                <div className='message-rightbar-one-notification'> <i class="fa-regular fa-bell fa-lg bell"></i> </div>
                <img className='message-rightbar-one-image' src='profile-pic.png'/>
            </div>
            <div className='message-inbox-open-chat'>
                <div className='message-inbox-open-chat-one'>
                    <div className='message-inbox-open-user-details'>
                        <img src='profile-pic.png' className='message-inbox-open-userimage'/>
                        <img src='profile-pic.png' className='message-inbox-open-userimage-2'/>
                        <div className='message-inbox-open-userimage-3'><p className='message-inbox-open-group-member-count'>9+</p></div>

                        <div className='message-inbox-open-name-and-user'>
                            <p className='message-inbox-open-name-group'>Beach Trip</p>
                        </div>
                    </div>
                    <div className='message-inbbox-open-user-chats'>
                    <div className='message-inbox-open-name-section'>
                    <img className='message-inbox-open-user-image'
                        src='profile-pic.png'
                    />
                    <div className='message-inbox-user-name-and-posted-time'>
                    <div className='wrapper-user-name-and-time'>
                        <p className='message-inbox-open-user-name'>Edward Ford</p>
                        <p className='message-inbox-user-posted-time'>5:30 pm</p>
                     </div>
                     <div className='wrapper-posted-message-and-count'>
                        <p className='message-inbox-open-user-posted-message'> Thank you for sharing this information </p>
                     </div>
                     </div>
              </div>
              <div className='message-inbox-open-name-section'>
                    <img className='message-inbox-open-user-image'
                        src='profile-pic.png'
                    />
                    <div className='message-inbox-user-name-and-posted-time'>
                    <div className='wrapper-user-name-and-time'>
                        <p className='message-inbox-open-user-name'>Edward Ford</p>
                        <p className='message-inbox-user-posted-time'>5:30 pm</p>
                     </div>
                     <div className='wrapper-posted-message-and-count'>
                        <p className='message-inbox-open-user-posted-message'> Thank you for sharing this information </p>
                     </div>
                     </div>
              </div>
                    </div>
                    
                </div>
                <div className='message-inbox-open-chat-two'>
                    <i class="fa-solid fa-user-plus message-inbox-open-right-logos"></i>
                    <i class="fa-solid fa-phone message-inbox-open-right-logos"></i>
                    <i class="fa-solid fa-video message-inbox-open-right-logos"></i>
                    <i class="fa-solid fa-ellipsis-vertical message-inbox-open-right-logos"></i>
                </div>
            </div>
            <div className='message-inbox-open-search-bar'>
              <label for="message-inbox-open-search-bar-input"></label> <br/>
                  <input type="text"
                  name="Occupation"
                  placeholder="Start writing..."
                  id="message-inbox-open-search-bar-input"/><br/>
                  <i class="fa-regular fa-face-smile message-inbox-open-smile-emoji"></i>
                  <button className='message-inbox-open-search-bar-submit-button'> <i className='fa-solid fa-plus'></i></button>
            </div>
        </div>
    </div>
  )
}
