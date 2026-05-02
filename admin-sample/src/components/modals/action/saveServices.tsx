import { useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { Plus, Trash2, X } from "lucide-react";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import SingleSelectDropdown from "../../ui/dropdown/SingleSelectController";
import DurationInput from "@shared/common/components/ui/form/input/DurationInput.tsx";
import CurrencyInput from "@shared/common/components/ui/form/input/CurrencyInput.tsx";
import TextArea from "@shared/common/components/ui/form/input/TextArea.js";
import Switch from "@shared/common/components/ui/form/switch/Switch.js";
import Label from "@shared/common/components/ui/form/Label.js";
import Input from "@shared/common/components/ui/form/input/InputField.js";
import { useModalData } from "../../../redux/hooks/useModal";
import { useFreelancerServices } from "../../freelancers/forms/EditProfile/services/hook/freelancer-services.hook";
import { useServiceCategories } from "../../../hooks/queries/serviceCategories/useServiceCategories";
import { useUserData } from "../../../redux/hooks/useUserData";
import { ShowIf } from "../../../utils/showId";
import { ToastService } from "../../../utils/toastService";
import freelancersService from "../../../api/services/freelancersService";
import { timeToMinutes } from "@shared/common/components/ui/form/input/TimeInput.js";
import { useGetServiceById } from "@/hooks/queries/freelancers/useGetServicesById";

interface Props {
  modalId: string;
  data?: any;
}

const SaveServicesModal: React.FC<Props> = ({ data }) => {
  const [isProductSelection, setIsProductSelection] = useState(false);
  const { close, open } = useModalData();
  const IdIfEditMode = data?.IdIfEditMode;
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

  // No parentForm context since it's a global modal. Use data props instead.
  // const parentForm = useFormContext();

  const handleFormSubmit = async (formData: any) => {
    if (!data.freelancerId) return;
    try {
      const optionsToSend = formData.is_product_options
        ? formData.product_options
            .filter(
              (opt: any) =>
                opt &&
                (opt.product_name?.trim() ||
                  opt.product_duration?.trim() ||
                  opt.product_price ||
                  opt.product_payout)
            )
            .map((opt: any) => ({
              product_name: opt.product_name,
              duration: timeToMinutes(opt.product_duration),
              price: Number(opt.product_price) || 0,
              discount: Number(opt.product_payout) || 0,
            }))
        : [
            {
              product_name: formData.product_name,
              duration: timeToMinutes(formData.initial_product_duration),
              price: Number(formData.initial_product_price) || 0,
              discount: Number(formData.initial_product_payout) || 0,
            },
          ];

      const serviceToSave = {
        id: IdIfEditMode ? String(IdIfEditMode) : undefined,
        service_category_id: Number(formData.product_category),
        name: formData.product_name,
        description: formData.product_description,
        status: true,
        options: optionsToSend,
      };

      const currentServices = data.currentServices || [];

      let updatedServices;
      if (isEditMode) {
        updatedServices = currentServices.map((s: any) => 
          s.id === IdIfEditMode ? { ...s, ...serviceToSave } : s
        );
      } else {
        updatedServices = [...currentServices, serviceToSave];
      }

      // Sanitize services: remove API-only fields and ensure proper structure
      const sanitizedServices = updatedServices.map((service: any, index: number) => {
        // Clean options - only keep allowed fields
        const cleanOptions = (service.options || []).map((opt: any) => ({
          ...(opt.id ? { id: String(opt.id) } : {}),
          product_name: opt.product_name || opt.name,
          duration: opt.duration,
          price: opt.price,
          discount: opt.discount,
        }));

        return {
          ...(service.id ? { id: String(service.id) } : {}),
          service_category_id: service.service_category_id || service.category?.id,
          name: service.name,
          description: service.description,
          status: service.status,
          order_index: index + 1,
          options: cleanOptions,
        };
      });

      const response = await freelancersService.updateFreelancerById(data.freelancerId, {
        services: sanitizedServices
      });

      if (response.status === 200 || response.status === 201) {
        ToastService.success(
          isEditMode ? "Service updated successfully" : "Service created successfully"
        );
        if (data.onSuccess) {
          data.onSuccess(response.data?.data?.catalogue_services || sanitizedServices);
        }
        close();
      } else {
        ToastService.error(response?.data?.message || "Failed to update services");
      }
    } catch (error: any) {
      console.error("Form submission error:", error);
      ToastService.error("An error occurred while updating services");
    }
  };

  const removeTheOption = async (index: number) => {
    remove(index);
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
              const nextId = currentOptions.length > 0 ? Math.max(...currentOptions.map((opt: any) => opt.id)) + 1 : 1;
              append({
                id: nextId,
                product_name: "",
                product_duration: "",
                product_price: "",
                product_payout: "",
              });
            }
          }
        }
      }

      if (name?.startsWith("product_options.0.product_")) {
        const isProductOptionsEnabled = formMethods.getValues("is_product_options");
        if (isProductOptionsEnabled) {
          const firstOption = formMethods.getValues("product_options.0");
          if (firstOption) {
            if (name === "product_options.0.product_duration") {
              formMethods.setValue("initial_product_duration", firstOption.product_duration);
            } else if (name === "product_options.0.product_price") {
              formMethods.setValue("initial_product_price", firstOption.product_price);
            } else if (name === "product_options.0.product_payout") {
              formMethods.setValue("initial_product_payout", firstOption.product_payout);
            }
          }
        }
      }

      if (name?.startsWith("initial_product_")) {
        const isProductOptionsEnabled = formMethods.getValues("is_product_options");
        if (!isProductOptionsEnabled) {
          const initialDuration = formMethods.getValues("initial_product_duration");
          const initialPrice = formMethods.getValues("initial_product_price");
          const initialPayout = formMethods.getValues("initial_product_payout");
          const firstOption = formMethods.getValues("product_options.0");

          if (firstOption) {
            update(0, {
              id: firstOption?.id || 1,
              product_name: firstOption?.product_name || "",
              product_duration: initialDuration || "",
              product_price: initialPrice || "",
              product_payout: initialPayout || "",
            });
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [formMethods, append, update]);


  useEffect(()=> {
    console.log("errors", formMethods?.formState?.errors)
  }, [formMethods?.formState?.errors])
  return (
    <Modal
      isOpen
      onClose={close}
      className="p-0 overflow-hidden max-w-lg"
      showCloseButton={false}
      outsideClick={false}
    >
      <div className="flex flex-col h-full bg-white dark:bg-black">
        <form
          className="flex flex-col h-full"
          onSubmit={formMethods.handleSubmit(handleFormSubmit)}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
             <button
              onClick={(e) => {
                e.preventDefault();
                close();
              }}
              className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-black dark:text-white font-medium">
              {isEditMode ? 'Update Service' : 'Create a Service'}
            </h2>
             <div className="w-5" />
          </div>

          {/* Form Content */}
          <div
            className="flex flex-col p-4 space-y-4 overflow-y-auto max-h-[70vh] pr-2"
          >
            {/* Product name */}
            <div>
              <Label className="text-black dark:text-white">Product name</Label>
              <Input
                type="text"
                register={formMethods?.register}
                registerOptions={"product_name"}
                errors={formMethods?.formState?.errors}
                placeholder="Product Name"
                autoFocus={true}
                maxLength={51}
                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
              />
            </div>

            {/* Pick a category */}
            <div>
              <Label className="text-black dark:text-white">Pick a category</Label>
              <Controller
                name="product_category"
                control={formMethods.control}
                render={({ field, fieldState }) => (
                  <SingleSelectDropdown
                    title=""
                    options={serviceCategoryOptions}
                    value={field.value}
                    onChange={(val) => field.onChange(val)}
                    errorMessage={fieldState.error}
                    showSearch={false}
                  />
                )}
              />
            </div>

            <div>
              <Label className="text-black dark:text-white">Product Description</Label>
              <TextArea
                register={formMethods?.register}
                registerOptions={"product_description"}
                errors={formMethods?.formState?.errors}
                placeholder="Product Description"
                maxLength={51}
                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
              />
            </div>

            {/* This product has options */}
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
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-black dark:text-white">Duration</Label>
                  <Controller
                    name="initial_product_duration"
                    control={formMethods.control}
                    render={({ field }) => (
                      <DurationInput
                        value={field.value}
                        onChange={field.onChange}
                        registerOptions={`initial_product_duration`}
                        errors={formMethods?.formState?.errors}
                        placeholder="h:30"
                      />
                    )}
                  />
                </div>
                <div>
                  <Label className="text-black dark:text-white">Price</Label>
                  <CurrencyInput
                    register={formMethods?.register}
                    registerOptions={`initial_product_price`}
                    errors={formMethods?.formState?.errors}
                    placeholder="£30"
                    maxLength={6}
                  />
                </div>
                <div>
                  <Label className="text-black dark:text-white">Payout</Label>
                  <CurrencyInput
                    register={formMethods?.register}
                    registerOptions={`initial_product_payout`}
                    errors={formMethods?.formState?.errors}
                    placeholder="£20"
                    maxLength={6}
                    disabled={true}
                  />
                </div>
              </div>
            </ShowIf>
            <ShowIf condition={!!isProductOptions}>
              <>
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="space-y-4 border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-gray-50 dark:bg-gray-900"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-black dark:text-white text-sm font-medium">
                        {`Option ${index + 1}`}
                      </h3>
                      <div className="flex items-center gap-2">
                        {index >= 2 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              open("delete-action", {
                                description: "Are you sure you want to delete this Option?",
                                action: () => removeTheOption(index),
                              });
                            }}
                            className="text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="text-black dark:text-white">Name</Label>
                      <Input
                        type="text"
                        register={formMethods?.register}
                        registerOptions={`product_options.${index}.product_name`}
                        errorSingleMessage={
                          (formMethods?.formState.errors.product_options as any)?.[index]
                            ?.product_name?.message
                        }
                        placeholder="Name"
                        maxLength={51}
                       className="border-gray-300 dark:border-gray-700 bg-white dark:bg-black"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-black dark:text-white">Duration</Label>
                        <Controller
                          name={`product_options.${index}.product_duration`}
                          control={formMethods.control}
                          render={({ field }) => (
                            <DurationInput
                              value={field.value}
                              onChange={field.onChange}
                              registerOptions={`product_options.${index}.product_duration`}
                              errorSingleMessage={
                                (formMethods?.formState.errors.product_options as any)?.[index]
                                  ?.product_duration?.message
                              }
                              placeholder="h:30"
                            />
                          )}
                        />
                      </div>
                      <div>
                        <Label className="text-black dark:text-white">Price</Label>
                        <CurrencyInput
                          register={formMethods?.register}
                          registerOptions={`product_options.${index}.product_price`}
                          errorSingleMessage={
                            (formMethods?.formState.errors.product_options as any)?.[index]
                              ?.product_price?.message
                          }
                          placeholder="£30"
                          maxLength={6}
                        />
                      </div>
                      <div>
                        <Label className="text-black dark:text-white">Payout</Label>
                        <CurrencyInput
                          register={formMethods?.register}
                          registerOptions={`product_options.${index}.product_payout`}
                          errorSingleMessage={
                            (formMethods?.formState.errors.product_options as any)?.[index]
                              ?.product_payout?.message
                          }
                          placeholder="£20"
                          maxLength={6}
                          disabled={true}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={handleAddOption}
                  className="flex items-center gap-2 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black w-fit"
                  variant="dark"
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Option
                </Button>
              </>
            </ShowIf>
          </div>
          <div className="p-4 pt-2 border-t border-gray-200 dark:border-gray-800 mt-auto">
            <Button className="w-full font-semibold bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black" type="submit">
              Continue
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default SaveServicesModal;