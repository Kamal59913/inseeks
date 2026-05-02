import { Controller, UseFormReturn, FieldErrors } from "react-hook-form";
import { Trash2 } from "lucide-react";
import Label from "@/components/ui/form/label";
import Input from "@/components/ui/form/Input";
import DurationInput from "@/components/ui/form/DurationInput";
import CurrencyInput from "@/components/ui/form/CurrencyInput";
import { ServiceFormData } from "@/types/api/services.types";

interface Props {
  index: number;
  formMethods: UseFormReturn<ServiceFormData, any, any>;
  onRemove: (index: number) => void;
  showRemove: boolean;
}

export const ProductOptionItem = ({
  index,
  formMethods,
  onRemove,
  showRemove,
}: Props) => {
  const errors = formMethods.formState.errors as FieldErrors<ServiceFormData>;
  return (
    <div className="space-y-4 border border-gray-700/30 rounded-lg p-4 bg-white/5">
      <div className="flex items-center justify-between">
        <h3 className="text-white text-sm font-medium">Option {index + 1}</h3>
        {showRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onRemove(index);
            }}
            className="text-red-400 hover:text-red-300 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <div>
        <Label>Name</Label>
        <Input
          type="text"
          register={formMethods?.register}
          registerOptions={`product_options.${index}.product_name`}
          errorSingleMessage={
            errors.product_options?.[index]?.product_name
              ?.message as string
          }
          placeholder="Name"
          maxLength={51}
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label>Duration</Label>
          <Controller
            name={`product_options.${index}.product_duration`}
            control={formMethods.control}
            render={({ field }) => (
              <DurationInput
                value={field.value}
                onChange={field.onChange}
                registerOptions={`product_options.${index}.product_duration`}
                errorSingleMessage={
                  errors.product_options?.[index]
                    ?.product_duration?.message as string
                }
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
            registerOptions={`product_options.${index}.product_price`}
            errorSingleMessage={
              errors.product_options?.[index]
                ?.product_price?.message as string
            }
            placeholder="£30"
            maxLength={6}
          />
        </div>
        <div>
          <Label>Payout</Label>
          <CurrencyInput
            register={formMethods?.register}
            registerOptions={`product_options.${index}.product_payout`}
            errorSingleMessage={
              errors.product_options?.[index]
                ?.product_payout?.message as string
            }
            placeholder="£20"
            maxLength={6}
            disabled={true}
          />
        </div>
      </div>
    </div>
  );
};
