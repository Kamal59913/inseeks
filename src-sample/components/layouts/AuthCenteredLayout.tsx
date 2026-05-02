"use client";
import React from "react";

interface AuthCenteredLayoutProps {
  children: React.ReactNode;
}

const AuthCenteredLayout: React.FC<AuthCenteredLayoutProps> = ({
  children,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center overflow-y-scroll hide-scrollbar main-wrapper">
      <div
        className={`w-full md:max-w-[393px] shadow-2xl h-screen text-gray-700 dark:text-white z-100`}
      >
        <div className="h-full flex flex-col">
          <div className={`flex-1 flex flex-col relative px-4`}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthCenteredLayout;

