"use client";
import { usePathname } from "next/navigation";
import Button from "../ui/button/Button";
import { useState } from "react";
import { useGlobalStates } from "@/store/hooks/useGlobalStates";
import { useAppDispatch } from "@/store/hooks";
import {
  resetServiceSaveTrigger,
  triggerServiceSave,
} from "@/store/slices/executionSlice";
import { useModalData } from "@/store/hooks/useModal";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";
import { TabBar, type TabItem } from "../ui/tabs/TabBar";
import ReferClientsSheet from "../profile/information/ReferClientsSheet";
import { LinkOpener } from "@/lib/utilities/socialLinks";

interface BookingsLayoutProps {
  children: React.ReactNode;
}

const TABS: readonly TabItem[] = [
  { label: "My Bookings", path: "/bookings", disabled: false },
] as const;

const BookingsLayout: React.FC<BookingsLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const { isButtonLoading } = useGlobalStates();
  const { open, close } = useModalData();
  const dispatch = useAppDispatch();
  const [isReferralOpen, setIsReferralOpen] = useState(false);

  const isServicesPage = pathname === "/catalog/services";

  const { handleTabNavigation } = useUnsavedChangesGuard();

  const handleSaveClick = async () => {
    if (isServicesPage) {
      open("submit-confirmation", {
        title: "Are you sure you want to save this order",
        description: "Your service orderings will be updated.",
        action: async () => {
          dispatch(triggerServiceSave());
          setTimeout(() => dispatch(resetServiceSaveTrigger()), 100);
          close();
        },
      });
      return;
    }
  };

  return (
    <>
      <div className="flex items-center justify-between pt-6 pb-4 border-b mb-3">
        <Button
          variant="glass"
          borderRadius="rounded-[16px]"
          className="text-[14px] font-medium active:scale-95 transition-all"
          onClick={() =>
            LinkOpener(
              process.env.NEXT_PUBLIC_FREELANCER_LANDING_SITE_HELP_PAGE!!,
            )
          }
          disabled={false}
          size="sm"
        >
          Help
        </Button>
        <img src={"/empera_text.svg"} />
        <Button
          type="button"
          onClick={() => setIsReferralOpen(true)}
          size="sm"
          variant="white"
          borderRadius="rounded-[25px]"
          loadingState={isButtonLoading("update-profile")}
          className="backdrop-blur-[94px] text-[14px] font-medium"
          disabled={false}
        >
          Refer
        </Button>
      </div>

      <TabBar tabs={TABS} onNavigate={handleTabNavigation} variant="heading" />

      <div className="flex-1 overflow-y-auto hide-scrollbar pb-4 space-y-6">
        {children}
      </div>
      <ReferClientsSheet
        isOpen={isReferralOpen}
        onClose={() => setIsReferralOpen(false)}
      />
    </>
  );
};

export default BookingsLayout;

