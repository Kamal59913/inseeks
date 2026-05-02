"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PaymentValidationSchema,
  PaymentValidationType,
} from "../validation/payment.validation";
import { ToastService } from "@/lib/utilities/toastService";
import customerService from "@/services/customerService";
import { shouldShowApplePay } from "@/lib/utilities/userAgentDetails";
import { useState, useEffect } from "react";
import paymentService from "@/services/paymentService";
import { loadStripe, PaymentRequest } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  Coupon,
  DirectPaymentPayload,
  PromoCodeResponse,
} from "@/types/api/payment.types";
import { PaymentMethodSelector } from "./payment/PaymentMethodSelector";
import { CardFields } from "./payment/CardFields";
import { ApplePayButton } from "./payment/ApplePayButton";
import { PromoSection } from "./payment/PromoSection";
import { OrderSummary } from "./payment/OrderSummary";

// Safe initialization
const STRIPE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = STRIPE_KEY ? loadStripe(STRIPE_KEY) : null;

interface PaymentFormProps {
  paymentData: PaymentValidationType;
  setPaymentData: (data: Partial<PaymentValidationType>) => void;
  total: number;
  discount?: number;
  promoApplied?: string | null;
  setPromoApplied: (promo: string) => void;
  setAppliedCoupon?: (coupon: Coupon) => void;
  appliedCoupons?: Coupon[];
  removeCoupon: (code: string) => void;
  onSubmit: (data?: Partial<PaymentValidationType>) => Promise<void>;
  goBack?: () => void;
  basePrice: number;
  customerFeeAmount: number;
  customerFeePercent: number;
}

function PaymentForm({
  paymentData,
  setPaymentData,
  total,
  setPromoApplied,
  setAppliedCoupon,
  appliedCoupons = [],
  removeCoupon,
  onSubmit,
  basePrice,
  customerFeeAmount,
  customerFeePercent,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [showApplePay, setShowApplePay] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "applepay">(
    "card",
  );
  const [isProcessingApplePay, setIsProcessingApplePay] = useState(false);
  const [isProcessingCard, setIsProcessingCard] = useState(false);

  const [cardErrors, setCardErrors] = useState<{
    cardNumber?: string;
    expiry?: string;
    cvc?: string;
  }>({});

  const handleCardChange = (
    event: { error?: { message: string } },
    field: keyof typeof cardErrors,
  ) => {
    setCardErrors((prev) => ({
      ...prev,
      [field]: event.error ? event.error.message : undefined,
    }));
  };

  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(
    null,
  );

  useEffect(() => {
    const canShowApplePay = shouldShowApplePay();
    setShowApplePay(canShowApplePay);
  }, []);

  useEffect(() => {
    if (!stripe || !total || !showApplePay) return;

    const pr = stripe.paymentRequest({
      country: "GB",
      currency: "gbp",
      total: {
        label: "Empera Booking",
        amount: Math.round((Number(total) || 0) * 100),
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr);
      }
    });

    // Clean up or re-bind if total changes
    return () => {
      // pr.off() if needed, but recreating is fine
    };
  }, [stripe, total, showApplePay]);

  useEffect(() => {
    if (!paymentRequest) return;

    const handlePaymentMethod = async (ev: any) => {
      // Stripe paymentmethod event
      setIsProcessingApplePay(true);
      try {
        const payload: DirectPaymentPayload = {
          amount: total,
          currency: "gbp",
        };
        const response = await paymentService.makeDirectPayment(payload);

        if (response?.data?.success && response.data.clientSecret) {
          const appleData = {
            ...paymentData,
            paymentMethod: "applepay",
            clientSecret: response.data.clientSecret,
            paymentMethodId: ev.paymentMethod.id,
          };

          setPaymentData(appleData);

          try {
            await onSubmit(appleData);
            ev.complete("success");
            ToastService.success(
              "Apple Pay authorized successfully!",
              "applepay-success",
            );
          } catch (error) {
            ev.complete("fail");
            console.error("Apple Pay submission error:", error);
          }
        } else {
          ev.complete("fail");
          ToastService.error("Failed to initiate payment flow");
        }
      } catch (error: unknown) {
        ev.complete("fail");
        console.error("Apple Pay Error:", error);
        ToastService.error(
          "An error occurred with Apple Pay",
          "applepay-error",
        );
      } finally {
        setIsProcessingApplePay(false);
      }
    };

    const handleCancel = () => {
      setIsProcessingApplePay(false);
    };

    paymentRequest.on("paymentmethod", handlePaymentMethod);
    paymentRequest.on("cancel", handleCancel);

    return () => {
      paymentRequest.off("paymentmethod");
      paymentRequest.off("cancel");
    };
  }, [paymentRequest, total, paymentData, onSubmit]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PaymentValidationType>({
    resolver: zodResolver(PaymentValidationSchema()),
    defaultValues: {
      cardNumber: "",
      expiry: "",
      cvc: "",
      country: paymentData.country || "United Kingdom",
      postal: paymentData.postal || "",
      promo: paymentData.promo || "",
    },
  });

  const promoValue = watch("promo");

  const applyPromo = async () => {
    if (!promoValue) {
      ToastService.error("Please enter a promo code", "promo-error");
      return;
    }

    const result = (await customerService.applyPromoCode(promoValue)) as {
      data: PromoCodeResponse;
    };

    if (result?.data?.valid && result?.data?.coupon) {
      setPaymentData({ ...paymentData, promo: promoValue });
      setPromoApplied(promoValue);

      if (setAppliedCoupon) {
        setAppliedCoupon({
          code: result.data.coupon.code,
          discountType: result.data.coupon.discountType,
          discountValue: result.data.coupon.discountValue,
        });
      }

      ToastService.success(
        result?.data?.message || "Promo applied successfully!",
        "promo-success",
      );
    } else {
      ToastService.error(
        result?.data.message || "Invalid promo code",
        "promo-error",
      );
    }
  };

  const handleApplePayClick = () => {
    if (!stripe) {
      ToastService.error("Stripe not loaded");
      return;
    }

    if (!paymentRequest) {
      ToastService.error("Apple Pay is not available on this device/browser");
      return;
    }

    // Trigger Apple Pay sheet immediately on user click
    paymentRequest.show();
  };

  const onFormSubmit = async (data: PaymentValidationType) => {
    // If Apple Pay was selected, this form submit shouldn't happen usually, but just in case
    if (paymentMethod === "applepay") {
      setIsProcessingApplePay(true);
      try {
        await onSubmit(paymentData);
      } finally {
        setIsProcessingApplePay(false);
      }
      return;
    }

    if (!stripe || !elements) {
      ToastService.error(
        "Payment system not loaded completely. Please try again.",
      );
      return;
    }

    setIsProcessingCard(true);

    try {
      const cardNumberElement = elements.getElement(CardNumberElement);
      if (!cardNumberElement) {
        ToastService.error("Please enter card details.");
        setIsProcessingCard(false);
        return;
      }

      const { error, paymentMethod: stripePaymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardNumberElement,
          billing_details: {
            address: {
              postal_code: data.postal,
              country: data.country === "United Kingdom" ? "GB" : "US",
            },
          },
        });

      if (error) {
        console.error("Stripe createPaymentMethod error:", error);
        // Now we prefer inline errors, maybe toast unrelated ones
        // ToastService.error(error.message || "Payment processing failed. Please check your card details.");
        setIsProcessingCard(false);
        return;
      }

      // Successfully created payment method
      const cardData = {
        ...data,
        paymentMethod: "card",
        paymentMethodId: stripePaymentMethod.id,
      };

      setPaymentData(cardData);

      // Proceed to booking submission
      await onSubmit(cardData);
    } catch (err: unknown) {
      console.error("Payment form submit error:", err);
      ToastService.error(
        "An unexpected error occurred during payment processing.",
      );
    } finally {
      setIsProcessingCard(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      {/* Payment Method Selection */}
      {showApplePay && (
        <PaymentMethodSelector
          paymentMethod={paymentMethod}
          onSelect={setPaymentMethod}
        />
      )}

      {/* Card Payment Form - only show if card is selected */}
      {paymentMethod === "card" && (
        <CardFields
          cardErrors={cardErrors}
          onCardChange={handleCardChange}
          register={register}
          errors={errors}
        />
      )}

      {/* Apple Pay Button */}
      {paymentMethod === "applepay" && (
        <ApplePayButton
          isProcessing={isProcessingApplePay}
          onClick={handleApplePayClick}
        />
      )}

      {/* PROMO - Always visible */}
      <PromoSection register={register} errors={errors} onApply={applyPromo} />

      {/* ORDER SUMMARY */}
      <OrderSummary
        basePrice={basePrice}
        customerFeeAmount={customerFeeAmount}
        customerFeePercent={customerFeePercent}
        appliedCoupons={appliedCoupons}
        total={total}
        removeCoupon={removeCoupon}
      />

      {/* Submit button only for card payment */}
      {paymentMethod === "card" && (
        <div className="mt-6 grid gap-3">
          <button
            type="submit"
            disabled={isProcessingCard}
            className="text-sm py-3 rounded-lg bg-white text-black font-bold w-full disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isProcessingCard ? "Processing..." : "Send booking request"}
          </button>
        </div>
      )}
    </form>
  );
}

export default function PaymentStep(props: PaymentFormProps) {
  if (!stripePromise) {
    console.error(
      "Stripe Promise failed to initialize. Check your env variables.",
    );
    // We still render content but elements might fail.
    // Ideally show an error state if key is missing.
  }

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
}
