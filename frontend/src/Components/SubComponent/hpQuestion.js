import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import styles from './postboxes.module.scss'
import { faEllipsisV, faFaceSmile, faPaperPlane, faHeart, faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default function Homepagequestion() {

  const [postMode, setpostMode] = useState('image');
  const navigate = useNavigate();
  let string = "Cancún, a Mexican city on the Yucatán Peninsula bordering the Caribbean Sea, is known for its beaches, numerous resorts and nightlife. It’s composed of 2 distinct areas: the more traditional downtown area, El Centro, and Zona Hotelera, a long, beachfront strip of high-rise hotels, nightclubs, shops and restaurants. Cancun is also a famed";
  let substring = string.substring(0, 100);

  const [beforeTrimmed, setbeforeTrimmed] = useState(substring);

  const showMore = () => {
    setbeforeTrimmed(string);
  }
  const showLess = () => {
    setbeforeTrimmed(substring);
  }

  const [toggleComment, setToggleComment] = useState(false);
  const CommentToggle = () => {
    setToggleComment(!toggleComment);
  }
  const zoomthepost = () => {
    console.log("yes that is triggered")
    navigate('/singlepost')
  }
  const openProfile = () => {
    console.log("yes that is triggered")
    navigate('/theuser')
  }
  
  return (
            <div className={styles.questionCard}>
              <div className={styles.questionCardName}>
              <img className={styles.profileImage}
                src='profile-pic.png' onClick={openProfile}
              />
                <div className={styles.profileName}>  <p className={styles.profileNameSub} onClick={openProfile}>Edward Ford</p>
                                                <p className={styles.postedTime} onClick={openProfile}> 5 min ago </p>
                </div>
                <FontAwesomeIcon icon={faEllipsisV} className={styles.threeDotPost} />
              </div>
              <div className={styles.column1b2} onClick={zoomthepost}>
                <p className={styles.postTitleQuestion}> What is tourism is back in Cancun Mexico?</p>
              </div>
              <div className={styles.column1b3} onClick={zoomthepost}></div>
              <div className={styles.column1b3QuestionBody}>
                  <p className={styles.columnQuestionBody}> {beforeTrimmed}</p>
                  {beforeTrimmed.length>100 ? <>
                    <p className={styles.columnQuestionReadMore} onClick={showLess}> Read Less</p>
                  </>: <>
                  <p className={styles.columnQuestionReadMore} onClick={showMore}> Read More</p>
                  </>}
                
              </div>
              <div className={styles.column1b4}>
              <div className={styles.column1b4heart}>
              <i class="fa-regular fa-heart posticons2 fa-sm"></i> <span className={styles.likeCommentCount2}>326</span>
                </div>
                <div className={styles.column1b4comment} onClick={CommentToggle}>
                <i class="fa-regular fa-comment posticons2 fa-sm"></i> <span className={styles.likeCommentCount2}>148</span>
                </div>
                <div className={styles.column1b4Share}> Share <i class="fa-solid fa-share"></i></div>
              </div>
             
             {toggleComment? <>
              <div className={styles.column1b5}>
              <label for="searchbar"></label> <br/>
                  <input type="text"
                  name="Occupation"
                  placeholder="Write in comment..."
                  id={styles.searchbar2}/><br/>
                  <div className={styles.commentIcons}>
                  <i className="fa-regular fa-face-smile smile-comment"></i>
                  <i className="fa-solid fa-paper-plane plane-comment"></i>
                  </div>
              </div>
              <div className={styles.column1b6}>
                <div className={styles.commentUserInfo}>
                <img className={styles.profileimageuserComments}
                src='profile-pic.png'
                />
                     <p className={styles.profileimageuserCommentsName}>Edward Ford</p>
                     <p className={styles.postedTimeComment}> 5 min ago </p>
                </div>
                <div className='columnCommentBody'>
                <p className={styles.postBody2}> Awesome edward, remember that 5 tips for low cost holidaysI sent you?</p>
              </div>
                <div className={styles.likesReplyUnderCommentPart}>
                    <div className={styles.column1b4heart2}>
                    <i class="fa-regular fa-heart posticons2 fa-sm"></i> <span className={styles.likeCommentCount2}>326</span>
                    </div>
                    <div className={styles.column1b4comment2}>
                    <i class="fa-regular fa-comment posticons2 fa-sm"></i> <span className={styles.likeCommentCount2}>148</span>
                    </div>
                </div>  
              </div>
             </>: <>
             </>}
            </div>
  )
}
