import React from 'react';
import ImageWithFallback from '../Common/ImageWithFallback';

export default function ZoomEventUserHeader() {
  return (
    <div className="blank-1">
      <div className="column1b1Evn">
        <ImageWithFallback variant="avatar" className="profileimageuser2" src="profile-pic.png" alt="profile" />
        <div className="profileName">
          <p className="profileNameSub">Edward Ford</p>
          <p className="postedTime"> 5 min ago </p>
        </div>
      </div>
      <div className="column1b4">
        <div className="column1b4ShareEvent">
          Share <i className="fa-solid fa-share"></i>
        </div>
        <div className="column1b4EventShare">
          <p className="column1b4EventShare-text">
            Interested <i className="fa-solid fa-check"></i>
          </p>
        </div>
        <i className="fa-solid fa-ellipsis-vertical threeDotEvent"></i>
      </div>
    </div>
  );
}
