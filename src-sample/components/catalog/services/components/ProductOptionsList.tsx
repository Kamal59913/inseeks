import { UseFormReturn } from "react-hook-form";
import { Plus } from "lucide-react";
import Button from "@/components/ui/button/Button";
import { ProductOptionItem } from "./ProductOptionItem";
import { ServiceFormData } from "@/types/api/services.types";

interface Props {
  fields: any[];
  formMethods: UseFormReturn<ServiceFormData, any, any>;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export const ProductOptionsList = ({
  fields,
  formMethods,
  onAdd,
  onRemove,
}: Props) => {
  return (
    <>
      {fields.map((field, index) => (
        <ProductOptionItem
          key={field.id}
          index={index}
          formMethods={formMethods}
          onRemove={onRemove}
          showRemove={index >= 2}
        />
      ))}

      <Button
        variant="glass"
        size="none"
        borderRadius="rounded-[16px]"
        onClick={onAdd}
        className="min-h-[42px] max-w-[136px] w-full text-[14px] flex gap-2 items-center justify-center font-medium active:scale-95 transition-all"
      >
        New Option
        <Plus className="w-4 h-4" />
      </Button>
    </>
  );
};
