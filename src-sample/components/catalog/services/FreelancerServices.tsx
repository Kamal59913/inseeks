"use client";
import { useMemo, useState, useEffect } from "react";
import { AxiosError } from "axios";
import FreelanceServicesForm from "./FreelancerServicesForm";
import { useGetFreeLancerServices } from "@/hooks/freelancerServices/useGetFreeLancerServices";
import freelancerServicesService from "@/services/freelancerServicesService";
import { ToastService } from "@/lib/utilities/toastService";
import { useModalData } from "@/store/hooks/useModal";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setServiceSaveDisabled,
  setServiceSaveStatus,
  resetServiceSaveTrigger,
} from "@/store/slices/executionSlice";
import { SortableServiceItem } from "./SortableServiceItem";
import { useServiceCategoriesFreelancerOnly } from "@/hooks/serviceCategories/useServiceCategories";
import { SingleOnBoard } from "@/components/ui/dropdown/SingleOnboardController";
import Button from "@/components/ui/button/Button";

const FreelancerServices = () => {
  const [services, setServices] = useState("");
  const { open, close } = useModalData();
  const [isFormOpening, setIsFormOpening] = useState({
    isOpenModal: false,
    idIfEditMode: "",
  });
  const dispatch = useAppDispatch();

  const serviceSaveTrigger = useAppSelector(
    (state) => state.executionStates.serviceSaveTrigger,
  );

  const { data: localData, isPending } = useGetFreeLancerServices({
    page: 1,
    limit: 1000,
  });

  const serviceList = useMemo(
    () => localData?.data?.data || [],
    [localData?.data?.data],
  );

  const { data: allServiceCategories } = useServiceCategoriesFreelancerOnly({
    page: 1,
    limit: 1000,
  });

  const serviceCategoryOptions = useMemo(() => {
    if (!allServiceCategories?.data?.data) return [];
    return allServiceCategories?.data?.data?.map((data: any) => ({
      value: data.id.toString(),
      label: data.name.toString(),
    }));
  }, [allServiceCategories]);

  useEffect(() => {
    if (serviceCategoryOptions.length > 0 && !services) {
      setServices(serviceCategoryOptions[0].value);
    }
  }, [serviceCategoryOptions, services]);

  // Ordered services state for global ordering
  const [orderedServices, setOrderedServices] = useState<any[]>([]);
  const [hasReordered, setHasReordered] = useState(false);

  // Initialize ordered services when data loads
  useEffect(() => {
    if (serviceList.length > 0) {
      setHasReordered(false);
    }
    setOrderedServices(serviceList || []);
  }, [serviceList]);

  // Get filtered list from ordered services
  const filteredServiceList = orderedServices.filter(
    (item: any) => item.serviceCategory?.id.toString() === services,
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setOrderedServices((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const reordered = arrayMove(items, oldIndex, newIndex);
        setHasReordered(true);
        return reordered;
      });
    }
  };

  const moveItemUp = (id: string) => {
    setOrderedServices((items) => {
      const index = items.findIndex((item) => item.id === id);
      if (index > 0) {
        const reordered = arrayMove(items, index, index - 1);
        setHasReordered(true);
        return reordered;
      }
      return items;
    });
  };

  const moveItemDown = (id: string) => {
    setOrderedServices((items) => {
      const index = items.findIndex((item) => item.id === id);
      if (index < items.length - 1) {
        const reordered = arrayMove(items, index, index + 1);
        setHasReordered(true);
        return reordered;
      }
      return items;
    });
  };

  // Dispatch disable save if <= 1 service
  useEffect(() => {
    if (filteredServiceList.length <= 1) {
      dispatch(setServiceSaveDisabled(true));
    } else {
      dispatch(setServiceSaveDisabled(false));
    }
  }, [filteredServiceList.length, dispatch]);

  const handleSaveOrder = async () => {
    try {
      // Create payload with global order indices
      const payload = orderedServices.map((service, index) => ({
        id: service.id,
        order_index: index + 1, // 1-based index
      }));

      const response =
        await freelancerServicesService.updateServicesOrder(payload);

      if (response?.status === 200 || response?.status === 201) {
        // ...
        ToastService.success("Order updated successfully");
        setHasReordered(false);
        dispatch(setServiceSaveStatus("success"));
      } else {
        dispatch(setServiceSaveStatus("error")); // ENSURE STATUS UPDATES
        if (response?.status !== 401) {
          ToastService.error("Failed to update order");
        }
      }
    } catch (error: unknown) {
      console.error("Error updating order:", error);
      dispatch(setServiceSaveStatus("error")); // ENSURE STATUS UPDATES TO STOP LOADER
      const status = error instanceof AxiosError ? error.response?.status : undefined;
      if (status !== 401) {
        ToastService.error("An error occurred while updating order");
      }
    }
  };

  // Listen to save trigger from Redux
  useEffect(() => {
    if (serviceSaveTrigger > 0) {
      const currentServices = orderedServices;
      const currentFilteredList = currentServices.filter(
        (item: any) => item.serviceCategory?.id.toString() === services,
      );

      if (currentFilteredList.length < 1) {
        ToastService.error("Please add at least one service to continue");
        dispatch(setServiceSaveStatus("error"));
        return;
      }
      handleSaveOrder();
    }
  }, [serviceSaveTrigger, services]);

  const deleteServices = async (_id: string) => {
    const response: any = await freelancerServicesService.deleteServicesById(_id);

    if (response.status === 200) {
      ToastService.success(
        `${response.data.message || "Services Deleted Successfully"}`,
        "delete-class",
      );
      close();
    } else {
      if (response?.status !== 401) {
        ToastService.error(
          `${response.data.message || "Failed Deleting Class"}`,
          "delete-class-fail",
        );
      }
    }
  };

  return (
    <>
      <SingleOnBoard
        title=""
        options={serviceCategoryOptions}
        value={services}
        onChange={(value) => {
          setServices(value);
        }}
        variant="pills"
      />
      <div className="mt-6 space-y-2 max-h-100 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:min-h-[50px] dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 pr-2">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredServiceList.map((item: any) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {filteredServiceList.map((item: any, index: number) => (
              <SortableServiceItem
                key={item.id}
                item={item}
                isFirst={index === 0}
                isLast={index === filteredServiceList.length - 1}
                onMoveUp={() => moveItemUp(item.id)}
                onMoveDown={() => moveItemDown(item.id)}
                onEdit={() => {
                  setIsFormOpening({
                    isOpenModal: true,
                    idIfEditMode: item.id,
                  });
                }}
                onDelete={() => {
                  open("delete-action", {
                    title: "Delete Confirmation!",
                    description:
                      "Are you sure you want to delete this Service?",
                    action: () => {
                      deleteServices(item.id);
                    },
                  });
                }}
              />
            ))}
          </SortableContext>
        </DndContext>

        {filteredServiceList.length === 0 && !isPending && (
          <p className="text-center text-gray-500 mt-6">No services found.</p>
        )}
      </div>
      <div className="flex justify-center">
        <Button
          size="rg"
          className="font-semibold"
          variant="white"
          onClick={() =>
            setIsFormOpening({
              isOpenModal: true,
              idIfEditMode: "",
            })
          }
        >
          Add a new service +{" "}
        </Button>
      </div>
      {isFormOpening.isOpenModal && (
        <div>
          <FreelanceServicesForm
            IdIfEditMode={isFormOpening.idIfEditMode}
            isOpen={isFormOpening.isOpenModal}
            onClose={() =>
              setIsFormOpening({
                isOpenModal: false,
                idIfEditMode: "",
              })
            }
          />
        </div>
      )}
    </>
  );
};

export default FreelancerServices;
