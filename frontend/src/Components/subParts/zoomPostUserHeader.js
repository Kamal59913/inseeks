import React from 'react'

export default function ZoomPostUserHeader() {
  return (
    <div className='blank-1'>
    <div className='column1b1'>
                <img className='profileimageuser2' src='profile-pic.png'/>
                <div className='profileName'>  
                    <p className='profileNameSub'>Edward Ford</p>
                    <p className='postedTime'> 5 min ago </p>
                </div>
    </div>
<div className='column1b4'>
    <div className='column1b4heart'>
        <i class="fa-regular fa-heart posticons2 fa-sm"></i> <span className='likeCommentCount'>326</span>
    </div>
    <div className='column1b4comment'>
        <i class="fa-regular fa-comment posticons2 fa-sm"></i> <span className='likeCommentCount'>148</span>
    </div>
    <div className='column1b4Share'> Share <i class="fa-solid fa-share"></i></div>
        <i class="fa-solid fa-ellipsis-vertical threeDotPost"></i>
    </div>
    </div>
    )
}
