import React from 'react'

export default function UserImage(props) {
  return (
    <div className="h-12 w-12 flex-shrink-0">
    <img
      className="h-12 w-12 rounded-full object-cover ml-2"
      src={props.avatar}
      alt=""
    />
  </div>  )
}
