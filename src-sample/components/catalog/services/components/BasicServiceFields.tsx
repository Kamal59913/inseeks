import { Controller, UseFormReturn } from "react-hook-form";
import Label from "@/components/ui/form/label";
import Input from "@/components/ui/form/Input";
import TextArea from "@/components/ui/form/TextArea";
import SingleSelectDropdown from "@/components/ui/dropdown/SingleSelectController";
import { ServiceFormData } from "@/types/api/services.types";

interface Props {
  formMethods: UseFormReturn<ServiceFormData, any, any>;
  serviceCategoryOptions: Array<{ value: string; label: string }>;
}

export const BasicServiceFields = ({ formMethods, serviceCategoryOptions }: Props) => {
  return (
    <div className="space-y-4">
      {/* Product name */}
      <div>
        <Label>Product name</Label>
        <Input
          type="text"
          register={formMethods?.register}
          registerOptions={"product_name"}
          errors={formMethods?.formState?.errors}
          placeholder="Product Name"
          autoFocus={true}
          maxLength={51}
        />
      </div>

      {/* Pick a category */}
      <div>
        <Label>Pick a category</Label>
        <Controller
          name="product_category"
          control={formMethods.control}
          render={({ field, fieldState }) => (
            <SingleSelectDropdown
              title=""
              options={serviceCategoryOptions}
              value={field.value?.toString()}
              onChange={(val) => {
                field.onChange(val);
              }}
              errorMessage={fieldState.error}
              showSearch={false}
            />
          )}
        />
      </div>

      <div>
        <Label>Product Description</Label>
        <TextArea
          register={formMethods?.register}
          registerOptions={"product_description"}
          errors={formMethods?.formState?.errors}
          placeholder="Product Description"
          maxLength={51}
        />
      </div>
    </div>
  );
};
