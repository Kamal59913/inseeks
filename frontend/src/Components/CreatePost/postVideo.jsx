import React, { useState } from 'react'
import axios from 'axios'
import PulseLoader from "react-spinners/PulseLoader";

export function PostVideo(props) {
  const postVideoUrl = "http://localhost:8000/api/v1/createpost/videopost"

  const [description, setDescription] = useState('');
  const [video, setvideo] = useState(null);
  const [loader, setLoader] = useState(false)


  const handleVideoChange = (e) => {
    setvideo(e.target.files[0]);
    console.log(video)
  } 
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true)
    console.log("Clicked")
    let formData = new FormData()
    formData.append('description',description)
    formData.append('video',video)
    if(props.envname) {
      formData.append('envname',props.envname)
    } else {
      formData.append('envname',"")
    }
    axios.post(postVideoUrl, formData , {
      headers: {
        'Content-Type': 'multipart/form-data',
      }, 
      withCredentials: true
    })
    .then((res) => {
      if(res.data.statusCode === 200 && res.data.success === true)
      {
        console.log("Successfully sent to the server")
        props.updatepost(res.data.data)
        setLoader(false)
        props.changetogglevideo()
      }
    })
    .catch((err) => {
      console.log(err)
    })

  }
  return (
    <div className="absolute rounded-md bg-slate-600 p-2 w-full h-screen flex items-center justify-center bg-opacity-25">
      <div className="relative flex justify-center bg-white px-4 py-4 sm:px-6 sm:py-16 lg:px-8 w-[460px] rounded-md">
        <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
        <i className='fa-solid fa-backward absolute ml-[400px] text-slate-600' onClick={props.changetogglevideo}></i>
        <h2 className="text-2xl font-bold leading-tight text-slate-600 mt-3">Upload Video</h2>
          <form action="#" onSubmit={handleSubmit
          
          } method="POST" className="mt-3">
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="" className="text-base font-medium text-gray-900">
                  </label>
                </div>
                <div className="mt-2">
                  <textarea
                    className="flex min-h-10 max-h-20 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="text"
                    placeholder="Description(Required)"
                    value={description}
                    onChange={(e)=>setDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className='mt-4'>
                <p className='inline-flex font-semibold text-lg'>Select</p>
                <label
              htmlFor="videoupload"
              className="ml-4 relative inline-flex items-center justify-center rounded-md border border-gray-400 bg-white px-3.5 py-2.5 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-slate-600 focus:bg-gray-100 focus:text-slate-600 focus:outline-none"
            >
             <i className='fa-solid fa-video'></i>
                </label>
                <input id="videoupload" type="file" className="hidden"  accept="video/mp4,video/x-m4v,video/*"  
                onChange={handleVideoChange}/>
                {
                    loader && <>
                      <span className='ml-2 text-slate-800'> Uploading 
                        </span>
                        <span className='ml-2'>
                        <PulseLoader color="#475569"
                            size={6}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                            />
                        </span>
                    </>
                  }
              </div>
              <div className='h-[180px] w-full bg-slate-600 mt-1 flex justify-center'>
              {video && <>
                  <video controls className='bg-slate-200 h-full w-64'>
                    <source src={URL.createObjectURL(video)} type='video/mp4'></source>
                  </video>
                  <i className=' fa-solid fa-x absolute ml-[360px] mt-3 text-slate-100' onClick={()=>setvideo(null)}></i>
                </> }
              </div>
              <button
              type="submit"
              className="relative inline-flex w-full items-center justify-center rounded-md border border-gray-400 bg-white px-3.5 py-2.5 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-slate-600 focus:bg-gray-100 focus:text-slate-600 focus:outline-none"
            >
              Post
            </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
