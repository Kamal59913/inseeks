"use client";

import { useMemo } from "react";
import { useFormContext, Controller } from "react-hook-form";
import Label from "@shared/common/components/ui/form/Label.js";
import CurrencyInput from "@shared/common/components/ui/form/input/CurrencyInput.js";
import MultiSelectDropdown from "../../../../../../../packages/components/src/components/ui/dropdown/MultiSelectController"; 
import { useServiceCategories } from "@/hooks/queries/serviceCategories/useServiceCategories";

const ChargingRates = () => {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const { data: allServiceCategories } = useServiceCategories({
    page: 1,
    limit: 1000,
  });

  const serviceCategoryOptions = useMemo(() => {
    if (!allServiceCategories?.data?.data?.categories) return [];
    return allServiceCategories?.data?.data?.categories?.map((data: any) => ({
      value: data.slug,
      label: data.name,
    }));
  }, [allServiceCategories]);

  const selectedAreas = watch("service_categories") || [];

  const selectedCategories = useMemo(() => {
    if (!allServiceCategories?.data?.data?.categories) return [];
    return allServiceCategories.data.data.categories.filter((cat: any) =>
      selectedAreas.includes(cat.slug)
    );
  }, [allServiceCategories, selectedAreas]);

  // Handle auto-setting values for specific categories (e.g. Nails full_day = 0)
  const categoryRates = watch("category_rates") || {};
  
  // React to category selection changes
  useMemo(() => {
    selectedCategories.forEach((cat: any) => {
      const categorySlug = cat.slug?.toLowerCase() || '';
      if (categorySlug.includes("nail")) {
        // Only set if not already 0 to avoid infinite loops if watch/setValue trigger incorrectly
        if (categoryRates[cat.slug]?.full_day !== 0) {
          setValue(`category_rates.${cat.slug}.full_day`, 0, { shouldValidate: true });
        }
      }
    });
  }, [selectedCategories, setValue, categoryRates]);

  return (
    <div className="space-y-6">
       <div>
        <Label>
            Tell us your areas of expertise
        </Label>
        <p className="text-gray-500 text-xs mb-2">You can select more than one option</p>
        {/* @ts-ignore */}
        <Controller
            name="service_categories"
            control={control}
            render={({ field, fieldState }) => (
            <MultiSelectDropdown
                title="Service Categories"
                options={serviceCategoryOptions}
                value={field.value || []}
                onChange={field.onChange}
                errorMessage={fieldState.error}
            />
            )}
        />
        </div>

      {selectedCategories.length > 0 && (
          <div className="flex flex-col gap-8">
            {selectedCategories.map((cat: any) => {
                const categorySlug = cat.slug?.toLowerCase() || '';
                
                // Define labels based on category
                let hourlyLabel = "Hourly Rate";
                let halfDayLabel = "Half Day Rate";
                let fullDayLabel = "Full Day Rate";
                let hideFullDay = false;
                
                if (categorySlug.includes("makeup")) {
                    hourlyLabel = "Min. glam and go";
                    halfDayLabel = "Min. half day shoot rate (4h)";
                    fullDayLabel = "Min. full day shoot rate";
                } else if (categorySlug.includes("hair")) {
                    hourlyLabel = "Min. style and go";
                    halfDayLabel = "Min. half day shoot rate (4h)";
                    fullDayLabel = "Min. full day shoot rate";
                } else if (categorySlug.includes("nail")) {
                    hourlyLabel = "Min. press ons (per set)";
                    halfDayLabel = "Min. nail art (per set)";
                    hideFullDay = true;
                }

                return (
                    <div key={cat.slug} className="space-y-4 border-b pb-4 last:border-0 border-gray-200 dark:border-gray-800">
                        <h3 className="text-sm font-semibold uppercase text-gray-500">{cat.name}</h3>
                        <div className="flex items-start gap-4">
                            <div className="flex-1">
                                <Label>{hourlyLabel}</Label>
                                <CurrencyInput
                                    register={register}
                                    registerOptions={`category_rates.${cat.slug}.hourly`}
                                    placeholder="In GBP"
                                    errors={errors}
                                    maxLength={6}
                                />
                            </div>

                            <div className="flex-1">
                                <Label>{halfDayLabel}</Label>
                                <CurrencyInput
                                    register={register}
                                    registerOptions={`category_rates.${cat.slug}.half_day`}
                                    placeholder="In GBP"
                                    errors={errors}
                                    maxLength={6}
                                />
                            </div>

                            {!hideFullDay && (
                                <div className="flex-1">
                                    <Label>{fullDayLabel}</Label>
                                    <CurrencyInput
                                        register={register}
                                        registerOptions={`category_rates.${cat.slug}.full_day`}
                                        placeholder="In GBP"
                                        errors={errors}
                                        maxLength={6}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
          </div>
      )}
    </div>
  );
};

export default ChargingRates;