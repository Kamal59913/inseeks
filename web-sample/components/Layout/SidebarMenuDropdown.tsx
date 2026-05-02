"use client";

import React from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  cn,
} from "@repo/ui/index";

import {
  SvgThreeLineMenu,
} from "@/components/icons";
import {
  CircleUserRound,
  MessageSquare,
  Heart,
  Repeat2,
  Bookmark,
  Users,
  Rss,
  Settings,
  LogOut,
} from "lucide-react";

interface SidebarMenuDropdownProps {
  username?: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

export const SidebarMenuDropdown = ({
  username,
  onNavigate,
  onLogout,
}: SidebarMenuDropdownProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenu modal={false} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "transition-colors hover:bg-transparent",
            open 
              ? "text-primary hover:text-primary" 
              : "text-[#9CA3AF] hover:text-gray-600"
          )}
        >
          <SvgThreeLineMenu className="w-6 h-6" />
        </Button>
      </DropdownMenuTrigger>
    <DropdownMenuContent
      side="right"
      align="end"
      className="w-64 bg-white border-0 shadow-xl p-0 overflow-hidden text-gray-700"
    >
      <div className="p-1.5">
        <DropdownMenuItem
          onClick={() => username && onNavigate(`/u/${username}`)}
          className="cursor-pointer gap-3 py-2.5"
        >
          <CircleUserRound className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-sm">My Page</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onNavigate("/messages")}
          className="cursor-pointer gap-3 py-2.5"
        >
          <MessageSquare className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-sm">Message</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onNavigate("/home/liked")}
          className="cursor-pointer gap-3 py-2.5"
        >
          <Heart className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-sm">Liked</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => username && onNavigate(`/u/${username}/reposts`)}
          className="cursor-pointer gap-3 py-2.5"
        >
          <Repeat2 className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-sm">Reposted</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onNavigate("/home/saved")}
          className="cursor-pointer gap-3 py-2.5"
        >
          <Bookmark className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-sm">Saved</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onNavigate("/communities")}
          className="cursor-pointer gap-3 py-2.5"
        >
          <Users className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-sm">Communities</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onNavigate("/feeds")}
          className="cursor-pointer gap-3 py-2.5"
        >
          <Rss className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-sm">Feeds</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onNavigate("/settings")}
          className="cursor-pointer gap-3 py-2.5"
        >
          <Settings className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-sm">Manage Account</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1.5 bg-gray-100" />

        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer gap-3 py-2.5 text-red-600 focus:text-red-700 focus:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-medium text-sm">Logout</span>
        </DropdownMenuItem>
      </div>
    </DropdownMenuContent>
    </DropdownMenu>
  );
};
