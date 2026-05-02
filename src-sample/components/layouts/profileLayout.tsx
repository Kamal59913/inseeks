"use client";
import { ToastService } from "@/lib/utilities/toastService";
import { AxiosError } from "axios";
import { useUserData } from "@/store/hooks/useUserData";
import { usePathname, useRouter } from "next/navigation";
import Button from "../ui/button/Button";
import { ProfileFormProvider } from "@/context/ProfileFormContext";
import { useEffect, useRef, useState } from "react";
import profileService from "@/services/profileService";
import { useGlobalStates } from "@/store/hooks/useGlobalStates";
import { useModalData } from "@/store/hooks/useModal";
import { useProfileFormInformation } from "../profile/hook/profile-form-Information.hook";
import { useProfileFormContacts } from "../profile/hook/profile-form-contacts.hook";
import ReferFreelancersSheet from "../profile/information/ReferFreelancersSheet";
import {
  triggerPhotoSave,
  resetPhotoSaveTrigger,
  setContactSaveStatus,
  resetContactSaveTrigger,
  setTutorialProcessing,
} from "@/store/slices/executionSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useTutorial } from "@/store/hooks/useTutorials";
import { ShowIf } from "@/lib/utilities/showIf";
import { NonRestrictiveTutorialPopup } from "../features/tutorials/NonRestrictiveTutorialPopup";
import ReferClientsSheet from "../profile/information/ReferClientsSheet";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";
import { TabBar, type TabItem } from "../ui/tabs/TabBar";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

const TABS: readonly TabItem[] = [
  { label: "INFORMATION", path: "/profile/information", disabled: false },
  { label: "PHOTOS", path: "/profile/photos", disabled: false },
  { label: "CONTACT", path: "/profile/contact", disabled: false },
] as const;

const PAGE_FIELD_MAP = {
  "/profile/information": ["firstName", "lastName", "profileUrl", "bio"],
  "/profile/contact": [
    "whatsapp",
    "email",
    "text",
    "isWhatsApp",
    "isEmail",
    "isText",
  ],
} as const;

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { userData } = useUserData();
  const { isButtonLoading } = useGlobalStates();
  const { open, close } = useModalData();
  const dispatch = useAppDispatch();
  const { isActive } = useTutorial();
  const [isReferralOpen, setIsReferralOpen] = useState({
    client: false,
    freelancer: false,
  });
  const contactSaveTrigger = useAppSelector(
    (state) => state.executionStates.contactSaveTrigger,
  );

  const hasRegisteredRef = useRef(false);

  const infoMethods = useProfileFormInformation(userData);
  const contactsMethods = useProfileFormContacts(userData);

  const formMethods =
    pathname === "/profile/contact" ? contactsMethods : infoMethods;

  const isPhotosPage = pathname === "/profile/photos";
  const isInformationPage = pathname === "/profile/information";

  // Use the shared unsaved changes guard (popstate disabled — was commented out in original)
  const { currentFormRef, handleTabNavigation } = useUnsavedChangesGuard({
    enablePopstateGuard: false,
  });

  const handleFormSubmit = async (formData: any) => {
    try {
      const response = await profileService.updateProfile(formData);
      if (response.status === 201 || response.status === 200) {
        ToastService.success(
          response.data.message || "Profile updated successfully",
        );
        if (currentFormRef.current) {
          currentFormRef.current.reset(formData, { keepValues: true });
        }
        dispatch(setContactSaveStatus("success"));
      } else {
        ToastService.error(response.data.message || "Failed to update profile");
        dispatch(setContactSaveStatus("error"));
        dispatch(setTutorialProcessing(false));
      }
    } catch (error: unknown) {
      console.error("Form submission error:", error);
      dispatch(setTutorialProcessing(false)); // ENSURE RESET
      const status = error instanceof AxiosError ? error.response?.status : undefined;
      if (status !== 401) {
        ToastService.error("An error occurred while updating profile");
        dispatch(setContactSaveStatus("error"));
      }
    } finally {
      dispatch(setTutorialProcessing(false));
    }
  };

  const handleSaveClick = async () => {
    if (isPhotosPage) {
      open("submit-confirmation", {
        title: "Are you sure you want to save this order",
        description: "Your orderings will be updated.",
        action: async () => {
          dispatch(triggerPhotoSave());
          setTimeout(() => dispatch(resetPhotoSaveTrigger()), 100);
          close();
        },
      });
      return;
    }

    const isValid = await formMethods.trigger();
    await handleContactSave(isValid);
  };

  const handleSilentSave = async () => {
    const isValid = await formMethods.trigger();
    if (isValid) {
      dispatch(setTutorialProcessing(true));
      const formData = formMethods.getValues();
      await handleFormSubmit(formData);
      setTimeout(() => dispatch(resetContactSaveTrigger()), 100);
    } else {
      dispatch(setContactSaveStatus("error"));
      dispatch(setTutorialProcessing(false));
      setTimeout(() => dispatch(resetContactSaveTrigger()), 100);
    }
  };

  const handleContactSave = async (isValid: boolean) => {
    if (!isValid) {
      const errors = formMethods.formState.errors;
      const currentPageFields =
        PAGE_FIELD_MAP[pathname as keyof typeof PAGE_FIELD_MAP] || [];

      // Check if current page has errors
      const hasCurrentPageErrors = currentPageFields.some(
        (field) => errors[field as keyof typeof errors],
      );

      if (hasCurrentPageErrors) {
        dispatch(setContactSaveStatus("error"));
        return;
      }

      // Find page with errors and navigate to it
      const pageWithErrors = Object.entries(PAGE_FIELD_MAP).find(
        ([path, fields]) => {
          if (path === pathname) return false;
          return fields.some((field) => errors[field as keyof typeof errors]);
        },
      );

      if (pageWithErrors) {
        ToastService.error("Please fix errors on other pages");
        router.push(pageWithErrors[0]);
        dispatch(setContactSaveStatus("error"));
        return;
      }
    }

    // Show confirmation modal
    open("submit-confirmation", {
      title: "Are you sure you want to save these changes?",
      description: "Your profile information will be updated.",
      action: async () => {
        dispatch(setTutorialProcessing(true));
        const formData = formMethods.getValues();
        await handleFormSubmit(formData);
        close();
      },
      cancel: () => {
        dispatch(setTutorialProcessing(false));
        dispatch(setContactSaveStatus("error"));
      },
    });
  };

  // Watch for contact save trigger
  useEffect(() => {
    if (contactSaveTrigger > 0 && pathname === "/profile/contact") {
      if (isActive) {
        handleSilentSave();
      } else {
        formMethods.trigger().then((isValid) => {
          handleContactSave(isValid);
        });
      }
    }
  }, [contactSaveTrigger, pathname, isActive]);

  // Register form methods
  const onFormMethodsReady = (methods: any) => {
    currentFormRef.current = methods;
  };

  // Register form methods when ready
  useEffect(() => {
    if (
      !hasRegisteredRef.current &&
      typeof formMethods?.formState.isDirty !== "undefined"
    ) {
      hasRegisteredRef.current = true;
      onFormMethodsReady(formMethods);
    }
  }, [formMethods, formMethods?.formState.isDirty]);

  useEffect(() => {
    close();
  }, [pathname]);

  return (
    <ProfileFormProvider value={{ formMethods }}>
      <div className="flex items-center justify-between pt-6 mb-4 pb-4 border-b border-bg-white/20">
        <h1 className="text-[28px] font-bold text-white">Profile</h1>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={handleSaveClick}
            size="sm"
            loadingState={isButtonLoading("update-profile")}
            className="rounded-[25px] bg-white shadow-[inset_0_-4px_4px_0_rgba(3,2,2,0.25)] backdrop-blur-[94px] px-[22px] text-[14px] font-medium"
          >
            Save Changes
          </Button>
        </div>
      </div>
      <ShowIf condition={isInformationPage!!}>
        <div className="mb-6 flex gap-3">
          <button
            type="button"
            onClick={() =>
              setIsReferralOpen((prev) => ({ ...prev, client: true }))
            }
            className="flex-1 h-[54px] bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.07)_100%)] shadow-[inset_0_4px_4px_0_rgba(255,255,255,0.25)] backdrop-blur-[82px] text-white rounded-[14px] flex items-center justify-center gap-3 transition-all border border-white/10 text-[14px] font-medium cursor-pointer active:scale-[0.98]"
          >
            <img src={"/gift.svg"} className="w-6 h-6" />
            Refer Clients
          </button>
          <button
            type="button"
            onClick={() =>
              setIsReferralOpen((prev) => ({ ...prev, freelancer: true }))
            }
            className="flex-1 h-[54px] bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.07)_100%)] shadow-[inset_0_4px_4px_0_rgba(255,255,255,0.25)] backdrop-blur-[82px] text-white rounded-[14px] flex items-center justify-center gap-3 transition-all border border-white/10 text-[14px] font-medium cursor-pointer active:scale-[0.98]"
          >
            <img src={"/gift.svg"} className="w-6 h-6" />
            Refer Freelancers
          </button>
        </div>
      </ShowIf>

      <TabBar tabs={TABS} onNavigate={handleTabNavigation} className="mb-2" />

      <ShowIf condition={isPhotosPage!!}>
        <p className="text-white text-[14px] font-normal mb-4">
          The first picture will be used as your cover picture.{" "}
        </p>
      </ShowIf>
      <form
        onSubmit={formMethods.handleSubmit(handleFormSubmit)}
        className={`flex-1 pb-4 space-y-6 ${isActive ? "" : ""}`}
      >
        {children}
      </form>
      <ReferClientsSheet
        isOpen={isReferralOpen.client}
        onClose={() =>
          setIsReferralOpen((prev) => ({ ...prev, client: false }))
        }
      />
      <ReferFreelancersSheet
        isOpen={isReferralOpen.freelancer}
        onClose={() =>
          setIsReferralOpen((prev) => ({ ...prev, freelancer: false }))
        }
      />
      <NonRestrictiveTutorialPopup />
    </ProfileFormProvider>
  );
};

export default ProfileLayout;

