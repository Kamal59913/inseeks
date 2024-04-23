/* DataContext.js */
import React, { createContext, useState } from 'react';
import axios from 'axios';

const DataContext = createContext();

/*default avatar*/
const avatar = 'https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png'

/*url to get users followed*/
const userlist = "http://localhost:8000/api/v1/users/getusers"

/*url to get users not followed*/
const userlistnotfollowed = "http://localhost:8000/api/v1/users/getusersnotfollowed"

/*url to like a post*/
const likepost = "http://localhost:8000/api/v1/like/toggle/like"


export const UserListProvider = ({ children }) => {
  const [data, setUserList] = useState(null);
  const [datanotfollowed, setUserListnotfollowed] = useState(null);

  const fetchData = async () => {
    // Your logic to fetch data
    const users = axios.get(userlist,{
        withCredentials: true
      })
      .then((res)=> {
        setUserList(res.data.data)
      })
      .catch((err)=> {
        console.log("There is an error while fetching userlist", err)
      })
  };

  const fetchDataNotFollowed = async () => {
    // Your logic to fetch data
    const users = axios.get(userlistnotfollowed,{
        withCredentials: true
      })
      .then((res)=> {
        setUserListnotfollowed(res.data.data)
      })
      .catch((err)=> {
        console.log("There is an error while fetching userlist", err)
      })
  };




  return (
    <DataContext.Provider value={{ data, fetchData, avatar, datanotfollowed, fetchDataNotFollowed}}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
