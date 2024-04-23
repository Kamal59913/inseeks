import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import POST from './SubComponent/postHomepage'
import QUESTION from './SubComponent/hpQuestion'
import IMGAGEPOST from './SubComponent/imageHomepage'
import SEARCH from './subParts/shortsearchbar-hp'
import LEFTBAR from './Parts/LeftBar'
import styles from '../Components/cssModules/homepage.module.scss'
import NANDP from './subParts/notifcationandprofile'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faVideo, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ArrowUpRight } from 'lucide-react'
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react'

const menuItems = [
  {
    name: 'Home',
    href: '#',
  },
  {
    name: 'About',
    href: '#',
  },
  {
    name: 'Contact',
    href: '#',
  },
]

const people = [
  {
    name: 'John Doe',
    title: 'Front-end Developer',
    department: 'Engineering',
    email: 'john@devui.com',
    role: 'Developer',
    image:
      'https://images.unsplash.com/photo-1628157588553-5eeea00af15c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80',
  },
  {
    name: 'Jane Doe',
    title: 'Back-end Developer',
    department: 'Engineering',
    email: 'jane@devui.com',
    role: 'CTO',
    image:
      'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80',
  },
]

export default function Homepage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  
  return (
    <>
    {/* <div className={styles.mainContainer}>
      <LEFTBAR/>
      <div className={styles.middleColumn}>      
        <div className={styles.BasicInformationSection}>
          <div className={styles.column1}>
            <div className={styles.column1a}>
              <div className={styles.postBox}>
              <img className={styles.profileimageuser}
                src='profile-pic.png'
              />
              <p className={styles.whatAreYouThinking}>  What are you thinking?  </p>
                </div>
              <div className={styles.postImageVideoPlus}> 
                <Link to="#/"><FontAwesomeIcon icon={faCamera} className={styles.posticons} /></Link>
                <Link to="#/"><FontAwesomeIcon icon={faVideo} className={styles.posticons} /></Link>
                <Link to="#/"><FontAwesomeIcon icon={faPlus} className={styles.posticons} /></Link>
                <div className={styles.postBoxShare}> Share &gt;</div>
              </div>
            </div>
            <POST/>
            <POST/>

          </div>
          <div className={styles.column2}>
              <QUESTION/>
              <IMGAGEPOST/>
              <POST/>
              <POST/>
          </div>
        </div>
      
      </div>
      <div className={styles.thirdcolumn}>
        <NANDP/>
          <div className={styles.rightbarTwo}>
            <p className={styles.rightbarTwoFeaturesStories}> Featured Stories  </p>
            <Link to='/stories'><button className={styles.ViewMoreStory}> <i className='fa-solid fa-plus'></i> </button></Link>
            <div className={styles.rightbarTwoImagesArray}>
              <Link to='/singlestory'><img className={styles.arrayImage} src='profile-pic.png'/></Link>
              <Link to='/singlestory'><img className={styles.arrayImage} src='profile-pic.png'/></Link>
              <Link to='/singlestory'><img className={styles.arrayImage} src='profile-pic.png'/></Link>
              <Link to='/singlestory'><img className={styles.arrayImage} src='profile-pic.png'/></Link>
              <Link to='/singlestory'><img className={styles.arrayImage} src='profile-pic.png'/></Link>
              <Link to='/singlestory'><img className={styles.arrayImage} src='profile-pic.png'/></Link>
              <Link to='/singlestory'><img className={styles.arrayImage} src='profile-pic.png'/></Link>
              <Link to='/singlestory'><img className={styles.arrayImage} src='profile-pic.png'/></Link>
            </div>
          </div>
          <div className={styles.rightbarThreeHomepage}>
              <p className={styles.whoToFollowHp}> Who to Follow </p>
            <div className={styles.rightbarThreeUserDetails}>
                <img className={styles.profileimageuserWhoToFollow} src='profile-pic.png' />
                <div className={styles.profileNameHpb}>  
                <p className={styles.profileNameSubhpb}>Edward Ford</p>                                
                    <p className={styles.postedTimeHpb}> Los Angeles, CA </p>
                </div>
                <button class={styles.connectHomePage}>Connect</button>            
            </div>
            <div className={styles.rightbarThreeUserDetails}>
                <img className={styles.profileimageuserWhoToFollow} src='profile-pic.png' />
                <div className={styles.profileNameHpb}>  
                    <p className={styles.profileNameSubhpb}>Edward Ford</p>                                
                    <p className={styles.postedTimeHpb}> Los Angeles, CA </p>
                </div>
                <button class={styles.connectHomePage}>Connect</button>            
            </div>
            <div className={styles.rightbarThreeUserDetails}>
                <img className={styles.profileimageuserWhoToFollow} src='profile-pic.png' />
                <div className={styles.profileNameHpb}>  
                <p className={styles.profileNameSubhpb}>Edward Ford</p>                                
                    <p className={styles.postedTimeHpb}> Los Angeles, CA </p>
                </div>
                <button class={styles.connectHomePage}>Connect</button>            
            </div>
          </div>
          <div className={styles.rightbarFour}>
               <p className={styles.trendTopicsHp}> Trend Topics</p>
            <div className={styles.rightbarFourDetails}>
               <div className={styles.rankTopic}> #1 </div><p className={styles.seeMore}> Made in India</p>
            </div>
            <div className={styles.rightbarFourDetails}>
            <div className={styles.rankTopic}> #2 </div> <p className={styles.seeMore}> Made in India</p>
            </div>
            <div className={styles.rightbarFourDetails}>
            <div className={styles.rankTopic}> #3 </div>
               <p className={styles.seeMore}> Made in India</p>
            </div>
            <div className={styles.rightbarFourDetails}>
            <div className={styles.rankTopic}> #4 </div>
               <p className={styles.seeMore}> Made in India</p>
            </div>
          </div>
      </div>

    </div> */}
    <div className={styles.forMediaScreen}>
    <div className="mx-auto relative w-full bg-white lg:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between py-2 px-2 md:px-7">
        <div className="inline-flex items-center space-x-5 md:space-x-10 text-md md:text-2xl">
          <span className='font-bold'> Social </span>
          <i className='fa-solid fa-sliders'></i>
          <i className='fa-solid fa-house'></i>
          <i className='fa-solid fa-seedling'></i>
          <i className='fa-solid fa-envelope'></i>
          <i className='fa-solid fa-user'></i>
          <i className='fa-solid fa-gear'></i>
          <i className='fa-solid fa-backward'></i>
        </div>
        <div className="hidden grow items-start lg:flex">
          <ul className="ml-12 inline-flex space-x-8">
            {menuItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="inline-flex items-center text-sm font-semibold text-gray-800 hover:text-gray-900"
                >
                  {item.name}
                  <span>
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden space-x-2 lg:hidden">
          <button
            type="button"
            className="rounded-md bg-transparent px-3 py-2 text-sm font-semibold text-black hover:bg-black/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            Sign In
          </button>
          <button
            type="button"
            className="rounded-md border border-black px-3 py-2 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            Log In
          </button>
        </div>
        <div className="lg:hidden">
          <Menu onClick={toggleMenu} className="h-6 w-6 cursor-pointer" />
        </div>
        {isMenuOpen && (
          <div className="absolute inset-x-0 top-0 z-50 origin-top-right transform p-2 transition lg:hidden">
            <div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="px-5 pb-6 pt-5">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center space-x-2">
                    <span>
                      <svg
                        width="30"
                        height="30"
                        viewBox="0 0 50 56"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M23.2732 0.2528C20.8078 1.18964 2.12023 12.2346 1.08477 13.3686C0 14.552 0 14.7493 0 27.7665C0 39.6496 0.0986153 41.1289 0.83823 42.0164C2.12023 43.5449 23.2239 55.4774 24.6538 55.5267C25.9358 55.576 46.1027 44.3832 48.2229 42.4602C49.3077 41.474 49.3077 41.3261 49.3077 27.8158C49.3077 14.3055 49.3077 14.1576 48.2229 13.1714C46.6451 11.7415 27.1192 0.450027 25.64 0.104874C24.9497 -0.0923538 23.9142 0.00625992 23.2732 0.2528ZM20.2161 21.8989C20.2161 22.4906 18.9835 23.8219 17.0111 25.3997C15.2361 26.7803 13.8061 27.9637 13.8061 28.0623C13.8061 28.1116 15.2361 29.0978 16.9618 30.2319C18.6876 31.3659 20.2655 32.6479 20.4134 33.0917C20.8078 34.0286 19.871 35.2119 18.8355 35.2119C17.8001 35.2119 9.0233 29.3936 8.67815 28.5061C8.333 27.6186 9.36846 26.5338 14.3485 22.885C17.6521 20.4196 18.4904 20.0252 19.2793 20.4196C19.7724 20.7155 20.2161 21.3565 20.2161 21.8989ZM25.6893 27.6679C23.4211 34.9161 23.0267 35.7543 22.1391 34.8668C21.7447 34.4723 22.1391 32.6479 23.6677 27.9637C26.2317 20.321 26.5275 19.6307 27.2671 20.3703C27.6123 20.7155 27.1685 22.7864 25.6893 27.6679ZM36.0932 23.2302C40.6788 26.2379 41.3198 27.0269 40.3337 28.1609C39.1503 29.5909 31.6555 35.2119 30.9159 35.2119C29.9298 35.2119 28.9436 33.8806 29.2394 33.0424C29.3874 32.6479 30.9652 31.218 32.7403 29.8867L35.9946 27.4706L32.5431 25.1532C30.6201 23.9205 29.0915 22.7371 29.0915 22.5892C29.0915 21.7509 30.2256 20.4196 30.9159 20.4196C31.3597 20.4196 33.6771 21.7016 36.0932 23.2302Z"
                          fill="black"
                        />
                      </svg>
                    </span>
                    <span className="font-bold">DevUI</span>
                  </div>
                  <div className="-mr-2">
                    <button
                      type="button"
                      onClick={toggleMenu}
                      className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                      <span className="sr-only">Close menu</span>
                      <X className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className="mt-6">
                  <nav className="grid gap-y-4">
                    {menuItems.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="-m-3 flex items-center rounded-md p-3 text-sm font-semibold hover:bg-gray-50"
                      >
                        <span className="ml-3 text-base font-medium text-gray-900">
                          {item.name}
                        </span>
                        <span>
                          <ChevronRight className="ml-3 h-4 w-4" />
                        </span>
                      </a>
                    ))}
                  </nav>
                </div>
                <div className="mt-2 space-y-2">
                  <button
                    type="button"
                    className="w-full rounded-md border border-black px-3 py-2 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    className="w-full rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  >
                    Log In
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

    <div className='flex flex-col lg:flex-row md:flex-col h-screen overflow-hidden'>
          <div className='shrink-0 flex-col py-8 pl-10 w-full lg:h-full lg:w-40 bg-slate-300 space-y-12 text-2xl hidden lg:flex'>
            <span className='font-bold'> Social </span>
            <i className='fa-solid fa-sliders pl-5'></i>
            <i className='fa-solid fa-house pl-5'></i>
            <i className='fa-solid fa-seedling pl-5'></i>
            <i className='fa-solid fa-envelope pl-5'></i>
            <i className='fa-solid fa-user pl-5'></i>
            <i className='fa-solid fa-gear pl-5'></i>
            <i className='fa-solid fa-backward pl-5'></i>
          </div>
          <div className='h-full w-full lg:h-screen md:h-full md:max-w-full lg:w-8/12 bg-slate-600 flex lg:flex-col overflow-x-scroll'>
            <div className='w-full md:mt-2'>
              <form class="flex items-center mx-auto w-[700px] ">   
                    <label for="simple-search" class="sr-only">Search</label>
                    <div class="relative w-full">
                        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <i className='fa-solid fa-search ga444'></i>
                        </div>
                        <input type="text" id="simple-search" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search branch name..." required />
                    </div>
                    <button type="submit" class="p-2.5 ms-2 text-sm font-medium text-black rounded-sm focus:ring-4 focus:outline-none bg-slate-100">
                      Search
                    </button>
                </form>
            </div>
            <div className='w-full grid grid-cols-2'>
                  <div className='shrink-0 h-full w-1/2 col-span-1'>
                  <div className="mt-4 ml-[26px] lg:ml-[120px] p-1 w-[380px] rounded-md border">
          <div className="flex items-center m-2">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded-full object-cover ml-2"
                                src='profile-pic.png'
                                alt=""
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-black-800">Kamallochan Boruah</div>
                              <div className="text-sm text-black-700">5 mins Ago</div>
                            </div>
                            <div className='ml-[150px] mb-3'><i class="fa-solid fa-ellipsis-vertical"></i></div>
          </div>
      <img
        src="https://images.unsplash.com/photo-1522199755839-a2bacb67c546?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGJsb2d8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
        alt="Laptop"
        className="m-3 h-[200px] w-[330px] rounded-md object-cover"
      />
      <div className="pl-5 pb-2">
        <h1 className="text-lg font-semibold">About Macbook</h1>
        <p className="text-sm text-black-600">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, debitis?
        </p>
        <i
          type="button"
          className="fa-regular fa-heart px-2.5 py-1 text-[14px] font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
        </i>
        <i
          type="button"
          className="fa-regular fa-comment px-2.5 py-1 text-[14px] font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
        </i>
        <i
          type="button"
          className="ml-[240px] fa-regular fa-share px-2.5 py-1 text-[14px] font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
        </i>

      </div>
    </div>          
                  </div>
                  <div className='shrink-0 hidden h-full w-full lg:block lg:h-full md:h-20 md:max-w-full lg:w-1/2'>
                  <div className="mt-4 ml-[26px] lg:ml-[40px] p-1 w-[380px] rounded-md border">
          <div className="flex items-center m-2">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded-full object-cover ml-2"
                                src='profile-pic.png'
                                alt=""
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-black-800">Kamallochan Boruah</div>
                              <div className="text-sm text-black-700">5 mins Ago</div>
                            </div>
                            <div className='ml-[150px] mb-3'><i class="fa-solid fa-ellipsis-vertical"></i></div>
          </div>
        <p className="text-base font-semibold ml-4">Images from Delhi</p>

      <div className="m-3 h-[200px] w-[330px] rounded-md object-cover grid grid-cols-3 gap-2">
        <div className='border-solid border-1 border-white rounded-sm col-span-2 row-span-2'></div>
        <div className='border-solid border-1 border-white rounded-sm'></div>
        <div className='border-solid border-1 border-white rounded-sm'></div>
      </div>
      <div className="p-2">
        <i
          type="button"
          className="fa-regular fa-heart px-2.5 py-1 text-[14px] font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
        </i>
        <i
          type="button"
          className="fa-regular fa-comment px-2.5 py-1 text-[14px] font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
        </i>
        <i
          type="button"
          className="ml-[250px] fa-regular fa-share px-2.5 py-1 text-[14px] font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
        </i>

      </div>
    </div> 
                  </div>
                  <div className='shrink-0 hidden h-full w-full lg:block lg:h-full md:h-20 md:max-w-full lg:w-1/2 ml-20 mt-6'>
                  <div className="mt-4 ml-[26px] lg:ml-[40px] p-1 w-[380px] rounded-md border">
          <div className="flex items-center m-2">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded-full object-cover ml-2"
                                src='profile-pic.png'
                                alt=""
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-black-800">Kamallochan Boruah</div>
                              <div className="text-sm text-black-700">5 mins Ago</div>
                            </div>
                            <div className='ml-[150px] mb-3'><i class="fa-solid fa-ellipsis-vertical"></i></div>
          </div>
        <p className="text-base font-semibold ml-4">Images from Delhi</p>

      <div className="m-3 h-[200px] w-[330px] rounded-md object-cover grid grid-cols-3 gap-2">
        <div className='border-solid border-1 border-white rounded-sm col-span-2 row-span-2'></div>
        <div className='border-solid border-1 border-white rounded-sm'></div>
        <div className='border-solid border-1 border-white rounded-sm'></div>
      </div>
      <div className="p-2">
        <i
          type="button"
          className="fa-regular fa-heart px-2.5 py-1 text-[14px] font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
        </i>
        <i
          type="button"
          className="fa-regular fa-comment px-2.5 py-1 text-[14px] font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
        </i>
        <i
          type="button"
          className="ml-[250px] fa-regular fa-share px-2.5 py-1 text-[14px] font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
        </i>

      </div>
    </div> 
                  </div>
                  <div className='shrink-0 hidden h-full w-full lg:block lg:h-full md:h-20 md:max-w-full lg:w-1/2'>
                  <div className="mt-4 ml-[26px] lg:ml-[40px] p-1 w-[380px] rounded-md border">
          <div className="flex items-center m-2">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded-full object-cover ml-2"
                                src='profile-pic.png'
                                alt=""
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-black-800">Kamallochan Boruah</div>
                              <div className="text-sm text-black-700">5 mins Ago</div>
                            </div>
                            <div className='ml-[150px] mb-3'><i class="fa-solid fa-ellipsis-vertical"></i></div>
          </div>
        <p className="text-base font-semibold ml-4">Images from Delhi</p>

      <div className="m-3 h-[200px] w-[330px] rounded-md object-cover grid grid-cols-3 gap-2">
        <div className='border-solid border-1 border-white rounded-sm col-span-2 row-span-2'></div>
        <div className='border-solid border-1 border-white rounded-sm'></div>
        <div className='border-solid border-1 border-white rounded-sm'></div>
      </div>
      <div className="p-2">
        <i
          type="button"
          className="fa-regular fa-heart px-2.5 py-1 text-[14px] font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
        </i>
        <i
          type="button"
          className="fa-regular fa-comment px-2.5 py-1 text-[14px] font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
        </i>
        <i
          type="button"
          className="ml-[250px] fa-regular fa-share px-2.5 py-1 text-[14px] font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
        </i>

      </div>
    </div> 
                  </div>
            </div>

          </div>
          {/* <div className='hidden lg:block shrink-0 h-20 w-full lg:h-screen md:h-20 md:max-w-full lg:w-4/12 bg-slate-600'>
          <div className="mt-4 ml-[26px] lg:ml-[40px] p-1 w-[380px] rounded-md border">
          <div className="flex items-center m-2">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded-full object-cover ml-2"
                                src='profile-pic.png'
                                alt=""
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-black-800">Kamallochan Boruah</div>
                              <div className="text-sm text-black-700">5 mins Ago</div>
                            </div>
                            <div className='ml-[150px] mb-3'><i class="fa-solid fa-ellipsis-vertical"></i></div>
          </div>
        <p className="text-base font-semibold ml-4">Images from Delhi</p>

      <div className="m-3 h-[200px] w-[330px] rounded-md object-cover grid grid-cols-3 gap-2">
        <div className='border-solid border-1 border-white rounded-sm col-span-2 row-span-2'></div>
        <div className='border-solid border-1 border-white rounded-sm'></div>
        <div className='border-solid border-1 border-white rounded-sm'></div>
      </div>
      <div className="p-2">
        <i
          type="button"
          className="fa-regular fa-heart px-2.5 py-1 text-[14px] font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
        </i>
        <i
          type="button"
          className="fa-regular fa-comment px-2.5 py-1 text-[14px] font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
        </i>
        <i
          type="button"
          className="ml-[250px] fa-regular fa-share px-2.5 py-1 text-[14px] font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
        </i>

      </div>
    </div> 
          </div> */}
          <div className='hidden lg:block shrink-0 h-full lg:h-screen md:h-full md:w-full lg:w-3/12 bg-slate-800'></div>
    </div>        
    </div>
    </>   
    )     
}
