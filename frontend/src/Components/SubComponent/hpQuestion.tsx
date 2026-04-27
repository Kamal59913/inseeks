import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageWithFallback from '../Common/ImageWithFallback';
import styles from './postboxes.module.scss';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Homepagequestion() {
  const [postMode, setpostMode] = useState('image');
  const navigate = useNavigate();
  const string =
    "Cancún, a Mexican city on the Yucatán Peninsula bordering the Caribbean Sea, is known for its beaches, numerous resorts and nightlife. It's composed of 2 distinct areas: the more traditional downtown area, El Centro, and Zona Hotelera, a long, beachfront strip of high-rise hotels, nightclubs, shops and restaurants. Cancun is also a famed";
  const substring = string.substring(0, 100);

  const [beforeTrimmed, setbeforeTrimmed] = useState(substring);
  const [toggleComment, setToggleComment] = useState(false);

  return (
    <div className={styles.questionCard}>
      <div className={styles.questionCardName}>
        <ImageWithFallback
          variant="avatar"
          className={styles.profileImage}
          src="profile-pic.png"
          alt="profile"
          onClick={() => navigate('/theuser')}
        />
        <div className={styles.profileName}>
          <p className={styles.profileNameSub} onClick={() => navigate('/theuser')}>Edward Ford</p>
          <p className={styles.postedTime} onClick={() => navigate('/theuser')}> 5 min ago </p>
        </div>
        <FontAwesomeIcon icon={faEllipsisV} className={styles.threeDotPost} />
      </div>
      <div className={styles.column1b2} onClick={() => navigate('/singlepost')}>
        <p className={styles.postTitleQuestion}> What is tourism is back in Cancun Mexico?</p>
      </div>
      <div className={styles.column1b3} onClick={() => navigate('/singlepost')}></div>
      <div className={styles.column1b3QuestionBody}>
        <p className={styles.columnQuestionBody}>{beforeTrimmed}</p>
        {beforeTrimmed.length > 100 ? (
          <p className={styles.columnQuestionReadMore} onClick={() => setbeforeTrimmed(substring)}>
            Read Less
          </p>
        ) : (
          <p className={styles.columnQuestionReadMore} onClick={() => setbeforeTrimmed(string)}>
            Read More
          </p>
        )}
      </div>
      <div className={styles.column1b4}>
        <div className={styles.column1b4heart}>
          <i className="fa-regular fa-heart posticons2 fa-sm"></i>{' '}
          <span className={styles.likeCommentCount2}>326</span>
        </div>
        <div className={styles.column1b4comment} onClick={() => setToggleComment(!toggleComment)}>
          <i className="fa-regular fa-comment posticons2 fa-sm"></i>{' '}
          <span className={styles.likeCommentCount2}>148</span>
        </div>
        <div className={styles.column1b4Share}>
          Share <i className="fa-solid fa-share"></i>
        </div>
      </div>

      {toggleComment && (
        <>
          <div className={styles.column1b5}>
            <label htmlFor="searchbar2"></label>
            <br />
            <input type="text" name="Occupation" placeholder="Write in comment..." id="searchbar2" />
            <br />
            <div className={styles.commentIcons}>
              <i className="fa-regular fa-face-smile smile-comment"></i>
              <i className="fa-solid fa-paper-plane plane-comment"></i>
            </div>
          </div>
          <div className={styles.column1b6}>
            <div className={styles.commentUserInfo}>
              <ImageWithFallback variant="avatar" className={styles.profileimageuserComments} src="profile-pic.png" alt="user" />
              <p className={styles.profileimageuserCommentsName}>Edward Ford</p>
              <p className={styles.postedTimeComment}> 5 min ago </p>
            </div>
            <div className="columnCommentBody">
              <p className={styles.postBody2}>
                Awesome edward, remember that 5 tips for low cost holidays I sent you?
              </p>
            </div>
            <div className={styles.likesReplyUnderCommentPart}>
              <div className={styles.column1b4heart2}>
                <i className="fa-regular fa-heart posticons2 fa-sm"></i>{' '}
                <span className={styles.likeCommentCount2}>326</span>
              </div>
              <div className={styles.column1b4comment2}>
                <i className="fa-regular fa-comment posticons2 fa-sm"></i>{' '}
                <span className={styles.likeCommentCount2}>148</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
