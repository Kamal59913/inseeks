"use client";

import React from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/index";
import { Copy } from "lucide-react";
import SvgShare from "../icons/Share";

interface ShareDropdownProps {
  onCopyLink: (e: React.MouseEvent) => void;
  trigger?: React.ReactNode;
  align?: "start" | "center" | "end";
  className?: string;
}

export const ShareDropdown = ({
  onCopyLink,
  trigger,
  align = "end",
  className = "",
}: ShareDropdownProps) => (
  <DropdownMenu modal={false}>
    <DropdownMenuTrigger asChild>
      {trigger || (
        <Button
          variant="postAction"
          size="post-icons"
          className={className}
        >
          <SvgShare stroke="currentColor" strokeWidth={0.4} />
        </Button>
      )}
    </DropdownMenuTrigger>
    <DropdownMenuContent align={align} className="w-48 bg-white border-gray-100">
      <DropdownMenuItem
        onClick={onCopyLink}
        className="cursor-pointer flex items-center gap-2 text-gray-700 font-medium"
      >
        <Copy className="w-4 h-4" />
        <span>Copy link</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
