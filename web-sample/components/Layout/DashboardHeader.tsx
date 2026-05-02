"use client";
import React, { useState, useCallback } from "react";
import { Button, Sheet, SheetContent, SheetTrigger } from "@repo/ui/index";
import { NotificationSidebar } from "../Home/NotificationSidebar";
import { NotificationOutline } from "@/components/icons";
import { UserSearch } from "../Features/UserSearch";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useGetUnseenCount } from "@/hooks/notificationServices/useGetUnseenCount";
import { useRouter } from "next/navigation";

export const DashboardHeader = () => {
  const router = useRouter();
  const [openNotification, setOpenNotification] = useState(false);

  // Initialize unseen count sync
  useGetUnseenCount();
  const unseenCount = useNotificationStore((state) => state.unseenCount);

  const handleSearch = useCallback((query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  }, [router]);

  return (
    <div className="rounded-b-[20px] -mx-[20px] px-6 py-4 flex items-center justify-between">
      {/* Search Bar */}
      <div className="relative w-full mx-auto max-w-2xl">
        <UserSearch
          variant="header"
          onSearch={handleSearch}
          placeholder="Search here..."
        />
      </div>

      {/* Notification */}
      <div className="w-[10%] text-end">
        <Sheet open={openNotification} onOpenChange={setOpenNotification}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="relative group">
              <NotificationOutline className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors" />
              {unseenCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 text-rose-500 text-[10px] rounded-full flex items-center justify-center font-bold">
                  {unseenCount > 99 ? "99+" : unseenCount}
                </span>
              )}
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-[400px] p-0 bg-white">
            <NotificationSidebar />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
