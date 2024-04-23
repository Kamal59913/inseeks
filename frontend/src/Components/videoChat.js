import React from 'react'
import SIDEBAR from './Parts/LeftBar'
import NOTIFICATION from './subParts/notifcationandprofile'

export default function VideoChat() {
  return (
    <div className='messagePageContainer'>
        <SIDEBAR/>
        <div className='message-inbox-video-chat'>
            <img className='message-inbox-video' src='story.png'/>
            <div className='message-inbox-video-text-chat'>
            <div className='message-inbox-notification-profile'>
                <div className='message-rightbar-one-notification'> <i class="fa-regular fa-bell fa-lg bell"></i> </div>
                <img className='message-rightbar-one-image' src='profile-pic.png'/>
            </div>
            <div className='message-inbox-open-chat'>
                <div className='message-inbox-open-chat-one'>
                    <div className='video-call-inbox-open-user-details'>
                        <img src='profile-pic.png' className='video-call-inbox-open-userimage'/>
                        <div className='message-inbox-open-name-and-user'>
                            <p className='video-call-inbox-open-name'>Kamallochan Boruah</p>
                            <p className='message-inbox-open-online-offline'>online</p>
                        </div>
                        <i class="fa-solid fa-ellipsis-vertical video-call-three-dot"></i>
                    </div>
                    <div className='vcall-inbbox-open-user-chats'>
                    <div className='vcall-inbox-open-name-section'>
                    <img className='vcall-inbox-open-user-image'
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
              <div className='vcall-inbox-open-name-section'>
                    <img className='vcall-inbox-open-user-image'
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
            <div className='vcall-inbox-open-search-bar'>
              <label for="vcall-inbox-open-search-bar-input"></label> <br/>
                  <input type="text"
                  name="Occupation"
                  placeholder="Start writing..."
                  id="vcall-inbox-open-search-bar-input"/><br/>
                  <i class="fa-regular fa-face-smile message-inbox-open-smile-emoji"></i>
                  <button className='vcall-inbox-open-search-bar-submit-button'> <i className='fa-solid fa-plus'></i></button>
            </div>
            </div>
        </div>
    </div>
  )
}
