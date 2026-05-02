"use client";
import React from "react";
import { ChevronLeft, Plus, ImageOff, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/index";
import NextImage from "next/image";
import { getAvatarDisplaySlots } from "@/lib/utilities/avatarStack";
import { useSmartBack } from "@/hooks/utils/useSmartBack";
import { LinkifiedText } from "@/components/ui/linkified-text";
import { useAuthStore } from "@/store/useAuthStore";

interface FeedHeaderProps {
  feed: {
    id: string | number;
    title: string;
    description: string | null;
    subscriber_count?: number;
    follower_avatars?: string[];
    is_followed?: boolean;
    avatar_url?: string;
    creator_user_id?: string | number;
    user_id?: string | number;
    created_by?: string | number;
  };
}

import { FeedFollowButton } from "./FeedFollowButton";
import { FeedOwnerActions } from "./FeedOwnerActions";

export const FeedHeader = ({ feed }: FeedHeaderProps) => {
  const goBack = useSmartBack("/home");
  const { userData } = useAuthStore();
  const membersCount = feed.subscriber_count ?? 0;
  const avatars = feed.follower_avatars ?? [];
  const displayImage = feed.avatar_url;
  const isFollowed = feed.is_followed ?? false;
  const ownerId = feed.creator_user_id ?? feed.user_id ?? feed.created_by;
  const isOwner = ownerId != null && userData?.id != null && String(ownerId) === String(userData.id);
  const shouldShowMoreBadge = Number(membersCount) > 3;
  const avatarSlots = getAvatarDisplaySlots(membersCount, avatars, shouldShowMoreBadge ? 3 : 4);

  return (
    <div className="bg-white p-6 pb-0">
      {/* Back Button */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => goBack()}
          className="flex items-center text-xl font-semibold text-gray-900 hover:opacity-80"
        >
          <ChevronLeft className="w-6 h-6 mr-1" />
          Back
        </button>
        {isOwner && (
          <FeedOwnerActions
            feed={feed}
            redirectTo="/home"
            className="shrink-0"
            actionClassName="h-10 w-10"
            iconClassName="h-4 w-4"
          />
        )}
      </div>

      <div className="flex flex-col items-center text-center">
        {/* Feed Image */}
        <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-white shadow-sm bg-gray-50 flex items-center justify-center">
           {displayImage ? (
             <NextImage
              src={displayImage}
              alt={feed.title}
              fill
              className="object-cover"
            />
           ) : (
             <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
               <ImageOff className="w-8 h-8 text-gray-400" />
             </div>
           )}
        </div>

        {/* Feed Title */}
        <h1 className="text-xl font-semibold text-gray-900 mb-3">
          {feed.title}
        </h1>

        {/* Subscribers Info */}
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
            {membersCount} Subscribers
          </span>
        </div>

        {/* Action Button */}
        {!isOwner && (
          <div className="w-full max-w-[300px] mb-6">
            <FeedFollowButton 
              feedId={feed.id}
              initialIsFollowing={isFollowed}
              feedTitle={feed.title}
              className="h-12 text-base font-medium rounded-xl shadow-none"
              isConfirmPopup={true}
            />
          </div>
        )}

        {/* Description */}
        {feed.description && (
          <LinkifiedText
            as="p"
            text={feed.description}
            className="text-gray-600 text-center max-w-md mb-6 leading-relaxed"
          />
        )}
      </div>
    </div>
  );
};
