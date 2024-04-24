import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';

export default function PostVideos(props) {

  const [likebuttontoggle, setlikebuttontoggle] = useState(false)
  const [likedata, setlikedata] = useState(null);

  /*to handle like toggle on front-end*/
  const [likecount, setlikecount ] = useState(null)
  const [isliked, setIsLiked] = useState(null)

  /*get like details*/
const getlikedetails = "http://localhost:8000/api/v1/like/getlike"

/*url to like a post*/
const likepost = "http://localhost:8000/api/v1/like/toggle/like"

const LikeAPost = async (data) => {
  axios.post(likepost, data, {
    withCredentials: true
  })
  .then((res)=> {
    console.log("reached", res)
  })
  .catch((err)=> {
    console.log(err)
  })
}

const getLikes = () => {
  const data = {
    PostId: props.postId,
    type: props.type
  }
  axios.post(getlikedetails, data, { withCredentials: true })
  .then((res)=> {
  setlikedata(res.data.data)
  setlikecount(res.data.data.length)
  if (res.data.data[0]) {
    setIsLiked(res.data.data[0].isLiked);
  }  })
.catch((err)=> {
  console.log(err)
})
}

useEffect(() => {
  getLikes()
}, [likebuttontoggle])


/*To handle the like*/
const onLikeClick = () => {
  const newLikeStatus = !isliked; // Toggle the like status
  setIsLiked(newLikeStatus); // Update the like status immediately

  // Update the like count based on the new like status
  const newLikeCount = newLikeStatus ? likecount + 1 : likecount - 1;
  setlikecount(newLikeCount);

  
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
    props.changeToggleVideoPost(props)
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
    <p className="text-sm text-black-600 ml-4 text-slate-200 mb-0">
    {props.description}
  </p>
<video
 src={props.video}
 alt="Laptop"
 className="m-3 h-[200px] w-[330px] rounded-md object-cover"
 controls // Add the controls attribute here
/>
<div className="pl-5 pb-2">

{likedata&& 
  <>
  {likecount}  
  <i 
    type="button"
    className={`${isliked ? 'fa-solid' : 'fa-regular'} fa-heart px-2.5 py-1 text-[14px] text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black`}
    onClick={onLikeClick}
  >
  </i>
    </>
    }
  
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
