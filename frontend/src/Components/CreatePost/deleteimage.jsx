import React, { useState } from 'react'
import PulseLoader from "react-spinners/PulseLoader";
import axios from 'axios'

export default function DeleteImage(props) {
  const postAnythingUrl = "http://localhost:8000/api/v1/users/deleteavatar"
  const [loader, setLoader] = useState(false)


  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true)
    axios.patch(postAnythingUrl, null,
      {      
        withCredentials: true
      }
    )
    .then((res) => {
      if(res.data.statusCode === 200 && res.data.success === true)
      { 
        console.log("Successfully sent to the server")
        console.log("avatar pic is removed")
        setLoader(false)
        props.toggleForProfileImageFetch()
        props.toggleDeletePic()
      }
    })
    .catch((err) => {
      console.log(err)
    })

  }
  return (
    <div className="absolute rounded-md bg-slate-600 p-2 w-full h-screen flex items-center justify-center bg-opacity-25">
      <div className="relative h-[200px] flex justify-center bg-white px-4 py-3 sm:px-6 sm:py-16 lg:px-8 w-[460px] rounded-md">
        <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
          <div className='flex justify'>
          {
                  loader && <>
                      <p className='absolute text-slate-600 font-semibold'>Deleting</p>
                      <span className='absolute ml-[70px]'>
                      <PulseLoader color="#475569"
                          size={6}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                          />
                      </span>
                  </>
                }
              <p className='absolute text-slate-600 font-semibold cursor-context-menu ml-[360px]' onClick={props.toggleDeletePic}>Cancel</p>
          </div>
          <h2 className="w-full text-2xl font-bold leading-tight text-slate-600 mt-12">Sure you want to delete the image?</h2>
          <form action="#" onSubmit={handleSubmit} method="POST" className="mt-2">
            <div className="space-y-3">
              <button
              type="submit"
              className="w-full items-center justify-center rounded-md border border-gray-400 bg-white px-3.5 py-2.5 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-slate-600 focus:bg-gray-100 focus:text-slate-600 focus:outline-none"
            >
              Delete  <i className='fa-regular fa-trash-can ml-3'></i>
            </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
