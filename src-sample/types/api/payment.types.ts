export interface PromoCodeResponse {
  valid: boolean;
  coupon?: {
    code: string;
    discountType: "flat" | "percentage";
    discountValue: number;
  };
  message?: string;
}

export interface DirectPaymentPayload {
  amount: number | string;
  currency: string;
}

export interface DirectPaymentResponse {
  success: boolean;
  clientSecret?: string;
  message?: string;
}

export interface Coupon {
  code: string;
  discountType: "flat" | "percentage";
  discountValue: number;
}
