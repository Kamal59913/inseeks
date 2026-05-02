import { Controller, UseFormReturn } from "react-hook-form";
import Label from "@/components/ui/form/label";
import DurationInput from "@/components/ui/form/DurationInput";
import CurrencyInput from "@/components/ui/form/CurrencyInput";
import { ServiceFormData } from "@/types/api/services.types";

interface Props {
  formMethods: UseFormReturn<ServiceFormData, any, any>;
}

export const SingleProductFields = ({ formMethods }: Props) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div>
        <Label>Duration</Label>
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
              minuteStep={15}
              maxHours={12}
            />
          )}
        />
      </div>
      <div>
        <Label>Price</Label>
        <CurrencyInput
          register={formMethods?.register}
          registerOptions={`initial_product_price`}
          errors={formMethods?.formState?.errors}
          placeholder="£30"
          maxLength={6}
        />
      </div>
      <div>
        <Label>Payout</Label>
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
  );
};
