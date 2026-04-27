import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import ImageWithFallback from '../Common/ImageWithFallback';

interface NotifcationandprofileProps {
  avatar?: string;
}

export default function Notifcationandprofile({ avatar }: NotifcationandprofileProps) {
  return (
    <div className="h-[60px] w-[168px] flex text-[white] ml-auto mr-0 mt-[18px] mb-0">
      <div className="h-[46px] w-[46px] bg-[#666bed] rounded-[10px]">
        <FontAwesomeIcon icon={faBell} className="text-[white] ml-4 mr-0 mt-[15px] mb-0" />
      </div>
      <ImageWithFallback
        variant="avatar"
        className="h-[46px] w-[46px] bg-[#666bed] ml-3.5 mr-[21px] rounded-[10px]"
        src={avatar}
        alt="profile"
      />
    </div>
  );
}
