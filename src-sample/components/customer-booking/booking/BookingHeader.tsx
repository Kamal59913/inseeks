"use client";
import { ShowIf } from "@/lib/utilities/showIf";
import { Step } from "./types";

interface BookingHeaderProps {
  step: Step;
  headerTitle: string;
  basePrice: number;
  selectedDay: string;
  selectedSlot: string | null;
  selectedServiceOptionsLength: number;
  goPrev: () => void;
  closeModal: () => void;
}

export default function BookingHeader({
  step,
  headerTitle,
  basePrice,
  selectedDay,
  selectedSlot,
  selectedServiceOptionsLength,
  goPrev,
  closeModal,
}: BookingHeaderProps) {
  const showBackButton =
    step !== Step.SERVICE &&
    !(step === Step.TIME && selectedServiceOptionsLength === 1);

  return (
    <div className="text-center">
      <div className="flex items-center mb-3">
        <ShowIf condition={showBackButton}>
          <button onClick={goPrev} className="text-white/80">
            ←
          </button>
        </ShowIf>
        <button onClick={closeModal} className="text-white/80 ml-auto">
          ✕
        </button>
      </div>

      {step !== Step.DETAILS &&
        step !== Step.LOCATION &&
        step !== Step.CUSTOMER && (
          <div className="font-semibold">{headerTitle}</div>
        )}

      {step !== Step.SERVICE &&
        step !== Step.DETAILS &&
        step !== Step.LOCATION &&
        step !== Step.CUSTOMER && (
          <div className="text-sm text-[#EEEEEE] mt-2 mb-2">£{basePrice}</div>
        )}

      {step !== Step.SERVICE &&
        step !== Step.DETAILS &&
        step !== Step.LOCATION &&
        step !== Step.CUSTOMER &&
        selectedSlot && (
          <div className="text-sm text-[#EEEEEE]">
            {new Date(selectedDay).toDateString()} - {selectedSlot}
          </div>
        )}

      {step === Step.DETAILS && (
        <>
          <div className="font-semibold">Add booking details</div>
          <p className="text-sm text-[#EEEEEE] mt-2 mb-2 font-normal max-w-[300px] mx-auto">
            Help your freelancer prepare by adding notes or reference images.
          </p>
        </>
      )}

      {step === Step.LOCATION && (
        <>
          <div className="font-semibold">Booking location</div>
          <p className="text-sm text-[#EEEEEE] mt-2 mb-2 font-normal max-w-[300px] mx-auto">
            Enter the address where you&apos;d like the service.
          </p>
        </>
      )}

      {step === Step.CUSTOMER && (
        <div className="font-semibold">Add your personal information</div>
      )}
    </div>
  );
}
