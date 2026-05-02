"use client";
import React from "react";
import { useParams } from "next/navigation";
import FeedView from "@/components/Features/FeedView";

const FeedPage = () => {
  const params = useParams();
  const id = params.id as string;

  return <FeedView id={id} />;
};

export default FeedPage;
