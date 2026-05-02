"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus, ImageIcon } from "lucide-react";
import { useGetPortfolioImages } from "@/hooks/portfolioImagesServices/useGetPortfolioImages";
import PhotoSubmitForm from "./PhotoSubmitForm";
import profilePortfolioService from "@/services/profilePortfolioServices";
import { ToastService } from "@/lib/utilities/toastService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { SortableItem } from "./SortableItem";
import Button from "@/components/ui/button/Button";
import { setPhotoSaving, setPhotoSaveStatus } from "@/store/slices/executionSlice";
import { AxiosError } from "axios";
import { PortfolioItem } from "@/types/api/freelancer.types";

const PhotosPage = () => {
  const { data: localData, isPending } = useGetPortfolioImages({
    page: 1,
    limit: 1000,
  });

  const [isFormOpening, setIsFormOpening] = useState({
    isOpenModal: false,
    idIfEditMode: "" as string | number,
  });

  const photoSaveTrigger = useAppSelector(
    (state) => state.executionStates.photoSaveTrigger,
  );

  const [orderedImages, setOrderedImages] = useState<PortfolioItem[]>([]);
  const [hasReordered, setHasReordered] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  const images = localData?.data?.data || [];
  const hasImages = images.length > 0;

  // Initialize ordered images when data loads
  useEffect(() => {
    if (images.length > 0) {
      setOrderedImages(images);
      setHasReordered(false);
    }
  }, [images]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setOrderedImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const reordered = arrayMove(items, oldIndex, newIndex);
        setHasReordered(true);
        return reordered;
      });
    }
  };

  const dispatch = useAppDispatch();
  const handleSaveOrder = async () => {
    setIsSavingOrder(true);
    dispatch(setPhotoSaving(true));
    dispatch(setPhotoSaveStatus("idle"));

    // Check for minimum photos requirement
    if (orderedImages.length < 5) {
      ToastService.error("Please upload at least 5 photos to continue");
      dispatch(setPhotoSaveStatus("error"));
      setIsSavingOrder(false);
      dispatch(setPhotoSaving(false));
      return;
    }

    try {
      // Create payload with new order indices
      const payload = orderedImages.map((img, index) => ({
        id: img.id,
        order_index: index + 1, // 1-based index
      }));

      const response =
        await profilePortfolioService.updatePortfolioOrder(payload);

      if (response?.status === 200 || response?.status === 201) {
        ToastService.success("Order updated successfully");
        setHasReordered(false);
        dispatch(setPhotoSaveStatus("success"));
      } else {
        if (response?.status !== 401) {
          ToastService.error("Failed to update order");
          dispatch(setPhotoSaveStatus("error"));
        }
      }
    } catch (error: unknown) {
      console.error("Error updating order:", error);
      const status = error instanceof AxiosError ? error.response?.status : undefined;
      if (status !== 401) {
        ToastService.error("An error occurred while updating order");
        dispatch(setPhotoSaveStatus("error"));
      }
    } finally {
      setIsSavingOrder(false);
      dispatch(setPhotoSaving(false));
    }
  };

  const handleRemove = (id: string | number) => {
    console.log("Remove image:", id);
  };

  useEffect(() => {
    if (photoSaveTrigger > 0) {
      handleSaveOrder();
    }
  }, [photoSaveTrigger]);

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center text-white min-h-[300px]">
        <p className="text-gray-400">Loading images...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col text-white">
      {/* Save Order Button - Show when reordered */}
      {/* {hasReordered && hasImages && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={handleSaveOrder}
            disabled={isSavingOrder}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isSavingOrder ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Order
              </>
            )}
          </button>
        </div>
      )} */}

      {/* Images Container */}
      <div className="[&::-webkit-scrollbar-track]:rounded-full overflow-[inherit] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 pr-2 max-h-[66vh]">
        {!hasImages ? (
          // Empty State
          <div className="flex flex-col items-center justify-center text-center py-12 px-4">
            <div className="bg-gray-800/50 rounded-full p-6 mb-4">
              <ImageIcon size={48} className="text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No photos yet
            </h3>
            <p className="text-gray-400 mb-6 max-w-sm">
              Start building your portfolio by adding your first image
            </p>
            <Button
              onClick={(e) => {
                e.preventDefault();
                setIsFormOpening({
                  isOpenModal: true,
                  idIfEditMode: "",
                });
              }}
              className="flex gap-2 font-medium text-sm justify-center items-center"
              size="sm"
            >
              <Plus size={20} />
              Add First Photo
            </Button>
          </div>
        ) : (
          // Images Grid with Drag & Drop
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={orderedImages?.map((img: PortfolioItem) => img.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-3 gap-3 w-full pb-5">
                {orderedImages?.map((img: PortfolioItem) => (
                  <SortableItem
                    key={img.id}
                    img_id={img.id}
                    img_url={img.thumbnail}
                    onRemove={handleRemove}
                    onClick={() => {
                      setIsFormOpening({
                        isOpenModal: true,
                        idIfEditMode: img.id,
                      });
                    }}
                  />
                ))}
                <div
                  onClick={() =>
                    setIsFormOpening({
                      isOpenModal: true,
                      idIfEditMode: "",
                    })
                  }
                  className="w-full aspect-square flex items-center justify-center border-2 border-white/10 border-dashed rounded-md cursor-pointer hover:bg-gray-800 transition-colors"
                >
                  <Plus size={24} />
                </div>
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {isFormOpening.isOpenModal && (
        <PhotoSubmitForm
          IdIfEditMode={isFormOpening.idIfEditMode}
          isOpen={isFormOpening.isOpenModal}
          onClose={() =>
            setIsFormOpening({
              isOpenModal: false,
              idIfEditMode: "",
            })
          }
        />
      )}
    </div>
  );
};

export default PhotosPage;
