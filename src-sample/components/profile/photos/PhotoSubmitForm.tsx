import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useState, useRef, useCallback, useEffect } from "react";
import { X, Plus, Camera, Trash2, Loader2, RefreshCw } from "lucide-react";
import { ToastService } from "@/lib/utilities/toastService";
import Label from "@/components/ui/form/label";
import Input from "@/components/ui/form/Input";
import profilePortfolioService from "@/services/profilePortfolioServices";
import { useGetPortfolioImagesById } from "@/hooks/portfolioImagesServices/useGetPortfolioImagesById";
import { usePhotos } from "./hook/photos.hook";
import Button from "@/components/ui/button/Button";
import { AxiosError } from "axios";

interface RhsCardProps {
  isOpen: boolean;
  onClose: () => void;
  IdIfEditMode?: string | number;
  initialData?: any;
  onImageUploaded?: (imageData: {
    url: string;
    thumbnailUrl: string;
    caption: string;
    id?: string;
  }) => void;
}

interface ImageData {
  id: string;
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
  IdIfEditMode,
  initialData,
  onImageUploaded,
}: RhsCardProps) {
  const isEditMode = !!IdIfEditMode;

  const { data: singlePortfolioImageData } = useGetPortfolioImagesById(
    IdIfEditMode?.toString() || "",
    { enabled: isEditMode }
  );

  const formMethods = usePhotos(
    isEditMode,
    initialData || singlePortfolioImageData?.data?.data
  );

  const [image, setImage] = useState<ImageData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* --------------------------------------------------------------- */
  /*  Load existing image in edit mode                               */
  /* --------------------------------------------------------------- */
  useEffect(() => {
    if (isEditMode && singlePortfolioImageData?.data?.data) {
      const existingImageUrl = formMethods?.getValues("image_url");

      // If we have an existing URL but no local image state, create a "success" image state
      if (existingImageUrl && !image) {
        setImage({
          id: IdIfEditMode?.toString() || "existing",
          file: null,
          preview: existingImageUrl,
          caption: formMethods?.getValues("image_caption") || "",
          uploadedUrl: existingImageUrl,
          uploadStatus: "success",
          isNewFile: false, // This is existing server image
        });
      }
    }
  }, [isEditMode, singlePortfolioImageData, formMethods, IdIfEditMode, image]);

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
  /*  File selection - NO AUTO UPLOAD, just preview                 */
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

    const newImage: ImageData = {
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview, // Local blob URL for preview
      caption: formMethods?.getValues("image_caption") || "",
      uploadStatus: "idle", // Not uploaded yet
      isNewFile: true, // Mark as new file
    };

    setImage(newImage);

    // Clear the image_url in form to trigger validation
    // This will show the red underline if validation requires image_url
    if (!isEditMode) {
      formMethods?.setValue("image_url", "", { shouldValidate: true });
    }
  };

  /* --------------------------------------------------------------- */
  /*  Delete – clears local state **and** the form field            */
  /* --------------------------------------------------------------- */
  const handleDeleteImage = () => {
    if (image && image.preview && image.file) {
      URL.revokeObjectURL(image.preview);
    }
    setImage(null);
    formMethods?.setValue("image_url", "", { shouldValidate: true });
    formMethods?.setValue("thumbnail_url", "", { shouldValidate: true });
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
  /*  Submit - Upload THEN Save/Update                              */
  /* --------------------------------------------------------------- */
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);

    try {
      let uploadedUrl = formMethods.getValues("image_url");
      let thumbnailUrl = formMethods.getValues("thumbnail_url");

      // Check if we need to upload a new image
      if (image?.isNewFile && image?.file) {
        // Update status to show we're uploading
        setImage((prev) =>
          prev ? { ...prev, uploadStatus: "uploading" } : null
        );

        // Upload the image first
        try {
          const uploadResult = await uploadImageToServer(image.file);
          uploadedUrl = uploadResult.url;
          thumbnailUrl = uploadResult.thumbnailUrl;
          formMethods?.setValue("image_url", uploadedUrl);
          formMethods?.setValue("thumbnail_url", thumbnailUrl);

          // Update image state to success
          setImage((prev) =>
            prev ? { ...prev, uploadedUrl, uploadStatus: "success" } : null
          );
        } catch (uploadError: unknown) {
          console.error("Upload error:", uploadError);
          const errMsg = uploadError instanceof Error ? uploadError.message : "Failed to upload image";
          const errStatus = uploadError instanceof AxiosError ? uploadError.response?.status : undefined;
          setImage((prev) =>
            prev
              ? {
                  ...prev,
                  uploadStatus: "error",
                  errorMessage: errMsg,
                }
              : null
          );
          if (errStatus !== 401) {
            ToastService.error("Failed to upload image");
          }
          setIsSubmitting(false);
          return; // Stop here if upload fails
        }
      }

      // If callback exists (signup flow), call it and close
      if (onImageUploaded && uploadedUrl) {
        onImageUploaded({
          url: uploadedUrl,
          thumbnailUrl: thumbnailUrl || uploadedUrl,
          caption: formMethods.getValues("image_caption") || "",
          id: IdIfEditMode?.toString(),
        });
        ToastService.success("Image updated successfully");
        handleClose();
        return;
      }

      // Validate form before submitting
      const isValid = await formMethods?.trigger();
      if (!isValid) {
        setIsSubmitting(false);
        return;
      }

      // Now save/update to database
      const formData = formMethods.getValues();
      const response = isEditMode
        ? await profilePortfolioService.updatePortfolioImagesById(
            formData,
            IdIfEditMode.toString()
          )
        : await profilePortfolioService?.createPortfolioImage(formData);

      if (response?.status === 201) {
        ToastService.success(
          response.data.message || "Portfolio image created successfully"
        );
        handleClose();
      } else if (response?.status === 200) {
        ToastService.success(
          response.data.message || "Portfolio image updated successfully"
        );
        handleClose();
      } else {
        ToastService.error(response?.data?.message || "Failed to save image");
      }
    } catch (error: unknown) {
      console.error("Submit error:", error);
      const errMsg = error instanceof Error ? error.message : "An error occurred";
      const errStatus = error instanceof AxiosError ? error.response?.status : undefined;
      if (errStatus !== 401) {
        ToastService.error(errMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formMethods, isEditMode, IdIfEditMode, image, onImageUploaded]);

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
    : formMethods?.getValues("image_url") || image?.preview; // Show server URL for existing

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent
        side="bottom"
        className="sheet-gradient-bg border-none p-0 overflow-y-auto scrollbar-hide"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4  ">
            <button
              onClick={handleClose}
              className="text-gray-300 hover:text-white transition-colors cursor-pointer absolute top-6 right-3"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-white text-sm font-medium mt-12">
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
                  className="relative w-full aspect-[361/404] bg-gray-900/50 border-2 border border-white/10 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-12 h-12 text-gray-600 mb-2" />
                  <p className="text-gray-500 text-sm">Click to select image</p>
                  <button className="absolute bottom-4 right-4 bg-white text-black p-3 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
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
                    {formMethods?.formState?.errors?.image_url.message}
                  </p>
                )}
                <div className="mt-2">
                  <Label>Caption (optional)</Label>
                  <Input
                    type="text"
                    register={formMethods?.register}
                    registerOptions={"image_caption"}
                    errors={formMethods?.formState?.errors}
                    placeholder="Notes"
                    autoFocus={false}
                    maxLength={151}
                  />
                </div>
              </div>
            ) : (
              /* 2. IMAGE PREVIEW – edit or create */
              <div className="space-y-4">
                <div className="relative w-full  aspect-[361/404] bg-gray-900 rounded-lg overflow-hidden">
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
                    <div className="top-4 right-4 flex gap-2">
                      {isEditMode ? (
                        // Edit mode: Replace button only
                        <Button
                          variant="glass"
                          size="none"
                          borderRadius="rounded-[16px]"
                          className="h-[42px] items-center flex gap-2 font-medium active:scale-95 transition-all px-3"
                          onClick={handleReplaceImage}
                        >
                          <span className="text-sm font-medium">Replace</span>
                          <RefreshCw className="w-3 h-3 mt-[5px]" />
                        </Button>
                      ) : (
                        // Create mode: Delete button
                        <Button
                          onClick={handleDeleteImage}
                          variant="glass"
                          size="none"
                          borderRadius="rounded-[16px]"
                          className="h-[42px] items-center flex gap-2 font-medium text-sm justify-center px-4 py-2"
                        >
                          Delete
                          <Trash2 className="w-3 h-3 mt-[5px]" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Caption – always show when image preview is visible */}
                <div>
                  <Label>Caption (optional)</Label>
                  <Input
                    type="text"
                    register={formMethods?.register}
                    registerOptions={"image_caption"}
                    errors={formMethods?.formState?.errors}
                    placeholder="Caption"
                    autoFocus={false}
                    maxLength={151}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 pt-2">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full font-semibold text-sm"
              size="rg"
            >
              {isSubmitting ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default PhotoSubmitForm;

