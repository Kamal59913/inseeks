import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import styles from './postboxes.module.scss'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default function PostHomepage() {
  const goTo = useNavigate();
  const [toggleComment, setToggleComment] = useState(false);
  const CommentToggle = () => {
    setToggleComment(!toggleComment);
  }
  const zoomThePost = () => {
    goTo('/singlepost')
  }
  
  const openProfile = () => {
    goTo('/theuser')
  }
  return (
    <div className={styles.questionCard}>
    <div className={styles.questionCardName}>
    <img className={styles.profileImage}   src='profile-pic.png' onClick={openProfile}/>
      <div className={styles.profileName}>  <p className={styles.profileNameSub} onClick={openProfile}>Edward Ford</p>
                                      <p className={styles.postedTime} onClick={openProfile}> 5 min ago </p>
      </div>
      <FontAwesomeIcon icon={faEllipsisV} className={styles.threeDotPost} />
    </div>
    <div className={styles.column1b2}   onClick={zoomThePost}>
      <p className={styles.postTitleQuestion}> Tourism is back in Cancun Mexico</p>
    </div>
    <div className={styles.column1b3} onClick={zoomThePost}></div>
    <div className={styles.column1b4}>
    <div className={styles.column1b4heart}>
      <i class="fa-regular fa-heart posticons2 fa-sm"></i> <span className={styles.likeCommentCount}>326</span>
      </div>
      <div className={styles.column1b4comment} onClick={CommentToggle}>
      <i class="fa-regular fa-comment posticons2 fa-sm"></i> <span className={styles.likeCommentCount}>148</span>
      </div>
      <div className={styles.column1b4Share}> Share <i class="fa-solid fa-share"></i></div>
    </div>
    {toggleComment? <>
              <div className='column1b5'>
              <label for="searchbar"></label> <br/>
                  <input type="text"
                  name="Occupation"
                  placeholder="Write in comment..."
                  id="searchbar2"/><br/>
                  <div className="comment-icons">
                  <i class="fa-regular fa-face-smile smile-comment"></i>
                  <i class="fa-solid fa-paper-plane plane-comment"></i>
                  </div>
              </div>
              <div className={styles.column1b6}>
                <div className='commentUserInfo'>
                <img className={styles.profileimageuserComments}
                src='profile-pic.png'
                />
                     <p className={styles.profileimageuserCommentsName}>Edward Ford</p>
                     <p className={styles.postedTimeComment}> 5 min ago </p>
                </div>
                <div className='columnCommentBody'>
                <p className='postBody2'> Awesome edward, remember that 5 tips for low cost holidaysI sent you?</p>
              </div>
                <div className='likesReplyUnderCommentPart'>
                    <div className='column1b4heart2'>
                    <i class="fa-regular fa-heart posticons2 fa-sm"></i> <span className={styles.likeCommentCount2}>326</span>
                    </div>
                    <div className='column1b4comment2'>
                    <i class="fa-regular fa-comment posticons2 fa-sm"></i> <span className={styles.likeCommentCount2}>148</span>
                    </div>
                </div>  
              </div>
             </>: <>
             </>}

  </div>
    )
}
