import React, { useState } from 'react'
import PulseLoader from "react-spinners/PulseLoader";
import axios from 'axios'

export function PostImages(props) {
  const postImageUrl = "http://localhost:8000/api/v1/createpost/imagepost"

  const [title, setTitle] = useState('');
  const [images, setimage] = useState([]);
  const [loader, setLoader] = useState(false)

  const [imagecounter, setimagecounter] = useState(0);

  const decrement = () => {
    let count = imagecounter
    if(imagecounter > 0) {
      count--;
      setimagecounter(count);
    } else {
      setimagecounter(images.length-1);
    }
  }

  const increment = () => {
    let count = imagecounter;
    if(count < images.length-1) {
      count++;
      setimagecounter(count);
    } else {
      setimagecounter(0);
    }
  }

  console.log(imagecounter)
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setimage(selectedFiles);
  } 
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true)
    console.log("Clicked")
    let formData = new FormData()
    formData.append('title',title)
    if(props.envname) {
      formData.append('envname',props.envname)
    } else {
      formData.append('envname',"")
    }
    images.forEach((image,index) => {
      formData.append(`images`,image);
    });
    console.log(formData)
    axios.post(postImageUrl, formData , {
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
        props.changetoggleimage()
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
        <i className='fa-solid fa-backward absolute ml-[400px] text-slate-600' onClick={props.changetoggleimage}></i>
        <h2 className="text-2xl font-bold leading-tight text-slate-600 mt-3">Post Images</h2>
          <form action="#" onSubmit={handleSubmit} method="POST" className="mt-3">
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
                    value={title}
                    onChange={(e)=> setTitle(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className='mt-4'>
                <p className='inline-flex font-semibold text-lg'>Select</p>
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
              <div className='h-[180px] w-full bg-slate-600 mt-1 flex justify-center'>
                { 
                images && <>
                  <i className='absolute fa-solid fa-less-than mr-[330px] mt-[78px] text-slate-200' onClick={decrement}></i>
                        {images[0] && <>
                                <img className='bg-slate-200 h-full w-64' src={URL.createObjectURL(images[imagecounter])} alt=''/>
                                        <i className='fa-solid fa-x absolute ml-[360px] mt-3 text-slate-100' onClick={()=>setimage(null)}></i>
                                      </> 
                                    }
                    <i className='absolute fa-solid fa-greater-than ml-[300px] mt-[78px] text-slate-200' onClick={increment}></i>
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
