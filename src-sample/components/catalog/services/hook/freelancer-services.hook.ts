import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { FreelanceServicesValidation } from "../../validations/freelance-service.validation";
import { minutesToTime } from "@/components/ui/form/TimeInput";
import { calculatePayout } from "@/lib/utilities/payoutCalculator";
import { ServiceFormData } from "@/types/api/services.types";

export const useFreelancerServices = (
  isEditMode: boolean,
  isProductSelection: boolean,
  data?: any,
  setIsProductSelection?: (value: boolean) => void, // Add callback to update parent state
  userData?: any,
): UseFormReturn<ServiceFormData, any, ServiceFormData> => {
  // const isInitialMount = useRef(true);

  const formMethods = useForm<ServiceFormData>({
    shouldFocusError: false,
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      product_name: "",
      product_description: "",
      product_category: "",
      is_product_options: false,
      initial_product_duration: "",
      initial_product_price: "",
      initial_product_payout: "",
      product_options: [
        {
          id: 1,
          product_name: "",
          product_duration: "",
          product_price: "",
          product_payout: "",
        },
        {
          id: 2,
          product_name: "",
          product_duration: "",
          product_price: "",
          product_payout: "",
        },
      ],
    },
    resolver: zodResolver(
      FreelanceServicesValidation(isProductSelection),
    ) as any,
  });

  useEffect(() => {
    if (isEditMode && data) {
      const platformFee = Number(userData?.user?.platform_fee) || 0;
      const stripeFee = Number(userData?.user?.stripe_fee) || 0;

      const hasMultipleOptions = data?.options?.length > 1;
      // const isSingleOption = data?.options?.length === 1;

      if (setIsProductSelection && hasMultipleOptions) {
        setIsProductSelection(true);
      }

      // Map the options array to form structure
      const mappedOptions =
        data?.options?.length > 0
          ? data.options.map((option: any, index: number) => ({
              id: index + 1,
              product_name: option.name || "",
              product_duration: minutesToTime(option.duration) || "", // <-- FIXED
              product_price: option.price?.toString() || "",
              product_payout: calculatePayout(
                option.price,
                platformFee,
                stripeFee,
              ),
            }))
          : [
              {
                id: 1,
                product_name: "",
                product_duration: "",
                product_price: "",
                product_payout: "",
              },
              {
                id: 2,
                product_name: "",
                product_duration: "",
                product_price: "",
                product_payout: "",
              },
            ];

      formMethods.reset({
        product_name: data?.name || "",
        product_description: data?.description || "",
        product_category: data?.serviceCategory?.id?.toString() || "",
        is_product_options: hasMultipleOptions,
        initial_product_duration:
          minutesToTime(data?.options?.[0]?.duration) || "",

        initial_product_price: data?.options?.[0]?.price?.toString() || "",
        initial_product_payout: calculatePayout(
          data?.options?.[0]?.price,
          platformFee,
          stripeFee,
        ),
        product_options: mappedOptions,
      });
    }

    // if (isInitialMount.current) {
    //   isInitialMount.current = false;
    // }
  }, [data, formMethods, isEditMode, setIsProductSelection]);

  // ---------------------------------------------------------------------------
  // LIVE PAYOUT AUTO UPDATE ON PRICE CHANGES
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const platformFee = Number(userData?.user?.platform_fee) || 0;
    const stripeFee = Number(userData?.user?.stripe_fee) || 0;

    const subscription = formMethods.watch((values, { name }) => {
      if (!name) return;

      // ---------------- Initial Price Change ----------------
      if (name === "initial_product_price") {
        const price = Number(values.initial_product_price);
        const payout = calculatePayout(price, platformFee, stripeFee);

        formMethods.setValue("initial_product_payout", payout, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }

      // ---------------- Option Price Change ----------------
      if (name.startsWith("product_options")) {
        const match = name.match(/product_options\.(\d+)\.product_price/);
        if (match) {
          const index = Number(match[1]);
          const price = Number(values.product_options?.[index]?.product_price);

          const payout = calculatePayout(price, platformFee, stripeFee);

          formMethods.setValue(
            `product_options.${index}.product_payout`,
            payout,
            {
              shouldValidate: true,
              shouldDirty: true,
            },
          );
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [formMethods, userData]);

  return formMethods;
};
