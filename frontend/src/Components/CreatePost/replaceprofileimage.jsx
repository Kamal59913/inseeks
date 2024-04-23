import React, { useState } from 'react'
import PulseLoader from "react-spinners/PulseLoader";
import axios from 'axios'

export default function ReplaceImages(props) {
  const postAnythingUrl = "http://localhost:8000/api/v1/users/updateavatar"

  const [image, setimage] = useState(null);
  const [loader, setLoader] = useState(false)

  //putting it all in a json variable
  const handleImageChange = (e) => {
    console.log(e.target.files[0])
      setimage(e.target.files[0]);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true)
    let formData = new FormData()
    formData.append('avatar',image)

    console.log(formData)
    axios.patch(postAnythingUrl, formData , {
      headers: {
        'Content-Type': 'multipart/form-data',
      }, 
      withCredentials: true
    })
    .then((res) => {
      if(res.data.statusCode === 200 && res.data.success === true)
      { 
        console.log("Successfully sent to the server")
        props.toggleForProfileImageFetch()
        setLoader(false)
        props.togglePic()
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
        <p className='absolute ml-[368px] text-slate-600 font-semibold cursor-context-menu' onClick={props.togglePic}>Cancel</p>
          <h2 className="text-2xl font-bold leading-tight text-slate-600 mt-3">Add Display Image</h2>
          <form action="#" onSubmit={handleSubmit} method="POST" className="mt-2">
            <div className="space-y-3">
              <div className='mt-3'>
                <p className='inline-flex font-semibold text-lg'>Insert</p>
                <label
                  htmlFor="imageupload"
                  className="imagecheck inline-flex items-center justify-center rounded-md bg-slate-600 px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80 ml-4"
                >
                <i className='fa-solid fa-image'></i>
                </label>
                <input id="imageupload" type="file" className="hidden imagecheck" multiple  accept="image/*"  
                onChange={handleImageChange}
                />
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
              <div className='h-[220px] w-full bg-slate-600 mt-1 flex justify-center'>
                {image && <>
                  <img className='bg-slate-200 h-full w-64 rounded-2xl' src={URL.createObjectURL(image)} alt=''/>
                  <i className='fa-solid fa-x absolute ml-[360px] mt-3 text-slate-100' onClick={()=>setimage(null)}></i>
                </> 
                }
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
