"use client";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useTutorial } from "@/store/hooks/useTutorials";
import { TutorialGuard } from "../features/tutorials/guard/tutorialsGuard";
import { TutorialProgress } from "../features/tutorials/TutorialsProgress";

interface FreelancerLayoutProps {
  children: React.ReactNode;
}

import Image from "next/image";

const FreelancerLayout: React.FC<FreelancerLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  // const { currentStep, isActive, setTutorialStep } = useTutorial();

  const tabs = [
    {
      label: "BOOKINGS",
      path: "/bookings",
      icon: "/CalendarStar.svg",
      disabled: false,
    },
    {
      label: "CATALOG",
      path: ["/catalog/services", "/catalog/availability", "/catalog/location"],
      icon: "/ListStar.svg",
      disabled: false,
    },
    {
      label: "WALLET",
      path: "/wallet",
      icon: "/Cardholder.svg",
      disabled: false,
    },
    {
      label: "PROFILE",
      path: ["/profile/information", "/profile/photos", "/profile/contact"],
      icon: "/IdentificationBadge.svg",
      disabled: false,
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center overflow-y-scroll hide-scrollbar main-wrapper">
      <div className="w-full md:max-w-[393px] shadow-2xl h-screen text-gray-700 dark:text-white z-100 px-4">
        <div className="h-full flex flex-col">
          <div className="flex-1 flex flex-col relative">
            {/* <TutorialProgress /> - Deprecated, using non-restrictive flow now */}
            {/* <TutorialManager /> */}
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex-1 overflow-y-auto hide-scrollbar">
                {children}
              </div>
              {/* Bottom Navigation */}
              <div className="border-t pt-3 pb-4 bg-black">
                <div className="flex items-center justify-around">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isDisabled = tab.disabled;
                    const paths = Array.isArray(tab.path)
                      ? tab.path
                      : [tab.path];
                    const isActive = paths.includes(pathname);
                    return (
                      <button
                        key={paths[0]}
                        disabled={isDisabled}
                        onClick={() => !isDisabled && router.push(paths[0])}
                        className={`flex relative opacity-30 w-1/4 flex-col items-center gap-1 transition-all ${
                          isDisabled
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer hover:text-purple-400"
                        }
                      ${isActive ? "opacity-100 active-menu " : ""}
                      
                      `}
                      >
                        <Image
                          src={tab.icon}
                          alt={tab.label}
                          width={24}
                          height={24}
                          className={`z-10 relative ${
                            isActive
                              ? "opacity-100"
                              : isDisabled
                              ? "opacity-40"
                              : "opacity-60"
                          }`}
                        />
                        <span
                          className={`text-[10px] z-10 relative font-medium ${
                            isActive
                              ? "text-white"
                              : isDisabled
                              ? "text-gray-600"
                              : "text-gray-400"
                          }`}
                        >
                          {tab.label}
                        </span>
                        <span className=" inline-block absolute w-full h-full bg-[rgb(90_0_113)] blur-[26px] top-5 z-0"></span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerLayout;

