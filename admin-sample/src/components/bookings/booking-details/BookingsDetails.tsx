import PageMeta from "../../common/PageMeta";
import ComponentCard from "../../common/ComponentCard";
import { HEADER_CONFIG } from "../../../config/headerName";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import PageBreadcrumbButton from "../../common/PageBreadCrumbButton";

import {
  Calendar,
  User,
  CreditCard,
  FileText,
  XCircle,
  CheckCircle,
  AlertCircle,
  ImageIcon,
  MapPin,
} from "lucide-react";

import { useModalData } from "@/redux/hooks/useModal";
import { ToastService } from "@/utils/toastService";
import freelancersService from "@/api/services/freelancersService";
import fundService from "@/api/services/fundsService";
import { queryClient } from "@/utils/queryClient";
import { useGetBookingsById } from "@/hooks/queries/bookings/useGetBookingsById";
import {
  formatDateTime,
  formatMinutesToDecimalHours,
  formatRelativeTime,
} from "@/utils/formateDate";
import bookingsService from "@/api/services/bookingsService";
import Tooltip from "@/components/ui/tooltip/tooltip";

const ReleaseTimer = ({
  serviceStartAt,
  serviceDuration,
}: {
  serviceStartAt: string;
  serviceDuration: number;
}) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [releaseDateStr, setReleaseDateStr] = useState("");

  useEffect(() => {
    const calculateTime = () => {
      const releaseTime =
        new Date(serviceStartAt).getTime() +
        serviceDuration * 60 * 1000 +
        24 * 60 * 60 * 1000;
      const now = new Date().getTime();
      const diff = releaseTime - now;

      setReleaseDateStr(
        formatDateTime(new Date(releaseTime).toISOString(), "short"),
      );

      if (diff <= 0) {
        setTimeLeft("0d 0h 0m");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft(`${days}d ${hours}h ${minutes}m`);
    };

    calculateTime();
    const timer = setInterval(calculateTime, 60000);
    return () => clearInterval(timer);
  }, [serviceStartAt, serviceDuration]);

  return (
    <div>
      <p className="mt-2">
        <span className="font-medium">Automatically releases in:</span>{" "}
        <span className="text-blue-600 font-medium">{timeLeft}</span>
      </p>
      <p className="mt-2">
        <span className="font-medium">Release Date:</span> {releaseDateStr}
      </p>
    </div>
  );
};

const BookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { open, close } = useModalData();

  const { data: bookingDetails, isPending } = useGetBookingsById(id || "", {
    enabled: true,
  });

  const booking = bookingDetails?.data?.data?.booking;
  const pendingPayment = bookingDetails?.data?.data?.pendingPayment;

  // Toggle this to false to enable force actions always
  const restrictForceActions = false;
  const isAccepted = booking?.appointment_status === "accepted";
  const restrictionMessage =
    "This action would be available once the booking is accepted.";

  const getCustomerDisplayName = (customer: any) => {
    const firstName = customer.first_name || "";
    const lastName = customer.last_name || "";

    if (!firstName && !lastName) return "Unknown";

    if (lastName) {
      return `${firstName} ${lastName.charAt(0)}.`;
    }

    return firstName;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { bg: string; text: string; icon: any }
    > = {
      accepted: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: CheckCircle,
      },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        icon: AlertCircle,
      },
      rejected: { bg: "bg-red-100", text: "text-red-800", icon: XCircle },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
      >
        <Icon className="w-4 h-4" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const forceCancel = async (bookingId: string) => {
    open("cancel-modal", {
      title: `Force Cancel Booking`,
      bookingId: bookingId,
      inputLabel: "Cancellation Reason",
      inputPlaceholder: "Enter reason for force cancelling...",
      confirmText: "Force Cancel",
      validationRequired: true,
      action: async (reason: string) => {
        try {
          const response: any = await freelancersService.bookingForceCancel(
            bookingId,
            {
              booking_id: bookingId,
              reason: reason,
            },
          );

          if (response?.status === 200) {
            ToastService.success(
              response.data.message || "Booking cancelled successfully",
              "force-cancel-booking",
            );
            await queryClient.invalidateQueries({
              queryKey: ["get-bookings-byId"],
            });
          } else {
            ToastService.error(
              response?.data?.message || "Failed to cancel booking",
              "force-cancel-booking-error",
            );
          }
        } catch (error) {
          ToastService.error(
            "An error occurred while cancelling booking",
            "force-cancel-booking-error",
          );
        } finally {
          close();
        }
      },
    });
  };

  const forceComplete = async (bookingId: string) => {
    open("complete-modal", {
      title: `Force Complete Booking`,
      description: "Are you sure you want to force complete this booking?",
      bookingId: bookingId,
      action: async (completedAt: string) => {
        try {
          const response = await freelancersService.bookingForceComplete(
            bookingId,
            {
              booking_id: bookingId,
              completed_at: completedAt || new Date().toISOString(),
            },
          );

          if (response?.status === 200) {
            ToastService.success(
              response.data.message || "Booking completed successfully",
              "force-complete-booking",
            );
            await queryClient.invalidateQueries({
              queryKey: ["get-bookings-byId"],
            });
          } else {
            ToastService.error(
              response?.data?.message || "Failed to complete booking",
              "force-complete-booking-error",
            );
          }
        } catch (error) {
          ToastService.error(
            "An error occurred while completing booking",
            "force-complete-booking-error",
          );
        } finally {
          close();
        }
      },
    });
  };

  const handleFreeze = (paymentId: number) => {
    open("cancel-modal", {
      title: "Freeze Payment!",
      inputLabel: "Freeze Reason",
      inputPlaceholder: "Enter reason for freezing this payment...",
      confirmText: "Freeze Payment",
      validationRequired: true,
      validationError: "Freeze reason is required",
      action: async (reason: string) => {
        try {
          const response: any = await fundService.freezePayment({
            paymentId: paymentId,
            reason: reason || "Admin Freeze",
          });

          if (response?.status === 200 || response?.status === 201) {
            ToastService.success(
              response.data.message || "Payment frozen successfully",
              "freeze-payment",
            );
            await queryClient.invalidateQueries({
              queryKey: ["get-bookings-byId"],
            });
            await queryClient.invalidateQueries({
              queryKey: ["get-all-funds"],
            });
          } else {
            ToastService.error(
              response?.response?.data?.message || "Failed to freeze payment",
              "freeze-payment-error",
            );
          }
        } catch (error) {
          ToastService.error("An error occurred", "freeze-payment-error");
        } finally {
          close();
        }
      },
    });
  };

  const handleRelease = (paymentId: number) => {
    open("complete-modal", {
      title: "Release Payment!",
      description:
        "Are you sure you want to release this payment? Funds will be sent to the freelancer and can't be reverted.",
      action: async () => {
        try {
          const response: any = await fundService.releasePayment({
            paymentId: paymentId,
          });

          if (response?.status === 200 || response?.status === 201) {
            ToastService.success(
              response.data.message || "Payment released successfully",
              "release-payment",
            );
            await queryClient.invalidateQueries({
              queryKey: ["get-bookings-byId"],
            });
            await queryClient.invalidateQueries({
              queryKey: ["get-all-funds"],
            });
          } else {
            ToastService.error(
              response?.response?.data?.message ||
                response?.message ||
                "Failed to release payment",
              "release-payment-error",
            );
          }
        } catch (error) {
          ToastService.error("An error occurred", "release-payment-error");
        } finally {
          close();
        }
      },
    });
  };

  const handlePartialRefund = (paymentId: number, bookingAmount: number) => {
    open("partial-refund-modal", {
      paymentId: paymentId,
      bookingAmount: bookingAmount,
      title: "Refund Payment!",
      description:
        "Are you sure you want to refund this payment? Once refunded, the funds will be transferred to the customer and cannot be reverted.",
    });
  };

  const handleAdminRemark = (paymentId: number) => {
    open("cancel-modal", {
      title: "Write a Remark",
      inputLabel: "Admin Remark",
      inputPlaceholder: "Enter your remark...",
      confirmText: "Save Remark",
      validationRequired: true,
      validationError: "Remark is required",
      action: async (remark: string) => {
        try {
          const response: any = await fundService.addAdminRemark({
            paymentId: paymentId,
            comment: remark || "",
          });

          if (response?.status === 200 || response?.status === 201) {
            ToastService.success(
              response.data.message || "Remark added successfully",
              "admin-remark",
            );
            await queryClient.invalidateQueries({
              queryKey: ["get-bookings-byId"],
            });
            await queryClient.invalidateQueries({
              queryKey: ["get-all-funds"],
            });
          } else {
            console.log(response);
            ToastService.error(
              response?.response?.data?.message ||
                response?.data?.message ||
                "Failed to add remark",
              "admin-remark-error",
            );
          }
        } catch (error) {
          ToastService.error("An error occurred", "admin-remark-error");
        } finally {
          close();
        }
      },
    });
  };

  const handleGenerateInvoice = async (bookingId: string | number) => {
    try {
      const response = await bookingsService.generateInvoice(bookingId);
      if (response.status === 200 || response.status === 201) {
        ToastService.success(
          response.data?.message || "Invoice generated successfully",
        );
      } else {
        ToastService.error(
          response.data?.message || "Failed to generate invoice",
        );
      }
    } catch (error: any) {
      ToastService.error("An error occurred while generating the invoice");
    }
  };

  const handleDownloadInvoice = async (bookingId: string | number) => {
    try {
      const response = await bookingsService.downloadInvoice(bookingId);
      if (response.status === 200 || response.status === 201) {
        const fileData = response?.data?.data;

        if (!fileData?.download_url) {
          ToastService.error("Download URL not found");
          return;
        }

        const link = document.createElement("a");
        link.href = fileData.download_url;
        link.download = fileData.filename || `Invoice-${bookingId}.pdf`;
        link.target = "_blank";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        ToastService.success(
          response.data?.message || "Invoice download started",
        );
      } else {
        ToastService.error(
          response.data?.message || "Failed to download invoice",
        );
      }
    } catch (error: any) {
      ToastService.error("An error occurred while downloading the invoice");
    }
  };

  const getAdminDecisionBadge = (decision: string) => {
    const decisionConfig: Record<string, { bg: string; text: string }> = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
      released: { bg: "bg-green-100", text: "text-green-800" },
      refunded: { bg: "bg-blue-100", text: "text-blue-800" },
    };

    const config = decisionConfig[decision] || {
      bg: "bg-gray-100",
      text: "text-gray-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {decision.toUpperCase()}
      </span>
    );
  };

  const parseLogs = (logsString: string | null | undefined) => {
    if (!logsString) return [];
    try {
      return JSON.parse(logsString);
    } catch (e) {
      console.error("Failed to parse logs", e);
      return [];
    }
  };

  return (
    <>
      <PageMeta
        title={`Booking Details | ${HEADER_CONFIG.NAME}`}
        description="Booking Details"
      />

      <PageBreadcrumbButton
        pageTitle="Booking Details"
        destination_name="Bookings"
        destination_path="bookings"
        is_reverse={true}
      />

      <ComponentCard title="Booking Details">
        {/* LOADING */}
        {isPending && (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-600 font-medium">
                Loading booking details...
              </p>
            </div>
          </div>
        )}

        {/* NO DATA */}
        {!isPending && !booking && (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No booking found</p>
            </div>
          </div>
        )}

        {/* BOOKING DETAILS */}
        {!isPending && booking && (
          <div className="space-y-6">
            {/* HEADER WITH STATUS */}
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {getCustomerDisplayName(booking.customer)}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatDateTime(booking.booking_timestamp, "short")}
                </p>
              </div>
              <div>{getStatusBadge(booking.appointment_status)}</div>
            </div>

            {/* MASONRY-LIKE LAYOUT: TWO COLUMNS */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* LEFT COLUMN */}
              <div className="flex-1 space-y-6 w-full lg:w-1/2">
                {/* OVERRIDE BOOKING */}
                <div className="bg-gray-50 p-4 rounded border space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    Override Booking
                  </h4>
                  <p className="text-sm text-gray-700">
                    You can manually override this booking's state regardless of
                    the customer's payment or workflow status.
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      className={`px-3 py-1.5 text-sm rounded ${
                        restrictForceActions &&
                        booking.appointment_status !== "pending"
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-red-600 text-white hover:bg-red-700"
                      }`}
                      onClick={() => forceCancel(booking.id)}
                      disabled={
                        restrictForceActions &&
                        booking.appointment_status !== "pending"
                      }
                    >
                      Force Cancel
                    </button>
                    <button
                      className={`px-3 py-1.5 text-sm rounded ${
                        restrictForceActions &&
                        booking.appointment_status !== "pending"
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                      onClick={() => forceComplete(booking.id)}
                      disabled={
                        restrictForceActions &&
                        booking.appointment_status !== "pending"
                      }
                    >
                      Force Complete
                    </button>
                  </div>
                </div>

                {/* INVOICES */}
                <div className="bg-gray-50 p-4 rounded border space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Invoices
                  </h4>
                  <p className="text-sm text-gray-700">
                    Generate or download invoice for this booking.
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      className="px-3 py-1.5 text-sm rounded bg-green-600 text-white hover:bg-green-700 flex items-center gap-1"
                      onClick={() => handleGenerateInvoice(booking.id)}
                    >
                      <FileText className="w-4 h-4" />
                      Generate Invoice
                    </button>
                    <button
                      className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1"
                      onClick={() => handleDownloadInvoice(booking.id)}
                    >
                      <FileText className="w-4 h-4" />
                      Download Invoice
                    </button>
                  </div>
                </div>

                {/* SERVICE DETAILS */}
                <div className="bg-gray-50 p-4 rounded border space-y-2">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Service Details
                  </h4>
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {booking.product.name}
                  </p>
                  <p>
                    <span className="font-medium">Description:</span>{" "}
                    {booking.product.description}
                  </p>
                  <p>
                    <span className="font-medium">Option name:</span>{" "}
                    {booking.productOption.name}
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">
                        {formatMinutesToDecimalHours(booking.service_duration)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="font-medium">£{booking.service_amount}</p>
                    </div>
                  </div>
                </div>

                {/* CUSTOMER INFORMATION */}
                <div className="bg-gray-50 p-4 rounded border space-y-1">
                  <h4 className="font-semibold flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    Customer Information{" "}
                    <a
                      className="text-blue-600"
                      href={`/customers/${booking.customer.uuid}`}
                    >
                      (Visit Profile)
                    </a>
                  </h4>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {booking.customer.email}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {booking.customer.country_code} {booking.customer.phone}
                  </p>
                </div>

                {/* FREELANCER INFORMATION */}
                {booking.freelancer && (
                  <div className="bg-gray-50 p-4 rounded border space-y-1">
                    <h4 className="font-semibold flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      Freelancer Information
                      <a
                        className="text-blue-600"
                        href={`/freelancers/${booking.freelancer.uuid}`}
                      >
                        (Visit Profile)
                      </a>
                    </h4>
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {booking.freelancer.first_name}{" "}
                      {booking.freelancer.last_name}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {booking.freelancer.email}
                    </p>
                    {booking.freelancer.phone && (
                      <p>
                        <span className="font-medium">Phone:</span>{" "}
                        {booking.freelancer.country_code}{" "}
                        {booking.freelancer.phone}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN */}
              <div className="flex-1 space-y-6 w-full lg:w-1/2">
                {/* PAYMENT INFORMATION */}
                {pendingPayment && (
                  <div className="bg-gray-50 p-4 rounded border space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      Payment Information
                    </h4>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      {getAdminDecisionBadge(pendingPayment.adminDecision)}
                    </div>
                    {pendingPayment.freezeReason && (
                      <p className="text-sm text-red-600">
                        <span className="font-medium">Freeze Reason:</span>{" "}
                        {pendingPayment.freezeReason}
                      </p>
                    )}
                    <p>
                      <span className="font-medium">
                        Amount paid by customer:
                      </span>{" "}
                      £
                      {(
                        parseFloat(pendingPayment.originalAmount) +
                        parseFloat(pendingPayment.discountAmount || 0)
                      ).toFixed(2)}
                    </p>
                    <p>
                      <span className="font-medium">Discount applied:</span>{" "}
                      {pendingPayment.discountAmount > 0
                        ? `- £${pendingPayment.discountAmount}`
                        : "- £0"}
                    </p>
                    <p>
                      <span className="font-medium">Coupon used:</span>{" "}
                      {pendingPayment.couponCode ? (
                        pendingPayment.couponCode
                      ) : (
                        <span className="text-gray-400 italic">N/A</span>
                      )}
                    </p>
                    <p>
                      <span className="font-medium">Final amount charged:</span>{" "}
                      £{pendingPayment.originalAmount}
                    </p>
                    <ReleaseTimer
                      serviceStartAt={booking.service_start_at}
                      serviceDuration={booking.service_duration}
                    />
                    <p className="break-all">
                      <span className="font-medium">Payment ID:</span>{" "}
                      {pendingPayment.stripePaymentIntentId}
                    </p>

                    {/* LOGS SECTION */}
                    <div className="mt-4 pt-4 border-t space-y-4">
                      {/* Refund Logs */}
                      {(() => {
                        const logs = parseLogs(
                          pendingPayment.partialRefundLogs,
                        );
                        if (logs.length > 0) {
                          return (
                            <div>
                              <h5 className="text-sm font-semibold text-gray-700 mb-2">
                                Refund Logs
                              </h5>
                              <div className="bg-white border rounded p-2 text-xs space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                                {logs.map((log: any, i: number) => (
                                  <div
                                    key={i}
                                    className="border-b last:border-0 pb-2 last:pb-0"
                                  >
                                    <p>
                                      <span className="font-medium">
                                        Action:
                                      </span>{" "}
                                      {log.comment}
                                    </p>
                                    <p>
                                      <span className="font-medium">By:</span>{" "}
                                      {log.by}{" "}
                                      <span className="text-gray-400">|</span>{" "}
                                      {formatDateTime(log.at, "short")}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }
                      })()}

                      {/* Refund Information */}
                      {(() => {
                        const logs = parseLogs(pendingPayment.refundLogs);
                        if (logs.length > 0) {
                          return (
                            <div>
                              <h5 className="text-sm font-semibold text-gray-700 mb-2">
                                Refund Information
                              </h5>
                              <div className="bg-white border rounded p-2 text-xs space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                                {logs.map((log: any, i: number) => (
                                  <div
                                    key={i}
                                    className="border-b last:border-0 pb-2 last:pb-0"
                                  >
                                    <div className="flex justify-between">
                                      <span className="font-medium text-blue-600">
                                        {log.refundType === "percentage"
                                          ? `${log.refundValue}%`
                                          : `£${log.refundValue}`}{" "}
                                        Refund
                                      </span>
                                      <span className="text-gray-500">
                                        {formatDateTime(log.at, "short")}
                                      </span>
                                    </div>
                                    <p>
                                      <span className="font-medium">
                                        Refunded Amount:
                                      </span>{" "}
                                      £
                                      {log.refundAmount
                                        ? log.refundAmount
                                        : "0.00"}
                                    </p>
                                    {log.refundResponse?.status && (
                                      <p>
                                        <span className="font-medium">
                                          Status:
                                        </span>{" "}
                                        {log.refundResponse.status}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }
                      })()}
                    </div>

                    {/* FUNDS MANAGEMENT ACTIONS */}
                    <div className="pt-3 border-t">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Funds Management
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Tooltip text={!isAccepted ? restrictionMessage : ""}>
                          <button
                            className={`px-3 py-1.5 text-sm rounded flex items-center gap-1 ${
                              !isAccepted ||
                              pendingPayment.isFrozen ||
                              pendingPayment.adminDecision === "refunded" ||
                              pendingPayment.adminDecision === "released"
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-red-600 text-white hover:bg-red-700"
                            }`}
                            onClick={() => handleFreeze(pendingPayment.id)}
                            disabled={
                              !isAccepted ||
                              pendingPayment.isFrozen ||
                              pendingPayment.adminDecision === "released" ||
                              pendingPayment.adminDecision === "refunded"
                            }
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            </svg>
                            {pendingPayment.isFrozen ? "Frozen" : "Freeze"}
                          </button>
                        </Tooltip>

                        <Tooltip text={!isAccepted ? restrictionMessage : ""}>
                          <button
                            className={`px-3 py-1.5 text-sm rounded flex items-center gap-1 ${
                              !isAccepted ||
                              !pendingPayment.isFrozen ||
                              pendingPayment.adminDecision === "released" ||
                              pendingPayment.adminDecision === "refunded"
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                            onClick={() => handleRelease(pendingPayment.id)}
                            disabled={
                              !isAccepted ||
                              !pendingPayment.isFrozen ||
                              pendingPayment.adminDecision === "released" ||
                              pendingPayment.adminDecision === "refunded"
                            }
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            {pendingPayment.adminDecision === "released"
                              ? "Released"
                              : "Release"}
                          </button>
                        </Tooltip>

                        <Tooltip text={!isAccepted ? restrictionMessage : ""}>
                          <button
                            className={`px-3 py-1.5 text-sm rounded flex items-center gap-1 ${
                              !isAccepted ||
                              !pendingPayment.isFrozen ||
                              pendingPayment.adminDecision === "released" ||
                              pendingPayment.adminDecision === "refunded"
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                            onClick={() =>
                              handlePartialRefund(
                                pendingPayment.id,
                                parseFloat(pendingPayment.originalAmount),
                              )
                            }
                            disabled={
                              !isAccepted ||
                              pendingPayment.adminDecision === "released" ||
                              pendingPayment.adminDecision === "refunded"
                            }
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                              />
                            </svg>
                            Refund
                          </button>
                        </Tooltip>

                        <Tooltip
                          text={
                            !isAccepted
                              ? restrictionMessage
                              : pendingPayment.adminDecision !== "refunded"
                                ? "You can add a remark once you do a refund."
                                : ""
                          }
                        >
                          <button
                            className={`px-3 py-1.5 text-sm rounded flex items-center gap-1 ${
                              !isAccepted ||
                              pendingPayment.adminDecision !== "refunded"
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "text-white hover:opacity-90"
                            }`}
                            style={
                              !isAccepted ||
                              pendingPayment.adminDecision !== "refunded"
                                ? {}
                                : {
                                    background:
                                      "linear-gradient(183.67deg, rgb(90, 0, 113) -146.61%, rgb(26, 10, 31) 111.69%)",
                                  }
                            }
                            onClick={() => handleAdminRemark(pendingPayment.id)}
                            disabled={
                              !isAccepted ||
                              pendingPayment.adminDecision !== "refunded"
                            }
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Admin Remark
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                )}

                {/* SCHEDULE */}
                <div className="bg-gray-50 p-4 rounded border space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Schedule
                  </h4>
                  <p>
                    <span className="font-medium">Request Date:</span>{" "}
                    {formatDateTime(booking.booking_timestamp, "short")}
                  </p>
                  <div className="space-y-0.5">
                    <p>
                      <span className="font-medium">Start:</span>{" "}
                      <span className="text-gray-900 font-semibold">
                        {formatRelativeTime(booking.service_start_at)}
                      </span>
                    </p>
                    <p className="text-sm text-gray-700">
                      {formatDateTime(booking.service_start_at, "short")}
                    </p>
                  </div>
                  <p>
                    <span className="font-medium">Duration:</span>{" "}
                    {formatMinutesToDecimalHours(booking.service_duration)}
                  </p>
                </div>

                {/* SERVICE LOCATION */}
                {booking.locations?.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded border space-y-1">
                    <h4 className="font-semibold flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      Service Location
                    </h4>
                    <div className="text-sm">
                      <p className="font-medium">
                        {booking.locations[0].address_1}
                      </p>
                      {booking.locations[0].address_2 && (
                        <p>{booking.locations[0].address_2}</p>
                      )}
                      <p>
                        {booking.locations[0].city},{" "}
                        {booking.locations[0].postal_code}
                      </p>
                    </div>
                  </div>
                )}

                {/* SPECIAL INSTRUCTIONS */}
                {booking.special_instructions && (
                  <div className="bg-blue-50 p-4 rounded border border-blue-300">
                    <h4 className="font-semibold text-blue-800 flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4" />
                      Special Instructions
                    </h4>
                    <p className="text-blue-700">
                      {booking.special_instructions}
                    </p>
                  </div>
                )}

                {/* IMAGES */}
                {booking.imageReferences?.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded border">
                    <h4 className="font-semibold flex items-center gap-2 mb-2">
                      <ImageIcon className="w-4 h-4 text-blue-600" />
                      Reference Images
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {booking.imageReferences.map(
                        (img: any, index: number) => (
                          <img
                            key={index}
                            src={img.image_url}
                            className="rounded border object-cover h-50"
                            alt={`Reference ${index + 1}`}
                          />
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* CANCELLATION */}
                {booking.appointment_status === "rejected" && (
                  <div className="bg-red-50 rounded border border-red-300 p-4">
                    <h4 className="font-semibold text-red-800 flex items-center gap-2 mb-1">
                      <XCircle className="w-4 h-4" />
                      Cancellation Details
                    </h4>
                    <p className="text-red-700">
                      {booking.cancellation_reason}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </ComponentCard>
    </>
  );
};

export default BookingDetails;
