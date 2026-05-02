"use client";

import React from "react";
import Link from "next/link";
import { User } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@repo/ui/index";
import { LinkifiedText } from "@/components/ui/linkified-text";

interface UserHoverCardProps {
  children: React.ReactNode;
  authorName: string;
  authorUsername: string;
  authorAvatar?: string;
  authorBio?: string;
  followingCount?: string | number;
  followersCount?: string | number;
  isOwnPost: boolean;
  isFollowing?: boolean;
}

export const UserHoverCard = ({
  children,
  authorName,
  authorUsername,
  authorAvatar,
  authorBio,
  followingCount = "0",
  followersCount = "0",
  isOwnPost,
}: UserHoverCardProps) => {
  const profileUrl = `/u/${authorUsername}`;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>

      <HoverCardContent
        className="w-80 bg-white border border-gray-200 shadow-md rounded-xl p-4"
        align="start"
      >
        <div className="space-y-4">
          {/* User Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Link href={profileUrl}>
                <Avatar className="w-12 h-12 border-2 border-gray-200 hover:opacity-90 transition-opacity">
                  <AvatarImage src={authorAvatar} alt={authorName} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white">
                    <User size={24} />
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <Link href={profileUrl} className="group">
                  <h4 className="font-semibold text-gray-900 group-hover:underline">
                    {authorName}
                  </h4>
                </Link>
                <Link href={profileUrl} className="group">
                  <p className="text-sm text-gray-500">
                    @{authorUsername}
                  </p>
                </Link>
              </div>
            </div>
          </div>

          {/* Bio */}
          {authorBio && (
            <LinkifiedText
              as="p"
              text={authorBio}
              className="text-sm text-gray-700 leading-relaxed line-clamp-3"
            />
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 pt-2 border-t border-gray-100 justify-center">
            <div className="flex items-center gap-2 w-1/3 justify-center">
              <div className="flex flex-col text-center">
                <span className="text-xl font-semibold text-gray-900 block">
                {followingCount}
              </span>
              <span className="text-sm text-gray-600 block">Following</span>
              </div>
              
            </div>
            <div className="flex items-center gap-2 w-1/3 justify-center">
              <div className="flex flex-col text-center">
                <span className="text-xl font-semibold text-gray-900 block">
                {followersCount}
              </span>
              <span className="text-sm text-gray-600 block">Followers</span>
              </div>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
