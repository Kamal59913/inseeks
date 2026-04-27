import React from 'react';

import ImageWithFallback from '../Common/ImageWithFallback';

export default function RightSideCommentBar() {
  return (
    <div className="RightSideEventsbar">
      <div className="rightbar-events-user-notification-and-profile-image">
      </div>
      <div className="rightbar-two-events">
        <p className="rightbar-tevents-features-stories">My Next Events</p>
        {[1, 2, 3].map((i) => (
          <div key={i} className="event1">
            <ImageWithFallback className="imageEvent" src="story.png" alt="event" />
            <p className="titleEvent">Arijit Singh Concert</p>
            <div className="bodyEvent">
              <p className="eventTime">December 12, 2023</p>
              <div className="tick-event"><i className="fa-solid fa-check tick"></i></div>
            </div>
          </div>
        ))}
        <div className="eventSeeMore">
          <p className="eventTextSeeMore">
            See More <i className="fa-solid fa-greater-than fa-xs"></i>
          </p>
        </div>
      </div>
    </div>
  );
}
