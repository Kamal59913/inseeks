"use client";

import { ServiceCategory } from "@/types/api/freelancer.types";

interface ProfileHeroProps {
  profilePic: string;
  fullName: string;
  categoryList: ServiceCategory[];
  onPhotoClick: () => void;
  hasPhotos: boolean;
}

const ProfileHero: React.FC<ProfileHeroProps> = ({
  profilePic,
  fullName,
  categoryList,
  onPhotoClick,
  hasPhotos,
}) => {
  return (
    <div
      className={`relative w-full h-[500px] -mt-[84px] ${
        hasPhotos ? "cursor-pointer" : ""
      }`}
      onClick={onPhotoClick}
    >
      <img
        src={profilePic}
        alt={fullName}
        className="object-cover w-full h-full"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#120012] via-transparent to-black/50" />

      {/* NAME + RATING + TAGS */}
      <div className="absolute bottom-6 left-5 right-5 text-center">
        <h1 className="mt-1 text-[28px] font-medium capitalize">{fullName}</h1>

        {/* DYNAMIC CATEGORY TAGS */}
        <div className="mt-4 flex gap-2 text-[12px] justify-center overflow-x-auto">
          {categoryList.slice(0, 3).map((cat: ServiceCategory) => (
            <span
              key={cat.id}
              className="px-4 py-1.5 bg-black/15 rounded-full whitespace-nowrap text-xs"
            >
              {cat.name}
            </span>
          ))}

          {/* Show +X more if there are more than 3 */}
          {categoryList.length > 3 && (
            <span className="px-3.5 py-1.5 bg-black/40 rounded-full whitespace-nowrap">
              +{categoryList.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHero;
