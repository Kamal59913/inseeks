"use client";
import React from "react";
import CommunitiesTab from "@/components/Home/Tabs/CommunitiesTab";
import { ScrollArea } from "@repo/ui/index";

export default function CommunitiesPage() {
  return (
    <div className="flex-1">
      <ScrollArea className="h-screen">
        <div className="max-w-3xl mx-auto px-6 pb-6 pt-6 bg-white min-h-screen">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Communities</h1>
          <CommunitiesTab isMinimal={false} />
        </div>
      </ScrollArea>
    </div>
  );
}
