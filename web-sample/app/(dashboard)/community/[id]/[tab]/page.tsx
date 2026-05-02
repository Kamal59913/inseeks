import React from "react";
import CommunityView from "@/components/Features/CommunityView";

const Page = async ({ params }: { params: Promise<{ id: string; tab: string }> }) => {
  const { id, tab } = await params;
  return <CommunityView id={id} activeTab={tab} />;
};

export default Page;
