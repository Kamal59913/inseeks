import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../Utilities/SearchBar';
import LeftBar from '../Utilities/LeftBar';
import { CreateEnv } from '../CreatePost/createEnv';

export default function Events() {
  const [toggleCreateEnv, settoggleCreateEnv] = useState(false);

  const navigate = useNavigate()
  const goToEvent = () => {
    navigate('/')
  }

  const toggleCreate = () => {
    toggleCreateEnv? settoggleCreateEnv(false) : settoggleCreateEnv(true)
    console.log(toggleCreate, "clicked")
  }
  return (
    <>
    {toggleCreateEnv && <CreateEnv toggleCreate = {toggleCreate}/>}
    <div className='flex flex-col lg:flex-row md:flex-col h-screen overflow-hidden'>
        <LeftBar/>
        <div className='h-full w-full lg:h-screen md:h-full md:max-w-full lg:w-full bg-slate-600 flex lg:flex-col overflow-x-scroll'>
        <div className='w-full mt-3 md:mt-2'>
              <SearchBar/>
            </div>
              <p className='ml-14 mt-4 text-slate-100 text-xl'>Environments</p>
                <div className='text-slate-100 ml-14 flex text-sm gap-4'>
                <p className> Anytime</p>
                <p className> Today</p>
                <p className> Tomorrow</p>
                <p className> This Week</p>
                <p className> This Month</p>
                <p className> Select</p>
                <p className = ""
                   onClick={toggleCreate}
                > Create One </p>
                </div>
                <div className='grid grid-cols-3 gap-y-10 gap-x-40 ml-14 mt-3 w-[1000px]'>
                <div class="w-[300px] rounded-md border">
                        <img
                          src="https://images.unsplash.com/photo-1522199755839-a2bacb67c546?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGJsb2d8ZW58MHx8MHx8&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=60"
                          alt="Laptop"
                          class="h-[200px] w-full rounded-md object-cover"
                        />
                        <div class="px-4">
                          <h1 class="mt-4 text-lg font-semibold">About Macbook</h1>
                          <p class="text-sm text-slate-100">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi,
                            debitis?
                          </p>
                          <div class="isolate flex-space-x-2">
                          <button
                            type="button"
                            class="mb-4 rounded-sm bg-black px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                          >
                            Join
                          </button>  
                              <img
                                className="relative ml-16 z-30 inline-block h-8 w-8 rounded-full ring-2 ring-white"
                                src="https://overreacted.io/static/profile-pic-c715447ce38098828758e525a1128b87.jpg"
                              />
                              <img
                                class="relative z-20 inline-block h-8 w-8 rounded-full ring-2 ring-white"
                                src="https://res.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_170,w_170,f_auto,g_faces,z_0.7,b_white,q_auto:eco,dpr_1/smokhfs2uevnppc2bmwl"
                              />
                              <img
                                class="relative z-10 inline-block h-8 w-8 rounded-full ring-2 ring-white"
                                src="https://leerob.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Favatar.b1d1472f.jpg&amp;w=256&amp;q=75"
                                alt="Lee_Robinson"
                              />
                              <img
                                class="relative z-0 inline-block h-8 w-8 rounded-full ring-2 ring-white"
                                src="https://nextjs.org/_next/image?url=https%3A%2F%2Fwww.datocms-assets.com%2F35255%2F1665059775-delba.jpg&amp;w=640&amp;q=75"
                                alt="Delba"
                              />
                          </div>

                      </div>
                    </div> 
                </div>
        </div>
    </div>  
    </> 
  )
}
