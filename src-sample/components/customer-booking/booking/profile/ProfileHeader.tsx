"use client";

import React from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Progress } from "@/components/ui/progress";
import Button from "@/components/ui/button/Button";

interface ProfileHeaderProps {
  scrollProgress: number;
  router: AppRouterInstance;
  LinkOpener: (url: string) => void;
  getFullWebLink: (path: string) => string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  scrollProgress,
  router,
  LinkOpener,
  getFullWebLink,
}) => {
  return (
    <header className="sticky top-0 z-50 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="bg-gradient-to-b from-black/60 to-transparent backdrop-blur-[2px]">
        <div className="px-4 py-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                LinkOpener(process.env.NEXT_PUBLIC_FREELANCER_LANDING_SITE!!);
              }}
              className="text-gray-600 dark:text-white cursor-pointer hover:opacity-80 transition-opacity"
            >
              <img
                src={"/left-icon.svg"}
                className="h-8 min-w-4 max-w-5 max-h-5"
                alt="Back"
              />
            </button>
            <Button
              variant="glass"
              size="sm"
              borderRadius="rounded-[16px]"
              onClick={(e) => {
                e.stopPropagation();
                LinkOpener(
                  process.env.NEXT_PUBLIC_FREELANCER_LANDING_SITE_HELP_PAGE!!,
                );
              }}
              className="font-medium active:scale-95 transition-all"
            >
              <span className="sm:inline">Help</span>
            </Button>
          </div>

          <img src="/logo.svg" className="absolute left-1/2 -ml-10 z-10" />

          <Button
            variant="white"
            borderRadius="rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              window.open(getFullWebLink("get-started-customer"), "_blank");
            }}
            className="text-[14px] font-medium active:scale-95 transition-all"
            size="sm"
          >
            Join
          </Button>
        </div>
      </div>
      <Progress
        value={scrollProgress}
        className="h-[2px] rounded-none bg-white/10"
        progressClassName="bg-white"
      />
    </header>
  );
};

export default ProfileHeader;
