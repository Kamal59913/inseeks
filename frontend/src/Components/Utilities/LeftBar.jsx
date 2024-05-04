import React from "react"
import { Link } from "react-router-dom"

export default function LeftBar(props) {
  const linkStyle = {
    textDecoration: "none", // Remove underline
    color: "inherit", // Inherit color from parent
  };
  return (
    <div className='bg-[#0f172a] text-[#818995] border-r-2 border-[#40536b] shrink-0 flex-col py-8 pl-10 w-full lg:h-full lg:w-40 space-y-12 text-2xl hidden lg:flex'>
    <span className='font-bold'> Social </span>
    <Link to='/h' style={linkStyle}><i className='fa-solid fa-house pl-5 mt-16'></i></Link>
    <Link to='/environments' style={linkStyle}><i className='fa-solid fa-seedling pl-5'></i></Link>
    {/* <Link to='/h/messages' style={linkStyle}><i className='fa-solid fa-envelope pl-5'></i></Link> */}
    <Link to='/profile' style={linkStyle}><i className='fa-solid fa-user pl-5'></i></Link>
    <Link to='/settings' style={linkStyle}><i className='fa-solid fa-gear pl-5'></i></Link>
    <i class="fa-solid fa-right-from-bracket pl-5" onClick={props.logout}></i>
    <i className='mt-10 fa-solid fa-backward pl-5 pt-20'></i>
  </div>
)
}
