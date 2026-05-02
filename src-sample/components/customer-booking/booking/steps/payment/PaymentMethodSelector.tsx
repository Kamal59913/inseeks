interface PaymentMethodSelectorProps {
  paymentMethod: "card" | "applepay";
  onSelect: (method: "card" | "applepay") => void;
}

import Label from "@/components/ui/form/label";

export function PaymentMethodSelector({
  paymentMethod,
  onSelect,
}: PaymentMethodSelectorProps) {
  return (
    <div className="mb-4">
      <Label>Payment Method</Label>
      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={() => onSelect("card")}
          className={`flex-1 py-2 rounded-lg text-[14px] font-medium transition-colors ${
            paymentMethod === "card"
              ? "bg-white text-black"
              : "bg-[#1a0a1a] border border-white/5 text-white"
          }`}
        >
          Card
        </button>
        <button
          type="button"
          onClick={() => onSelect("applepay")}
          className={`flex-1 py-2 rounded-lg text-[14px] font-medium transition-colors ${
            paymentMethod === "applepay"
              ? "bg-white text-black"
              : "bg-[#1a0a1a] border border-white/5 text-white"
          }`}
        >
          Apple Pay
        </button>
      </div>
    </div>
  );
}
