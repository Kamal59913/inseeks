"use client";
import React from "react";

export default function FullScreenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-white dark:bg-black">
      <div className="hidden lg:flex w-1/2 bg-black relative">
        <div className="absolute inset-0 bg-gradient-to from-black/70 to-transparent z-10"></div>
        <img
          src="/layout_img_3.jpg"
          alt="empera background"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="relative z-20 w-full h-full flex flex-col px-8">
          <div className="flex-5 flex flex-col justify-center items-center text-center">
              <img src="/main_logo.svg" alt="empera prfile image" />
            <p className="text-lg font-light text-gray-50 mt-2">
              Beauty in a hurry, not a rush.
            </p>
          </div>
          <div className="flex-5"></div>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 min-h-screen lg:h-screen bg-linear-to-b from-[#1B001F] to-[#000000] text-white relative overflow-y-auto py-8">
        <div className="w-full max-w-md px-6">{children}</div>
      </div>
    </div>
  );
}

