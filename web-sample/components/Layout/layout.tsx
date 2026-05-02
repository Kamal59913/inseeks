"use client";
import React from "react";

import { SidebarMenuDropdown } from "./SidebarMenuDropdown";

import {
  HomeFilled,
  HomeOutline,
  Search,
  Plus,
  ChatFilled,
  ChatOutline,
  UserFilled,
  UserOutline,
} from "@/components/icons";

import {
  Button,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  cn,
  ScrollArea,
} from "@repo/ui/index";

import { useRouter, usePathname } from "next/navigation";
import { useModalStore } from "@/store/useModalStore";
import { useAuthStore } from "@/store/useAuthStore";
import GlobalLoader from "./GlobalLoader";
import { scrollToTop } from "@/lib/utilities/scrollUtils";
import { DashboardHeader } from "./DashboardHeader";
import Image from "next/image";
import { useNavigationStack } from "@/hooks/utils/useNavigationStack";

type DefaultLayoutProps = {
  children: React.ReactNode;
};

const SidebarNavItem = ({
  icon: Icon,
  onClick,
  label,
  className = "",
  iconProps = {},
  isActive = false,
}: {
  icon: any;
  onClick: () => void;
  label: string;
  className?: string;
  iconProps?: any;
  isActive?: boolean;
}) => (
  <Tooltip delayDuration={200}>
    <TooltipTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "transition-colors hover:bg-transparent",
          isActive ? "text-primary hover:text-primary" : "text-[#9CA3AF] hover:text-gray-600",
          className,
        )}
        onClick={onClick}
      >
        <Icon className="w-6 h-6" {...iconProps} />
      </Button>
    </TooltipTrigger>
    <TooltipContent side="right" sideOffset={10}>
      {label}
    </TooltipContent>
  </Tooltip>
);

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  useNavigationStack();
  const router = useRouter();
  const pathname = usePathname();
  const { openModal, stack } = useModalStore();
  const isCreateModalOpen = stack.some((m) => m.type === "create-new");
  const { userData } = useAuthStore();

  const handleProfileClick = () => {
    if (userData?.username) {
      router.push(`/u/${userData.username}`);
    } else {
      router.push("/login");
    }
  };

  const handleLogout = () => {
    openModal("logout");
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <GlobalLoader />

      <div className="w-20 bg-[#FCF7FE] border-gray-200 flex flex-col items-center py-6 space-y-8 fixed left-0 top-0 h-full z-[60]">
        <div className="cursor-pointer" onClick={scrollToTop}>
          <Image
            src="/logo.svg"
            className=""
            alt="AVOM"
            width={50}
            height={50}
            onClick={() => {
              router.push("/home");
              scrollToTop();  
            }}
          />
        </div>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "transition-colors hover:bg-transparent",
                pathname.startsWith("/home") ? "text-primary hover:text-primary" : "text-[#9CA3AF] hover:text-gray-600",
              )}
              onClick={() => { router.push("/home"); scrollToTop(); }}
            >
              {pathname.startsWith("/home")
                ? <HomeFilled className="w-6 h-6" />
                : <HomeOutline className="w-6 h-6" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>Home</TooltipContent>
        </Tooltip>
        <SidebarNavItem
          icon={Search}
          onClick={() => router.push("/search")}
          label="Users"
          isActive={pathname === "/search"}
        />
        <SidebarNavItem
          icon={Plus}
          onClick={() => openModal("create-new")}
          label="Create a Post or Feed"
          isActive={isCreateModalOpen}
        />
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "transition-colors hover:bg-transparent",
                pathname.startsWith("/messages") ? "text-primary hover:text-primary" : "text-[#9CA3AF] hover:text-gray-600",
              )}
              onClick={() => router.push("/messages")}
            >
              {pathname.startsWith("/messages")
                ? <ChatFilled className="w-6 h-6" />
                : <ChatOutline className="w-6 h-6" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>Messages</TooltipContent>
        </Tooltip>
        <div className="mt-auto flex flex-col items-center space-y-8">
          <SidebarMenuDropdown
            username={userData?.username}
            onNavigate={handleNavigation}
            onLogout={handleLogout}
          />

          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "transition-colors hover:bg-transparent",
                  !!userData?.username && pathname.startsWith(`/u/${userData.username}`) ? "text-primary hover:text-primary" : "text-[#9CA3AF] hover:text-gray-600",
                )}
                onClick={handleProfileClick}
              >
                {!!userData?.username && pathname.startsWith(`/u/${userData.username}`)
                  ? <UserFilled className="w-6 h-6" />
                  : <UserOutline className="w-6 h-6" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={10}>Profile</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className=" flex-1 ml-20 h-screen overflow-hidden w-full flex justify-center">
        <div className={cn("max-w-3xl w-full bg-white flex flex-col h-full")}>
          {/* Static Global Header */}
          <div className="shrink-0 z-80 bg-white">
            <div className="px-6">
              <DashboardHeader />
            </div>
          </div>

          {/* Isolated Scroll Viewport */}
          <ScrollArea className="flex-1 border-gray-100 relative">
            {children}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
