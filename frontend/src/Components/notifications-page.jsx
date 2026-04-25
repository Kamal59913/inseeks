import React, { useState } from 'react'
import LEFTBAR from './Parts/LeftBar'
import RIGHTCOMMENTBAR from './Parts/RightSideCommentBar'
import BACK from './subParts/backButton'
import USERDETAILS from './subParts/zoomEventUserHeader'
import SEARCH from './subParts/shortsearchbar'
import POSTHOMEPAGE from './SubComponent/sm-hpQuestion'
import IMGAGEPOSTHOMEPAGE from './SubComponent/sm-imageHomepage'

export default function NotificationsPage() {
  const [toggleComment, setToggleComment] = useState(false);
  const CommentToggle = () => {
    setToggleComment(!toggleComment);
  }
  return (
    <div className="newContainer">
        <LEFTBAR/>
        <div className='SecondBox'>
        <div className='AccountsInformationTaglineshort'>
                <i class="fa-solid fa-magnifying-glass"></i>
                <label for="searchbarshort-shorter" className='filtershort-shorter'>FILTERS</label> <br/>
                          <input type="text"
                          name="Occupation"
                          placeholder="Search in Socials..."
                          id="searchbarshort-shorter"/><br/>
                </div>    
                <div className='featured-stories'>
                    <div className='rightbar-two-features-stories-src'> Featured Stories 
                    <button className='add-see-more-notification'> See More <i className='fa-solid fa-greater-than'></i></button>
                    </div>
                        <div className='rightbar-two-images-array-notification'>
                            <div className='plus-more-img'><i className='fa-solid fa-plus plus-story'></i></div>
                            <img className='array-image' src='profile-pic.png'/>
                            <img className='array-image' src='profile-pic.png'/>
                            <img className='array-image' src='profile-pic.png'/>
                            <img className='array-image' src='profile-pic.png'/>
                            <img className='array-image' src='profile-pic.png'/>
                            <img className='array-image' src='profile-pic.png'/>
                            <img className='array-image' src='profile-pic.png'/>
                            <img className='array-image' src='profile-pic.png'/>
                            <img className='array-image' src='profile-pic.png'/>
                            <img className='array-image' src='profile-pic.png'/>
                            <img className='array-image' src='profile-pic.png'/>
                            <img className='array-image' src='profile-pic.png'/>
                            <img className='array-image' src='profile-pic.png'/>
                            <img className='array-image' src='profile-pic.png'/>
                    </div> 
                </div>    
          
                <div className='what-to-post'>
                <div className='postBox-notification'>
                    <img className='profileimageuser' src='profile-pic.png'/>
                    <p className='whatAreYouThinking-notification'>  What are you thinking?  </p>
                    <i class="fa-solid fa-ellipsis-vertical three-dot-notification"></i>
                    </div>
              <div className='postBox2-notification'> 
                <div className='wrap-img-vid-plus'>
                    <div className='postBox2Image'>
                        <i class="fa-solid fa-camera posticons fa-sm"></i>
                    </div>
                    <div className='postBox2Video'>
                        <i class="fa-solid fa-video posticons fa-sm"></i>
                    </div>
                    <div className='postBox2Plus'>
                          <i class="fa-solid fa-plus posticons fa-sm"></i>
                    </div>
                    </div>
                <div className='postBox2Share-notification'> Share &gt;</div>
                 </div>
                </div>    
                <div className='post-of-notification'>
                          <div className='column1b1-notifiction'>
                            <img className='profileimageuser2-notifiction' src='profile-pic.png' />
                            <div className='profileName-notifiction'>
                              <p className='profileNameSub-notifiction'>Edward Ford</p>
                              <p className='postedTime-notifiction'>5 min ago</p>
                            </div>
                            <i class="fa-solid fa-ellipsis-vertical threeDotPost-notifiction"></i>
                          </div>
                          <div className='column1b2-notifiction'>
                            <p className='postBody-notifiction'>Images of Cancun Mexico</p>
                          </div>
                          <div className='column1b3-notifiction'>
                            {/* Here is the logic */}
                              <div className='imageOne-notifiction'></div>
                              <div className='imageTwo-notifiction'></div>
                            <div className='imageThree-notifiction'>
                              <p className='seventeenMore-notifiction'>17 More</p>
                            </div>
                          </div>
                          <div className='column1b4-notifiction'>
                            <div className='likecomment-wrapper-notifiction'>
                                <div className='column1b4heart-notifiction'>
                                  <i class="fa-regular fa-heart posticons2-notifiction fa-sm"></i> <span className='likeCommentCount-notifiction'>326</span>
                                </div>
                                <div className='column1b4comment-notifiction' onClick={CommentToggle}>
                                  <i class="fa-regular fa-comment posticons2-notifiction fa-sm"></i> <span className='likeCommentCount-notifiction'>148</span>
                                </div>
                            </div>
                            <div className='column1b4Share-notifiction'> Share <i class="fa-solid fa-share"></i></div>
                          
                          
                          </div>
                          {toggleComment ? ( <>
                            <div className='column1b5-notifiction'>
                              <label for="searchbar-notifiction"></label> <br />
                              <input type="text" name="Occupation" placeholder="Write in comment..." id="searchbar-notifiction" /><br />
                              <div className="comment-icons-notifiction">
                                <i class="fa-regular fa-face-smile smile-comment-notifiction"></i>
                                <i class="fa-solid fa-paper-plane plane-comment-notifiction"></i>
                              </div>
                            </div>
                            <div className='column1b6-notifiction'>
                                  <div className='commentUserInfo-notifiction'>
                                        <img className='profileimageuser3-notifiction' src='profile-pic.png' />
                                        <p className='profileNameSub2-notifiction'>Edward Ford</p>
                                        <p className='postedTime2-notifiction'>5 min ago</p>
                                  </div>
                                  <div className='columnCommentBody-notifiction'>
                                        <p className='postBody2-notifiction'>Awesome edward, remember that 5 tips for low cost holidays I sent you?</p>
                                  </div>
                                  <div className='likesReplyUnderCommentPart-notifiction'>
                                        <div className='column1b4heart2-notifiction'>
                                          <i class="fa-regular fa-heart posticons2 fa-sm"></i> <span className='likeCommentCount2-notifiction'>326</span>
                                        </div>
                                        <div className='column1b4comment2-notifiction'>
                                          <i class="fa-regular fa-comment posticons2 fa-sm"></i> <span className='likeCommentCount2-notifiction'>148</span>
                                        </div>
                                  </div>
                            </div>

                            </>
                          ) : (
                            <></>
                          )}
                  </div> 
        </div>
        <div className='RightSideCommentbar'>
        <div className='rightbar-one-user-notification-and-profile-image'>
            <i class="fa-regular fa-x fa-lg cross-notification fa-xs"></i> 
            <img className='rightbar-one-image' src='profile-pic.png'/>
        </div>
        <div className='notification-right-side-col2'>
          <p className='notification-text'>Notification</p> <button className='no-of-notifications'>4</button>
        </div>
        <div className='notification-right-side-col3'>
          <div className='notification-profile-posted'></div>
          <img className='notification-profile-image' src='profile-pic.png'/>
          <p className='notification-profile-text'>Gunner Ackner</p>
          <p className='notification-profile-time-ago'>5 min</p>
          <img className='notification-profile-post-image' src='profile-pic.png'/>
        </div>
        <div className='notification-right-side-col4'>
          <div className='notification-profile-posted'></div>
          <img className='notification-profile-image' src='profile-pic.png'/>
              <div className='notification-profile-sent-details-wrapper'>
              <div className='notification-profile-sent-details-wrapper1'> 
                    <p className='notification-profile-text'>Gunner Ackner</p>
                    <p className='notification-profile-time-ago'>5 min</p>
                    </div>
                    <div className='notification-profile-sent-details-wrapper1'> 
                    <p className='notification-profile-text-message'>Sent you a friend request</p>
                    </div>
                    <div className='notification-profile-sent-details-wrapper1'> 
                    <button className='notification-profile-request-btn'><i className='fa-solid fa-check'></i> Connect</button>
                    <button className='notification-profile-reject-btn'><i className='fa-solid fa-x'></i> Ignore</button>
                    </div>
                    
                    
                   
              </div>
          <img className='notification-profile-post-image' src='profile-pic.png'/>
        </div>
        <div className='notification-right-side-col4'>
          <div className='notification-profile-posted'></div>
          <img className='notification-profile-image' src='profile-pic.png'/>
              <div className='notification-profile-sent-details-wrapper'>
              <div className='notification-profile-sent-details-wrapper1'> 
                    <p className='notification-profile-text'>Gunner Ackner</p>
                    <p className='notification-profile-time-ago'>5 min</p>
                    </div>
                    <div className='notification-profile-sent-details-wrapper1'> 
                    <p className='notification-profile-text-message'>Sent you a friend request</p>
                    </div>
                    <div className='notification-profile-sent-details-wrapper1'> 
                    <button className='notification-profile-request-greyed-btn'><i className='fa-solid fa-check'></i> Connected </button>
                    </div>
                    
                    
                   
              </div>
          <img className='notification-profile-post-image' src='profile-pic.png'/>
        </div>
        <div className='notification-right-side-col4'>
          <div className='notification-profile-posted'></div>
          <img className='notification-profile-image' src='profile-pic.png'/>
              <div className='notification-profile-sent-details-wrapper'>
              <div className='notification-profile-sent-details-wrapper1'> 
                    <p className='notification-profile-text'>Gunner Ackner</p>
                    <p className='notification-profile-time-ago'>5 min</p>
                    </div>
                    <div className='notification-profile-sent-details-wrapper1'> 
                    <p className='notification-profile-text-message'>Commented on your post</p>
                    </div>        
              </div>
          <img className='notification-profile-post-image' src='profile-pic.png'/>
        </div>  
        
        <div className='notification-right-side-col4'>
          <div className='notification-profile-posted'></div>
          <img className='notification-profile-image' src='profile-pic.png'/>
              <div className='notification-profile-sent-details-wrapper'>
              <div className='notification-profile-sent-details-wrapper1'> 
                    <p className='notification-profile-text'>Gunner Ackner</p>
                    <p className='notification-profile-time-ago'>5 min</p>
                    </div>
                    <div className='notification-profile-sent-details-wrapper1'> 
                    <p className='notification-profile-text-message'>Liked your post</p>
                    </div>        
              </div>
          <img className='notification-profile-post-image' src='profile-pic.png'/>
        </div>  
        <div className='notification-right-side-col4'>
          <div className='notification-profile-posted'></div>
          <img className='notification-profile-image' src='profile-pic.png'/>
              <div className='notification-profile-sent-details-wrapper'>
              <div className='notification-profile-sent-details-wrapper1'> 
                    <p className='notification-profile-text'>Gunner Ackner</p>
                    <p className='notification-profile-time-ago'>5 min</p>
                    </div>
                    <div className='notification-profile-sent-details-wrapper1'> 
                    <p className='notification-profile-text-message'>Replied to you</p>
                    </div>        
              </div>
          <img className='notification-profile-post-image' src='profile-pic.png'/>
        </div>  
        <div className='notification-right-side-col4'>
          <div className='notification-profile-posted'></div>
          <img className='notification-profile-image' src='profile-pic.png'/>
              <div className='notification-profile-sent-details-wrapper'>
              <div className='notification-profile-sent-details-wrapper1'> 
                    <p className='notification-profile-text'>Gunner Ackner</p>
                    <p className='notification-profile-time-ago'>5 min</p>
                    </div>
                    <div className='notification-profile-sent-details-wrapper1'> 
                    <p className='notification-profile-text-message'>Sent you a message</p>
                    </div>        
              </div>
          <img className='notification-profile-post-image' src='profile-pic.png'/>
        </div>  
</div>
    </div>   
  )
}
