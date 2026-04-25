import React from 'react'

export default function ZoomEventUserHeader() {
  return (
    <div className='blank-1'>
    <div className='column1b1Evn'>
                <img className='profileimageuser2' src='profile-pic.png'/>
                <div className='profileName'>  
                    <p className='profileNameSub'>Edward Ford</p>
                    <p className='postedTime'> 5 min ago </p>
                </div>
    </div>
<div className='column1b4'>
    <div className='column1b4ShareEvent'> Share <i class="fa-solid fa-share"></i></div>
    <div className='column1b4EventShare'> <p className='column1b4EventShare-text'>Interested <i class="fa-solid fa-check"></i></p> </div>
    <i class="fa-solid fa-ellipsis-vertical threeDotEvent"></i>
    </div>
    </div>
    )
}
