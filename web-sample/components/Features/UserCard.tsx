"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, Button, Avatar, AvatarImage, AvatarFallback } from "@repo/ui/index";
import { User as UserIcon } from "lucide-react";
import { UserSubscribeButton } from "./UserSubscribeButton";
import { getUserInitials, getRandomUserColor } from "@/lib/utilities/userUtils";

interface UserCardProps {
  user: {
    id: number | string;
    full_name: string;
    username: string;
    profile_photo_url?: string;
    profile_thumbnail_url?: string;
    subscribers_count?: number;
    is_subscribed?: boolean;
  };
}

export const UserCard = ({ user }: UserCardProps) => {
  // Format subscriber count (e.g., 3.5M)
  const formatCount = (count: number = 0) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
    if (count >= 1000) return (count / 1000).toFixed(1) + "K";
    return count.toString();
  };

  return (
    <Card className="rounded-2xl shadow-none border border-gray-200 bg-[#FCFCFC] transition-all hover:border-primary/20 hover:shadow-sm">
      <CardContent className="flex flex-col items-center p-4">
        <Link href={`/u/${user.username}/posts`} className="flex flex-col items-center w-full">
          <div className="h-20 w-20 rounded-full overflow-hidden border border-gray-100 shadow-sm mb-2">
              <Avatar className="h-full w-full">
                <AvatarImage src={user.profile_photo_url || user.profile_thumbnail_url} alt={user.full_name} className="object-cover" />
                <AvatarFallback 
                  className="font-semibold text-xl text-gray-900"
                  style={{ backgroundColor: getRandomUserColor(user.id || user.username) }}
                >
                    {getUserInitials(user.full_name || user.username)}
                </AvatarFallback>
              </Avatar>
          </div>
          <h3 className="font-semibold text-base text-gray-900 truncate w-full text-center px-1">
            {user.full_name || user.username}
          </h3>
          <p className="text-sm text-gray-500 mb-1 truncate w-full text-center">
            @{user.username}
          </p>
          <p className="text-sm font-normal text-primary mb-2">
            {formatCount(user.subscribers_count || 0)} Subscriber
          </p>
        </Link>
        <div className="w-full mt-auto">
            <UserSubscribeButton 
              username={user.username}
              displayName={user.full_name}
              initialIsFollowing={user.is_subscribed}
              className="w-full rounded-xl"
            />
        </div>
      </CardContent>
    </Card>
  );
};
