import React, { useState } from 'react'
import LeftBar from '../Utilities/LeftBar'
import RIGHTCOMMENTBAR from '../Utilities/RightSideCommentBar'

export default function BlogPost(props) {
    const [avatar, setAvatar] = useState('https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png');
  return (
    <div className='absolute w-full flex flex-col lg:flex-row md:flex-col h-screen overflow-hidden bg-opacity-20 justify-center items-center z-10 bg-slate-100'>
        {/* <LeftBar/> */}
        <div className='w-[600px] h-[650px] flex flex-col overflow-y-scroll overflow-x-hidden bg-slate-600 items-center ml-8'>
        <div className="flex mt-14 w-[500px] relative">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={props.temp.avatar || avatar}
                          alt=""
                        />
                      </div>
                      <div className="ml-4">  
                      <div className="text-sm font-semibold text-black-800 cursor-context-menu">{props.temp.author}</div>
                        <div className="text-sm text-black-700">5 mins Ago</div>
                      </div>
                      <div className='absolute mr-40 mb-3 ml-[494px]'><i class="fa-solid fa-ellipsis-vertical"></i></div>
                    </div>
                <img className='max-h-[360px] max-w-[500px] mt-6' src={props.temp.image}/>
                <p className='font-semibold mt-6 max-w-[500px] text-md'>{props.temp.title}</p>
                    <p className="mt-2 max-w-[500px]"> 
                    {props.temp.description}
                        </p>
        </div>
        <RIGHTCOMMENTBAR currentUser = {props.temp.currentUser} currentPostId = {props.temp.postId}/>
        <i className='fa-regular fa-x h-20 w-20 text-2xl font-bold text-slate-400 mb-[560px] ml-5' onClick={props.changeToggleBlogPost}></i>
    </div>   
  )
}
