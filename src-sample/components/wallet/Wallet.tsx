"use client";

import walletService from "@/services/walletService";
import Button from "../ui/button/Button";
import { useGetFreelancerTransactions } from "@/hooks/paymentServices/useGetFreelancerTransactions";
import { formatDate } from "@/lib/utilities/timeFormat";
import { useState } from "react";
import WalletTransactionDetails from "./WalletTransactionDetails";
import PaymentSettingsForm from "./PaymentSettingsForm";
import PayoutHistorySheet from "./PayoutHistorySheet";
import { Transaction } from "@/types/api/wallet.types";

const Wallet = () => {
  const { data: apiData, isPending } = useGetFreelancerTransactions();

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [isPaymentSettingsOpen, setIsPaymentSettingsOpen] = useState(false);
  const [isPayoutHistoryOpen, setIsPayoutHistoryOpen] = useState(false);

  const totalAmount = apiData?.totalAmount || 0;
  const transactions = apiData?.transactions || [];

  const formatTransactionDate = (dateString: string) => {
    if (!dateString) return "";
    return formatDate(dateString, { format: "short" });
  };

  

  return (
    <>
      {/* TOP LEFT - STRIPE CONNECT BUTTON */}
      <div className="absolute top-6 flex items-center gap-4 z-20">
        <Button
          type="button"
          onClick={async () => {
            const response: any = await walletService?.createConnectAccount();
            if (response?.data?.url) {
              window.location.href = response.data.url;
            }
          }}
          size="sm"
          variant="white"
          borderRadius="rounded-[25px]"
          className="backdrop-blur-[94px] text-[14px] font-medium"
          disabled={false}
        >
          Stripe Connect
        </Button>
      </div>

      {/* TOP RIGHT ICONS */}
      <div className="absolute top-6 right-6 flex items-center gap-4 z-20">
        {/* BAR GRAPH → OPEN PAYOUT HISTORY */}
        <img
          src="/line_graph.svg"
          className="w-5 h-5 cursor-pointer opacity-100 hover:opacity-80 transition"
          alt="payout-history"
          onClick={() => setIsPayoutHistoryOpen(true)}
        />

        {/* SETTINGS BUTTON → OPEN PAYMENT SETTINGS */}
        <img
          src="/settings.svg"
          className="w-5 h-5 cursor-pointer opacity-100 hover:opacity-80 transition"
          alt="settings"
          onClick={() => setIsPaymentSettingsOpen(true)}
        />
      </div>

      {/* Stripe Buttons REMOVED - Moved to PaymentSettingsForm */}
      {/* <div className="flex gap-4 mb-6 mt-12">
        <Button
          type="submit"
          onClick={handleFormSubmit}
          disabled={!!userData.stripeAccountId}
        >
          Stripe Connect
        </Button>

        <Button type="submit" onClick={viewAccount}>
          View Account
        </Button>
      </div> */}
      <div className="mb-6 mt-12"></div>

      {/* TOTAL EARNINGS */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-white">
          £{totalAmount.toLocaleString()}
        </h1>
        <p className="text-white text-[16px] mt-1">All-Time Earnings</p>
      </div>

      {/* TRANSACTIONS LIST */}
      <div
        className="space-y-2 max-h-[60vh] overflow-y-auto pr-2
          [&::-webkit-scrollbar]:w-1
          [&::-webkit-scrollbar-track]:rounded-full 
          [&::-webkit-scrollbar-track]:bg-gray-100 
          [&::-webkit-scrollbar-thumb]:rounded-full 
          [&::-webkit-scrollbar-thumb]:bg-gray-300 
          dark:[&::-webkit-scrollbar-track]:bg-neutral-700 
          dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
      >
        {transactions.map((transaction: Transaction) => {
          const getStatusText = (status: string) => {
            switch (status?.toLowerCase()) {
              case "pending":
                return "Pending";
              case "succeeded":
              case "accepted":
              case "completed":
                return "Transfer Completed";
              case "failed":
              case "rejected":
                return "Transfer Failed";
              default:
                return status || "Unknown";
            }
          };

          const getStatusColor = (status: string) => {
            switch (status?.toLowerCase()) {
              case "pending":
                return "text-[#f7c230]";
              case "succeeded":
              case "accepted":
              case "completed":
                return "text-[#58CC5A]";
              case "failed":
              case "rejected":
                return "text-[#f57d7c]";
              default:
                return "text-gray-500";
            }
          };

          const statusText = getStatusText(transaction.transactionStatus);
          const statusColor = getStatusColor(transaction.transactionStatus);

          const isUserDeleted = !transaction.bookingUser;
          const isBookingDeleted = !transaction.booking;
          const isDisabled = isUserDeleted || isBookingDeleted;

          const customerName = isUserDeleted
            ? "Customer Deleted"
            : isBookingDeleted
              ? "Booking Deleted"
              : `${transaction.bookingUser!.first_name} ${
                  transaction.bookingUser!.last_name || ""
                }`;

          return (
            <div
              key={transaction.paymentId}
              className={`text-[12px] service-category-card px-5 py-4 transition-all duration-200 
                ${
                  isDisabled
                    ? "opacity-50 grayscale cursor-not-allowed select-none"
                    : "hover:to-[#3a3a45] cursor-pointer"
                }`}
              onClick={() => {
                if (isDisabled) return;
                setSelectedTransaction(transaction);
                setIsDetailsOpen(true);
              }}
            >
              <div className="flex items-start justify-between w-full">
                <div>
                  <h3 className="text-[14px] font-medium text-white mb-1">
                    {customerName}
                  </h3>
                  <p className="text-gray-400 text-[12px]">
                    {isBookingDeleted
                      ? "Deleted Booking"
                      : formatTransactionDate(
                          transaction.booking?.service_start_at ?? "",
                        )}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[14px] font-medium text-white block mb-1">
                    £{transaction.amount}
                  </span>
                  <span className={`text-[12px] ${statusColor}`}>
                    {statusText}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {transactions.length === 0 && !isPending && (
          <p className="text-center text-gray-500 mt-6">
            No transactions found.
          </p>
        )}
      </div>

      {/* TRANSACTION DETAILS SHEET */}
      <WalletTransactionDetails
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        transaction={selectedTransaction}
      />

      {/* PAYMENT SETTINGS SHEET */}
      <PaymentSettingsForm
        isOpen={isPaymentSettingsOpen}
        onClose={() => setIsPaymentSettingsOpen(false)}
      />

      {/* PAYOUT HISTORY SHEET (BAR GRAPH) */}
      <PayoutHistorySheet
        isOpen={isPayoutHistoryOpen}
        onClose={() => setIsPayoutHistoryOpen(false)}
      />
    </>
  );
};

export default Wallet;

