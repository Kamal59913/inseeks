"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@repo/ui/index";
import AllTab from "./Tabs/AllTab";
import CommunitiesTab from "./Tabs/CommunitiesTab";
import FeedsTab from "./Tabs/FeedsTab";
import VideoShortsTab from "./Tabs/VideoShortsTab";

interface HomeProps {
  activeTab?: string;
  activeSubTab?: string;
}

const Home = ({ activeTab = "Explore", activeSubTab = "All" }: HomeProps) => {
  const tabs = ["Explore", "Communities", "Feeds", "Video Only"];

  const renderContent = () => {
    switch (activeTab) {
      case "Explore":
        return <AllTab activeSubTab={activeSubTab} />;
      case "Communities":
        return <CommunitiesTab isMinimal={true} activeSubTab={activeSubTab} />;
      case "Feeds":
        return <FeedsTab isMinimal={true} activeSubTab={activeSubTab} />;
      case "Video Only":
        return <VideoShortsTab isMinimal={true} activeSubTab={activeSubTab} />;
      default:
        return <AllTab activeSubTab={activeSubTab} />;
    }
  };

  return (
    <div className="px-6 pb-6">
      <div className="flex space-x-2 mb-2.5 mx-auto bg-gray-100 rounded-full max-w-[500px]">
        {tabs.map((tab) => {
          const href =
            tab === "Explore"
              ? "/home"
              : tab === "Communities"
                ? "/home/communities"
                : tab === "Feeds"
                  ? "/home/feeds"
                  : tab === "Video Only"
                    ? "/home/short-videos"
                    : "/home";
          return (
            <Link className="grow" key={tab} href={href}>
              <Button
                variant={activeTab === tab ? "default" : "ghost"}
                className={`rounded-full px-7 w-full ${
                  activeTab === tab
                    ? "bg-primary hover:bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab}
              </Button>
            </Link>
          );
        })}
      </div>

      {/* Content Area */}
      {renderContent()}
    </div>
  );
};

export default Home;
