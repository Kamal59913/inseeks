import { Coupon } from "@/types/api/payment.types";

interface OrderSummaryProps {
  basePrice: number;
  customerFeeAmount: number;
  customerFeePercent: number;
  appliedCoupons: Coupon[];
  total: number;
  removeCoupon: (code: string) => void;
}

export function OrderSummary({
  basePrice,
  customerFeeAmount,
  customerFeePercent,
  appliedCoupons,
  total,
  removeCoupon,
}: OrderSummaryProps) {
  return (
    <>
      <div className="mt-4 border-t border-white/20 my-6 -mx-5"></div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-[#EEEEEE]">
          <span>Subtotal</span>
          <span>£{basePrice.toFixed(2)}</span>
        </div>

        {customerFeeAmount > 0 && (
          <div className="flex justify-between text-sm text-[#EEEEEE]">
            <span>Service Fee ({customerFeePercent}%)</span>
            <span>£{customerFeeAmount.toFixed(2)}</span>
          </div>
        )}

        {appliedCoupons.map((coupon, index: number) => (
          <div
            key={index}
            className="flex justify-between items-center rounded-lg text-sm text-[#EEEEEE]"
          >
            <div className="flex items-center gap-2 bg-[#2A1A2A] p-2 rounded-md">
              <span className="uppercase font-medium">{coupon.code}</span>
              <button
                type="button"
                onClick={() => removeCoupon(coupon.code)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>
            <span className="text-[#EEEEEE]">
              -£
              {coupon.discountType === "flat"
                ? coupon.discountValue.toFixed(2)
                : Math.round(
                    (basePrice + customerFeeAmount) *
                      (coupon.discountValue / 100),
                  ).toFixed(2)}
            </span>
          </div>
        ))}

        <div className="flex text-sm justify-between font-bold text-white">
          <span>TOTAL</span>
          <span>£{total.toFixed(2)}</span>
        </div>
      </div>

      <p className="text-xs text-[#F5F5F5] mt-2 font-normal">
        A temporary hold of £{total.toFixed(2)} will be placed on your card.
      </p>
    </>
  );
}
