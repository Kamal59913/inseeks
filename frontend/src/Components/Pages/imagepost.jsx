import React, { useState } from 'react'
import RIGHTCOMMENTBAR from '../Utilities/RightSideCommentBar'

export default function ImagePost(props) {
    const [avatar, setAvatar] = useState('https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png');
    const [counter, setCounter] = useState(0)
    const [images, setImages] = useState(props.temp.images)
    // let image;
    const ImageCounterIncrease = () => {
      // setCounter(prevCounter => (prevCounter + 1) % images.length);
      // Check if counter is already at the last index
      if (counter === images.length - 1) {
      return; // Exit the function early if at the last index
    }

  // Increment the counter by 1
  setCounter(prevCounter => prevCounter + 1);
      }
    const ImageCounterDecrease = () => {
      // setCounter(prevCounter => (prevCounter - 1 + images.length) % images.length);
      if (counter === 0) {
        return; // Exit the function early if at the last index
    } 
    // Increment the counter by 1
    setCounter(prevCounter => prevCounter - 1);
    }

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
                <img className='h-[400px] w-[500px] mt-6' src={images[counter]}/>
                <div className='flex flex-row gap-[4px] m-2 w-[500px]'>
                  <button className='text-slate-100 px-2 py-1 rounded-sm bg-slate-900' onClick={ImageCounterDecrease}> prev </button> 
                  <button className='text-slate-100 bg-slate-900 px-2 py-1 rounded-sm' onClick={ImageCounterIncrease}> next </button>

                </div>
                <p className='font-semibold max-w-[500px] text-sm mt-2'>{props.temp.title} </p>
        </div>
        <RIGHTCOMMENTBAR currentUser = {props.temp.currentUser} currentPostId = {props.temp.postId}/>
        <i className='fa-regular fa-x h-20 w-20 text-2xl font-bold text-slate-400 mb-[560px] ml-5' onClick={props.changeToggleImagePost}></i>
    </div>   
  )
}
