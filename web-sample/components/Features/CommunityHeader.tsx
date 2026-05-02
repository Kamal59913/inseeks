"use client";
import React from "react";
import { ChevronLeft, Plus, ImageOff, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/index";
import { FollowButton } from "./FollowButton";
import NextImage from "next/image";
import { getAvatarDisplaySlots } from "@/lib/utilities/avatarStack";
import { useSmartBack } from "@/hooks/utils/useSmartBack";
import { LinkifiedText } from "@/components/ui/linkified-text";

interface CommunityHeaderProps {
  community: {
    id: string | number;
    name: string;
    description: string;
    subscriber_count?: number;
    members?: string | number;
    is_subscribed?: boolean;
    isFollowing?: boolean;
    follower_avatars?: string[];
    memberAvatars?: string[];
    banner_photo_url?: string;
    image?: string;
  };
}

export const CommunityHeader = ({ community }: CommunityHeaderProps) => {
  const goBack = useSmartBack("/home");
  const membersCount = community.subscriber_count ?? community.members ?? 0;
  const avatars = community.follower_avatars ?? community.memberAvatars ?? [];
  const isSubscribed = community.is_subscribed ?? community.isFollowing ?? false;
  const displayImage = community.image ?? community.banner_photo_url;
  const shouldShowMoreBadge = Number(membersCount) > 3;
  const avatarSlots = getAvatarDisplaySlots(membersCount, avatars, shouldShowMoreBadge ? 3 : 4);

  return (
    <div className="bg-white p-6 pb-0">
      {/* Back Button */}
      <div className="flex items-center mb-6">
        <button
          type="button"
          onClick={() => goBack()}
          className="flex items-center text-xl font-semibold text-gray-900 hover:opacity-80"
        >
          <ChevronLeft className="w-6 h-6 mr-1" />
          Back
        </button>
      </div>

      <div className="flex flex-col items-center text-center">
        {/* Community Image */}
        <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-white shadow-sm bg-gray-50 flex items-center justify-center">
           {displayImage ? (
             <NextImage
              src={displayImage}
              alt={community.name}
              fill
              className="object-cover"
            />
           ) : (
             <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
               <ImageOff className="w-8 h-8 text-gray-400" />
             </div>
           )}
        </div>

        {/* Community Name */}
        <h1 className="text-xl font-semibold text-gray-900 mb-3">
          {community.name}
        </h1>

        {/* Members Info */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex -space-x-2">
            {avatarSlots.map((avatar, idx) => (
              <Avatar key={idx} className="w-8 h-8 border-2 border-white">
                <AvatarImage src={avatar || undefined} />
                <AvatarFallback className="bg-gray-100 text-gray-400">
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            ))}
            {shouldShowMoreBadge && (
              <div className="w-8 h-8 rounded-full border-2 border-white bg-purple-50 flex items-center justify-center">
                <Plus className="w-4 h-4 text-purple-500" />
              </div>
            )}
          </div>
          <span className="text-gray-500 text-sm">
            {membersCount} Members
          </span>
        </div>

        {/* Action Button */}
        <div className="w-full max-w-[300px] mb-6">
          <FollowButton 
            communityId={community.id}
            initialIsFollowing={isSubscribed}
            communityName={community.name}
            className="h-12 text-base font-medium rounded-xl shadow-none"
          />
        </div>

        {/* Description */}
        <LinkifiedText
          as="p"
          text={community.description}
          className="text-gray-600 text-center max-w-md mb-6 leading-relaxed"
        />
      </div>
    </div>
  );
};
