"use client";

import React from "react";
import { useLoaderStore } from "@/store/useLoaderStore";

const GlobalLoader = () => {
  const { loader } = useLoaderStore();

  if (!loader) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    </div>
  );
};

export default GlobalLoader;
