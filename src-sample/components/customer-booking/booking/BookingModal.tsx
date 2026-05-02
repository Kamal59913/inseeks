"use client";
import { useMemo, useEffect, ChangeEvent } from "react";
import { Step } from "./types";
import { useGlobalStates } from "@/store/hooks/useGlobalStates";
import { useBookingPersistence } from "../hook/useBookingPersistence";
import { convertTo24Hour } from "../../../lib/utilities/timeUtils";
import { useBookingSubmission } from "./hooks/useBookingSubmission";
import profilePortfolioService from "@/services/profilePortfolioServices";
import BookingHeader from "./BookingHeader";
import BookingSteps from "./BookingSteps";
import ConfirmStep from "./steps/ConfirmStep";

import {
  Freelancer,
  FreelancerService,
  ServiceOption,
} from "@/types/api/freelancer.types";

type Props = {
  selected: Freelancer;
  closeModal: () => void;
  initialServiceId?: number | null;
  initialOptionId?: number | null;
  freelancer?: Freelancer;
};

export default function BookingModal({
  selected,
  closeModal,
  initialServiceId = null,
  initialOptionId = null,
  freelancer,
}: Props) {
  const { setPageLoading } = useGlobalStates();
  const { bookingState, updateBookingState, clearPersistedData } =
    useBookingPersistence(
      String(selected.id),
      initialServiceId,
      initialOptionId,
    );

  const freelancerProfile = selected;
  const useConfirmModal = true;

  // Derived Data
  const selectedService: FreelancerService | undefined = useMemo(() => {
    return freelancerProfile?.services?.find(
      (s: FreelancerService) => s.id === bookingState.selectedServiceId,
    );
  }, [freelancerProfile, bookingState.selectedServiceId]);

  const selectedOption: ServiceOption | undefined = useMemo(() => {
    return selectedService?.options?.find(
      (o: ServiceOption) => o.id === bookingState.selectedOptionId,
    );
  }, [selectedService, bookingState.selectedOptionId]);

  const headerTitle = selectedService?.name || "Booking";
  const basePrice = selectedOption?.price || 0;

  // Fee calculation logic
  const customerFeePercent = freelancerProfile?.customer_fee_percent ?? 5;
  const customerFeeAmount = (basePrice * customerFeePercent) / 100;

  const discount =
    bookingState.appliedCoupons?.length > 0
      ? bookingState.appliedCoupons.reduce((acc: number, coupon: any) => {
          if (coupon.discountType === "flat") return acc + coupon.discountValue;
          if (coupon.discountType === "percent")
            return acc + (basePrice * coupon.discountValue) / 100;
          return acc;
        }, 0)
      : 0;

  const total = basePrice + customerFeeAmount - discount;

  // Days for the calendar
  const days = useMemo(() => {
    const arr: { date: Date }[] = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      arr.push({ date: d });
    }
    return arr;
  }, []);

  // Submission Logic
  const { handleSubmitBooking } = useBookingSubmission({
    bookingState,
    updateBookingState,
    selected,
    selectedService,
    selectedOption,
    freelancerProfile,
    total,
    setPageLoading,
    clearPersistedData,
    convertTo24Hour,
  });

  // Handlers
  const goNext = () => {
    if (bookingState.step === Step.SERVICE)
      updateBookingState({ step: Step.TIME });
    else if (bookingState.step === Step.TIME)
      updateBookingState({ step: Step.DETAILS });
  };

  const goPrev = () => {
    if (bookingState.step === Step.TIME) {
      if ((selectedService?.options || []).length > 1)
        updateBookingState({ step: Step.SERVICE });
    } else if (bookingState.step === Step.DETAILS)
      updateBookingState({ step: Step.TIME });
    else if (bookingState.step === Step.LOCATION)
      updateBookingState({ step: Step.DETAILS });
    else if (bookingState.step === Step.CUSTOMER)
      updateBookingState({ step: Step.LOCATION });
    else if (bookingState.step === Step.PAYMENT)
      updateBookingState({ step: Step.CUSTOMER });
  };

  const handleFileChange = async (
    index: number,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const startUploading = [...bookingState.isUploading];
    startUploading[index] = true;
    updateBookingState({ isUploading: startUploading });

    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await profilePortfolioService.uploadImages(formData, true);
      if (res?.data?.data?.url) {
        const newUrls = [...bookingState.uploadedUrls];
        const newPreviews = [...bookingState.imagePreviews];
        newUrls[index] = res.data.data.url;
        newPreviews[index] = res.data.data.thumbnailUrl || URL.createObjectURL(file);
        updateBookingState({
          uploadedUrls: newUrls,
          imagePreviews: newPreviews,
        });
      }
    } finally {
      const stopUploading = [...bookingState.isUploading];
      stopUploading[index] = false;
      updateBookingState({ isUploading: stopUploading });
    }
  };

  const removeImage = (index: number) => {
    const newUrls = [...bookingState.uploadedUrls];
    const newPreviews = [...bookingState.imagePreviews];
    newUrls[index] = "";
    newPreviews[index] = "";
    updateBookingState({ uploadedUrls: newUrls, imagePreviews: newPreviews });
  };

  const isConfirmModalActive =
    useConfirmModal && bookingState.step === Step.CONFIRM;

  if (!bookingState.selectedServiceId) return null;

  return (
    <>
      {!isConfirmModalActive && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[92vh] rounded-t-2xl overflow-hidden flex justify-center">
            <div className="max-w-[390px] text-white rounded-t-2xl w-full p-4 min-h-[60vh] max-h-[92vh] overflow-auto bg-[linear-gradient(184deg,#5A0071_-146.61%,#000_111.69%)]">
              <BookingHeader
                step={bookingState.step as Step}
                headerTitle={headerTitle}
                basePrice={basePrice}
                selectedDay={bookingState.selectedDay}
                selectedSlot={bookingState.selectedSlot}
                selectedServiceOptionsLength={
                  (selectedService?.options || []).length
                }
                goPrev={goPrev}
                closeModal={closeModal}
              />

              <div className="border-t border-white/20 my-6 -mx-5" />

              <BookingSteps
                step={bookingState.step as Step}
                bookingState={bookingState}
                selectedService={selectedService}
                selectedOption={selectedOption}
                selected={selected}
                freelancer={freelancer}
                days={days}
                basePrice={basePrice}
                discount={discount}
                total={total}
                customerFeeAmount={customerFeeAmount}
                customerFeePercent={customerFeePercent}
                updateBookingState={updateBookingState}
                goNext={goNext}
                handleSubmitBooking={handleSubmitBooking}
                handleFileChange={handleFileChange}
                removeImage={removeImage}
                closeModal={closeModal}
                useConfirmModal={useConfirmModal}
              />
            </div>
          </div>
        </div>
      )}

      {isConfirmModalActive && (
        <ConfirmStep
          selected={selected}
          closeModal={closeModal}
          freelancer={freelancer}
        />
      )}
    </>
  );
}
