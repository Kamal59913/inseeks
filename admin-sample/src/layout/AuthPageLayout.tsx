import React from "react";
import { Link } from "react-router";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-black sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-black sm:p-0">
        {children}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-[#F3F0F5] dark:bg-white/5 lg:grid">
          <div className="relative flex items-center justify-center z-1">
            {/* <GridShape /> */}
            <div className="flex flex-col items-center max-w-xs">
              <Link to="/" className="block mb-4">
                <img
                  className="dark:hidden"
                  width={231}
                  height={48}
                  src="/images/logo/logo.svg"
                  alt="Logo"
                />
                <img
                  className="hidden dark:block" 
                  width={231}
                  height={48}
                  src="/images/logo/logo-dark.svg"
                  alt="Logo"
                />
                  <p className="mb-2 text-[28px] font-medium text-center text-gray-600 dark:text-white/90">
                  <span className="relative inline-block">
                    <span className="relative z-10">Admin</span>
                  </span>
                </p>
              </Link>
              {/* <p className="text-center text-gray-400 dark:text-white/60">
                Free and Open-Source Tailwind CSS Admin Dashboard Template
              </p> */}
            </div>
          </div>
        </div>
        {/* <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div> */}
      </div>
    </div>
  );
}
