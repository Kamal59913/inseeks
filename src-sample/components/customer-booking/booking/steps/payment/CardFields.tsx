import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import Label from "@/components/ui/form/label";
import Input from "@/components/ui/form/Input";
import { PaymentValidationType } from "../../validation/payment.validation";

const ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "12px",
      color: "#ffffff",
      fontFamily: "Inter, sans-serif",
      "::placeholder": {
        color: "#aab7c4",
      },
      backgroundColor: "transparent",
    },
    invalid: {
      color: "#ef4444",
    },
  },
};

interface CardFieldsProps {
  cardErrors: {
    cardNumber?: string;
    expiry?: string;
    cvc?: string;
  };
  onCardChange: (
    event: { error?: { message: string } },
    field: "cardNumber" | "expiry" | "cvc"
  ) => void;
  register: UseFormRegister<PaymentValidationType>;
  errors: FieldErrors<PaymentValidationType>;
}

export function CardFields({
  cardErrors,
  onCardChange,
  register,
  errors,
}: CardFieldsProps) {
  return (
    <div className="mt-4 space-y-3">
      {/* Card number */}
      <div>
        <Label>Card Number</Label>
        <div
          className={`mt-2 w-full text-xs rounded-lg p-3 bg-[#1a0a1a] border ${cardErrors.cardNumber ? "border-red-500" : "border-white/5"}`}
        >
          <CardNumberElement
            options={ELEMENT_OPTIONS}
            onChange={(e) => onCardChange(e, "cardNumber")}
          />
        </div>
        {cardErrors.cardNumber && (
          <p className="mt-1.5 text-xs text-red-500">{cardErrors.cardNumber}</p>
        )}
      </div>

      {/* Expiry + CVC */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Expiration date</Label>
          <div
            className={`mt-2 w-full text-xs rounded-lg p-3 bg-[#1a0a1a] border ${cardErrors.expiry ? "border-red-500" : "border-white/5"}`}
          >
            <CardExpiryElement
              options={ELEMENT_OPTIONS}
              onChange={(e) => onCardChange(e, "expiry")}
            />
          </div>
          {cardErrors.expiry && (
            <p className="mt-1.5 text-xs text-red-500">{cardErrors.expiry}</p>
          )}
        </div>

        <div>
          <Label>Security code</Label>
          <div
            className={`mt-2 w-full text-xs rounded-lg p-3 bg-[#1a0a1a] border ${cardErrors.cvc ? "border-red-500" : "border-white/5"}`}
          >
            <CardCvcElement
              options={ELEMENT_OPTIONS}
              onChange={(e) => onCardChange(e, "cvc")}
            />
          </div>
          {cardErrors.cvc && (
            <p className="mt-1.5 text-xs text-red-500">{cardErrors.cvc}</p>
          )}
        </div>
      </div>

      {/* Country + Postal */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Billing country</Label>
          <select
            {...register("country")}
            className="mt-2 w-full text-xs rounded-lg p-3 bg-[#1a0a1a] border border-white/5 text-white"
          >
            <option value="United Kingdom">United Kingdom</option>
            <option value="United States">United States</option>
          </select>
        </div>

        <div>
          <Label>Postal code</Label>
          <Input
            register={register}
            registerOptions="postal"
            type="text"
            placeholder="Postal code"
            errors={errors}
            className="mt-2 w-full text-xs rounded-lg p-3 bg-[#1a0a1a] border border-white/5"
          />
        </div>
      </div>
    </div>
  );
}
