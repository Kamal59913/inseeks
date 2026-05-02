import React from "react";
import { ProfileFeed } from "@/components/Profile/ProfileFeed";

const Page = async ({ params }: { params: Promise<{ username: string; tab: string }> }) => {
  const { username, tab } = await params;
  return <ProfileFeed username={username} activeTab={tab} />;
};

export default Page;
