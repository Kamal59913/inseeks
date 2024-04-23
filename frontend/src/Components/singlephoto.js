import React from 'react'
import POST from './SubComponent/postHomepage'
import QUESTION from './SubComponent/hpQuestion'
import IMGAGEPOST from './SubComponent/imageHomepage'
import LEFTBAR from './Parts/LeftBar'
import RIGHTCOMMENTBAR from './Parts/RightSideCommentBar'
import BACK from './subParts/backButton'
import USERDETAILS from './subParts/zoomPostUserHeader'
export default function SinglePhoto() {
  return (
    <div className="newContainer">
        <LEFTBAR/>
        <div className='rightbar-two-photos'>
                    <div className='userInfo'>
                        <button className='userInfo-Back-btn'><i className='fa-solid fa-less-than'></i> Back</button>
                        <p className='username-Single-Photos'> Kamal Boruah </p>
                        <img src='profile-pic.png' className='image-pic'/>
                    </div>
                <div className='second-Photo'>
                    <div className='secondOne-Photo'><i class="fa-solid fa-less-than less-than"></i> </div>
                    <img className='secondTwo-Photo' src='story.png'/>
                    <div className='secondThree-Photo'> <i class="fa-solid fa-greater-than less-than"></i> </div>
                </div>      
          </div>
        <RIGHTCOMMENTBAR/>
    </div>   
  )
}
