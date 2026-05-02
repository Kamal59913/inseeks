"use client";
import React from "react";
import { useParams } from "next/navigation";
import CommunityView from "@/components/Features/CommunityView";

const CommunityPage = () => {
  const params = useParams();
  const id = params.id as string;

  return <CommunityView id={id} />;
};

export default CommunityPage;
