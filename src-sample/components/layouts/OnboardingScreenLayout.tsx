"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { NavigationHeaderStepOne } from "../features/navigationHeaderStepOne";
import { NavigationHeaderStepTwo } from "../features/navigationHeaderStepTwo";
import { NavigationHeaderCustomer } from "../features/navigationHeaderCustomer";

import { ShowIf } from "@/lib/utilities/showIf";

interface OnboardingScreenLayoutProps {
  children: React.ReactNode;
}

const OnboardingScreenLayout: React.FC<OnboardingScreenLayoutProps> = ({
  children,
}) => {
  const pathname = usePathname();

  const renderHeader = () => {
    if (
      pathname.includes("/get-started-customer") ||
      pathname.includes("/customer")
    ) {
      return <NavigationHeaderCustomer className="mt-14" />;
    }
    if (pathname.includes("/signup/freelancer-complete-profile")) {
      return <NavigationHeaderStepTwo className="mt-14" />;
    }
    return <NavigationHeaderStepOne className="mt-14" />;
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-y-scroll hide-scrollbar main-wrapper">
      <div
        className={`w-full md:max-w-[393px] shadow-2xl h-screen text-gray-700 dark:text-white z-100 px-4`}
      >
        <div className="h-full flex flex-col">
          {renderHeader()}
          <div className={`flex-1 flex flex-col relative `}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreenLayout;

