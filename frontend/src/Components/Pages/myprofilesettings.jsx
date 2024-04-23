import { useEffect, useState } from 'react';
import PANDN from '../Utilities/notifcationandprofile'
import LeftBar from '../Utilities/LeftBar';
import ReplaceImage from '../CreatePost/replaceprofileimage'
import DeleteImage from '../CreatePost/deleteimage';
import axios from 'axios';

function MyProfileSettings() {  
  /*url to update profile*/
  const updateurl = "http://localhost:8000/api/v1/users/update-account"

  /*url to get the current user*/
  const currentuser = "http://localhost:8000/api/v1/users/current-user"


  const [togglechangeprofilepic, setTogglechangeprofilepic] = useState(false)
  const [toggledeleteprofilepic, setToggledeleteprofilepic] = useState(false)

  /*hooks to store form*/
  const [fullname, setfullname] = useState('');
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png');
  const [profilepicture, setProfilepicturetoggle] = useState(false);
  const [email, setEmail] = useState('');
  const [about, setAbout] = useState('');
  const [currentUser, setCurrentUser] = useState();
  const [buttonname, setButtonname] = useState('Save Changes')

/*to get the current user*/
useEffect(() => {
  axios.get(currentuser, {
    withCredentials: true
  })
  .then((res)=>{
    console.log(res.data.data)
    setCurrentUser(res.data.data)
  })
}, [username, profilepicture])


  const togglePic = () => {
    togglechangeprofilepic? 
    setTogglechangeprofilepic(false)
    :
    setTogglechangeprofilepic(true)
  }

  const toggleDeletePic = () => {
    toggledeleteprofilepic? 
    setToggledeleteprofilepic(false)
    :
    setToggledeleteprofilepic(true)
  }

  const toggleForProfileImageFetch = () => {
    profilepicture? setProfilepicturetoggle(false): setProfilepicturetoggle(true)
    console.log("here is the toggle", profilepicture);
  }

  const handlesubmit = (e) => {
    e.preventDefault();
    console.log("clicked")
    const data = {
      fullname: fullname,
      username: username,
      email: email,
      about: about
    }
    axios.patch(updateurl, data, {
      withCredentials: true
    })
    .then((res)=> {
      console.log(res)
      setAbout('');
      setEmail('');
      setUsername('');
      setfullname('');
      setButtonname('Saved !!');
      setTimeout(() => {
        setButtonname('Save Changes')
      }, 2000);
    })
    .catch((err)=> {
      console.log(err)
    })
  }
  console.log("this is the avatar",avatar)

  return (   
    <>
    {togglechangeprofilepic && <ReplaceImage togglePic={togglePic} toggleForProfileImageFetch={toggleForProfileImageFetch}/>}
    {toggledeleteprofilepic && <DeleteImage toggleDeletePic={toggleDeletePic} toggleForProfileImageFetch={toggleForProfileImageFetch}/>}
    <div className="flex flex-col lg:flex-row md:flex-col h-screen overflow-hidden">
      <LeftBar/>
      <div className='h-full w-full lg:h-screen md:h-full md:max-w-full lg:w-8/12 bg-slate-600 flex lg:flex-col overflow-x-scroll items-center pl-8'>
        <div className='@apply h-[70px] w-[59.2vw] text-[black] mt-[7px]'>
          <p className='@apply text-slate-200 text-xl font-bold mt-7 ml-2'>Accounts Information</p>
        </div>
        <div className='flex h-[133px] text-[white] gap-2'>
        
            <img className='h-[105px] w-[105px] mt-[7px] rounded-[28px]' src={currentUser&& currentUser.avatar || avatar}/>
     
      
          <div className=' h-28 w-[50vw] flex flex-col ml-3.5 mt-[7px]'>
            <div className='text-xl h-7 w-[700px] text-[$maincolor-light] font-bold mt-3.5'> {currentUser&& <>{currentUser.username}</>}</div>
            <div className='h-14 w-[600px] flex flex-row gap-3.5 mt-[7px]'>
              <button className='px-4 h-10 bg-slate-500 cursor-pointer text-[white] font-semibold rounded-[42px]' onClick={togglePic}> Replace Image</button>
              <button className='px-4 h-10 cursor-pointer font-medium rounded-[7px] border-[3px] border-solid border-[grey]' onClick={toggleDeletePic}> Delete Image <i class="fa-regular fa-trash-can"></i></button>
            </div>
          </div>
        </div>
       <div className='h-[240px] w-[60vw] flex flex-col ml-3.5 mr-0 my-0'>
        <div className='flex gap-4'>
            <div className='text-md font-semibold text-slate-200 underline'>Basic Information</div>
            <div className='text-md font-semibold text-slate-200'>Change Password</div>
          </div>
          <form onSubmit={handlesubmit} method='POST'>
          <div className='w-[94%] flex'>
          <div className='h-[70px] w-[420px]'>
              <label for="title" className='text-slate-200'>FULLNAME</label> <br/>
                  <input type="text"
                  name="Occupation"
                  className='h-[37.8px] w-[20vw] text-slate-600 font-medium bg-slate-400 border mt-[7px] pl-3.5 rounded-md border-[none] border-solid border-[grey]'
                  value={fullname}
                  onChange={(e)=>setfullname(e.target.value)}
                  /><br/>
              </div>
              <div className='h-[84px] w-[420px]'>
              <label for="title" className='text-slate-200'>USERNAME</label> <br/>
                  <input type="text"
                  name="Occupation"
                  className='h-[37.8px] w-[20vw] text-slate-600 font-medium bg-slate-400 border mt-[7px] pl-3.5 rounded-md border-[none] border-solid border-[grey]'
                  value={username}
                  onChange={(e)=> setUsername(e.target.value)}
                  /><br/>
              </div>
          </div>
          <div className='input-form-profile-page-basic-information-input-row-2'>
          <div className='h-[70px] w-[420px]'>
              <label for="title" className='text-slate-200'>EMAIL</label> <br/>
                  <input type="text"
                  name="Occupation"
                  className='h-[37.8px] w-[20vw] text-slate-600 font-medium bg-slate-400 border mt-[7px] pl-3.5 rounded-md border-[none] border-solid border-[grey]'
                  value={email}
                  onChange={(e)=> setEmail(e.target.value)}
                  /><br/>
              </div>
              <div className='h-[84px] w-[420px]'>
              <label for="title" className='text-slate-200'>ABOUT</label> <br/>
                  <textarea
                  name="Occupation"
                  className='max-h-[60.8px] min-h-[37.8px] w-[20vw] text-slate-600 font-medium bg-slate-400 border mt-[7px] pl-3.5 rounded-md border-[none] border-solid border-[grey]'
                  value={about}
                  onChange={(e)=>setAbout(e.target.value)}
                  /><br/>
              </div>
          </div>
          <div className='divider'></div>
          <button type='submit' className='mr-auto mt-2 text-lg h-14 min-w-[210px] bg-slate-200 text-slate-600 font-semibold rounded-[70px] border-none'> {buttonname} </button>
          </form>
          </div>

      </div>
      
      <div className='hidden shrink-0 h-full lg:h-screen md:h-full md:w-full lg:w-3/12 bg-slate-800 lg:flex lg:flex-col pl-8'>
            <PANDN/>
             <p className='text-[white] text-[22px] font-semibold ml-[22.4px] mr-0 mt-[21px] mb-0'>Settings</p>
             <div className='text-[white] flex flex-row gap-[9.8px] ml-[22.4px] mr-0 mt-7 mb-0'>
             <i className="fa-regular fa-user m-0 p-[9.8px] rounded-[6.3px] border-[1.8px] border-solid border-[grey]"></i>
             <p className='text-sm font-bold mt-[8.4px] mb-0 mx-0'> My Account </p>
             </div>
             <div className='text-[white] flex flex-row gap-[9.8px] ml-[22.4px] mr-0 mt-7 mb-0'>
             <i className="fa-regular fa-bell m-0 p-[9.8px] rounded-[6.3px] border-[1.8px] border-solid border-[grey]"></i>
             <p className='text-sm font-bold mt-[8.4px] mb-0 mx-'> Notifications </p>
             </div>
             <div className='text-[white] flex flex-row gap-[9.8px] ml-[22.4px] mr-0 mt-7 mb-0'>
             <i class="fa-regular fa-clock m-0 p-[9.8px] rounded-[6.3px] border-[1.8px] border-solid border-[grey]"></i>
             <p className='text-sm font-bold mt-[8.4px] mb-0 mx-'> Activity History </p>
             </div>
             <div className='text-[white] flex flex-row gap-[9.8px] ml-[22.4px] mr-0 mt-7 mb-0'>
             <i class="fa-solid fa-rupee-sign m-0 p-[9.8px] rounded-[6.3px] border-[1.8px] border-solid border-[grey]"></i>
             <p className='text-sm font-bold mt-[8.4px] mb-0 mx-'> Billing and Payment </p>
             </div>
             <div className='text-[white] flex flex-row gap-[9.8px] ml-[22.4px] mr-0 mt-7 mb-0'>
             <i class="fa-solid fa-lock m-0 p-[9.8px] rounded-[6.3px] border-[1.8px] border-solid border-[grey]"></i>
             <p className='text-sm font-bold mt-[8.4px] mb-0 mx-'> Security & Privacy </p>
             </div>
             <div className='text-[white] flex flex-row gap-[9.8px] ml-[22.4px] mr-0 mt-7 mb-0'>
             <i class="fa-brands fa-hire-a-helper m-0 p-[9.8px] rounded-[6.3px] border-[1.8px] border-solid border-[grey]"></i>
             <p className='text-sm font-bold mt-[8.4px] mb-0 mx-'> Help </p>
             </div>
          </div>
      </div>
      </>
  );
}

export default MyProfileSettings;
