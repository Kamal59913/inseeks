import { UseFormRegister, FieldErrors } from "react-hook-form";
import Label from "@/components/ui/form/label";
import Input from "@/components/ui/form/Input";
import Button from "@/components/ui/button/Button";
import { useGlobalStates } from "@/store/hooks/useGlobalStates";
import { PaymentValidationType } from "../../validation/payment.validation";

interface PromoSectionProps {
  register: UseFormRegister<PaymentValidationType>;
  errors: FieldErrors<PaymentValidationType>;
  onApply: () => void;
}

export function PromoSection({ register, errors, onApply }: PromoSectionProps) {
  const { isButtonLoading } = useGlobalStates();

  return (
    <div className="flex items-center flex-wrap mt-4">
      <Label>Promo code</Label>

      <div className="relative w-full">
        <Input
          register={register}
          registerOptions="promo"
          type="text"
          placeholder="Promo code"
          errors={errors}
          className="mt-2 w-full text-xs rounded-lg p-3 bg-[#1a0a1a] border border-white/5"
        />

        <Button
          type="button"
          onClick={onApply}
          className="px-3 text-[14px] absolute top-[13px] right-[5px] bg-white rounded-lg text-black font-[500]"
          size="xs"
        >
          {isButtonLoading("apply-promo-code") ? "Applying..." : "Apply"}
        </Button>
      </div>
    </div>
  );
}
