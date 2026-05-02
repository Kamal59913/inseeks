import { Controller, useFieldArray } from "react-hook-form";
import { ToastService } from "@/lib/utilities/toastService";
import { AxiosError } from "axios";
import { ShowIf } from "@/lib/utilities/showIf";
import { useEffect, useMemo, useState } from "react";
import freelancerServicesService from "@/services/freelancerServicesService";
import { useServiceCategories } from "@/hooks/serviceCategories/useServiceCategories";
import { useGetServiceById } from "@/hooks/freelancerServices/useGetServicesById";
import { useModalData } from "@/store/hooks/useModal";
import { useUserData } from "@/store/hooks/useUserData";
import { useFreelancerServices } from "./hook/freelancer-services.hook";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Button from "@/components/ui/button/Button";
import Switch from "@/components/ui/form/Switch";
import { setFormErrors } from "@/lib/utilities/formErrorMapper";

// Sub-components
import { ServiceFormHeader } from "./components/ServiceFormHeader";
import { BasicServiceFields } from "./components/BasicServiceFields";
import { SingleProductFields } from "./components/SingleProductFields";
import { ProductOptionsList } from "./components/ProductOptionsList";

interface RhsCardProps {
  isOpen: boolean;
  onClose: () => void;
  IdIfEditMode?: string;
}

function FreelanceServicesForm({
  isOpen,
  onClose,
  IdIfEditMode,
}: RhsCardProps) {
  const [isProductSelection, setIsProductSelection] = useState(false);
  const { open, close } = useModalData();
  const isEditMode = !!IdIfEditMode;
  const { data: singleServiceData } = useGetServiceById(IdIfEditMode || "", {
    enabled: isEditMode,
  });
  const { userData } = useUserData();
  const formMethods = useFreelancerServices(
    isEditMode,
    isProductSelection,
    singleServiceData?.data?.data,
    setIsProductSelection,
    userData
  );

  const { fields, append, remove, update } = useFieldArray({
    control: formMethods.control,
    name: "product_options",
  });

  const { data: allServiceCategories } = useServiceCategories({
    page: 1,
    limit: 1000,
  });

  const isProductOptions = formMethods.watch("is_product_options");

  const handleAddOption = () => {
    const currentOptions: any = formMethods.getValues("product_options");
    const nextId =
      currentOptions.length > 0
        ? Math.max(...currentOptions.map((opt: any) => opt.id)) + 1
        : 1;

    append({
      id: nextId,
      product_name: "",
      product_duration: "",
      product_price: "",
      product_payout: "",
    });
  };

  const serviceCategoryOptions = useMemo(() => {
    if (!allServiceCategories?.data?.data) return [];
    return allServiceCategories?.data?.data?.categories.map((data: any) => ({
      value: data.id.toString(),
      label: data.name.toString(),
    }));
  }, [allServiceCategories]);

  const handleFormSubmit = async (formData: any) => {
    try {
      const response = isEditMode
        ? await freelancerServicesService.updateServicesById(
            formData,
            IdIfEditMode
          )
        : await freelancerServicesService.createServices(formData);

      if ("status" in response) {
        if (response.status === 201 || response.status === 200) {
          ToastService.success(
            response.data.message || "Operation successful"
          );
          onClose();
        } else {
          const hasFieldErrors = setFormErrors(response, formMethods.setError);
          if (!hasFieldErrors && response.status !== 401) {
            ToastService.error(
              response.data.message || "An error occurred"
            );
          }
        }
      }
    } catch (error: unknown) {
      console.error("Form submission error:", error);
      const status = error instanceof AxiosError ? error.response?.status : undefined;
      if (status !== 401) {
        ToastService.error("An error occurred while updating profile");
      }
    }
  };

  const removeTheOption = async (index: number) => {
    remove(index);
    close();
  };

  useEffect(() => {
    const subscription = formMethods.watch((value, { name }) => {
      if (name === "is_product_options") {
        const isEnabled = !!value.is_product_options;
        setIsProductSelection(isEnabled);

        if (isEnabled) {
          const currentOptions = formMethods.getValues("product_options")!;
          const initialDuration = formMethods.getValues("initial_product_duration");
          const initialPrice = formMethods.getValues("initial_product_price");
          const initialPayout = formMethods.getValues("initial_product_payout");

          if ((initialDuration || initialPrice || initialPayout) && currentOptions.length > 0) {
            const firstOption = currentOptions[0];
            if (!firstOption.product_duration && !firstOption.product_price && !firstOption.product_payout) {
              update(0, {
                id: firstOption?.id || 1,
                product_name: firstOption?.product_name || "",
                product_duration: initialDuration || "",
                product_price: initialPrice || "",
                product_payout: initialPayout || "",
              });
            }
          }

          if (currentOptions.length < 2) {
            const optionsToAdd = 2 - currentOptions.length;
            for (let i = 0; i < optionsToAdd; i++) {
              const nextId = currentOptions.length > 0
                ? Math.max(...currentOptions.map((opt: any) => opt.id)) + 1
                : 1;
              append({ id: nextId, product_name: "", product_duration: "", product_price: "", product_payout: "" });
            }
          }
        }
      }

      if (name?.startsWith("product_options.0.product_")) {
        if (formMethods.getValues("is_product_options")) {
          const firstOption = formMethods.getValues("product_options.0");
          if (firstOption) {
            if (name === "product_options.0.product_duration") formMethods.setValue("initial_product_duration", firstOption.product_duration);
            else if (name === "product_options.0.product_price") formMethods.setValue("initial_product_price", firstOption.product_price);
            else if (name === "product_options.0.product_payout") formMethods.setValue("initial_product_payout", firstOption.product_payout);
          }
        }
      }

      if (name?.startsWith("initial_product_")) {
        if (!formMethods.getValues("is_product_options")) {
          const initialDuration = formMethods.getValues("initial_product_duration");
          const initialPrice = formMethods.getValues("initial_product_price");
          const initialPayout = formMethods.getValues("initial_product_payout");
          const firstOption = formMethods.getValues("product_options.0");
          if (firstOption) {
            update(0, { ...firstOption, product_duration: initialDuration || "", product_price: initialPrice || "", product_payout: initialPayout || "" });
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [formMethods, append, update]);

  return (
    <Sheet open={isOpen}>
      <SheetContent side="bottom" className="sheet-gradient-bg border-none p-0 overflow-y-auto scrollbar-hide">
        <form
          className="flex flex-col h-full"
          onSubmit={formMethods.handleSubmit(handleFormSubmit)}
        >
          <ServiceFormHeader isEditMode={isEditMode} onClose={onClose} />

          <div className="flex flex-col p-4 space-y-4 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
            <BasicServiceFields formMethods={formMethods} serviceCategoryOptions={serviceCategoryOptions} />

            <div>
              <Controller
                name="is_product_options"
                control={formMethods.control}
                render={({ field }) => (
                  <Switch
                    value={field.value!}
                    onChange={field.onChange}
                    errors={formMethods.formState.errors}
                    name="is_product_options"
                    label="This product has options"
                  />
                )}
              />
            </div>

            <ShowIf condition={!isProductOptions}>
              <SingleProductFields formMethods={formMethods} />
            </ShowIf>

            <ShowIf condition={!!isProductOptions}>
              <ProductOptionsList
                fields={fields}
                formMethods={formMethods}
                onAdd={handleAddOption}
                onRemove={(index) => {
                  open("delete-action", {
                    title: "Delete Confirmation!",
                    description: "Are you sure you want to delete this Option?",
                    action: () => removeTheOption(index),
                  });
                }}
              />
            </ShowIf>
          </div>
          <div className="p-4 pt-2">
            <Button size="rg" className="w-full font-semibold" type="submit">
              Continue
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export default FreelanceServicesForm;
