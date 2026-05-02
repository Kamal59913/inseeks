"use client";
import React from "react";
import { Camera, ChevronLeft, User, Trash2 } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Form,
  FormField,
  FormItem,
  Field,
  FieldError,
  InputGroupInput,
  InputGroupTextarea,
  FieldGroup,
  DatePicker,
  Switch,
  Label,
} from "@repo/ui/index";
import { useRouter } from "next/navigation";
import { useEditProfileForm } from "./use-edit-profile-form.hook";
import { EditProfileValidationType } from "./edit-profile.validation";
import { useAuthStore } from "@/store/useAuthStore";
import { useGlobalStore } from "@/store/useGlobalStore";
import profileService from "@/lib/api/services/profileService";
import { ToastService } from "@/lib/utilities/toastService";
import { queryClient } from "@/lib/utilities/queryClient";
import { format } from "date-fns";
import { useState, useRef, useEffect } from "react";
import { useModalStore } from "@/store/useModalStore";

const DEFAULT_BANNER_IMAGE = "";
const DEFAULT_PROFILE_IMAGE = "";

const getFileNameForBlob = (baseName: string, blob: Blob) => {
  const extension = blob.type === "image/png" ? "png" : "jpg";
  return `${baseName}.${extension}`;
};

const syncUserProfileQueryCache = (username: string, freshUserData: any) => {
  queryClient.setQueryData(["user", username], (previous: any) => {
    if (previous?.data && typeof previous.data === "object") {
      return {
        ...previous,
        data: {
          ...previous.data,
          ...freshUserData,
        },
      };
    }

    if (previous && typeof previous === "object") {
      return {
        ...previous,
        ...freshUserData,
      };
    }

    return freshUserData;
  });
};

const EditProfile = () => {
  const router = useRouter();
  const { userData, fetchCurrentUser } = useAuthStore();
  const { buttonLoaders, startButtonLoading, stopButtonLoading } =
    useGlobalStore();
  const { openModal } = useModalStore();
  const form = useEditProfileForm(userData);

  const [profileImage, setProfileImage] = useState<{
    preview: string;
    blob: Blob | null;
  }>({
    preview: userData?.profile_photo_url || DEFAULT_PROFILE_IMAGE,
    blob: null,
  });
  const [isProfileImageRemoved, setIsProfileImageRemoved] = useState(false);
  const [bannerImage, setBannerImage] = useState<{
    preview: string;
    blob: Blob | null;
  }>({
    preview: userData?.banner_photo_url || DEFAULT_BANNER_IMAGE,
    blob: null,
  });
  const [isBannerImageRemoved, setIsBannerImageRemoved] = useState(false);

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 13);

  const profileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userData) {
      if (!profileImage.blob) {
        setProfileImage((prev) => ({
          ...prev,
          preview: userData.profile_photo_url || DEFAULT_PROFILE_IMAGE,
        }));
        setIsProfileImageRemoved(false);
      }
      if (!bannerImage.blob) {
        setBannerImage((prev) => ({
          ...prev,
          preview: userData.banner_photo_url || DEFAULT_BANNER_IMAGE,
        }));
        setIsBannerImageRemoved(false);
      }
    }
  }, [userData]);

  useEffect(() => {
    return () => {
      if (profileImage.blob && profileImage.preview.startsWith("blob:")) {
        URL.revokeObjectURL(profileImage.preview);
      }
      if (bannerImage.blob && bannerImage.preview.startsWith("blob:")) {
        URL.revokeObjectURL(bannerImage.preview);
      }
    };
  }, [profileImage, bannerImage]);

  const replaceImageState = (
    type: "profile" | "banner",
    nextImage: { preview: string; blob: Blob | null },
  ) => {
    if (type === "profile") {
      setProfileImage((prev) => {
        if (prev.blob && prev.preview.startsWith("blob:")) {
          URL.revokeObjectURL(prev.preview);
        }
        return nextImage;
      });
      return;
    }

    setBannerImage((prev) => {
      if (prev.blob && prev.preview.startsWith("blob:")) {
        URL.revokeObjectURL(prev.preview);
      }
      return nextImage;
    });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "banner",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        openModal("image-cropper", {
          image: reader.result as string,
          aspectRatio: type === "profile" ? 1 : 3,
          onCropComplete: (croppedBlob: Blob) => {
            const preview = URL.createObjectURL(croppedBlob);
            replaceImageState(type, { preview, blob: croppedBlob });
            if (type === "profile") {
              setIsProfileImageRemoved(false);
            } else {
              setIsBannerImageRemoved(false);
            }
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (type: "profile" | "banner") => {
    replaceImageState(type, {
      preview:
        type === "profile" ? DEFAULT_PROFILE_IMAGE : DEFAULT_BANNER_IMAGE,
      blob: null,
    });

    if (type === "profile") {
      setIsProfileImageRemoved(true);
    } else {
      setIsBannerImageRemoved(true);
    }

    if (type === "profile" && profileInputRef.current) {
      profileInputRef.current.value = "";
    }

    if (type === "banner" && bannerInputRef.current) {
      bannerInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: EditProfileValidationType) => {
    startButtonLoading("update-account");

    if (profileImage.blob || bannerImage.blob) {
      const formData = new FormData();
      if (profileImage.blob) {
        formData.append(
          "profile_photo",
          profileImage.blob,
          getFileNameForBlob("profile", profileImage.blob),
        );
      }
      if (bannerImage.blob) {
        formData.append(
          "banner_photo",
          bannerImage.blob,
          getFileNameForBlob("banner", bannerImage.blob),
        );
      }

      const uploadResponse: any =
        await profileService.uploadProfilePhotos(formData);

      if (uploadResponse?.status === true || uploadResponse?.status === 200) {
      } else {
        ToastService.error(
          uploadResponse?.message || "Failed to upload photos",
        );
        stopButtonLoading("update-account");
        return;
      }
    }

    const payload = {
      name: data.name,
      bio: data.bio,
      birthday: data.birthday ? format(data.birthday, "yyyy-MM-dd") : "",
      status: data.status,
      account_of: data.account_of,
      ...(isProfileImageRemoved ? { profile_photo_url: "" } : {}),
      ...(isBannerImageRemoved ? { banner_photo_url: "" } : {}),
    };

    const response: any = await profileService.updateAccountDetails(payload);

    if (response?.status === true || response?.status === 200) {
      ToastService.success("Profile updated successfully");
      setIsProfileImageRemoved(false);
      setIsBannerImageRemoved(false);
      const freshUserData = await fetchCurrentUser();

      if (freshUserData?.username) {
        syncUserProfileQueryCache(freshUserData.username, freshUserData);
        await queryClient.invalidateQueries({
          queryKey: ["user", freshUserData.username],
          refetchType: "active",
        });
      }
    } else {
      ToastService.error(
        response?.data?.message ||
          response?.message ||
          "Failed to update profile",
      );
    }
    stopButtonLoading("update-account");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-100">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="mr-2"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-semibold">Edit Profile</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 pb-6">
          <div className="">
            {/* ── Banner ── */}
            <div
              className="h-48 bg-gradient-to-r from-rose-400 via-pink-500 to-purple-500 relative overflow-hidden group cursor-pointer"
              onClick={() => bannerInputRef.current?.click()}
            >
              {bannerImage.preview && (
                <img
                  src={bannerImage.preview}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20 transition-all duration-200 group-hover:bg-black/80">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div
                    className="w-12 h-12 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20 transition-all duration-200 group-hover:bg-black/80"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage("banner");
                    }}
                  >
                    <Trash2 className="w-6 h-6" />
                  </div>
                </div>
              </div>
              <input
                type="file"
                ref={bannerInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "banner")}
              />
            </div>

            {/* ── Profile Avatar ── */}
            <div className="relative -mt-16 px-6">
              <div
                className="relative inline-block group cursor-pointer"
                onClick={() => profileInputRef.current?.click()}
              >
                <Avatar className="w-28 h-28 ring-4 ring-white border-1 border-gray-200 bg-white shadow-lg font-bold text-2xl">
                  <AvatarImage src={profileImage.preview} />
                  <AvatarFallback className="bg-gray-100 text-gray-400">
                    <User size={40} />
                  </AvatarFallback>
                </Avatar>

                {/* Dark overlay — purely visual, no clipping on children */}
                <div className="absolute inset-0 rounded-full bg-black/10 group-hover:bg-black/30 transition-all duration-200 pointer-events-none" />

                {/* Buttons — on the wrapper itself, not inside the rounded overlay */}
                <div 
className="absolute -bottom-3 left-1/2 -translate-x-1/2 ml-[22px] flex items-center gap-2 z-50"
                >
                  <div className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20 transition-all duration-200 group-hover:bg-black/80">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div
                    className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20 transition-all duration-200 group-hover:bg-black/80"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage("profile");
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </div>
                </div>

                <input
                  type="file"
                  ref={profileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "profile")}
                />
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="px-6 pt-4 pb-8 space-y-6">
            <FieldGroup className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-2">
                    <Label isRequired className="text-gray-700 font-medium text-sm">
                      Name
                    </Label>
                    <Field data-invalid={fieldState.invalid}>
                      <InputGroupInput
                        {...field}
                        placeholder="Enter your name"
                        className="bg-white hover:bg-white-50 shadow-none border-gray-200"
                        isSpaceAtStart={false}
                        maxLength={65}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="account_of"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm">
                      Account Of
                    </Label>
                    <Field data-invalid={fieldState.invalid}>
                      <InputGroupInput
                        {...field}
                        placeholder="Enter account of"
                        className="bg-white hover:bg-white-50 shadow-none border-gray-200"
                        isSpaceAtStart={false}
                        maxLength={101}
                        // disabled={true}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm">
                      Bio
                    </Label>
                    <Field data-invalid={fieldState.invalid}>
                      <InputGroupTextarea
                        {...field}
                        placeholder="Tell us about yourself"
                        className="min-h-[120px] bg-white border-gray-200 shadow-none"
                        allowEmptySpaces={true}
                        autoResize={true}
                        stretchable={true}
                        showEllipsis={false}
                        maxLength={1001}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthday"
                render={({ field: { value, onChange }, fieldState }) => (
                  <FormItem className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm">
                      Birthday
                    </Label>
                    <Field data-invalid={fieldState.invalid}>
                      <DatePicker
                        id="edit-profile-birthday"
                        defaultDate={value}
                        onChange={(selectedDates) => onChange(selectedDates[0])}
                        placeholder="Select birthday"
                        maxDate={maxDate}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field: { value, onChange }, fieldState }) => (
                  <FormItem className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm">
                      Status
                    </Label>
                    <div className="flex items-center gap-8">
                      <Switch
                        name="status-single"
                        label="Single"
                        value={value === "single"}
                        onChange={(checked) =>
                          onChange(
                            checked
                              ? "single"
                              : value === "single"
                                ? null
                                : value,
                          )
                        }
                        size="lg"
                      />
                      <Switch
                        name="status-married"
                        label="Married"
                        value={value === "married"}
                        onChange={(checked) =>
                          onChange(
                            checked
                              ? "married"
                              : value === "married"
                                ? null
                                : value,
                          )
                        }
                        size="lg"
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FormItem>
                )}
              />
            </FieldGroup>

            <Button
              type="submit"
              className="w-full h-12 font-medium mt-4 bg-primary hover:bg-primary/90"
              loadingState={buttonLoaders["update-account"]}
            >
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditProfile;
