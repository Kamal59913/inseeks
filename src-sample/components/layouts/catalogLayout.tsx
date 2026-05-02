"use client";
import { usePathname } from "next/navigation";
import Button from "../ui/button/Button";
import { useGlobalStates } from "@/store/hooks/useGlobalStates";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useModalData } from "@/store/hooks/useModal";
import {
  resetServiceSaveTrigger,
  triggerServiceSave,
  triggerLocationSave,
  resetLocationSaveTrigger,
  triggerAvailabilitySave,
  resetAvailabilitySaveTrigger,
} from "@/store/slices/executionSlice";
import { useTutorial } from "@/store/hooks/useTutorials";
import { NonRestrictiveTutorialPopup } from "../features/tutorials/NonRestrictiveTutorialPopup";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";
import { TabBar, type TabItem } from "../ui/tabs/TabBar";

interface CatalogLayoutProps {
  children: React.ReactNode;
}

const TABS: readonly TabItem[] = [
  { label: "SERVICES", path: "/catalog/services", disabled: false },
  { label: "AVAILABILITY", path: "/catalog/availability", disabled: false },
  { label: "LOCATION", path: "/catalog/location", disabled: false },
] as const;

const CatalogLayout: React.FC<CatalogLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const { isButtonLoading } = useGlobalStates();
  const { open, close } = useModalData();
  const { isActive } = useTutorial();
  const dispatch = useAppDispatch();
  const isServiceSaveDisabled = useAppSelector(
    (state) => state.executionStates.isServiceSaveDisabled,
  );

  const isServicesPage = pathname === "/catalog/services";
  const isLocationPage = pathname === "/catalog/location";
  const isAvailabilityPage = pathname === "/catalog/availability";

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
    } else if (isLocationPage) {
      open("submit-confirmation", {
        title: "Are you sure you want to save this location",
        description: "Your location will be updated.",
        action: async () => {
          dispatch(triggerLocationSave());
          setTimeout(() => dispatch(resetLocationSaveTrigger()), 100);
          close();
        },
      });
      return;
    } else if (isAvailabilityPage) {
      open("submit-confirmation", {
        title: "You can update your availability at any time",
        description: "Your availability slots will be updated.",
        action: async () => {
          dispatch(triggerAvailabilitySave());
          setTimeout(() => dispatch(resetAvailabilitySaveTrigger()), 100);
          close();
        },
      });
      return;
    }
  };

  return (
    <>
      <div className="flex items-center justify-between py-6">
        <h1 className="text-[28px] font-bold text-white">Catalog</h1>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={handleSaveClick}
            size="sm"
            disabled={
              (isServicesPage && isServiceSaveDisabled) ||
              isButtonLoading("update-profile")
            }
            loadingState={isButtonLoading("update-profile")}
            className="rounded-[25px] bg-white shadow-[inset_0_-4px_4px_0_rgba(3,2,2,0.25)] backdrop-blur-[94px] px-[22px] text-[14px] font-medium"
          >
            Save Changes
          </Button>
        </div>
      </div>

      <TabBar tabs={TABS} onNavigate={handleTabNavigation} />

      <div
        className={`flex-1 overflow-y-auto hide-scrollbar pb-4 space-y-6 ${isActive ? "" : ""}`}
      >
        {children}
      </div>
      <NonRestrictiveTutorialPopup />
    </>
  );
};

export default CatalogLayout;

