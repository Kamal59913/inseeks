"use client";
import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { QrCode, User, CircleUserRound } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  cn,
  GlobalLoader,
} from "@repo/ui/index";

import { useAuthStore } from "@/store/useAuthStore";
import { useModalStore } from "@/store/useModalStore";
import { useGetUserByUsername } from "@/hooks/userServices/useGetUserByUsername";
import { UserSubscribeButton } from "@/components/Features/UserSubscribeButton";
import { useSmartBack } from "@/hooks/utils/useSmartBack";
import { LinkifiedText } from "@/components/ui/linkified-text";

interface ProfileHeaderProps {
  username: string;
}

export const ProfileHeader = ({ username }: ProfileHeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const goBack = useSmartBack("/home");
  const { userData: loggedInUser } = useAuthStore();
  const { openModal } = useModalStore();

  const activeTab = pathname.split("/").pop() === username ? "posts" : pathname.split("/").pop() || "posts";

  const {
    data: userDataResponse,
    isLoading: isUserLoading,
    isError,
  } = useGetUserByUsername(username);

  const userData = (userDataResponse as any)?.data || userDataResponse;
  
  const isUserMissing =
    isError ||
    !userData ||
    (typeof userData === "object" &&
      userData !== null &&
      "detail" in userData &&
      (userData as { detail?: string }).detail === "User not found");

  const isOwnProfile = userData?.username === loggedInUser?.username;

  const handleTabChange = (value: string) => {
    const basePath = `/u/${username}`;
    router.push(`${basePath}/${value === "posts" ? "" : value}`);
  };

  if (isUserLoading) {
    return <GlobalLoader className="h-screen items-center bg-gray-50" />;
  }

  if (isUserMissing) {
    return (
      <div className="h-[90vh] w-full flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <CircleUserRound className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900">No users found</h2>
        <p className="text-gray-500 mt-2 max-w-xs">
          We could not find a profile for "@{username}".
        </p>
        <Button className="mt-6" onClick={() => goBack()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 px-6">
      {/* Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-r from-rose-400 via-pink-500 to-purple-500 rounded-b-2xl">
        {userData?.banner_photo_url &&
          userData.banner_photo_url !== "string" &&
          userData.banner_photo_url.startsWith("http") && (
            <img
              src={userData?.banner_photo_url}
              alt=""
              className={cn(
                "w-full h-full object-cover transition-opacity relative",
                isOwnProfile ? "cursor-pointer hover:opacity-95" : "cursor-context-menu"
              )}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.opacity = "0";
              }}
              onClick={() =>
                openModal("image-preview", { imageUrl: userData.banner_photo_url })
              }
            />
          )}
      </div>

      {/* Profile Info Header */}
      <div className="relative -mt-16 pb-6">
        <div className="relative inline-block">
          <Avatar
            className={cn(
              "w-28 h-28 ring-4 ring-white border-1 border-gray-200 bg-white shadow-lg",
              userData?.profile_photo_url && userData.profile_photo_url !== "string"
                ? "cursor-pointer"
                : "cursor-context-menu"
            )}
            onClick={() =>
              userData?.profile_photo_url &&
              userData.profile_photo_url !== "string" &&
              openModal("image-preview", {
                imageUrl: userData.profile_photo_url,
              })
            }
          >
            <AvatarImage
              src={userData?.profile_photo_url !== "string" ? userData?.profile_photo_url : undefined}
              className="object-cover"
            />
            <AvatarFallback className="bg-gray-50 flex items-center justify-center border-none">
              <User size={40} className="text-gray-400" />
            </AvatarFallback>
          </Avatar>
          <button
            onClick={() => openModal("qr-code", { userData })}
            className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-md border border-gray-200"
          >
            <QrCode className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <div className="flex justify-end -mt-8">
          {isOwnProfile ? (
            <Link href="/edit-profile">
              <Button>Edit Profile</Button>
            </Link>
          ) : (
            <UserSubscribeButton
              username={userData?.username}
              displayName={userData?.full_name}
              initialIsFollowing={userData?.is_following_user ?? userData?.is_following}
              className="px-8"
            />
          )}
        </div>

        <div className="mt-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {userData?.full_name || "User Name"}
          </h1>
          <p className="text-gray-500 mt-1">@{userData?.username || "username"}</p>
          {userData?.bio && (
            <LinkifiedText
              as="p"
              text={userData.bio}
              className="text-gray-600 mt-2 text-sm leading-relaxed"
            />
          )}

          <div className="flex items-center gap-6 mt-6">
            <div 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => openModal("follow-list", { userId: userData.id, initialTab: "followers" })}
            >
              <span className="text-gray-700 font-normal">Followers :</span>
              <span className="text-gray-900 font-bold text-lg">
                {userData?.followers_count || "0"}
              </span>
            </div>
            <div 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => openModal("follow-list", { userId: userData.id, initialTab: "following" })}
            >
              <span className="text-gray-700 font-normal">Following :</span>
              <span className="text-gray-900 font-bold text-lg">
                {userData?.following_count || "0"}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs List */}
        <div className="sticky top-0 bg-gray-50 pt-4 z-10">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList
              className={cn(
                "grid bg-white border border-gray-100 rounded-full w-full",
                isOwnProfile ? "grid-cols-4" : "grid-cols-3"
              )}
            >
              <TabsTrigger value="posts" className="rounded-full">
                Posts
              </TabsTrigger>
              <TabsTrigger value="reposts" className="rounded-full">
                Reposts
              </TabsTrigger>
              <TabsTrigger value="media" className="rounded-full">
                Media
              </TabsTrigger>
              {isOwnProfile && (
                <TabsTrigger value="saved" className="rounded-full">
                  Saved
                </TabsTrigger>
              )}
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
