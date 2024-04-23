import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DataContext from '../../Context/myContext';

export default function Post(props) {
  const { LikeAPost } = useContext(DataContext)
  const [likebuttontoggle, setlikebuttontoggle] = useState(false)

  
  /*To handle the like*/
  const onLikeClick = () => 
  {
    console.log(props.postId)
    likebuttontoggle? setlikebuttontoggle(false) : setlikebuttontoggle(true)
    const data = {
      PostId: props.postId,
      type: props.type
    }
    LikeAPost(data)
  }

  const linkStyle = {
    textDecoration: "none", // Remove underline
    color: "inherit", // Inherit color from parent
  };

  const sendData = () => {
    props.changeToggleBlogPost(props)
  }
  
  return (
    <div className="ml-[26px] lg:ml-[22px] p-1 w-[380px] rounded-md border">
    <div className="flex items-center m-2"> 
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full object-cover ml-2"
                          src={props.avatar}
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                      <Link to={`/user/${props.author}`} style={linkStyle}> <div className="text-sm font-semibold text-black-800 cursor-context-menu">{props.author}</div> </Link>
                      <div className="text-sm text-black-700">5 mins Ago</div>
                      </div>
          <div className='ml-[150px] mb-2'><i class="fa-solid fa-ellipsis-vertical"></i></div>
    </div>
<img
  src={props.image}
  alt="Laptop"
  className="m-3 h-[200px] w-[330px] rounded-md object-cover"
/>
<div className="pl-5 pb-2">
  <h1 className="text-lg font-semibold">{props.title}</h1>
  <p className="text-sm text-black-600">
    {props.description}
  </p>
  {props.likesCount}
  <i
    type="button"
    className={`${likebuttontoggle? `fa-solid` : `fa-regular`} fa-heart px-2.5 py-1 text-[14px] text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black`}
    onClick={onLikeClick}
  >
  </i>
  <i
    type="button"
    className="fa-regular fa-comment px-2.5 py-1 text-[14px] font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
    onClick={sendData}
  >
  </i>
  <i
    type="button"
    className="ml-[240px] fa-regular fa-share px-2.5 py-1 text-[14px] font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
  >
  </i>

</div>
</div>   
    )
}
