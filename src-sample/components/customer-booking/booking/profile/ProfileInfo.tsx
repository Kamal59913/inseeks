"use client";

import React from "react";
import Button from "@/components/ui/button/Button";
import { copyToClipboard } from "@/lib/utilities/copyToClipboard";
import { Freelancer, ServiceArea } from "@/types/api/freelancer.types";

interface ProfileInfoProps {
  firstName: string;
  locationText: string;
  locationTextAddress: string;
  freelancer: Freelancer;
  showFullBio: boolean;
  setShowFullBio: (show: boolean) => void;
  setIsContactModalOpen: (open: boolean) => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  firstName,
  locationText,
  locationTextAddress,
  freelancer,
  showFullBio,
  setShowFullBio,
  setIsContactModalOpen,
}) => {
  const bio = freelancer?.additional_info?.bio?.trim() || "";

  return (
    <div className="px-5">
      {/* Location + buttons */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <div className="max-w-[60%]">
          <p className="flex flex-col items-start capitalize">
            <span className="text-[12px] font-[400] text-white">
              {locationText}
            </span>
            <span className="text-[16px] font-[500] text-white">
              {locationTextAddress}
            </span>
          </p>
          {freelancer.service_areas?.some(
            (sa: ServiceArea) => sa.service_place?.id === 3,
          ) && (
            <p className="mt-0 text-xs text-white leading-relaxed capitalize">
              Available to travel
            </p>
          )}
        </div>

        <div className="flex gap-2 items-end">
          <Button
            variant="glass"
            size="none"
            borderRadius="rounded-xl"
            onClick={() => setIsContactModalOpen(true)}
            className="h-12 text-[14px] py-3 px-4 truncate font-normal"
          >
            Message {firstName}
          </Button>
          <Button
            variant="glass"
            size="none"
            borderRadius="rounded-xl"
            onClick={() => copyToClipboard(window.location.href)}
            className="h-12 w-12 flex-shrink-0 flex items-center justify-center p-0"
          >
            <img src="/share.svg" alt="Share" />
          </Button>
        </div>
      </div>

      {bio && (
        <div className="pt-5">
          <p className="text-xs leading-relaxed text-white">
            {!showFullBio ? bio.slice(0, 120) : bio}
            {bio.length > 120 && (
              <button
                onClick={() => setShowFullBio(!showFullBio)}
                className="ml-1 text-[12px] font-medium text-white"
              >
                {showFullBio ? "Show less" : "Read more..."}
              </button>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;
