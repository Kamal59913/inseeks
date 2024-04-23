import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import SignUpPage from '../AuthenticationPages/signUpPage' 
import { ArrowRight } from 'lucide-react'
import  axios  from 'axios';

export default function LoginPage() {

  let indexof;
  const loginUrl = "http://localhost:8000/api/v1/users/login"
  const [toggle, setToggle] = useState(false);

  /*Initializing useNavigate*/
  const navigate = useNavigate();
  /*hooks for input fields*/
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [temp, setTemp] = useState('');
  const [password, setPassword] = useState('');

  const setUsernameOrEmail = (theUserNameorPass) => {

    //whether email or username, converting it to lower-case
    let usernameoremail = theUserNameorPass.toLowerCase();
    setTemp(usernameoremail)
    indexof = usernameoremail.indexOf("@")
    if((indexof) === -1) {
      setUsername(usernameoremail)
    } else {
      setEmail(usernameoremail)
    }
  }

  const LogInData = {
    username: username,
    email: email,
    password: password
  }


  const handleLogin = (e) => {
    e.preventDefault()
    console.log("working")
    axios.post(loginUrl,LogInData, {
      withCredentials: true
    })
      .then((res) => {
        if(res.data.statusCode === 200 && res.data.success === true)
          {
            navigate("/h")
          }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const TogglePage = () => {
    if(!toggle) {
      setToggle(true)
    } else {
      setToggle(false)
    }
  }
  return (
    <>
    {toggle? <SignUpPage togglepage = {TogglePage}/> : 
        <section className=''>
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-slate-900 h-screen">
          <div className="relative flex lg:items-center px-4 pb-10 pt-60 sm:px-6 sm:pb-16 md:justify-center lg:px-8 lg:pb-24">
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            <div className="relative">
              <div className="w-full max-w-xl xl:mx-auto xl:w-full xl:max-w-xl">
                <h3 className="text-4xl font-bold text-slate-200">
                  Get insight into this new Social
                </h3>
              </div>
  
  
            </div>
          </div>
          <div className="flex flex-col items-center justify-center px-4 sm:px-6 sm:py-16 lg:px-8 lg:py-0 ">
            <div className="lg:mt-4 xl:mx-auto xl:w-96 xl:max-w-sm 2xl:max-w-md pt-16 px-4 border-2 border-slate-600 rounded-md ">
              <h2 className="text-3xl font-bold leading-tight text-slate-200 sm:text-4xl">Log in</h2>  
              <form action="#" onSubmit={handleLogin} className="mt-8">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="" className="text-base font-medium text-slate-200">
                      {' '}
                      Email address or Username{' '}
                    </label>
                    <div className="mt-2">
                      <input
                        className="flex text-slate-200 h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        type="text"
                        placeholder="Email or username "
                        value={temp}
                        onChange={(e) => setUsernameOrEmail(e.target.value)}
                      ></input>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="" className="text-base font-medium text-slate-200">
                        {' '}
                        Password{' '}
                      </label>
                      <a
                        href="#"
                        title=""
                        className="text-sm font-semibold text-slate-200 hover:underline"
                      >
                        {' '}
                        Forgot password?{' '}
                      </a>
                    </div>
                    <div className="mt-2">
                      <input
                        className="flex text-slate-200 h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      ></input>
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center rounded-md bg-slate-600 px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                    >
                      Get started <ArrowRight className="ml-2" size={16} />
                    </button>
                    
                  </div>
                  <div className='h-20 w-full flex space-x-10 justify-center'>
                      <i className='fa-brands fa-google text-slate-100 text-3xl'></i>
                      <i className='fa-brands fa-facebook text-slate-100 text-3xl'></i>
                      <i className='fa-brands fa-twitter text-slate-100 text-3xl'></i>
                  </div>
                </div>
              </form>
              <div>
                <p className="text-sm text-gray-200 pb-10">
                Don&apos;t have an account?{' '}
                <p
                  className="inline-flex font-semibold text-slate-400 transition-all duration-200 hover:underline"
                  onClick={TogglePage}
                >
                  Create a free account
                </p>
              </p> 
              </div>
            </div>
          </div>
        </div>
      </section>
    }

    </>
  )
}
