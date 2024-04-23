import React, { useContext, useEffect, useState } from 'react'
import LeftBar from '../Utilities/LeftBar'
import SearchBar from '../Utilities/SearchBar'
import DataContext from '../../Context/myContext'
import axios from 'axios'

export default function MyFriends() {

  /*url to follow a user*/
  const togglefollow = "http://localhost:8000/api/v1/follow//user/connecttoggle"  

  const [datatoggle, setdatatoggle] = useState(true);
  const [friendRequestToggle, setfriendRequestToggle] = useState({});
  const [diconnectRequestToggle, setdisconnectfriendRequestToggle] = useState({});
  const [friendsCount, setfriendsCount] = useState(0);
  /*toggle for useeffect dependency array*/
  const [dependencyToggle, setToggle] = useState(false);

  const {data, fetchData, avatar, datanotfollowed, fetchDataNotFollowed} = useContext(DataContext)

  useEffect(() => {
      fetchData()
      fetchDataNotFollowed()
  }, [data, datanotfollowed])

  useEffect(() => {
    if (data && data.length > 0) {
      setfriendsCount(data.length);
    }
}, [data]); // Update friends count when data changes


  const connectionRequest = (id) => {
  /*intially set false to each element*/
  setfriendRequestToggle(prevState => ({
    ...prevState,
    [id]: !prevState[id] // If the state is undefined, set it to false
  }));
  
  let toggle;
  if(friendRequestToggle[id]){
    toggle = 'connect';
  } else {
    toggle = 'connected'
  }
  const userdetails = {
    userId : id,
    toggle: toggle
  }

  axios.post(togglefollow, userdetails, { withCredentials: true })
  .then((res)=> {
    console.log("Toggle follow request is successfull", res)
    // fetchDataNotFollowed()
  })
  .catch((err) => {
    console.log("There is some problem occurred in the follow toggle")
  })
  }

  const disconnectionRequest = (id) => {
    /*intially set false to each element*/
    setdisconnectfriendRequestToggle(prevState => ({
      ...prevState,
      [id]: !prevState[id] // If the state is undefined, set it to false
    }));
    
    let toggle;
    if(diconnectRequestToggle[id]){
      toggle = 'connect';
    } else {
      toggle = 'disconnected'
    }
    const userdetails = {
      userId : id,
      toggle: toggle
    }
  
    console.log(userdetails.toggle)
    axios.post(togglefollow, userdetails, { withCredentials: true })
    .then((res)=> {
      console.log("Toggle follow request is successfull", res)
      // fetchData()
    })
    .catch((err) => {
      console.log("There is some problem occurred in the follow toggle")
    })
    }
  return (
    <div className='flex flex-col lg:flex-row md:flex-col h-screen overflow-hidden'>
        <LeftBar/>
        <div className='h-full w-full lg:h-screen md:h-full md:max-w-full lg:w-full bg-slate-600 flex lg:flex-col overflow-x-scroll items-center'>
        <div className='w-full mt-3 md:mt-2'>
              <SearchBar/>
            </div>                
            <div className='text-slate-200 mt-8 flex mr-auto ml-[189px] gap-4'>
                    <p className={datatoggle ? 'underline' : ''} onClick={()=> setdatatoggle(true)}>People to follow</p>
                    <p className={!datatoggle ? 'underline' : ''} onClick={()=> setdatatoggle(false)}>Connected {friendsCount}</p>
                </div>    
                    <div className='grid grid-cols-4 gap-x-20 gap-y-6 items-center justify-center mt-4'>
                        {
                            datatoggle? <>{
                              datanotfollowed && datanotfollowed.map((index, i) => {
                                return (
                                    <div className='h-[22vh] w-[26vh] bg-[white] flex flex-col justify-center items-center rounded-[1vh]'>
                                    <img className='h-[8vh] w-[8vh] rounded-[2vh]' src={index.avatar || avatar}/>
                                    <p className='text-base font-semibold mt-[0.4vh] mb-0 mx-0'>{index.fullname}</p>
                                    <p className='text-[13px] font-medium text-[#8f92a1] -mt-0.5 mb-0 mx-0'>{index.username}</p>
                                    <button className='bg-[#53d768] text-[11px] font-semibold text-[white] h-[3vh] w-[11.8vh] mt-[1vh] mb-0 mx-0 rounded-[0.4vh] border-none' 
                                    onClick={() => connectionRequest(index._id)}>
                                        { friendRequestToggle[index._id] ? 'Connected' : 'Connect'}
                                      </button>
                                </div>  
                                )
                            })} </>
                            :
                            <>{
                            data&& data.map((index, i) => {
                              return (
                                  <div className='h-[22vh] w-[26vh] bg-[white] flex flex-col justify-center items-center rounded-[1vh]'>
                                  <img className='h-[8vh] w-[8vh] rounded-[2vh]' src={index.avatar || avatar}/>
                                  <p className='text-base font-semibold mt-[0.4vh] mb-0 mx-0'>{index.fullname}</p>
                                  <p className='text-[13px] font-medium text-[#8f92a1] -mt-0.5 mb-0 mx-0'>{index.username}</p>
                                  <button className='bg-[#53d768] text-[11px] font-semibold text-[white] h-[3vh] w-[11.8vh] mt-[1vh] mb-0 mx-0 rounded-[0.4vh] border-none'
                                  onClick={() => disconnectionRequest(index._id)}>
                                        { friendRequestToggle[index._id] ? 'Connect' : 'Connected'}
                                  </button>
                              </div>  
                              )
                          })  
                            } </>
                          } 
                    </div>    
        </div>
    </div>   
  )
}
