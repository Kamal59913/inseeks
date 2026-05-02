import React from "react";
import { ProfileFeed } from "@/components/Profile/ProfileFeed";

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;
  return <ProfileFeed username={username} activeTab="posts" />;
};

export default Page;
