"use client";

import { useState } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus, ImageIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import PhotoSubmitForm from "./PhotoSubmitForm";
import { SortableItem } from "./SortableItem";
import Button from "@/components/ui/button/Button";
import { useFormContext, useFieldArray } from "react-hook-form";

const PhotosPage = ({ onSave }: { onSave?: () => void }) => {
  const { id: freelancerUuid } = useParams<{ id: string }>();
  const { control, formState: { errors } } = useFormContext();
  const { fields, move, remove, append, update } = useFieldArray({
    control,
    name: "freelancerPortfolioImages",
  });

  const [isFormOpening, setIsFormOpening] = useState({
    isOpenModal: false,
    idIfEditMode: "",
  });

  const hasImages = fields.length > 0;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((item) => item.id === active.id);
      const newIndex = fields.findIndex((item) => item.id === over.id);
      move(oldIndex, newIndex);
    }
  };

  const handleRemove = (index: number) => {
    remove(index);
    onSave?.();
  };

  const handlePhotoSubmit = (data: any) => {
      console.log("handlePhotoSubmit data:", data);
      const editId = isFormOpening.idIfEditMode;
      if (editId) {
          const index = fields.findIndex((item) => item.id === editId);
          if (index !== -1) {
              console.log(`Updating field at index ${index} with:`, data);
              update(index, data);
          }
      } else {
          console.log("Appending new item:", data);
          append(data);
      }
      onSave?.();
  };

  const getInitialData = () => {
      if (!isFormOpening.idIfEditMode) return undefined;
      return fields.find(item => item.id === isFormOpening.idIfEditMode);
  }

  return (
    <div className="flex flex-col text-white">
      {/* Images Container */}
      <div className="[&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 pr-2 max-h-[66vh] overflow-y-auto">
        {!hasImages ? (
          // Empty State
          <div className="flex flex-col items-center justify-center text-center py-12 px-4">
            <div className="bg-gray-800/50 rounded-full p-6 mb-4">
              <ImageIcon size={48} className="text-gray-400" />
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
          // Images Flex with Drag & Drop
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={fields.map((field) => field.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-wrap gap-10 w-full">
                {fields.map((field: any, index) => (
                  <SortableItem
                    key={field.id}
                    img_id={field.id}
                    db_id={field.db_id}
                    freelancerUuid={freelancerUuid || ""}
                    img_url={field.thumbnail_url} 
                    onRemove={() => handleRemove(index)}
                    onClick={() => {
                      setIsFormOpening({
                        isOpenModal: true,
                        idIfEditMode: field.id, 
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
                  className="w-[100px] h-[100px] flex items-center justify-center border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <Plus size={24} className="text-gray-400"/>
                </div>
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {isFormOpening.isOpenModal && (
        <PhotoSubmitForm
          isEditMode={!!isFormOpening.idIfEditMode}
          initialData={getInitialData()}
          onSubmit={handlePhotoSubmit}
          isOpen={isFormOpening.isOpenModal}
          onClose={() =>
            setIsFormOpening({
              isOpenModal: false,
              idIfEditMode: "",
            })
          }
        />
      )}
      {errors.freelancerPortfolioImages && (
        <p className="mt-4 text-xs text-red-500">
          {errors.freelancerPortfolioImages.message?.toString()}
        </p>
      )}
    </div>
  );
};

export default PhotosPage;