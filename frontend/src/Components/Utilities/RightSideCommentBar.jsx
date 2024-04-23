import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'

export default function RightSideCommentBar(props) {
  const [avatar, setAvatar] = useState('https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png');
  const [socket, setSocket] = useState()
  const [comment, setComment] = useState([])
  const [currnetComment, setCurrentComment] = useState()

  /*Url to save comments*/
  const savecomment = "http://localhost:8000/api/v1/comment/post-comment"
  const getcomment = "http://localhost:8000/api/v1/comment/retrieve-comment"

  /*Use Effect to connect with web sockets*/
  const url = "http://localhost:8000/"
  useEffect(() => {
    const socketInstance = io(url);
    setSocket(socketInstance)
    // listen for events emitted by the server
    socketInstance.on('connect', () => {
      console.log('Connected to server', socketInstance.id);
    });
  
    socketInstance.on('chat message', async (data) => {
        console.log('Recieved message',data);

        if(data.Post_Id == props.currentPostId) {
            setComment(prevComment => [
              ...prevComment,
              data
            ]);
        }
    });
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

     /*Use Effect to retrieve user*/
    useEffect(() => {
      const data = {
        Post_Id : props.currentPostId,
      }
      axios.post(getcomment, data, {
        withCredentials: true
      })
      .then((res)=>{
        console.log(res.data,"here it is")
        setComment(res.data.data)      
        })
      .catch((err)=>{
        console.log(err)
      })
    }, [])
    

  const handlesubmit = (e) => {
    e.preventDefault();
    setCurrentComment('')
    /*recieving data*/
    const data = {
      Post_Id: props.currentPostId,
      username: props.currentUser.username,
      avatar: props.currentUser.avatar,
      content: currnetComment
    }

    /*step 1 emit message*/
    socket.emit("chat message", data)

    /*step 2 save data into the database*/
    axios.post(savecomment, data, {
      withCredentials: true
    })
    .then((res)=>{
      console.log(res)
    })
    .catch((err)=>{
      console.log(err)
    })
  }
  return (
    <>
    <div className='relative h-[650px] w-[26vw] bg-slate-800 flex flex-col pb-10'>
        <div className='h-[8vh] w-[16.8vw] flex flex-row text-[white] ml-auto mr-[2.9vh] mt-[4vh] mb-0 justify-end'>
            <div className='mr-5 mt-[12px]'> <i className="fa-regular fa-bell fa-lg"></i> </div>
            <img className='h-10 w-10 rounded-lg' src={props.currentUser.avatar || avatar}/>
        </div>
        <div className='h-[550px] w-[22vw] flex flex-col text-[white] ml-6 mr-0 mb-0'>
            <p className='text-lg font-semibold cursor-context-menu ml-[5px] mr-0 my-0'> Comments {comment.length} </p>
              <div className='h-[550px] overflow-auto overflow-x-hidden'>
                <div className='w-full flex flex-col'>
                  {comment && comment.slice().reverse().map((index, i) => {
                    return (
                    <>
                      <div className='w-[49vh] flex flex-row mt-[1vh] mb-0 mx-0 rounded-[1vh]'>
                        <img className='h-10 w-10 bg-[powderblue] ml-[1vh] mr-0 mt-[2vh] mb-0 rounded-lg' src={index.avatar || avatar}/>
                          <p className='text-xs w-56 font-semibold cursor-context-menu ml-2 mt-3'>{index.username}</p>
                            <p className='text-[11px] text-[#8f92a1] mr-0 mt-3 mb-0'> 5 min ago </p>
                      </div>
                      <div className=''>
                        <p className='text-xs text-[grey] font-medium ml-[1vh] mr-0 mt-[1vh] mb-0'> {index.content}</p>
                      </div>
                      <div className='flex mt-2 gap-2 ml-2 h-6'>
                        <i className="fa-regular fa-heart fa-sm mt-2"></i> <span className='text-xs'></span>
                        <i className="fa-regular fa-comment fa-sm mt-2 ml-4"></i> <span className='text-xs'></span>
                      </div>  
                    </>
                    )
                  })}
                </div>
          </div>
              <form className='h-[7vh] w-full flex' onSubmit={handlesubmit}>
              <label for=""></label> <br/>
                  <input type="text"
                  name="Occupation"
                  placeholder="Write in comment..."
                  className="text-slate-600 h-[5vh] w-80 max-w-[119vh] text-sm rounded pl-[1vh] pr-[10vh] border-2 border-solid ml-3"
                  value={currnetComment}
                  onChange={(e) => setCurrentComment(e.target.value)}
                  /><br/>
                  <button className="absolute fa-solid fa-paper-plane text-slate-700 ml-[284px] mt-2" type='submit'></button>
              </form>
        </div>
    </div>
    </>
  )
}
