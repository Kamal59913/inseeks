import React from 'react'
import LEFTBAR from './Parts/LeftBar'
import RIGHTCOMMENTBAR from './Utilities/RightSideCommentBar'
import BACK from './subParts/backButton'
import USERDETAILS from './subParts/zoomEventUserHeader'
// import SEARCH from './subParts/shortsearchbar'
import POSTHOMEPAGE from './SubComponent/sm-hpQuestion'
import IMGAGEPOSTHOMEPAGE from './SubComponent/sm-imageHomepage'

export default function SearchResults() {
  return (
    <div className="newContainer">
        <LEFTBAR/>
        <div className='SecondBox'>
                {/* <SEARCH/>      */}
                <div className='SearchResults-mid-div-1'>People</div>    
                <div className='SearchResults-mid-div-2'>
                    <div className='SearchResults-mid-div-2-grid'>
                        <div className='h-[8vh] w-[46vh] flex flex-row ml-[1.4vh] mr-0 mt-[2vh] mb-0 bg-slate-900'>
                            <img className='h-[6vh] w-[6vh] bg-[powderblue] ml-[1vh] mr-0 mt-[1vh] mb-0 rounded-lg' src='profile-pic.png' />
                            <div className='h-[6vh] w-[40vw] text-[black] text-sm font-semibold flex flex-col ml-[1vh] mt-[8.4px]'>  
                                <p className='w-[13vw] text-sm font-bold text-[black] cursor-context-menu m-0'>Edward Ford</p>                                
                                <p className='text-[11px] text-[grey] cursor-context-menu m-0'> Los Angeles, CA </p>
                            </div>
                            <div className='text-[13px] font-semibold rounded h-[3vh] bg-[green] text-[white] ml-[1.4vh] mr-0 mt-[1.4vh] mb-0 px-[1.2vh] py-[0.2vh]'> Connect</div>            
                        </div>
                    </div>
                    <div className='SearchResults-mid-div-2-grid'>
                    <div className='rightbar-three-user-details-src'>
                            <img className='profileimageuser4-src' src='profile-pic.png' />
                            <div className='profileName-src'>  
                                <p className='profileNameSub3-src'>Edward Ford</p>                                
                                <p className='postedTime3-src'> Los Angeles, CA </p>
                            </div>
                            <div className='search-page-connect-button'> Connect</div>            
                        </div>
                    </div>
                    <div className='SearchResults-mid-div-2-grid'>
                    <div className='rightbar-three-user-details-src'>
                            <img className='profileimageuser4-src' src='profile-pic.png' />
                            <div className='profileName-src'>  
                                <p className='profileNameSub3-src'>Edward Ford</p>                                
                                <p className='postedTime3-src'> Los Angeles, CA </p>
                            </div>
                            <div className='search-page-connect-button'> Connect</div>            
                        </div>
                    </div>
                    <div className='SearchResults-mid-div-2-grid'>
                    <div className='rightbar-three-user-details-src'>
                            <img className='profileimageuser4-src' src='profile-pic.png' />
                            <div className='profileName-src'>  
                                <p className='profileNameSub3-src'>Edward Ford</p>                                
                                <p className='postedTime3-src'> Los Angeles, CA </p>
                            </div>
                            <div className='search-page-connect-button'> Connect</div>            
                        </div>
                    </div>
                </div>    
                <div className='SearchResults-mid-div-3'> See More <i class="fa-solid fa-greater-than greater-than"></i></div>    
                <div className='SearchResults-mid-div-4'>Posts</div>    
                <div className='SearchResults-mid-div-5'>
                    <div className='SearchResults-mid-div-5-col-1'>
                            <POSTHOMEPAGE/>    
                            <IMGAGEPOSTHOMEPAGE/>
                            <POSTHOMEPAGE/>    
                    </div>
                    <div className='SearchResults-mid-div-5-col-1'>
                            <POSTHOMEPAGE/>    
                            <POSTHOMEPAGE/> 
                    </div>

                </div>    

        </div>
        <div className='RightSideCommentbar'>
        <div className='rightbar-one-user-notification-and-profile-image'>
            <div className='rightbar-one-notification'> <i class="fa-regular fa-bell fa-lg bell"></i> </div>
            <img className='rightbar-one-image' src='profile-pic.png'/>
        </div>
        
    <div className='rightbar-two-comments-src'>
        <div className='Event-single-img-src'>
            <img src='story.png' className='Event-single-img-src-add'/>
            <div className='onTheTopOfAdd'>
                <p className='onTheTopOfAddTitle'>Go Premium</p>
                <p className='onTheTopOfAddBody'>Try premium membership and enjoy a full membership of our community.</p>
                <button className='add-see-more'> See More <i className='fa-solid fa-greater-than'></i></button>
            </div>
        </div>
        <div className='wrap-who-to-follow-src'>
        <p className='rightbar-two-friends-interested-src1'>Who to follow</p>
            <div className='rightbar-three-zevent-user-details-src'>
                <img className='profileimageuser4' src='profile-pic.png' />
                <div className='profileName'>  
                <p className='profileNameSubFollow-src'>Edward Ford</p>                                
                </div>
                <div class="follow-plus-event-src">Follow</div>            
            </div>
            <div className='rightbar-three-zevent-user-details-src'>
                <img className='profileimageuser4' src='profile-pic.png' />
                <div className='profileName'>  
                <p className='profileNameSubFollow-src'>Edward Ford</p>                                
                </div>
                <div class="follow-plus-event-src">Follow</div>            
            </div>
            <div className='rightbar-three-zevent-user-details-src'>
                <img className='profileimageuser4' src='profile-pic.png' />
                <div className='profileName'>  
                    <p className='profileNameSubFollow-src'>Edward Ford</p>                                
                </div>
                <div class="follow-plus-event-src">Follow</div>            
            </div>
            <div className='rightbar-three-zevent-seemore'>
               <p className='see-more-src'> See More <i className='fa-solid fa-greater-than'></i></p>
            </div>
        </div>
        
        <div className='wrap-friends-src'>
        <p className='rightbar-two-friends-interested-src2'>Friends</p>
            <div className='rightbar-three-zevent-user-details-src'>
                <img className='profileimageuser4' src='profile-pic.png' />
                <div className='profileName'>  
                <p className='profileNameSubZoom'>Edward Ford</p>                                
                </div>
                <i class="fa-solid fa-check follow-plus-friends"></i>            
            </div>
            <div className='rightbar-three-zevent-user-details-src'>
                <img className='profileimageuser4' src='profile-pic.png' />
                <div className='profileName'>  
                <p className='profileNameSubZoom'>Edward Ford</p>                                
                </div>
                <i class="fa-solid fa-check follow-plus-friends"></i>            
            </div>
            <div className='rightbar-three-zevent-user-details-src'>
                <img className='profileimageuser4' src='profile-pic.png' />
                <div className='profileName'>  
                    <p className='profileNameSubZoom'>Edward Ford</p>                                
                </div>
                <i class="fa-solid fa-check follow-plus-friends"></i>            
            </div>
            <div className='rightbar-three-zevent-seemore'>
                {/* <p className='see-more-src'> See More <i className='fa-solid fa-greater-than'></i></p> */}
            </div>
        </div>
        
          </div>
</div>
    </div>   
  )
}
