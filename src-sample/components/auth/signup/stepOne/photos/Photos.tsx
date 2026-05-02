"use client";

import { useState, useEffect, useRef } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { SortableItem } from "./SortableItem";
import PhotoSubmitForm from "@/components/profile/photos/PhotoSubmitForm";
import { UseFormReturn } from "react-hook-form";
import profilePortfolioService from "@/services/profilePortfolioServices";
import { ToastService } from "@/lib/utilities/toastService";
import { useDispatch } from "react-redux";
import { setPageLoading } from "@/store/slices/globalSlice";
import Loader from "@/components/ui/loader/loader";

interface PhotosPageProps {
  formMethods: UseFormReturn<any>;
}

interface UploadedImage {
  id: string;
  url: string;
  thumbnail: string;
  caption: string;
}

const PhotosPage = ({ formMethods }: PhotosPageProps) => {
  const [localImages, setLocalImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const [isFormOpening, setIsFormOpening] = useState({
    isOpenModal: false,
    idIfEditMode: "",
    initialData: null as any,
  });

  // Load images from form on mount
  useEffect(() => {
    const savedImages =
      formMethods.getValues("freelancerPortfolioImages") || [];
    if (savedImages.length > 0) {
      // Handle both old format (strings) and new format (objects)
      const imageObjects = savedImages.map((item: any, index: number) => {
        // If it's already an object with image_url, use it
        if (typeof item === "object" && item.image_url) {
          return {
            id: item.id || `image-${index}-${Date.now()}`,
            url: item.image_url,
            thumbnail: item.thumbnail_url || item.image_url,
            caption: item.image_caption || "",
          };
        }
        // Otherwise, treat it as a URL string (backwards compatibility)
        return {
          id: `image-${index}-${Date.now()}`,
          url: item,
          thumbnail: item,
          caption: "",
        };
      });
      setLocalImages(imageObjects);
    }
  }, []);

  // Sync local images with form field whenever localImages changes
  useEffect(() => {
    // Store as array of objects with image_url and thumbnail_url
    const imageObjects = localImages.map((img) => ({
      image_url: img.url,
      thumbnail_url: img.thumbnail,
      image_caption: img.caption,
    }));

    formMethods.setValue("freelancerPortfolioImages", imageObjects, {
      shouldValidate: false, // Don't validate automatically - only when Continue is clicked
    });

    // Clear the error if we now have 5+ images and error exists
    if (
      imageObjects.length >= 5 &&
      formMethods.formState.errors.freelancerPortfolioImages
    ) {
      formMethods.trigger("freelancerPortfolioImages");
    }
  }, [localImages, formMethods]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLocalImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const uploadImageToServer = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      // Pass true to skip internal global loader toggling
      const response = await profilePortfolioService.uploadImages(
        formData,
        true
      );

      if (response?.status === 200 || response?.status === 201) {
        return {
          url: response.data.data.url,
          thumbnailUrl:
            response.data.data.thumbnailUrl || response.data.data.url,
        };
      }
      ToastService.error(response?.data?.message || "Failed to upload image");
      return null;
    } catch (error: unknown) {
      ToastService.error(error instanceof Error ? error.message : "Failed to upload image");
      return null;
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Process all selected files
    const uploadPromises = Array.from(files).map(async (file) => {
      // Basic size validation
      if (file.size > 5 * 1024 * 1024) {
        ToastService.error(`File ${file.name} is too large (max 5MB)`);
        return null;
      }
      return uploadImageToServer(file);
    });

    try {
      setIsUploading(true);
      dispatch(setPageLoading(true)); // Start global loader once
      const results = await Promise.all(uploadPromises);

      const newImages: UploadedImage[] = results
        .filter(
          (res): res is { url: string; thumbnailUrl: string } => res !== null
        )
        .map((res) => ({
          id: `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url: res.url,
          thumbnail: res.thumbnailUrl,
          caption: "",
        }));

      if (newImages.length > 0) {
        setLocalImages((prev) => [...prev, ...newImages]);
        ToastService.success(
          `${newImages.length} image(s) uploaded successfully`
        );
      }
    } catch (error) {
      console.error("Batch upload error:", error);
    } finally {
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setIsUploading(false);
      dispatch(setPageLoading(false)); // End global loader once
    }
  };

  const handleRemove = (id: string) => {
    setLocalImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleImageUploaded = (imageData: {
    url: string;
    thumbnailUrl: string;
    caption: string;
    id?: string;
  }) => {
    setLocalImages((prev) =>
      prev.map((img) =>
        img.id === imageData.id
          ? {
              ...img,
              url: imageData.url,
              thumbnail: imageData.thumbnailUrl,
              caption: imageData.caption,
            }
          : img
      )
    );
  };

  return (
    <div className="flex flex-col text-white">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Images Container */}
      <div className="[&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 pr-2 max-h-[66vh] overflow-y-auto">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={localImages?.map((img) => img.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-3 gap-3 w-full">
              {localImages?.map((img) => (
                <SortableItem
                  key={img.id}
                  img_id={img.id}
                  img_url={img.thumbnail}
                  onRemove={handleRemove}
                  onClick={() => {
                    // setIsFormOpening({
                    //   isOpenModal: true,
                    //   idIfEditMode: img.id,
                    //   initialData: {
                    //     image_url: img.url,
                    //     thumbnail_url: img.thumbnail,
                    //     image_caption: img.caption,
                    //   },
                    // });
                  }}
                />
              ))}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-[100px] h-[100px] flex items-center justify-center border-2 border-dashed border-gray-500 rounded-md cursor-pointer hover:bg-gray-800 transition-colors"
              >
                <Plus size={24} />
              </div>
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {isFormOpening.isOpenModal && (
        <PhotoSubmitForm
          isOpen={isFormOpening.isOpenModal}
          IdIfEditMode={isFormOpening.idIfEditMode}
          initialData={isFormOpening.initialData}
          onClose={() =>
            setIsFormOpening({
              isOpenModal: false,
              idIfEditMode: "",
              initialData: null,
            })
          }
          onImageUploaded={handleImageUploaded}
        />
      )}

      {isUploading && (
        <div className="mt-4 flex flex-col items-center justify-center p-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium animate-pulse">
              Images are being uploaded, please wait...
            </p>
          </div>
        </div>
      )}

      {/* Validation Error Display */}
      {formMethods.formState.errors.freelancerPortfolioImages && (
        <p className="mt-2 text-xs text-red-500">
          {
            formMethods.formState.errors.freelancerPortfolioImages
              .message as string
          }
        </p>
      )}
    </div>
  );
};

export default PhotosPage;

