"use client";
import { Eye } from "lucide-react";
import { useProfileFormContext } from "@/context/ProfileFormContext";
import Label from "@/components/ui/form/label";
import Input from "@/components/ui/form/Input";
import TextArea from "@/components/ui/form/TextArea";
import { copyToClipboard } from "@/lib/utilities/copyToClipboard";
import Button from "@/components/ui/button/Button";
import { useGlobalStates } from "@/store/hooks/useGlobalStates";
import authService from "@/services/authService";
import { ToastService } from "@/lib/utilities/toastService";
import { useUserData } from "@/store/hooks/useUserData";
import { useModalData } from "@/store/hooks/useModal";
import { queryClient } from "@/lib/utilities/queryClient";
import { clearAuthToken } from "@/lib/utilities/tokenManagement";
import { useRouter } from "next/navigation";
import { getFullProfileUrl } from "@/lib/utilities/profileUtils";
import { GoShare } from "react-icons/go";
import UrlPreview from "./UrlPreview";

const InformationPage = () => {
  const { formMethods } = useProfileFormContext();
  const { isButtonLoading } = useGlobalStates();
  const { userData, setUserData, setAuthenticated } = useUserData();
  const { open, close } = useModalData();
  const router = useRouter();


    const handleChangePassword = async () => {
      const data = {
        email: userData?.user?.email ?? "",
      };
      const response = await authService?.changePassword(data);
  
      if (response.status === 201) {
        open("email-sent-confirmation", {
          title: "Password update email sent",
          description: "Please check your inbox for the password update link.",
        });
      } else {
        if (response?.status !== 401) {
          ToastService.error(
            response.data.message || "Password Reset Mail Sent Failed",
            "password-reset-fail"
          );
        }
      }
    };

      const handleSignOut = () => {
        open("log-out", {
          title: "Are you sure you want to logout?",
          action: logout,
        });
      };
    
      const logout = async () => {
        try {
          queryClient.clear();
          clearAuthToken();
          setUserData(null);
          setAuthenticated(false);
          close();
          ToastService.success("Logged Out Successfully");
          router.push("/login/freelancer");
        } catch (error) {
          console.error("Sign out error:", error);
          ToastService.error("Sign out failed");
        }
      };
    

  return (
    <div
      className="overflow-y-auto max-h-[66vh] [&::-webkit-scrollbar-track]:rounded-full
    [&::-webkit-scrollbar]:w-1
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 pr-2"
    >
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <Label>First name</Label>
          <Input
            type="text"
            register={formMethods?.register}
            registerOptions={"firstName"}
            errors={formMethods?.formState?.errors}
            placeholder="First name"
            autoFocus={true}
            maxLength={51}
          />
        </div>
        <div>
          <Label>Last name</Label>
          <Input
            type="text"
            register={formMethods?.register}
            registerOptions={"lastName"}
            errors={formMethods?.formState?.errors}
            placeholder="Last name"
            maxLength={51}
          />
        </div>
      </div>

      {/* Public Profile URL */}
      <div className="mb-6">
        <Label>Public profile URL</Label>
        <div className="flex gap-2">
          <UrlPreview urlPath={formMethods?.getValues("profileUrl")} />
          
          <Button
            variant="glass"
            size="none"
            borderRadius="rounded-[12px]"
            className="w-10 h-10 flex items-center justify-center p-0"
            onClick={(e) => {
              e.preventDefault();
              window.open(getFullProfileUrl(formMethods?.getValues("profileUrl")), "_blank");
            }}
          >
            <Eye className="w-5 h-5 text-gray-400" />
          </Button>
          <Button
            variant="glass"
            size="none"
            borderRadius="rounded-[12px]"
            className="px-4 h-10 flex items-center justify-center gap-2 text-sm"
            onClick={(e) => {
              e.preventDefault();
              copyToClipboard(
                getFullProfileUrl(formMethods?.getValues("profileUrl")),
                "The profile link is copied to clipboard"
              );
            }}
          >
            Share
            <GoShare className="w-5 h-5 text-gray-400" />
          </Button>
        </div>
      </div>
<hr className="border-bg-white/40 mt-8 mb-6" />
      <div>
        <Label>Your bio</Label>
        <TextArea
          register={formMethods?.register}
          registerOptions={"bio"}
          errors={formMethods?.formState?.errors}
          placeholder="Bio"
          rows={10}
          maxLength={501}
        />
      </div>
 
        {/* Sticky buttons at bottom */}
      <div className="flex flex-col gap-3 pt-4 mt-4">
        <Button
          type="button"
          onClick={handleChangePassword}
          className="w-full h-[36px] text-[14px]"
          size="none"
          variant="dark"
          loadingState={isButtonLoading("change-password")}
        >
          Change Password
        </Button>
        <Button
          type="button"
          onClick={handleSignOut}
          className="w-full h-[36px] text-[14px]"
          variant="dark2"
          size="none"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default InformationPage;

