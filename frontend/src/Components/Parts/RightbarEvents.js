import React from 'react'
import NOTANDPROFILE from '../subParts/notifcationandprofile'

export default function RightSideCommentBar() {
  return (
    <div className='RightSideEventsbar'>
        <div className='rightbar-events-user-notification-and-profile-image'>
          <NOTANDPROFILE/>
        </div>
    <div className='rightbar-two-events'>
        <p className='rightbar-tevents-features-stories'> My Next Events</p>
          <div className='event1'>
            <img className='imageEvent' src='story.png'/>
            <p className='titleEvent'>Arijit Singh Concert</p>
            <div className='bodyEvent'> <p className='eventTime'>December 12, 2023</p>
                <div className='tick-event'><i class="fa-solid fa-check tick"></i></div>
            </div>

         </div>
         <div className='event1'>
            <img className='imageEvent' src='story.png'/>
            <p className='titleEvent'>Arijit Singh Concert</p>
            <div className='bodyEvent'> <p className='eventTime'>December 12, 2023</p>
                <div className='tick-event'><i class="fa-solid fa-check tick"></i></div>
            </div>

         </div>
         <div className='event1'>
            <img className='imageEvent' src='story.png'/>
            <p className='titleEvent'>Arijit Singh Concert</p>
            <div className='bodyEvent'> <p className='eventTime'>December 12, 2023</p>
                <div className='tick-event'><i class="fa-solid fa-check tick"></i></div>
            </div>

         </div>
         <div className='eventSeeMore'>
            <p className='eventTextSeeMore'>See More <i class="fa-solid fa-greater-than fa-xs"></i></p>
         </div>
    </div>
</div>

    )
}
