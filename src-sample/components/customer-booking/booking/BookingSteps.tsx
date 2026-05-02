"use client";
import React from "react";
import { Step } from "./types";
import { PaymentValidationType } from "./validation/payment.validation";
import ServiceStep from "./steps/ServiceStep";
import TimeStep from "./steps/TimeStep";
import DetailsStep from "./steps/DetailsStep";
import LocationStep from "./steps/LocationStep";
import CustomerStep from "./steps/CustomerStep";
import PaymentStep from "./steps/PaymentStep";
import ConfirmStepSheet from "./steps/ConfirmStepSheet";
import { Coupon } from "@/types/api/payment.types";

import {
  Freelancer,
  FreelancerService,
  ServiceOption,
} from "@/types/api/freelancer.types";
import { BookingState } from "../hook/useBookingPersistence";

interface BookingStepsProps {
  step: Step;
  bookingState: BookingState;
  selectedService: FreelancerService | undefined;
  selectedOption: ServiceOption | undefined;
  selected: Freelancer;
  freelancer: Freelancer | undefined;
  days: { date: Date }[];
  basePrice: number;
  discount: number;
  total: number;
  customerFeeAmount: number;
  customerFeePercent: number;
  updateBookingState: (data: Partial<BookingState>) => void;
  goNext: () => void;
  handleSubmitBooking: (
    paymentDataOverride?: Partial<PaymentValidationType>,
  ) => Promise<void>;
  handleFileChange: (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  removeImage: (index: number) => void;
  closeModal: () => void;
  useConfirmModal: boolean;
}

export default function BookingSteps({
  step,
  bookingState,
  selectedService,
  selectedOption,
  selected,
  freelancer,
  days,
  basePrice,
  discount,
  total,
  customerFeeAmount,
  customerFeePercent,
  updateBookingState,
  goNext,
  handleSubmitBooking,
  handleFileChange,
  removeImage,
  closeModal,
  useConfirmModal,
}: BookingStepsProps) {
  switch (step) {
    case Step.SERVICE:
      return (
        <ServiceStep
          venueOption={bookingState.venueOption}
          setVenueOption={(v: string) => updateBookingState({ venueOption: v })}
          service={selectedService}
          selectedOptionId={bookingState.selectedOptionId}
          setSelectedOptionId={(id: number | null) =>
            updateBookingState({ selectedOptionId: id })
          }
          goNext={goNext}
          selected={selected}
        />
      );

    case Step.TIME:
      return (
        <TimeStep
          days={days}
          selectedDay={bookingState.selectedDay}
          setSelectedDay={(day: string | null) =>
            updateBookingState({ selectedDay: day ?? "" })
          }
          selectedSlot={bookingState.selectedSlot}
          setSelectedSlot={(slot: string | null) =>
            updateBookingState({ selectedSlot: slot })
          }
          goNext={goNext}
          freelancerUuid={selected.uuid}
          productOptionId={selectedOption?.id}
        />
      );

    case Step.DETAILS:
      return (
        <DetailsStep
          notes={bookingState.notes}
          setNotes={(notes: string) => updateBookingState({ notes })}
          imagePreviews={bookingState.imagePreviews}
          handleFileChange={handleFileChange}
          removeImage={removeImage}
          isUploading={bookingState.isUploading}
          goNext={() => updateBookingState({ step: Step.LOCATION })}
        />
      );

    case Step.LOCATION:
      return (
        <LocationStep
          location={bookingState.location}
          setLocation={(loc: any) => updateBookingState({ location: loc })}
          goNext={() => updateBookingState({ step: Step.CUSTOMER })}
        />
      );

    case Step.CUSTOMER:
      return (
        <CustomerStep
          customerData={bookingState.customerData}
          setCustomerData={(data: any) =>
            updateBookingState({ customerData: data })
          }
          goNext={() => updateBookingState({ step: Step.PAYMENT })}
        />
      );

    case Step.PAYMENT:
      return (
        <PaymentStep
          paymentData={bookingState.paymentData}
          setPaymentData={(data: any) =>
            updateBookingState({ paymentData: data })
          }
          basePrice={basePrice}
          discount={discount}
          total={total}
          customerFeeAmount={customerFeeAmount}
          customerFeePercent={customerFeePercent}
          promoApplied={bookingState.promoApplied}
          setPromoApplied={(promo: string) =>
            updateBookingState({ promoApplied: promo })
          }
          setAppliedCoupon={(coupon: Coupon) => {
            updateBookingState({ appliedCoupons: [coupon] });
          }}
          appliedCoupons={bookingState.appliedCoupons || []}
          removeCoupon={(code: string) => {
            const current: Coupon[] = bookingState.appliedCoupons || [];
            updateBookingState({
              appliedCoupons: current.filter((c: Coupon) => c.code !== code),
            });
          }}
          goBack={() => updateBookingState({ step: Step.CUSTOMER })}
          onSubmit={handleSubmitBooking}
        />
      );

    case Step.CONFIRM:
      if (!useConfirmModal) {
        return (
          <ConfirmStepSheet
            selected={selected}
            closeModal={closeModal}
            freelancer={freelancer}
          />
        );
      }
      return null;

    default:
      return null;
  }
}
