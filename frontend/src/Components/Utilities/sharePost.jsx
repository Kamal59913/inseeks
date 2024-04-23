import React from 'react'
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom'

export default function SharePost(props) {
  return (
    <div className="ml-[26px] lg:ml-[22px] p-1 w-[380px] rounded-md border">
    <div className="flex items-center m-2">
  <div className="h-10 w-10 flex-shrink-0">
    <img
      className="h-8 w-8 rounded-full object-cover ml-2"  
      src={props.avatar}
      alt=""
    />
  </div>
  <div className="ml-4 mb-2" onClick={props.changetoggleany}>
    <div className="text-sm font-medium text-white w-[280px] h-7 bg-slate-600 outline-none" type='text'>What is on your mind?</div>
  </div>
</div>

<div className="p-2">
<i type="button" className="fa-regular fa-camera px-2.5 py-1 text-[14px] font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
onClick={props.changetoggleimage}>
</i>
<i
type="button"
className="fa-regular fa-video px-2.5 py-1 text-[14px] font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
onClick={props.changetogglevideo}
>
</i>
<i
type="button"
className="fa-regular fa-plus px-2.5 py-1 text-[14px] font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
onClick={props.changetoggleany}
>
</i>
<i
type="button"
className="ml-[210px] fa-regular fa-share px-2.5 py-1 text-[14px] font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
onClick={props.changetogglestory}
>
</i>

</div>
</div> 
    )
}
