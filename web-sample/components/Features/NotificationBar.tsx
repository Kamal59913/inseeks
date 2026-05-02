"use client";
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@repo/ui/index";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  ScrollArea,
} from "@repo/ui/index";

const NotificationItem = ({ text, time }: any) => (
  <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-100 cursor-pointer">
    <Avatar className="w-10 h-10">
      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=notify" />
      <AvatarFallback>N</AvatarFallback>
    </Avatar>
    <div className="flex-1">
      <p className="text-sm text-gray-800">{text}</p>
      <span className="text-xs text-gray-500">{time}</span>
    </div>
  </div>
);


export const NotificationSidebar = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Notifications</h2>
      </div>
      <Tabs defaultValue="all" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-3 m-4 bg-gray-100 rounded-full">
          <TabsTrigger value="all" className="rounded-full">All</TabsTrigger>
          <TabsTrigger value="mentions" className="rounded-full">Mentions</TabsTrigger>
          <TabsTrigger value="interactions" className="rounded-full">Interactions</TabsTrigger>
        </TabsList>
        <ScrollArea className="flex-1 px-4 pb-6">
          <TabsContent value="all" className="space-y-4 mt-2">
            <NotificationItem text="Jane Cooper liked your post" time="2h ago" />
            <NotificationItem text="Alex mentioned you in a comment" time="5h ago" />
            <NotificationItem text="You have a new follower" time="1d ago" />
          </TabsContent>
          <TabsContent value="mentions" className="space-y-4 mt-2">
            <NotificationItem text="Alex mentioned you in a post" time="5h ago" />
            <NotificationItem text="Sarah tagged you" time="1d ago" />
          </TabsContent>
          <TabsContent value="interactions" className="space-y-4 mt-2">
            <NotificationItem text="John liked your post" time="30m ago" />
            <NotificationItem text="Emily reposted your post" time="3h ago" />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};
  
