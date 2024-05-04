import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from "react-router-dom"
import axios from 'axios'
import NavBar from '../Utilities/NavBar';
import LeftBar from '../Utilities/LeftBar';
import SearchBar from '../Utilities/SearchBar';
import Post from '../PostComponents/post'
import PostImage from '../PostComponents/postImages';
import Videos from '../PostComponents/postvideo';
import SharePost from '../Utilities/sharePost';
import UserImage from '../Utilities/UserImage';
import { PostAnyThing } from '../CreatePost/postAnything';
import { PostImages } from '../CreatePost/postImage';
import { PostVideo } from '../CreatePost/postVideo';
import BlogPost from './blogpost';
import VideoPost from './videopost';
import ImagePost from './imagepost';

export default function EnvHomepage() {

  const {envname} = useParams()
  const linkStyle = {
    textDecoration: "none", // Remove underline
    color: "inherit", // Inherit color from parent
  };
  /*declaring the navigate instance*/
  const navigate = useNavigate()
  const [posts, setposts] = useState()
  
  /*dummy profile pic*/
  const [avatar, setAvatar] = useState('https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png');

  
  /*declaring the axios urls*/
  const logoutUrl = "http://localhost:8000/api/v1/users/logout"

  /*declaring the route for getallposts*/
  const getallposts = `http://localhost:8000/api/v1/env/getposts/env/${envname}`

  /*declaring the route for only blog posts*/
  const getallblogposts = `http://localhost:8000/api/v1/env/getposts/env/blogs/${envname}`

  /*declaring the route for only image posts*/
  const getallimageposts = `http://localhost:8000/api/v1/env/getposts/env/images/${envname}`
  
  /*declaring the route for only image posts*/
  const getallvideoposts = `http://localhost:8000/api/v1/env/getposts/env/videos/${envname}`
  /*url to get the current user*/
  const currentuser = "http://localhost:8000/api/v1/users/current-user"

  /*url to get top 4 users*/
  const userlist = "http://localhost:8000/api/v1/users/getuserlist"

  /*url to follow a user*/
  const followUser = "http://localhost:8000/api/v1/follow//user/connect"  

  
  const [currentUser, setCurrentUser] = useState();

  /*useEffect to load the current user*/
  useEffect(() => {
    axios.get(currentuser, {
      withCredentials: true
    })
    .then((res)=>{
      setCurrentUser(res.data.data)
    })
  }, [])
  
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

  /*logout axios request*/
  const logout = () => {
    /*navigate back to the login page*/
    navigate("/")
    axios.post(logoutUrl, null, {
      withCredentials: true 
    })
    .then((res)=> {
      console.log(res)
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  /*UseEffect hook to get allposts*/
  useEffect(() => {
    axios.get(getallposts, {
      withCredentials: true 
    })
    .then((res)=> {
      setposts(res.data.done)
      underlineManager('explore')
    })
    .catch((err)=>{
      console.log(err)
    })
  }, [])

  
  /*These two useStates are connected*/
  const [buttonfollow, setButtonfollow] = useState([]);
  const [buttonfollowtoggle, setButtonfollowtoggle] = useState(false);


  /*Useffect hook to get top 3 users*/
  /*running it in each 4 seconds*/
  useEffect(() => {
    const interval = setInterval(() => {
      axios.get(userlist,{
        withCredentials: true
      })
      .then((res)=> {
        console.log(res)
        setUserList(res.data.data)
      })
      .catch((err)=> {
        console.log("There is an error while fetching userlist", err)
      })
    }, 3000);
  
    return () => {
      clearInterval(interval);
    }
  }, [])
  
  const [togglePostAny, settogglePostAny] = useState(false);
  const [togglePostImage, settogglePostImage] = useState(false);
  const [togglePostVideo, settogglePostVideo] = useState(false);
  const [togglePostStory, settogglePostStory] = useState(false);
  const [imagesUnderline, setImagesUnderline] = useState('');
  const [videosUnderline, setVideosUnderline] = useState('');
  const [blogsUnderline,  setBlogsUnderline] = useState('');
  const [exploreUnderline, setexploreUnderline] = useState('');
  const [userList, setUserList] = useState(null);

  /*toggle for types of posts*/
  const [toggleImagePost, settoggleImagePost] = useState(false);
  const [toggleVideoPost, settoggleVideoPost] = useState(false);
  const [toggleBlogPost, settoggleBlogPost] = useState(false);
  const [blogtemp, setblogtemp] = useState()
  const [videotemp, setvideotemp] = useState()
  const [imagetemp, setimagetemp] = useState()

  const changeToggleImagePost = (data) => {
    setimagetemp(data)
    if(toggleImagePost == false) {
      console.log('clicked');
      settoggleImagePost(true);
    } else {
      console.log('clicked');
      settoggleImagePost(false);
    }  
}
const changeToggleVideoPost = (data) => {
  console.log(data)
  setvideotemp(data)
    if(toggleVideoPost === false) {
      settoggleVideoPost(true);
    } else {
      settoggleVideoPost(false);
    }
}
const changeToggleBlogPost = (data) => {
  setblogtemp(data)
  console.log(data, "here is the id of the post")
  if(toggleBlogPost === false) {
    settoggleBlogPost(true);
  } else {
    settoggleBlogPost(false);
  }
}
/*Button states*/
 const [buttonStates, setButtonStates] = useState(Array(3).fill(false));


const changeToggleAny = () => {
    if(togglePostAny == false) {
      console.log('clicked');
      settogglePostAny(true);
    } else {
      console.log('clicked');
      settogglePostAny(false);
    }  
}
const changeToggleImage = () => {
    if(togglePostImage === false) {
      settogglePostImage(true);
    } else {
      settogglePostImage(false);
    }
}
const changeToggleVideo = () => {
  if(togglePostVideo === false) {
    settogglePostVideo(true);
  } else {
    settogglePostVideo(false);
  }
}
const changeToggleStory = () => {
  if(togglePostStory === false) {
    settogglePostStory(true);
  } else {
    settogglePostStory(false);
  }
}
// Add a useEffect to observe changes in the posts state
useEffect(() => {
  // console.log("new set of posts")
  // console.log(posts);
}, [posts]); // Run this effect whenever posts state changes
  
const updatepost = (newposts) => {
  if(posts) {
    setposts(prevPosts => [...newposts, ...prevPosts])
  } else {
    setposts(newposts)
  }
}
/*To filter the posts*/
const filterPosts = (data) => {
  let url;
  if(data == 'explore') {
  url = getallposts
  } else if(data == 'images') {
  url = getallimageposts
  } else if(data == 'videos') {
  url = getallvideoposts
  } else if(data == 'blogs') {
  url = getallblogposts
  }
  axios.get(url, { withCredentials: true })
  .then((res) => {
    setposts(res.data.done)
    underlineManager(data)
  })
  .catch((err) => {
    console.log(err)
  })

}

/*Function to sent friend request*/
const connectionRequest = (data, i) => {

  const newButtonStates = [...buttonStates];
  newButtonStates[data] = !newButtonStates[data];
  setButtonStates(newButtonStates);

  buttonfollowtoggle ? setButtonfollowtoggle(false) :  setButtonfollowtoggle(true)
  const userdetails = {
    userId : data,
    toggle: false
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
    <>
    {togglePostAny && <PostAnyThing changetoggleany = {changeToggleAny} updatepost={updatepost} envname={envname}/>} 
    {togglePostImage && <PostImages changetoggleimage = {changeToggleImage} updatepost={updatepost} envname={envname}/>}
    {togglePostVideo && <PostVideo changetogglevideo = {changeToggleVideo} updatepost={updatepost} envname={envname}/>}
    
    {toggleImagePost && <ImagePost changeToggleImagePost = {changeToggleImagePost} temp={imagetemp}/>}
    {toggleVideoPost && <VideoPost changeToggleVideoPost = {changeToggleVideoPost} temp={videotemp}/>}
    {toggleBlogPost && <BlogPost changeToggleBlogPost = {changeToggleBlogPost} temp={blogtemp}/>}

    <NavBar/>
    <div className='flex flex-col lg:flex-row md:flex-col h-screen overflow-hidden'>
          <LeftBar logout={logout}/>
          <div className='h-full w-full lg:h-screen md:h-full md:max-w-full lg:w-8/12 bg-slate-600 flex lg:flex-col overflow-x-scroll items-center'>
            <div className='w-full mt-3 md:mt-2'>
              <SearchBar/>
            </div>
            <div className='text-slate-200 mt-8 flex mr-auto ml-[100px] gap-4'>
               <div className={`${exploreUnderline} font-semibold cursor-context-menu`} onClick={()=> filterPosts('explore')}>Explore</div>  
               <div className={`${imagesUnderline} cursor-context-menu`} onClick={()=> filterPosts('images')}>Images</div> 
               <div className={`${videosUnderline} cursor-context-menu`} onClick={()=> filterPosts('videos')}>Videos</div>
               <div className={`${blogsUnderline} cursor-context-menu`} onClick={()=> filterPosts('blogs')}>Blogs</div>
            </div>
            <div className='w-[840px] grid grid-cols-2 grid-rows-18 mt-4 gap-y-6 gap-x-3'>
                    <div className='col-span-1 row-span-2 mb-2'>
                        <SharePost changetoggleimage={changeToggleImage} changetoggleany={changeToggleAny} changetogglevideo = {changeToggleVideo} changetogglestory = {changeToggleStory} avatar={currentUser&& currentUser.avatar || avatar}/>
                  </div>
                  {
                    posts && <>
                    {
                    posts.map((index, i) => {
                      if(index.type == "image") {    
                        return (
                          <div className='h-full col-span-1 row-span-6'>
                          <PostImage postId={index._id} type={index.type} _id={index.author[0]._id} author={index.author[0].username} avatar={index.author[0].avatar || avatar}  title={index.title} images={index.images} time={index.createdAt} editTime={index.updatedAt} views={index.views} isLiked={index.isLiked} likesCount={index.likesCount} changeToggleImagePost={changeToggleImagePost} currentUser={currentUser}/>
                          </div>                        
                          )
                      }
                      else if(index.type == "video") {          
                        return (
                          <div className='h-full w-1/2 col-span-1 row-span-6'>
                          <Videos postId={index._id} type={index.type} _id={index.author[0]._id} author={index.author[0].username} avatar={index.author[0].avatar || avatar} description={index.description} video={index.video} time={index.createdAt} editTime={index.updatedAt} views={index.views} isLiked={index.isLiked} likesCount={index.likesCount} changeToggleVideoPost={changeToggleVideoPost} currentUser={currentUser}/>
                          </div>
                        )
                      }
                      else if(index.type == "blogpost"){
                            // Check if the author array is defined and not empty
                        return (
                          <div className='h-full w-1/2 col-span-1 row-span-6'>

                          <Post postId={index._id} type={index.type} _id={index.author[0]._id} author={index.author[0].username} avatar={index.author[0].avatar || avatar} title={index.title} description={index.description} image={index.image} time={index.createdAt} editTime={index.updatedAt} views={index.views} isLiked={index.isLiked} likesCount={index.likesCount} changeToggleBlogPost={changeToggleBlogPost} currentUser={currentUser}/>
                          </div>
                        )
                      }
                    })
                  }
                    </>
                  }
            </div>

          </div>
          <div className='hidden shrink-0 h-full lg:h-screen md:h-full md:w-full lg:w-3/12 bg-slate-800 lg:flex lg:flex-col'>
            <div className='flex'>
                   <div className='ml-[220px] mt-4 bg-slate-400 h-12 w-12 flex items-center justify-center rounded-full'>
                        <i className='fa-solid fa-bell text-white text-xl'></i>
                    </div>
                    <div className='ml-5 mt-4'>
                        <UserImage avatar={avatar}/>
                    </div>
            </div>
            <p className='text-white text-md mt-4 ml-8'> Recent Stories </p>
            <div className='flex gap-4 mt-2 pl-9 overflow-x-auto no-scrollbar'>
                <img className='h-11 w-11 border-4 border-slate-400 border-double outline-white rounded-md' src='profile-pic.png'></img>
                <img className='h-11 w-11 border-4 border-slate-400 border-double rounded-md' src='profile-pic.png'></img>
                <img className='h-11 w-11 border-4 border-slate-400 border-double rounded-md' src='profile-pic.png'></img>
                <img className='h-11 w-11 border-4 border-slate-400 border-double rounded-md' src='profile-pic.png'></img>
                <img className='h-11 w-11 border-4 border-slate-400 border-double rounded-md' src='profile-pic.png'></img>
                <img className='h-11 w-11 border-4 border-slate-400 border-double rounded-md' src='profile-pic.png'></img>

            </div>
            <p className='text-white text-md mt-4 ml-8'> People to follow </p>
            <div className='flex flex-col gap-3'>
              {
                userList&& userList.map((index,i) => {
                  return (
                    <div className='flex flex-row ml-6'>
                    <img className='h-[6vh] w-[6vh] bg-[powderblue] ml-[1vh] mr-0 mt-[1vh] mb-0 rounded-lg' src={index.avatar || avatar} />
                    <div className='h-[6vh] w-54 text-sm font-semibold flex flex-col ml-[1vh] mt-[8.4px]'>  
                        <p className='w-[13vw] text-sm font-bold text-slate-100 cursor-context-menu m-0'>{index.username}</p>                                
                        <p className='text-[11px] text-slate-50 cursor-context-menu m-0'> {
                          index.about.length>32 ? <> {index.about.slice(0, 32)} ... </> : <>{index.about}</>} </p>
                    </div>
                    <div key={i} className='text-[13px] font-semibold rounded h-[3vh] bg-slate-200 text-slate-600 px-2 mt-3 cursor-context-menu' onClick={()=> connectionRequest(index._id, i)}>
                      {buttonStates[index._id] ? <>Connected</> : <>Connect</>}
                       </div>            
    </div>
                  )
                })
              
              }
           
            </div>
            <Link to="/h/follow" style={linkStyle}><p className='text-white text-md mt-4 ml-8 cursor-pointer'> See more people ... </p></Link>
          </div>
    </div>        
    </>   
    )     
}
