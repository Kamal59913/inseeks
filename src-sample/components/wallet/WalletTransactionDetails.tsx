"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  formatDate,
  formatMinutesToDecimalHours,
} from "@/lib/utilities/timeFormat";
import Button from "../ui/button/Button";
import { useUserData } from "@/store/hooks/useUserData";
import SelectContactMode from "../features/SelectContactMode";
import { useState } from "react";
import ReferenceImageModal from "../ui/modals/ReferenceImageModal";
import walletService from "@/services/walletService";
import { ToastService } from "@/lib/utilities/toastService";
import { useGlobalStates } from "@/store/hooks/useGlobalStates";
import { Transaction } from "@/types/api/wallet.types";

interface WalletTransactionDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

const WalletTransactionDetails = ({
  isOpen,
  onClose,
  transaction,
}: WalletTransactionDetailsProps) => {
  const { userData } = useUserData();
  const { isButtonLoading } = useGlobalStates();
  const [isContactModeOpening, setIsContactModeOpening] = useState({
    isOpenModal: false,
    idIfEditMode: "",
  });

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const handleGenerateInvoice = async () => {
    if (!transaction?.booking?.id) {
      ToastService.error("Booking ID not found");
      return;
    }

    const response = await walletService.generateInvoice(
      transaction.booking.id
    );

    if (response.status === 200 || response.status === 201) {
      ToastService.success(
        response.data.message || "Invoice generated successfully"
      );

      if (response.data.invoice_url) {
        window.open(response.data.invoice_url, "_blank");
      }
    } else {
      ToastService.error(response.data.message || "Failed to generate invoice");
    }
  };

  const handleImageClick = (idx: number) => {
    setSelectedPhotoIndex(idx);
    setIsPhotoModalOpen(true);
  };

  if (!transaction) return null;

  const { booking, bookingUser } = transaction;

  const platformFee = Number(userData?.user?.platform_fee) || 0;
  const stripeFee = Number(userData?.user?.stripe_fee) || 0;
  const price = transaction.amount || 0;
  const totalFee = ((platformFee + stripeFee) / 100) * price;
  const payout = price - totalFee;

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-[#f7c230] text-black border-none";
      case "succeeded":
      case "accepted":
      case "completed":
        return "bg-[#58CC5A] text-black border-none";
      case "failed":
      case "rejected":
        return "bg-[#f57d7c] text-black border-none";
      default:
        return "bg-gray-500 text-black border-none";
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "The payout will be available 24h after the completion of the service";
      case "rejected":
      case "failed":
        return "A claim has been opened for this job, and the customer has been refunded. Please contact us for more information.";
      case "succeeded":
      case "completed":
        return "This job has been completed successfully. Your payout has been paid.";
      default:
        return null;
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-[#f7c230]";
      case "rejected":
      case "failed":
        return "text-[#f57d7c]";
      case "succeeded":
      case "completed":
        return "text-[#58CC5A]";
      default:
        return "text-gray-500";
    }
  };

  // Helper for address
  const addressString = booking?.location
    ? [
        booking.location.address_1,
        booking.location.address_2,
        booking.location.city,
        booking.location.postal_code,
      ]
        .filter(Boolean)
        .join(", ")
    : "Location not provided";

  return (
    <Sheet open={isOpen}>
      <SheetContent
        side="bottom"
        className="sheet-gradient-bg border-none p-0 flex flex-col overflow-y-auto scrollbar-hide"
      >
        {/* Close Button Row */}
        <div className="flex items-center justify-end px-4 pt-4 h-full">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <img src="/xIcon.svg" alt="Close" className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          {/* 1. Header Section */}
          <div className="flex flex-col items-center text-center space-y-2 mb-6">
            {/* Status Badge */}
            <span
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${getStatusBadgeColor(
                transaction.transactionStatus
              )}`}
            >
              {transaction.transactionStatus || "Pending"}
            </span>

            {getStatusDescription(transaction.transactionStatus) && (
              <p
                className={`text-[12px] mt-2 leading-relaxed ${getStatusTextColor(
                  transaction.transactionStatus
                )}`}
              >
                {getStatusDescription(transaction.transactionStatus)}
              </p>
            )}
            {/* Transaction Ref # */}
            <span className="text-gray-400 text-xs mt-2">
              #{transaction.paymentId || "0000"}
            </span>

            {/* Service Name (Dummy if missing) */}
            <h2 className="text-[16px] font-semibold text-white mt-1">
              {/* Currently mapping does not provide service name in booking object as per sample, so using generic or fallback */}
              {booking?.product?.name || "Service Name"}{" "}
              {booking?.service_duration
                ? `${formatMinutesToDecimalHours(booking.service_duration)}`
                : ""}
            </h2>

            {/* Date & Time */}
            <p className="text-gray-300 text-sm">
              {booking?.service_start_at
                ? formatDate(booking.service_start_at, { format: "short" })
                : "Date N/A"}
            </p>
            {/* Option (Dummy if missing) */}
            <p className="text-gray-500 text-xs">
              Option: {booking?.option_name || "Standard"}
            </p>
          </div>

          <div className="border-t border-white/10 my-6" />

          {/* 2. Client Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-[14px] mb-1">Client</p>
                <p className="text-white text-[16px] font-medium">
                  {bookingUser?.first_name} {bookingUser?.last_name || ""}
                </p>
              </div>
              <Button
                size="none"
                variant="glass"
                className={`h-[40px] text-[12px] px-4 font-medium leading-none whitespace-nowrap`}
                borderRadius="rounded-[16px]"
                onClick={() => {
                  setIsContactModeOpening({
                    isOpenModal: true,
                    idIfEditMode: "",
                  });
                }}
              >
                Contact {bookingUser?.first_name || "Client"}
              </Button>
            </div>

            {/* Location */}
            <div>
              <p className="text-gray-400 text-[14px] mb-1">Location</p>
              <p className="text-white/80 text-[14px] mb-0.5">
                Client&apos;s home
              </p>
              <p className="text-white text-[14px]">{addressString}</p>
            </div>
          </div>

          <div className="border-t border-white/10 my-6" />

          {/* 3. Details Section */}
          <div className="space-y-6">
            {/* Notes */}
            <div>
              <p className="text-gray-400 text-[14px] mb-2">Notes</p>
              <p className="text-white italic text-[14px]">
                {booking?.special_instructions ||
                  "No special instructions provided."}
              </p>
            </div>

            {/* Photo References */}
            {booking?.imageReferences && booking.imageReferences.length > 0 && (
              <div>
                <p className="text-gray-400 text-[14px] mb-2">Photo references</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {booking.imageReferences.map((img: { image_url?: string }, idx: number) => (
                    <div
                      key={idx}
                      className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-white/10"
                    >
                      <img
                        src={img.image_url || ""}
                        alt={`Ref ${idx}`}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => handleImageClick(idx)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-white/10 my-6" />

          {/* 4. Financials Section */}
          <div className="space-y-2">
            <div className="flex justify-between text-[12px]">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-white">£{price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-gray-400">Payment procesor fees</span>
              <span className="text-white">-£{totalFee.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-white font-bold text-[14px]">Payout</span>
              <span className="text-white font-bold text-[14px]">
                £
                {payout.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* 5. Footer / Actions */}
        <div className="p-4 border-t border-white/10 bg-[#000000]/20">
          <Button
            size="none"
            variant="glass"
            className={`w-full px-4 h-[48px] leading-none whitespace-nowrap font-medium text-[12px]`}
            onClick={handleGenerateInvoice}
            loadingState={isButtonLoading("generate-invoice")}
          >
            Generate invoice
          </Button>
        </div>

        {isContactModeOpening.isOpenModal && (
          <div>
            <SelectContactMode
              isOpen={isContactModeOpening.isOpenModal}
              currentData={booking}
              email={bookingUser?.email}
              phone={bookingUser?.phone} // Assuming phone is available here, or need to verify structure
              onClose={() =>
                setIsContactModeOpening({
                  isOpenModal: false,
                  idIfEditMode: "",
                })
              }
            />
          </div>
        )}
        {isPhotoModalOpen && (
          <ReferenceImageModal
            images={booking?.imageReferences || []}
            initialIndex={selectedPhotoIndex}
            onClose={() => setIsPhotoModalOpen(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default WalletTransactionDetails;

