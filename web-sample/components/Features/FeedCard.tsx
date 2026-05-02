"use client";
import React from "react";
import { useRouter } from "next/navigation";

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
  CardContent,
  Badge,
  cn,
} from "@repo/ui/index";

import Image from "next/image";
import { FeedFollowButton } from "./FeedFollowButton";
import { FeedOwnerActions } from "./FeedOwnerActions";
import { getAvatarDisplaySlots } from "@/lib/utilities/avatarStack";
import { LinkifiedText } from "@/components/ui/linkified-text";
import { useAuthStore } from "@/store/useAuthStore";

export const FeedCard = ({ feed }: any) => {
  const router = useRouter();
  const { userData } = useAuthStore();
  const membersCount = feed.subscriber_count ?? feed.members ?? 0;
  const avatars = feed.follower_avatars ?? feed.memberAvatars ?? [];
  const avatarSlots = getAvatarDisplaySlots(membersCount, avatars, 4);
  const ownerId = feed.creator_user_id ?? feed.user_id ?? feed.created_by;
  const isOwner = ownerId != null && userData?.id != null && String(ownerId) === String(userData.id);
  const feedHref = `/feed/${feed.id || 1}`;
  const handleClick = () => {
    sessionStorage.setItem("avom-feed-scroll-intent", "true");
    sessionStorage.setItem("avom-clicked-feed", String(feed.id));
  };
  const handleCardNavigation = (
    event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
  ) => {
    const target = event.target as HTMLElement;
    if (target.closest("a,button,input,textarea,select,[role='button']")) {
      return;
    }

    handleClick();
    router.push(feedHref);
  };

  return (
    <div
      className="block relative cursor-pointer"
      id={`feed-${feed.id}`}
      data-feed-id={feed.id}
      onClick={handleCardNavigation}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleCardNavigation(event);
        }
      }}
      role="link"
      tabIndex={0}
    >
      <Card className="rounded-2xl shadow-none border border-gray-200 bg-white overflow-hidden h-full">
        <div className="relative h-32 w-full bg-gray-50 flex items-center justify-center">
          {isOwner && (
            <div className="absolute left-3 top-3 z-20">
              <FeedOwnerActions
                feed={feed}
                className="border-white/70 bg-white/90 shadow-md"
              />
            </div>
          )}
          {feed.community?.name && (
            <Badge 
              variant="secondary" 
              className="absolute top-2 text-[11px] right-2 z-10 bg-primary text-white border-none shadow-sm font-medium"
            >
              {feed.community.name}
            </Badge>
          )}
          {feed.avatar_url ? (
            <Image
              src={feed.avatar_url}
              alt={feed.title || "Feed Image"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <ImageOff className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
        <CardContent
          className={cn(
            "px-4 pt-4",
            isOwner ? "pb-4" : "pb-16",
          )}
        >
          <h3 className="font-semibold text-base text-gray-900 mb-1 truncate capitalize">
            {feed.title}
          </h3>
          {feed.description && (
            <LinkifiedText
              as="p"
              text={feed.description}
              className="text-sm text-gray-500 line-clamp-2 mb-3 leading-5 whitespace-pre-wrap"
            />
          )}
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
          {!isOwner && (
            <div className="mt-auto absolute left-0 right-0 px-3 bottom-3">
              <FeedFollowButton 
                feedId={feed.id} 
                initialIsFollowing={feed.is_followed}
                feedTitle={feed.title}
                isConfirmPopup={true}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
