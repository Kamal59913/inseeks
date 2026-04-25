import React from 'react'

export default function Singlestory() {
  return (
<div className="newContainer">
      <div className='SideBar'>
        <div className='SideBarOne'>
        <i class="fa-solid fa-sliders fa-2x"></i>
        </div>
        <div className='SideBarTwo'>
        <i class="fa-solid fa-house fa-xl"></i>
        </div>
        <div className='SideBarThree'>
        <i class="fa-solid fa-calendar-days fa-xl"></i>
        </div>
        <div className='SideBarFour'>
        <i class="fa-regular fa-envelope fa-xl"></i>
        </div>
        <div className='SideBarFive'>
        <i class="fa-solid fa-user fa-xl"></i>
        </div>
        <div className='SideBarSix'>
        <i class="fa-solid fa-gear fa-xl"></i>
        </div>
        <div className='SideBarSeven'>
        <i class="fa-solid fa-backward fa-xl"></i>
        </div>
      </div>

      <div className='RightbarStories'>
            {/* <div className='rightbar-one-stories'>
                <div className='rightbar-one-notification-stories'> <i class="fa-regular fa-bell fa-lg bell"></i> </div>
                <img className='rightbar-one-image-stories' src='profile-pic.png'/>
          </div> */}
          <div className='rightbar-two-stories'>
                <div className='first'>
                    <div className='back'> <i class="fa-solid fa-less-than less-than"></i> <span className='textt'> Back </span></div>
                    <div className='userInfo'>
                        <p className='username'> Kamal Boruah </p>
                        <img src='profile-pic.png' className='image-pic'/>
                    </div>
                </div>
                <div className='second'>
                    <div className='secondOne'><i class="fa-solid fa-less-than less-than"></i> </div>
                    <img className='secondTwo' src='story.png'/>
                    <div className='secondThree'> <i class="fa-solid fa-greater-than less-than"></i> </div>

                </div>
                <div className='third'>
              <label for="searchbar-story"></label> <br/>
                  <input type="text"
                  name="Occupation"
                  placeholder="Write in comment..."
                  id="searchbar-story"/><br/>
                  <div className="comment-icons-story">
                  <i class="fa-solid fa-paper-plane plane-comment"></i>
                  <i class="fa-regular fa-face-smile smile-comment"></i>
                  </div>
              </div>
          </div>
          <div className='rightbar-stories'>
            <div className='rightbar-one-stories'>
                <div className='rightbar-one-notification-stories'> <i class="fa-regular fa-bell fa-lg bell"></i> </div>
                <img className='rightbar-one-image-stories' src='profile-pic.png'/>
            </div>

            <div className='rightbar-three'>
            <div className='rightbar-three-who-to-follow'>
              <p className='who-to-follow'> Who to Follow </p>
            </div>
            <div className='rightbar-three-user-details'>
                <img className='profileimageuser4' src='profile-pic.png' />
                <div className='profileName'>  
                    <p className='profileNameSub3'>Edward Ford</p>                                
                </div>
                <i class="fa-solid fa-user-plus follow-plus"></i>            
            </div>
            <div className='rightbar-three-user-details'>
                <img className='profileimageuser4' src='profile-pic.png' />
                <div className='profileName'>  
                    <p className='profileNameSub3'>Edward Ford</p>                                
                </div>
                <i class="fa-solid fa-user-plus follow-plus"></i>            
            </div>
            <div className='rightbar-three-user-details'>
                <img className='profileimageuser4' src='profile-pic.png' />
                <div className='profileName'>  
                    <p className='profileNameSub3'>Edward Ford</p>                                
                </div>
                <i class="fa-solid fa-user-plus follow-plus"></i>            
            </div>
            <div className='rightbar-three-user-details'>
                <img className='profileimageuser4' src='profile-pic.png' />
                <div className='profileName'>  
                    <p className='profileNameSub3'>Edward Ford</p>                                
                </div>
                <i class="fa-solid fa-user-plus follow-plus"></i>            
            </div>
            <div className='rightbar-three-user-details'>
                <img className='profileimageuser4' src='profile-pic.png' />
                <div className='profileName'>  
                    <p className='profileNameSub3'>Edward Ford</p>                                
                </div>
                <i class="fa-solid fa-user-plus follow-plus"></i>            
            </div>
            <div className='rightbar-three-user-details'>
               <p className='see-more'> See More</p>
            </div>
          </div>
          </div>
          
      </div>
      

    </div>     )
}
