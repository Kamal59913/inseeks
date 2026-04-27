import React from 'react';
import ImageWithFallback from '../Common/ImageWithFallback';

interface UserImageProps {
  avatar: string;
}

export default function UserImage({ avatar }: UserImageProps) {
  return (
    <div className="h-12 w-12 flex-shrink-0">
      <ImageWithFallback variant="avatar" className="h-12 w-12 rounded-full object-cover ml-2" src={avatar} alt="" />
    </div>
  );
}
