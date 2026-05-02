"use client";
import React from "react";


import {
  Button
} from "@repo/ui/index";



export const SidebarItem = ({ icon: Icon, label, onClick }: any) => (
  <Button
    variant="outline"
    className="w-full text-sm justify-start gap-3 font-medium rounded-sm shadow-none bg-[#FAF5FF] border-[#E9D5FF] text-primary"
    onClick={onClick}
  >
    <Icon className="w-3.5 h-3.5" />
    {label}
  </Button>
);
