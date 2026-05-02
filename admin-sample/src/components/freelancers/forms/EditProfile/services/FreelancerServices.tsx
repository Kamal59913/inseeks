"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit2, GripVertical, Trash2, Plus } from "lucide-react";
import { useModalData } from "@/redux/hooks/useModal";
import { ToastService } from "@/utils/toastService";
import freelancerServicesService from "@/api/services/freelancerServicesService";
import Button from "@shared/common/components/ui/button/Button.js";
import { useFormContext } from "react-hook-form";
import SingleSelectDropdown from "@/components/ui/dropdown/SingleSelectController";
import { useParams } from "react-router-dom";

interface SortableServiceItemProps {
  service: any;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const SortableServiceItem = ({
  service,
  onEdit,
  onDelete,
}: SortableServiceItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: service.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`cursor-pointer group flex items-center gap-3 p-4 hover:bg-gray-100 border border-gray-400 hover:border-gray-700 rounded-lg transition-all ${
        isDragging ? "opacity-50 shadow-xl ring-2 ring-purple-500/50" : ""
      }`}
      // onClick={() => onEdit(service.id)}
    >
      <div
        {...attributes}
        {...listeners}
        className="flex-shrink-0 cursor-grab active:cursor-grabbing text-gray-600 hover:text-gray-400 transition-colors touch-none p-1"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className=" font-medium text-base mb-1 truncate">
          {service.name}
        </h4>
        {service.description && (
          <p className="text-sm text-gray-400 line-clamp-2">
            {service.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => onEdit(service.id)}
          className="p-2 hover:bg-gray-400 rounded-md transition-all"
          aria-label="Edit service"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(service.id)}
          className="p-2 hover:bg-red-500/10 rounded-md transition-all"
          aria-label="Delete service"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

interface FreelancerServicesProps {
  serviceCategories: any[];
  initialServices: any[];
}

const FreelancerServices: React.FC<FreelancerServicesProps> = ({
  serviceCategories,
  initialServices,
}) => {
  const { setValue } = useFormContext();
  const { id: freelancerId } = useParams<{ id: string }>();

  const [services, setServices] = useState<any[]>(initialServices);
  const [filterCategory, setFilterCategory] = useState<string>("");
  const { open, close } = useModalData();

  const categoryOptions = useMemo(() => {
    return serviceCategories.map((cat: any) => ({
      value: cat.id.toString(),
      label: cat.name,
    }));
  }, [serviceCategories]);

  // Don't auto-select first category, allow it to be empty

  useEffect(() => {
    setServices(initialServices);
  }, [initialServices]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredServices = useMemo(() => {
    // If no filter selected, show all services
    if (!filterCategory) {
      return services;
    }
    return services.filter((service: any) => {
      return service.category?.id?.toString() === filterCategory;
    });
  }, [services, filterCategory]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = services.findIndex((item) => item.id === active.id);
      const newIndex = services.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newServices = [...services];
        const [movedItem] = newServices.splice(oldIndex, 1);
        newServices.splice(newIndex, 0, movedItem);
        setServices(newServices);
        setValue("services", newServices);
      }
    }
  };

  const handleEditClick = (serviceId: string) => {
    open("save-services", {
      IdIfEditMode: serviceId,
      freelancerId: freelancerId,
      currentServices: services,
      onSuccess: (updatedServices: any) => {
        setServices(updatedServices);
        setValue("services", updatedServices);
      },
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await freelancerServicesService.deleteServicesById(id);
      if (response.status === 200) {
        ToastService.success("Service deleted successfully");
        const updatedServices = services.filter((s) => s.id !== id);
        setServices(updatedServices);
        setValue("services", updatedServices);
        close();
      }
    } catch (error) {
      ToastService.error("Failed to delete service");
    }
  };

  const deleteService = (id: string) => {
    open("delete-action", {
      description: "Are you sure you want to delete this service?",
      action: () => handleDelete(id),
    });
  };

  const handleAddNew = () => {
    open("save-services", {
      IdIfEditMode: undefined,
      freelancerId: freelancerId,
      currentServices: services,
      onSuccess: (updatedServices: any) => {
        setServices(updatedServices);
        setValue("services", updatedServices);
      },
    });
  };



  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold ">Services</h3>
          <p className="text-sm text-gray-400 mt-1">
            Manage and organize your service offerings
          </p>
        </div>
        <Button size="sm" onClick={handleAddNew} variant="dark" className="flex items-center gap-2">
          <Plus className="" />
          Add Service
        </Button>
      </div>

      {categoryOptions.length > 0 && (
        <div className="max-w-xs">
          <SingleSelectDropdown
            title="Filter by Category"
            options={categoryOptions}
            value={filterCategory}
            onChange={(val) => setFilterCategory(val)}
            showSearch={false}
          />
        </div>
      )}

      <div className="space-y-3">
        {filteredServices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 rounded-xl border border-dashed border-gray-800">
            <div className="text-gray-500 mb-2">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <p className="text-base font-medium mb-1">
              No services in this category
            </p>
            <p className="text-sm">
              Add your first service to get started
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredServices.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {filteredServices.map((service) => (
                  <SortableServiceItem
                    key={service.id}
                    service={service}
                    onEdit={handleEditClick}
                    onDelete={deleteService}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
};

export default FreelancerServices;