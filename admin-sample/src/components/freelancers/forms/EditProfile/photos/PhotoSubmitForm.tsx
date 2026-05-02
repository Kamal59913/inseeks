import { Modal } from "@/components/ui/modal";
import { useState, useRef, useCallback, useEffect } from "react";
import { X, Plus, Camera, Trash2, Loader2, RefreshCw } from "lucide-react";
import { ToastService } from "@/utils/toastService";
import Label from "@shared/common/components/ui/form/Label.js";
import Input from "@shared/common/components/ui/form/input/InputField.js";
import profilePortfolioService from "@/api/services/profilePortfolioService";
import { usePhotos } from "./hook/photos.hook";
import Button from "@shared/common/components/ui/button/Button.js";

interface RhsCardProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  isEditMode: boolean;
}

interface ImageData {
  id: string;
  db_id?: string | number;
  file: File | null;
  preview: string;
  caption: string;
  uploadedUrl?: string;
  uploadStatus: "idle" | "uploading" | "success" | "error";
  errorMessage?: string;
  isNewFile: boolean; // Track if this is a newly selected file
}

function PhotoSubmitForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditMode,
}: RhsCardProps) {
  const formMethods = usePhotos(isEditMode, initialData);

  const [image, setImage] = useState<ImageData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* --------------------------------------------------------------- */
  /*  Load existing image in edit mode                               */
  /* --------------------------------------------------------------- */
  useEffect(() => {
    if (isEditMode && initialData) {
      const existingImageUrl =
        formMethods?.getValues("image_url") || initialData.image_url;
      const existingThumbnailUrl =
        formMethods?.getValues("thumbnail_url") || initialData.thumbnail_url;

      // If we have an existing URL but no local image state, create a "success" image state
      if (existingImageUrl && !image) {
        const caption = formMethods?.getValues("caption") || 
                       initialData.caption || 
                       initialData.image_caption || 
                       "";

        setImage({
          id: initialData.id || "existing",
          db_id: initialData.db_id || initialData.id,
          file: null,
          preview: existingThumbnailUrl || existingImageUrl, // Use thumbnail for preview if available
          caption: caption,
          uploadedUrl: existingImageUrl,
          uploadStatus: "success",
          isNewFile: false, // This is existing server image
        });

        // Ensure form is populated
        if (!formMethods.getValues("image_url")) {
          formMethods.setValue("image_url", existingImageUrl);
          formMethods.setValue("thumbnail_url", existingThumbnailUrl);
          formMethods.setValue("caption", caption);
          formMethods.setValue("db_id", initialData.db_id || initialData.id);
        }
      }
    }
  }, [isEditMode, initialData, formMethods, image]);

  /* --------------------------------------------------------------- */
  /*  Upload helper                                                  */
  /* --------------------------------------------------------------- */
  const uploadImageToServer = async (
    file: File
  ): Promise<{ url: string; thumbnailUrl: string }> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await profilePortfolioService.uploadImages(formData);

    if (response?.status === 200 || response?.status === 201) {
      return {
        url: response?.data?.data?.url,
        thumbnailUrl: response?.data?.data?.thumbnailUrl || "",
      };
    }
    throw new Error(response?.data?.message || "Failed to upload image");
  };

  /* --------------------------------------------------------------- */
  /*  File selection - IMMEDIATE UPLOAD                             */
  /* --------------------------------------------------------------- */
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      ToastService.error("File size must be less than 5MB");
      e.target.value = ""; // Reset the file input
      return;
    }

    const preview = URL.createObjectURL(file);

    // Initial state: uploading
    const newImage: ImageData = {
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview,
      caption: formMethods?.getValues("caption") || "",
      uploadStatus: "uploading",
      isNewFile: true,
    };

    setImage(newImage);

    try {
      const uploadResult = await uploadImageToServer(file);
      
      // Update state with success and URLs
      setImage(prev => prev ? {
        ...prev,
        uploadedUrl: uploadResult.url,
        uploadStatus: "success"
      } : null);

      // Set form values immediately
      formMethods.setValue("image_url", uploadResult.url);
      formMethods.setValue("thumbnail_url", uploadResult.thumbnailUrl);
      
      ToastService.success("Image uploaded successfully");
    } catch (uploadError: any) {
      console.error("Upload error:", uploadError);
      setImage(prev => prev ? {
        ...prev,
        uploadStatus: "error",
        errorMessage: uploadError?.message || "Failed to upload image"
      } : null);
      
      if (uploadError?.response?.status !== 401 && uploadError?.status !== 401) {
        ToastService.error("Failed to upload image");
      }
    } finally {
      e.target.value = ""; // Clear input so same file can be selected again if needed
    }
  };

  /* --------------------------------------------------------------- */
  /*  Delete – clears local state **and** the form field            */
  /* --------------------------------------------------------------- */
  const handleDeleteImage = () => {
    if (!window.confirm("Are you sure you want to delete this Image?")) return;

    if (image && image.preview && image.file) {
      URL.revokeObjectURL(image.preview);
    }
    setImage(null);
    formMethods?.setValue("image_url", "", { shouldValidate: true });
    formMethods?.setValue("thumbnail_url", "", { shouldValidate: true });
    handleClose();
  };

  /* --------------------------------------------------------------- */
  /*  Replace image (edit mode only)                                */
  /* --------------------------------------------------------------- */
  const handleReplaceImage = () => {
    // Revoke old blob URL if it exists
    if (image && image.preview && image.isNewFile) {
      URL.revokeObjectURL(image.preview);
    }
    fileInputRef.current?.click();
  };

  /* --------------------------------------------------------------- */
  /*  Submit - Pass already uploaded/existing data to parent        */
  /* --------------------------------------------------------------- */
  const handleSubmit = useCallback(async () => {
    // Only block if it's currently uploading. The empty case is handled by Zod trigger below.
    if (image?.uploadStatus === "uploading") {
      return;
    }

    if (image?.uploadStatus === "error") {
      ToastService.error("Please re-upload or select a different image");
      return;
    }

    setIsSubmitting(true);

    try {
      // Validate form before submitting (checks image_url and caption length)
      const isValid = await formMethods?.trigger();
      if (!isValid) {
          console.log("Form invalid", formMethods.formState.errors);
        setIsSubmitting(false);
        return;
      }

      // Get current form data
      const formData = formMethods.getValues();
      
      const finalData = {
        ...formData, // image_url, thumbnail_url, image_caption, db_id
        id: initialData?.id, // preserve fieldArray ID if editing
      };

      console.log("Submitting final portfolio item data:", finalData);
      onSubmit(finalData);
      handleClose();
    } catch (error: any) {
      console.error("Submit error:", error);
      if (error?.response?.status !== 401 && error?.status !== 401) {
        ToastService.error(error?.message || "An error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formMethods, initialData, image, onSubmit]);

  const handleClose = () => {
    if (image && image.preview && image.isNewFile) {
      URL.revokeObjectURL(image.preview);
    }
    setImage(null);
    setIsSubmitting(false);
    onClose();
  };

  /* --------------------------------------------------------------- */
  /*  Render                                                         */
  /* --------------------------------------------------------------- */
  const hasImageUrl = !!formMethods?.getValues("image_url");
  const showImagePreview = image || hasImageUrl;

  // Determine what to show in the preview
  const previewSrc = image?.isNewFile
    ? image.preview // Show local blob for new files
    : formMethods?.getValues("thumbnail_url") ||
      formMethods?.getValues("image_url") ||
      image?.preview; // Show server URL for existing

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="p-0 overflow-hidden max-w-lg"
      showCloseButton={false}
    >
      <div className="flex flex-col h-full bg-white dark:bg-black">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-black dark:text-white font-medium">
            {isEditMode ? "Edit Image" : "Image reference (optional)"}
          </h2>
          <div className="w-5" />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {/* 1. SHOW FILE-PICKER ONLY WHEN nothing is present */}
          {!showImagePreview ? (
            <div>
              <div
                className="relative w-full aspect-[24/9] bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-black dark:hover:border-white transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-gray-500 text-sm">Click to select image</p>
                <button className="absolute bottom-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-800 transition-colors cursor-pointer dark:bg-white dark:text-black dark:hover:bg-gray-200">
                  <Plus className="w-5 h-5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              {formMethods?.formState?.errors?.image_url && (
                <p className="mt-1.5 text-xs text-red-500">
                  {formMethods?.formState?.errors?.image_url.message as string}
                </p>
              )}
              <div className="mt-4">
                <Label className="text-black dark:text-white">
                  Caption (optional)
                </Label>
                <Input
                  type="text"
                  register={formMethods?.register}
                  registerOptions={"caption"}
                  errors={formMethods?.formState?.errors}
                  placeholder="Notes"
                  autoFocus={false}
                  maxLength={151}
                  className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                />
              </div>
            </div>
          ) : (
            /* 2. IMAGE PREVIEW – edit or create */
            <div className="space-y-4">
              <div className="relative w-full aspect-[24/9] bg-gray-900 rounded-lg overflow-hidden">
                <img
                  src={previewSrc}
                  alt="Selected"
                  className="w-full h-full object-cover"
                />

                {/* Upload overlay - only show during actual upload */}
                {image?.uploadStatus === "uploading" && (
                  <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                    <Loader2 className="w-12 h-12 text-white animate-spin mb-3" />
                    <p className="text-white text-sm">Uploading image...</p>
                  </div>
                )}

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              <div className="flex justify-center">
                {/* Action buttons - different for edit vs create mode */}
                {!isSubmitting && (
                  <div className="flex gap-2">
                    {isEditMode ? (
                      // Edit mode: Replace button only
                      <Button
                        onClick={handleReplaceImage}
                        className="text-sm flex gap-2 items-center"
                        size="sm"
                      >
                        Replace
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    ) : (
                      // Create mode: Delete button
                      <Button
                        onClick={handleDeleteImage}
                        className="text-sm flex gap-2 items-center"
                        size="sm"
                      >
                        Delete
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Caption – always show when image preview is visible */}
              <div>
                <Label className="text-black dark:text-white">
                  Caption (optional)
                </Label>
                <Input
                  type="text"
                  register={formMethods?.register}
                  registerOptions={"caption"}
                  errors={formMethods?.formState?.errors}
                  placeholder="Caption"
                  autoFocus={false}
                  maxLength={151}
                  className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 pt-2 border-t border-gray-200 dark:border-gray-800">
          {image?.uploadStatus === "uploading" && (
            <p className="text-xs text-blue-500 mb-2 text-center animate-pulse">
              Please wait for the image to finish uploading
            </p>
          )}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || image?.uploadStatus === "uploading"}
            className="w-full font-semibold text-sm bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black disabled:opacity-50"
            size="sm"
          >
            {isSubmitting ? "Saving..." : "Save Photo"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default PhotoSubmitForm;
