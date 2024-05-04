import React, { useEffect, useState } from 'react'
import LeftBar from '../Utilities/LeftBar'
import SearchBar from '../Utilities/SearchBar'
import Post from '../PostComponents/post'
import PostImage from '../PostComponents/postImages'
import Videos from '../PostComponents/postvideo'

import axios from 'axios'
import { Link, useParams } from 'react-router-dom'

export default function UserProfile() {
  const linkStyle = {
    textDecoration: "none", // Remove underline
    color: "inherit", // Inherit color from parent
  };
  
  const { username }  = useParams();
  console.log(username)
  const [posts, setposts] = useState()
  /*dummy profile pic*/
  const [avatar, setAvatar] = useState('https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png');

  /*url to get the user*/
  const userUrl = "http://localhost:8000/api/v1/users/profile"

  /*declaring the axios urls*/
  const logoutUrl = "http://localhost:8000/api/v1/users/logout"

  /*User posts links*/
  /*declaring the route for getallposts*/
  const getallpostsUser = "http://localhost:8000/api/v1/createpost/getalluserposts"

  /*declaring the route for only blog posts*/
  const getallimagepostsUser = "http://localhost:8000/api/v1/createpost/getuserposts/images"
   
  /*declaring the route for only image posts*/
  const getallvideopostsUser = "http://localhost:8000/api/v1/createpost/getuserposts/videos"
      
  /*declaring the route for only image posts*/
  const getallblogpostsUser = "http://localhost:8000/api/v1/createpost/getuserposts/blogs"
  
  /*url to follow a user*/
  const followUser = "http://localhost:8000/api/v1/follow//user/connect"  


  const underlineManager = (value) => {
    if(value == 'explore') {
      setImagesUnderline('')
      setVideosUnderline('')
      setBlogsUnderline('')
      setexploreUnderline('underline underline-offset-2')
    } else if(value == 'images') {
      setImagesUnderline('underline underline-offset-2')
      setVideosUnderline('')
      setBlogsUnderline('')
      setexploreUnderline('')
    } else if(value == 'videos') {
      setImagesUnderline('')
      setVideosUnderline('underline underline-offset-2')
      setBlogsUnderline('')
      setexploreUnderline('')
    } else if(value == 'blogs') {
      setImagesUnderline('')
      setVideosUnderline('')
      setBlogsUnderline('underline underline-offset-2')
      setexploreUnderline('')
    }
}
const [imagesUnderline, setImagesUnderline] = useState('');
const [videosUnderline, setVideosUnderline] = useState('');
const [blogsUnderline,  setBlogsUnderline] = useState('');
const [exploreUnderline, setexploreUnderline] = useState('');
const [profileuser, setProfileuser] = useState('');
const [buttonfollow, setButtonfollow] = useState(false);
const [buttonclicked, setbuttonclicked] = useState();

/*useEffect hook to get the current user*/
useEffect(() => {
  axios.get(`${userUrl}/${username}`, {
    withCredentials: true
  })
  .then((res)=> {
    setProfileuser(res.data.data)
    if(res.data.data.isFollowed) {
      setButtonfollow(true)
    } else {
      setButtonfollow(false)
    }
  })
  .catch((err) => {
    console.log(err)
  })
}, [buttonfollow])

  /*UseEffect hook to get allposts*/
  useEffect(() => {
    axios.get(`${getallpostsUser}/${username}`, {
      withCredentials: true 
    })
    .then((res)=> {
      console.log(res.data.done)
      underlineManager('explore')
      setposts(res.data.done)
    })
    .catch((err)=>{
      console.log(err)
    })
  }, [])
  


// Add a useEffect to observe changes in the posts state
useEffect(() => {
}, [posts]); // Run this effect whenever posts state changes
  

/*To filter the posts*/
const filterPosts = (data) => {
    let url;
    if(data == 'explore') {
    url = `${getallpostsUser}/${username}`
    } else if(data == 'images') {
    url = `${getallimagepostsUser}/${username}`
    } else if(data == 'videos') {
    url = `${getallvideopostsUser}/${username}`
    } else if(data == 'blogs') {
    url = `${getallblogpostsUser}/${username}`
    }
    axios.get(url, { withCredentials: true })
    .then((res) => {
      console.log(res)
      setposts(res.data.done)
      underlineManager(data)
    })
    .catch((err) => {
      console.log(err)
    })
  }
    /*function to toggle follow*/
    const toggleFollow = () => {
      buttonfollow? setButtonfollow(false)  : setButtonfollow(true)
      console.log(buttonfollow)
      const userdetails = {
        userId : profileuser._id,
        toggle: buttonfollow
      }
      axios.post(followUser, userdetails, { withCredentials: true })
      .then((res)=> {
        console.log("Toggle follow request is successfull", res)
      })
      .catch((err) => {
        console.log("There is some problem occurred in the follow toggle")
      })
    }
  return (
    <div className='bg-[#0f172a] flex flex-col lg:flex-row md:flex-col h-screen overflow-hidden'>
        <LeftBar/>
        <div className='w-[388px] h-[720px] flex flex-col overflow-y-scroll overflow-x-hidden ml-[80px] justify-center'>
            <div className='w-[360px] h-[640px] bg-slate-50 flex flex-col items-center rounded-[1.6vh]'>
                <img className='h-[119px] w-[119px] mt-4 mb-0 mx-0 rounded-[11.2px]' src={profileuser.avatar || avatar}/>
                <p className='text-xl font-bold text-[black] mt-[1vh] mb-0 mx-0'>{profileuser&& profileuser.fullname}</p>
                <p className='text-base font-semibold text-[#8f92a1] mt-[4.2px] mb-0 mx-0'>{profileuser && profileuser.username}</p>
                <div className='h-[42px] text-sm font-semibold text-[#8f92a1] flex flex-row gap-7 m-0 p-0'>
                    <p className='text-base mt-[11.2px] mb-0 mx-0'><b className='text-slate-800'>{profileuser.PostsCount  + profileuser.ImagePostCount + profileuser.VideoPostsCount}</b> Posts</p>
                    <p className='text-base mt-[11.2px] mb-0 mx-0'> Following <b className='text-slate-800'>{profileuser.channelsFollowedToCount}</b></p>
                    <p className='text-base mt-[11.2px] mb-0 mx-0'> Followers <b className='text-slate-800'>{profileuser.followersCount}</b></p>

                </div>
                <div className='text-sm text-[#8f92a1] flex flex-row gap-[35px] items-center mt-[2.8px] mb-0 mx-0'>
                      { buttonfollow?
                        <button className='bg-[#53d768] text-[white] h-[4.6vh] font-semibold px-[1vh] py-0 rounded-[1vh] border-none' onClick={toggleFollow}>
                          Connected <i className='fa-solid fa-check ml-2'></i> 
                        </button> :
                        <button className='bg-[#53d768] text-[white] h-[4.6vh] font-semibold px-[1vh] py-0 rounded-[1vh] border-none' onClick={toggleFollow}>
                        Connect
                      </button>
                      }  
                    <i className='fa-regular fa-envelope text-[18px]'></i>
                    <i class="fa-solid fa-ellipsis-vertical text-lg rounded text-[black] px-[1.2vh] py-[0.2vh] border-2 border-solid border-[#8f92a1]"></i>
                </div>
                <p className='text-base font-semibold ml-0 mr-[190px] mt-3 mb-0'>About</p>
                <p className='text-sm font-medium ml-0 mr-6 my-0'>
             {profileuser.about? profileuser.about : <a href='#'> Add Bio! </a>}
                </p>
                <Link to='/h/follow' style={linkStyle}><p className='text-sm font-bold ml-0 mr-[12vw] my-3.5'>Connections</p></Link>
                <div className='grid grid-cols-[49px_49px_49px_49px_49px] gap-y-[9.8px] mt-0 mb-3.5 mx-0'>
                       {
                        profileuser.followerslist&& profileuser.followerslist.map((index,i) => {
                          return (
                            <img
                            key={i}
                            src={index.avatar || avatar} 
                            className='h-[42px] w-[42px] rounded-[7px]'/>
                          )

                        })
                       }                       
                </div>

            </div>
        </div>
        <div className='ml-auto h-full w-[900px] lg:h-screen md:h-full md:max-w-full bg-slate-600 flex lg:flex-col overflow-x-scroll items-center'>
            <div className='w-full mt-3 md:mt-2'>
              <SearchBar/>
            </div>
            <div className='text-slate-200 mt-8 flex mr-auto ml-[54px] gap-4'>
            <div className={`${exploreUnderline} font-semibold cursor-context-menu`} onClick={()=> filterPosts('explore')}>Posted by user</div>  
               <div className={`${imagesUnderline} cursor-context-menu`} onClick={()=> filterPosts('images')}>Images</div> 
               <div className={`${videosUnderline} cursor-context-menu`} onClick={()=> filterPosts('videos')}>Videos</div> 
               <div className={`${blogsUnderline} cursor-context-menu`} onClick={()=> filterPosts('blogs')}>Blogs</div>
            </div>
            <div className='w-[840px] grid grid-cols-2 grid-rows-18 mt-4 gap-y-6 gap-x-3'>
                  {
                    posts && <>
                    {
                    posts.map((index, i) => {
                      if(index.type == "image") {    
                        return (
                          <div className='h-full col-span-1 row-span-6'>
                          <PostImage author={index.author[0].username}  title={index.title} images={index.images} time={index.createdAt} editTime={index.updatedAt} views={index.views} avatar={index.author[0].avatar? index.author[0].avatar: avatar}/>
                          </div>                        
                          )
                      }
                      else if(index.type == "video") {          
                        return (
                          <div className='h-full w-1/2 col-span-1 row-span-6'>
                          <Videos author={index.author[0].username} description={index.description} video={index.video} time={index.createdAt} editTime={index.updatedAt} views={index.views} avatar={index.author[0].avatar? index.author[0].avatar: avatar}/>
                          </div>
                        )
                      }
                      else if(index.type == "blogpost"){
                            // Check if the author array is defined and not empty
                        return (
                          <div className='h-full w-1/2 col-span-1 row-span-6'>
                          <Post author={index.author[0].username} title={index.title} description={index.description} image={index.image} time={index.createdAt} editTime={index.updatedAt} views={index.views} avatar={index.author[0].avatar? index.author[0].avatar: avatar}/>
                          </div>
                        )
                      }
                    })
                  }
                    </>
                  }
            </div>

          </div>
    </div>

  )
}
