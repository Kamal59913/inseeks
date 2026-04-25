import React from 'react'
import POST from './SubComponent/postHomepage'
import QUESTION from './SubComponent/hpQuestion'
import IMGAGEPOST from './SubComponent/imageHomepage'
import LEFTBAR from './Parts/LeftBar'
import RIGHTCOMMENTBAR from './Utilities/RightSideCommentBar'
import BACK from './subParts/backButton'
import USERDETAILS from './subParts/zoomPostUserHeader'
export default function SingleVideo() {
  return (
    <div className="newContainer">
        <LEFTBAR/>
        <div className='SecondBox'>
            <div className='SecondBox-row1'>
                <BACK/>
            </div>
            <div className='SecondBox-row2'>
                <img className='blog-image-zoom-post' src='story.png'/>
                <USERDETAILS/>  
                <div className='blog-title-zoom-post'> <p className='text2'>The Best Fashion Instagrams of the Week: Caline dion sdfgsd gsdgf sdgf f sfd sd sfd df </p></div>
                <div className='blog-body-zoom-post'>
                    <p className="blog-body-zoom-post-text"> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release.
                    </p>
                </div>
                <div className='blog-body-zoom-post2'>
                    <p className='blog-body-zoom-post-text2'>Travel</p>
                    <p className='blog-body-zoom-post-text2'>Mexico</p>
                    <p className='blog-body-zoom-post-text2'>Vlog</p>
                    <p className='blog-body-zoom-post-text2'>Tips</p>
                    <p className='blog-body-zoom-post-text2'>Vacation</p>
                    <p className='blog-body-zoom-post-text2'>Cancun</p>
                </div>
                <div className='blog-body-zoom-post3'>
                    <div className='blog-body-post3'> Related Videos </div>
                    <div className='blog-body-post4'>
                        <img className='related-video1' src='story.png'/>
                        <img className='related-video1' src='story.png'/>
                        <img className='related-video1' src='story.png'/>

                    </div>
                </div>
            </div>
        </div>
        <RIGHTCOMMENTBAR/>
    </div>   
  )
}
