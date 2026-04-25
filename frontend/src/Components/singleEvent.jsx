import React from 'react'
import LEFTBAR from './Parts/LeftBar'
import RIGHTCOMMENTBAR from './Parts/RightSideCommentBar'
import BACK from './subParts/backButton'
import USERDETAILS from './subParts/zoomEventUserHeader'

export default function SingleEvent() {
  return (
    <div className="newContainer">
        <LEFTBAR/>
        <div className='SecondBox'>
            <div className='SecondBox-row1'>
                <BACK/>
            </div>
            <div className='SecondBox-row2'>
                <USERDETAILS/>  
                <img className='blog-image-zoom-event' src='imageCar.png'/>
                <div className='blog-title-zoom-event'> <p className='text-event'>The Best Fashion Instagrams of the Week </p></div>
                <div className='timings-event'>
                        <div className='column1b1Evn'>
                        <div className='Event-Date-Time'> <i class="fa-regular fa-clock Event-Date-Time-Text"></i></div>
                            <div className='profileName'>  
                                <p className='profileNameSub'>12 December, 2019</p>
                                <p className='postedTime'>From 9:00am to 6:00pm</p>
                            </div>
                        </div>
                        <div className='column1b1Evn'>
                        <div className='Event-Date-Time'> <i class="fa-solid fa-rupee-sign Event-Date-Time-Text"></i></div>
                            <div className='profileName'>  
                                <p className='profileNameSub'>$60-$90</p>
                                <p className='postedTime'>+30% Taxes</p>
                            </div>
                        </div>
                </div>
                <div className='blog-description-zoom-event'>
                    <p className="blog-description-zoom-post-text"> Event Description </p>
                </div>
                <div className='blog-body-zoom-event'>
                    <p className="blog-body-zoom-event-text"> Lorem Ipsum is  dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                         "de Finibus Bonoru</p>
                </div>
                <div className='blog-body-zoom-event-tags'>
                    <buton className='zoom-event-tag-btn1'>Car</buton><buton className='zoom-event-tag-btn'>Los Angeles</buton>
                    <buton className='zoom-event-tag-btn'>Exhibition</buton><buton className='zoom-event-tag-btn'>Auto</buton>
                    <buton className='zoom-event-tag-btn'>Show</buton>
                </div>
            </div>
        </div>
        <div className='RightSideCommentbar'>
        <div className='rightbar-one-user-notification-and-profile-image'>
            <div className='rightbar-one-notification'> <i class="fa-regular fa-bell fa-lg bell"></i> </div>
            <img className='rightbar-one-image' src='profile-pic.png'/>
        </div>
    <div className='rightbar-two-comments'>
        <p className='rightbar-two-features-stories'> Address </p>
        <div className='Event-single-sevent2'>
                      <img className='Event-single-img' src='imageCar.png'/>
                      <div className='EventZoom1-time'>
                        <div className='EventZsevent1-time-col-1'> <p className='dateZEVTC1'> 10 </p></div>
                        <div className='Eventsevent1-time-col-2'>
                          <p className='EventdayEVTC1'>Los Angeles, CA</p>
                          <p className='monthEVTC1'>189 The Grove Dr</p>

                        </div>
                        <div className='Eventsevent1-time-col-3'>Directions</div>
                      </div>
                                        
                     </div>
        <p className='rightbar-two-friends-interested'> Friends Interested </p>
            <div className='rightbar-three-zevent-user-details'>
                <img className='profileimageuser4' src='profile-pic.png' />
                <div className='profileName'>  
                <p className='profileNameSubZoom'>Edward Ford</p>                                
                </div>
                <i class="fa-solid fa-check follow-plus-event"></i>            
            </div>
            <div className='rightbar-three-zevent-user-details'>
                <img className='profileimageuser4' src='profile-pic.png' />
                <div className='profileName'>  
                <p className='profileNameSubZoom'>Edward Ford</p>                                
                </div>
                <i class="fa-solid fa-check follow-plus-event"></i>            
            </div>
            <div className='rightbar-three-zevent-user-details'>
                <img className='profileimageuser4' src='profile-pic.png' />
                <div className='profileName'>  
                     <p className='profileNameSubZoom'>Edward Ford</p>                                
                </div>
                <i class="fa-solid fa-check follow-plus-event"></i>            
            </div>
            <div className='rightbar-three-zevent-user-details'>
                <img className='profileimageuser4' src='profile-pic.png' />
                <div className='profileName'>  
                    <p className='profileNameSubZoom'>Edward Ford</p>                                
                </div>
                <i class="fa-solid fa-check follow-plus-event"></i>            
            </div>
            <div className='rightbar-three-zevent-seemore'>
               <p className='see-more'> See More</p>
            </div>
          </div>
</div>
    </div>   
  )
}
