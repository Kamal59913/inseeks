import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../Utilities/SearchBar';
import LeftBar from '../Utilities/LeftBar';
import { CreateEnv } from '../CreatePost/createEnv';
import EnvCard from '../envComponents/envCard';
import axios from 'axios'

export default function Events() {
  const [holdEnvData, setholdEnvData] = useState()
  /*Url to retrieve environments*/
  let getEnvs = "http://localhost:8000/api/v1/env/getEnvs"

  const [toggleCreateEnv, settoggleCreateEnv] = useState(false);

  useEffect(() => {
    axios.get(getEnvs, {
      withCredentials: true
    })
    .then((res) => {
      setholdEnvData(res.data.data)
    })
    .catch((err) => {
      console.log(err)
    })
  }, [toggleCreateEnv])
  
  console.log(holdEnvData,'holdEnvData')
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
    <div className='bg-[#0f172a] flex flex-col lg:flex-row md:flex-col h-screen overflow-hidden'>
        <LeftBar/>
        <div className='h-full w-full lg:h-screen md:h-full md:max-w-full lg:w-full flex lg:flex-col overflow-x-scroll'>
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
                { holdEnvData &&
                  holdEnvData.map((index, i)=> {
                    return (
                    <EnvCard title={index.name} description={index.description} avatar = {index.envAvatar} isJoined = {index.isJoined}/>
                  )
                  })
                }
                </div>
        </div>
    </div>  
    </> 
  )
}
