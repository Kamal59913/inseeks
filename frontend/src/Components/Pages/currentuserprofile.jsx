import React, { useEffect, useState } from 'react'
import PANDN from '../Utilities/notifcationandprofile'
import LeftBar from '../Utilities/LeftBar'
import SearchBar from '../Utilities/SearchBar'
import Post from '../PostComponents/post'
import Videos from '../PostComponents/postvideo'
import PostImage from '../PostComponents/postImages'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function MyProfile() {
  const linkStyle = {
    textDecoration: "none", // Remove underline
    color: "inherit", // Inherit color from parent
  };

  /*User posts links*/
  /*declaring the route for getallposts*/
  const getallpostsUser = "http://localhost:8000/api/v1/createpost/getalluserposts"

  /*declaring the route for only blog posts*/
  const getallblogpostsUser = "http://localhost:8000/api/v1/createpost/getuserposts/blogs"
   
  /*declaring the route for only image posts*/
  const getallimagepostsUser = "http://localhost:8000/api/v1/createpost/getuserposts/images"
      
  /*declaring the route for only image posts*/
  const getallvideopostsUser = "http://localhost:8000/api/v1/createpost/getuserposts/videos"
  
  /*url to get the current user*/
  const currentuser = "http://localhost:8000/api/v1/users/current-user"


  const [posts, setposts] = useState()
  const [imagesUnderline, setImagesUnderline] = useState('');
  const [videosUnderline, setVideosUnderline] = useState('');
  const [blogsUnderline,  setBlogsUnderline] = useState('');
  const [exploreUnderline, setexploreUnderline] = useState('');

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

    /*dummy profile pic*/
    const [avatar, setAvatar] = useState('https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png');

    /*hook to store current user*/
    const [currentUser, setCurrentUser] = useState();

    /*UseEffect hook to get current user data*/
    useEffect(() => {
      axios.get(currentuser, {
        withCredentials: true
      })
      .then((res)=>{
        console.log(res.data.data)
        setCurrentUser(res.data.data)
      })
    }, [])

    /*UseEffect hook to get allposts*/
    useEffect(() => {
      if(currentUser) {
        console.log(currentUser)
        axios.get(`${getallpostsUser}/${currentUser.username}`, {
          withCredentials: true   
        })
        .then((res)=> {
          console.log(res.data.done)
          setposts(res.data.done)
          underlineManager('explore')
        })
        .catch((err)=>{
          console.log(err)
        }) 
      }

      }, [currentUser])

    /*To filter the posts*/
    const filterPosts = (data) => {
      let url;
      switch (data) {
        case 'images':
          url = `${getallimagepostsUser}/${currentUser.username}`;
          break;
        case 'videos':
          url = `${getallvideopostsUser}/${currentUser.username}`;
          break;
        case 'blogs':
          url = `${getallblogpostsUser}/${currentUser.username}`;
          break;
        default:
          url = `${getallpostsUser}/${currentUser.username}`;
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

  return (
    <div className="bg-[#0f172a] flex flex-col lg:flex-row md:flex-col h-screen overflow-hidden">
        <LeftBar/>
        <div className='h-full w-full lg:h-screen md:h-full md:max-w-full lg:w-8/12 flex lg:flex-col overflow-x-scroll items-center'>
            <div className='w-full mt-3 md:mt-2'>
              <SearchBar/>
            </div>
            <div className='text-slate-200 mt-8 flex mr-auto ml-[114px] gap-4'>
               <div className={`${exploreUnderline} font-semibold cursor-context-menu`} onClick={()=> filterPosts('explore')}>Your Posts</div>  
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
                          <PostImage author={index.author[0].username}  title={index.title} images={index.images} time={index.createdAt} editTime={index.updatedAt} views={index.views} avatar={index.author[0].avatar || avatar}/>
                          </div>                        
                          )
                      }
                      else if(index.type == "video") {          
                        return (
                          <div className='h-full w-1/2 col-span-1 row-span-6'>
                          <Videos author={index.author[0].username} description={index.description} video={index.video} time={index.createdAt} editTime={index.updatedAt} views={index.views} avatar={index.author[0].avatar || avatar}/>
                          </div>
                        )
                      }
                      else if(index.type == "blogpost"){
                            // Check if the author array is defined and not empty
                        return (
                          <div className='h-full w-1/2 col-span-1 row-span-6'>
                          <Post author={index.author[0].username} title={index.title} description={index.description} image={index.image} time={index.createdAt} editTime={index.updatedAt} views={index.views} avatar={index.author[0].avatar || avatar}/>
                          </div>
                        )
                      }
                    })
                  }
                    </>
                  }
            </div>

          </div>
        <div className='h-screen w-[26vw] bg-slate-800 fixed flex flex-col rounded-tl-[34px] rounded-bl-[30px] right-0'>
        <PANDN avatar={avatar}/>
        <div className='h-[650px] w-[23vw] flex flex-col items-center ml-[21px] mr-0 mt-[7px] mb-0 rounded-[11.2px]'>
                <img className='h-[119px] w-[119px] mt-[9.8px] mb-0 mx-0 rounded-[11.2px]' src={currentUser && currentUser.avatar || avatar}/>
                <p className='text-[22px] font-bold text-[white] mt-[7px] mb-0 mx-0'>{currentUser&& <>{currentUser.fullname}</>}</p>
                <p className='text-base font-semibold text-[#8f92a1] mt-[4.2px] mb-0 mx-0'>{currentUser&& <>{currentUser.username}</>}</p>
                <div className='h-[42px] text-sm font-semibold text-[#8f92a1] flex flex-row gap-7 m-0 p-0'>
                    <p className='text-base mt-[11.2px] mb-0 mx-0'><b className='text-white'>{currentUser&& currentUser.PostsCount+currentUser.ImagePostCount+currentUser.VideoPostsCount}</b> Posts</p>
                    <p className='text-base mt-[11.2px] mb-0 mx-0'><b className='text-white'>{currentUser&& Math.max(0, currentUser.followersCount - 1)}</b> Friends</p>
                </div>
                <div className='text-sm text-[#8f92a1] flex flex-row gap-[35px] items-center mt-[2.8px] mb-0 mx-0'>
                    <Link to='/settings' style={linkStyle}><button className='bg-[#53d768] text-[white] text-base h-[42px] font-semibold mt-[4.2px] mb-0 mx-0 px-[21px] py-0 rounded-[21px] border-none'>Edit Profile</button></Link>
                    <i class="fa-solid fa-ellipsis-vertical text-lg rounded text-[white] px-[11.2px] py-[5.6px] border-2 border-solid border-[#8f92a1]"></i>
                </div>
                <p className='text-lg font-bold text-[white] ml-0 mr-[186px] mt-3.5 mb-0'>About</p>
                <p className='text-[13px] font-semibold w-[14vw] text-slate-200 ml-0 mr-[23.8px] mt-[4.2px] mb-0'>
             {  
              currentUser? currentUser.about : <>You have not added any bios</>
             }
                </p>
                <Link to="/h/follow" style={linkStyle}><p className='text-[19px] font-bold text-[white] ml-0 mr-[12vw] my-3.5'>Friends</p></Link>
                <div className='grid grid-cols-[49px_49px_49px_49px_49px] gap-y-[9.8px] mt-0 mb-3.5 mx-0'>
                  {
                    currentUser && currentUser.followerslist.map((index, i) => {
                        return (
                            index? <img key={i} src={index.avatar || avatar} className='h-[42px] w-[42px] rounded-[7px]'/>
                            :
                            <img src={avatar} className='h-[42px] w-[42px] rounded-[7px]'/>
                        )
                      
                    })
                  }
                </div>

            </div>
</div>
    </div>   
  )
}
