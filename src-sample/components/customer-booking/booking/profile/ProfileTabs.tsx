"use client";

import React from "react";

interface ProfileTabsProps {
  TAB_LIST: string[];
  activeTab: string;
  onTabClick: (tab: string) => void;
  hasBio: boolean;
  hasPhotos: boolean;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  TAB_LIST,
  activeTab,
  onTabClick,
  hasBio,
  hasPhotos,
}) => {
  return (
    <div className="mt-6 px-5 flex gap-6 text-base border-b border-white/10 sticky top-17 pt-4 z-20 overflow-x-auto whitespace-nowrap bg-inherit">
      {TAB_LIST.map((tab) => {
        const isAbout = tab === "ABOUT";
        const isPhotos = tab === "PHOTOS";
        const disabled = (isAbout && !hasBio) || (isPhotos && !hasPhotos);
        return (
          <button
            key={tab}
            onClick={() => {
              if (disabled) return;
              onTabClick(tab);
            }}
            disabled={disabled}
            className={`pb-1 ${
              disabled
                ? "opacity-20 cursor-not-allowed pb-3 text-base"
                : activeTab === tab
                  ? "pb-3 font-bold text-white text-base"
                  : "pb-3 font-normal text-white opacity-20 hover:text-gray-300 text-base"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};

export default ProfileTabs;
