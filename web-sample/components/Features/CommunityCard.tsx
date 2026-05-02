"use client";
import React from "react";
import Link from "next/link";

import {
  Users,
  ImageOff,
  User,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent
} from "@repo/ui/index";

import Image from "next/image";
import { FollowButton } from "./FollowButton";
import { getAvatarDisplaySlots } from "@/lib/utilities/avatarStack";

export const CommunityCard = ({ community }: any) => {
  const membersCount = community.subscriber_count ?? community.members ?? 0;
  const avatars = community.follower_avatars ?? community.memberAvatars ?? [];
  const avatarSlots = getAvatarDisplaySlots(membersCount, avatars, 4);
  const handleClick = () => {
    sessionStorage.setItem("avom-community-scroll-intent", "true");
    sessionStorage.setItem("avom-clicked-community", String(community.id));
  };

  return (
    <Link
      href={`/community/${community.id || 1}`}
      className="block"
      id={`community-${community.id}`}
      data-community-id={community.id}
      onClick={handleClick}
    >
      <Card className="rounded-2xl shadow-none border border-gray-200 bg-white overflow-hidden h-full">
        <div className="relative h-32 w-full bg-gray-50 flex items-center justify-center">
          {community.image ? (
            <Image
              src={community.image}
              alt={community.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <ImageOff className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-base text-gray-900 mb-2 truncate capitalize">
            {community.name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{membersCount} Members</span>
            </div>
            {avatarSlots.length > 0 && (
              <div className="flex -space-x-2">
                {avatarSlots.map((avatar, idx) => (
                  <Avatar key={idx} className="w-6 h-6 border-2 border-white">
                    <AvatarImage src={avatar || undefined} />
                    <AvatarFallback className="bg-gray-100 text-gray-400">
                      <User className="h-3.5 w-3.5" />
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            )}
          </div>
          <div className="mt-3">
            <FollowButton 
              communityId={community.id} 
              initialIsFollowing={community.is_subscribed}
              communityName={community.name}
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
