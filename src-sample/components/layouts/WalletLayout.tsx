"use client";

import { useTutorial } from "@/store/hooks/useTutorials";
import { NonRestrictiveTutorialPopup } from "../features/tutorials/NonRestrictiveTutorialPopup";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

const WalletLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
    const { isActive } = useTutorial();
  
  return (
    <div className="flex items-center justify-between py-6">
      <div className={`flex-1 overflow-y-auto hide-scrollbar pb-4 space-y-6 ${isActive ? "" : ""}`}>
        {children}
      </div>
      <NonRestrictiveTutorialPopup />
    </div>
  );
};

export default WalletLayout;

