"use client";
import React from "react";
import {
  ChevronLeft,
  Image as ImageIcon,
  Camera as CameraIcon,
  Smile,
} from "lucide-react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  cn,
  SingleSelectDropdown,
  Form,
  FormField,
  FormItem,
  Field,
  FieldError,
  FieldGroup,
  InputGroupInput,
  InputGroupTextarea,
} from "@repo/ui/index";
import { UseFormReturn } from "react-hook-form";
import { CreateFeedValidationType } from "../validation/createNew.validation";
import { MediaPreview } from "../utils/MediaPreview";
import { ComposerLinkPreview } from "@/components/ui/composer-link-preview";

interface CreateFeedViewProps {
  onBack: () => void;
  isLoading: boolean;
  user: any;
  followedCommunities: any[];
  feedForm: UseFormReturn<CreateFeedValidationType>;
  onSubmit: (values: CreateFeedValidationType) => Promise<void>;
  heading?: string;
  submitLabel?: string;
  formId?: string;
  containerClassName?: string;

  // Media State
  selectedMedia: any[];

  // Emoji Picker State
  showEmojiPicker: boolean;
  setShowEmojiPicker: (show: boolean) => void;
  onEmojiClick: (emojiData: any) => void;

  // Feed Avatar
  feedAvatar: { blob: Blob | null, preview: string };
  setFeedAvatar: (data: { blob: Blob | null, preview: string }) => void;
  openModal: (type: string, data?: any) => void;
}

export const CreateFeedView = ({
  onBack,
  isLoading,
  user,
  followedCommunities,
  feedForm,
  onSubmit,
  heading = "Create Feed",
  submitLabel = "Post",
  formId = "feed-form",
  containerClassName,
  selectedMedia,
  showEmojiPicker,
  setShowEmojiPicker,
  onEmojiClick,
  feedAvatar,
  setFeedAvatar,
  openModal,
}: CreateFeedViewProps) => {
  const watchedValues = feedForm.watch();
  const isFormEmpty =
    !watchedValues.title?.trim() &&
    !watchedValues.mainPost?.trim() &&
    selectedMedia.length === 0;
  const composerText = watchedValues.mainPost || "";

  return (
    <div
      className={cn(
        "flex flex-col h-[600px] p-4 bg-white rounded-md relative shadow-lg",
        containerClassName,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-0 border-b border-gray-200 pb-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </Button>
        <h2 className="text-lg font-medium text-gray-800 flex-1">
          {heading}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <div className="flex items-center gap-3 mb-4 mx-1">
          <Avatar>
            <AvatarImage src={user?.profile_photo_url} />
            <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white">
              {user?.full_name?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-gray-800">
            {user?.full_name || "User"}
          </span>
        </div>

        <Form {...feedForm}>
          <form
            id={formId}
            onSubmit={feedForm.handleSubmit(onSubmit as any)}
          >
            <FieldGroup className="space-y-4 mx-1">
              <FormField
                control={feedForm.control as any}
                name="title"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <Field data-invalid={fieldState.invalid}>
                      <InputGroupInput
                        {...field}
                        placeholder="Enter your Title"
                        className="bg-white hover:bg-white-50 shadow-none border-gray-200"
                        isSpaceAtStart={false}
                        maxLength={101}
                        showEllipsis={false}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  </FormItem>
                )}
              />

              <FormField
                control={feedForm.control as any}
                name="communityId"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <Field data-invalid={fieldState.invalid}>
                      <SingleSelectDropdown
                        options={followedCommunities.map((c: any) => ({
                          value: c.id.toString(),
                          label: c.name,
                          image: c.profile_photo_url,
                        }))}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select a community"
                        title="Community (Optional)"
                        showSearch={true}
                        showEllipsis={false}
                        errorMessage={fieldState.error?.message}
                        placeholderClassName="text-muted-foreground font-normal"
                      />
                    </Field>
                  </FormItem>
                )}
              />

              <FormField
                control={feedForm.control as any}
                name="mainPost"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <Field data-invalid={fieldState.invalid}>
                      <InputGroupTextarea
                        {...field}
                        placeholder="Main Post (Optional)"
                        className="min-h-[120px] bg-white border-gray-200 shadow-none"
                        allowEmptySpaces={true}
                        autoResize={true}
                        stretchable={true}
                        showEllipsis={false}
                        maxLength={201}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  </FormItem>
                )}
              />
            </FieldGroup>
          </form>
        </Form>

        <div className="mx-1 mt-4">
          <ComposerLinkPreview text={composerText} />
        </div>

        <MediaPreview
          selectedMedia={feedAvatar.preview ? [{ id: "feed-avatar", type: "photo", url: feedAvatar.preview }] : []}
          removeMedia={() => setFeedAvatar({ blob: null, preview: "" })}
          selectedMusic={null}
          removeMusic={() => {}}
        />

        {showEmojiPicker && (
          <div className="absolute bottom-36 left-1/2 -translate-x-1/2 z-50 shadow-2xl rounded-xl overflow-hidden">
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              theme={Theme.LIGHT}
              width={350}
              height={400}
            />
          </div>
        )}
      </div>

      <div className="py-4 border-t border-gray-200">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-primary bg-gray-100 rounded-full h-9 w-9"
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.onchange = (e: any) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    openModal("image-cropper", {
                      image: reader.result as string,
                      aspectRatio: 1,
                      onCropComplete: (croppedBlob: Blob) => {
                        const preview = URL.createObjectURL(croppedBlob);
                        setFeedAvatar({ blob: croppedBlob, preview });
                      },
                    });
                  };
                  reader.readAsDataURL(file);
                }
              };
              input.click();
            }}
          >
            <ImageIcon className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-primary bg-gray-100 rounded-full h-9 w-9"
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.capture = "environment";
              input.onchange = (e: any) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    openModal("image-cropper", {
                      image: reader.result as string,
                      aspectRatio: 1,
                      onCropComplete: (croppedBlob: Blob) => {
                        const preview = URL.createObjectURL(croppedBlob);
                        setFeedAvatar({ blob: croppedBlob, preview });
                      },
                    });
                  };
                  reader.readAsDataURL(file);
                }
              };
              input.click();
            }}
          >
            <CameraIcon className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full h-9 w-9 ${showEmojiPicker ? "text-primary bg-primary/10" : "text-gray-400 bg-gray-100 hover:text-primary"}`}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile className="h-5 w-5" />
          </Button>
        </div>

        <Button
          form={formId}
          type="submit"
          className="w-full h-11"
          disabled={isLoading || isFormEmpty}
          loadingState={isLoading}
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  );
};
