import React, { useState } from 'react';
import ImageWithFallback from '../Common/ImageWithFallback';

export default function SmImageHomepage() {
  const [toggleComment, setToggleComment] = useState(false);

  return (
    <div className="column1b-sm">
      <div className="column1b1-sm">
        <ImageWithFallback variant="avatar" className="profileimageuser2" src="profile-pic.png" alt="profile" />
        <div className="profileName">
          <p className="profileNameSub">Edward Ford</p>
          <p className="postedTime"> 5 min ago </p>
        </div>
        <i className="fa-solid fa-ellipsis-vertical threeDotPost"></i>
      </div>
      <div className="column1b2">
        <p className="postBody"> Images of Cancun Mexico</p>
      </div>
      <div className="column1b3">
        <div className="imageOne"></div>
        <div className="imageTwo"></div>
        <div className="imageThree">
          <p className="seventeenMore"> 17 More </p>
        </div>
      </div>
      <div className="column1b4">
        <div className="column1b4heart">
          <i className="fa-regular fa-heart posticons2 fa-sm"></i>{' '}
          <span className="likeCommentCount">326</span>
        </div>
        <div className="column1b4comment" onClick={() => setToggleComment(!toggleComment)}>
          <i className="fa-regular fa-comment posticons2 fa-sm"></i>{' '}
          <span className="likeCommentCount">148</span>
        </div>
        <div className="column1b4Share-sm">
          Share <i className="fa-solid fa-share"></i>
        </div>
      </div>
      {toggleComment && (
        <>
          <div className="column1b5">
            <label htmlFor="searchbar2"></label>
            <br />
            <input type="text" name="Occupation" placeholder="Write in comment..." id="searchbar2" />
            <br />
            <div className="comment-icons-sm">
              <i className="fa-regular fa-face-smile smile-comment"></i>
              <i className="fa-solid fa-paper-plane plane-comment"></i>
            </div>
          </div>
          <div className="column1b6">
            <div className="commentUserInfo">
              <ImageWithFallback variant="avatar" className="profileimageuser3" src="profile-pic.png" alt="user" />
              <p className="profileNameSub2">Edward Ford</p>
              <p className="postedTime2-sm"> 5 min ago </p>
            </div>
            <div className="columnCommentBody">
              <p className="postBody2">
                Awesome edward, remember that 5 tips for low cost holidays I sent you?
              </p>
            </div>
            <div className="likesReplyUnderCommentPart">
              <div className="column1b4heart2">
                <i className="fa-regular fa-heart posticons2 fa-sm"></i>{' '}
                <span className="likeCommentCount2">326</span>
              </div>
              <div className="column1b4comment2">
                <i className="fa-regular fa-comment posticons2 fa-sm"></i>{' '}
                <span className="likeCommentCount2">148</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
