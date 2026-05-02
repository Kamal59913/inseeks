import { useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";
import { HEADER_CONFIG } from "../../../config/headerName";
import { useParams } from "react-router-dom";
import PageBreadcrumbButton from "../../../components/common/PageBreadCrumbButton";

import {
  Calendar,
  MapPin,
  User,
  CreditCard,
  FileText,
  XCircle,
  CheckCircle,
  AlertCircle,
  Image,
  Mail,
  Phone,
  Hash,
} from "lucide-react";

import { useModalData } from "@/redux/hooks/useModal";
import { ToastService } from "@/utils/toastService";
import freelancersService from "@/api/services/freelancersService";
import { queryClient } from "@/utils/queryClient";
import { useGetCustomerById } from "@/hooks/queries/customers/useServiceCategoriesById";
import {
  formatDateTime,
  formatMinutesToDecimalHours,
  formatRelativeTime,
} from "@/utils/formateDate";
import bookingsService from "@/api/services/bookingsService";

const CustomerDetails = ({
  isWaitingList = false,
}: {
  isWaitingList?: boolean;
}) => {
  const { id } = useParams<{ id: string }>();
  const { open, close } = useModalData();

  const { data: customerDetails, isPending } = useGetCustomerById(id || "", {
    enabled: true,
  });

  const customer = customerDetails?.data?.data;

  const [openBooking, setOpenBooking] = useState<string | null>(null);

  const toggleAccordion = (bookingId: string) => {
    setOpenBooking((prev) => (prev === bookingId ? null : bookingId));
  };

  // Toggle this to false to enable force actions always
  const restrictForceActions = false;

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

  const getStatusColor = (status?: string) => {
    if (!status) return "bg-gray-100 text-gray-800";
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      suspended: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
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
            }
          );

          if (response?.status === 200) {
            ToastService.success(
              response.data.message || "Booking cancelled successfully",
              "force-cancel-booking"
            );
            await queryClient.invalidateQueries({
              queryKey: ["get-customer-by-id"],
            });
          } else {
            ToastService.error(
              response?.data?.message || "Failed to cancel booking",
              "force-cancel-booking-error"
            );
          }
        } catch (error) {
          ToastService.error(
            "An error occurred while cancelling booking",
            "force-cancel-booking-error"
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
            }
          );

          if (response?.status === 200) {
            ToastService.success(
              response.data.message || "Booking completed successfully",
              "force-complete-booking"
            );
            await queryClient.invalidateQueries({
              queryKey: ["get-customer-by-id"],
            });
          } else {
            ToastService.error(
              response?.data?.message || "Failed to complete booking",
              "force-complete-booking-error"
            );
          }
        } catch (error) {
          ToastService.error(
            "An error occurred while completing booking",
            "force-complete-booking-error"
          );
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
          response.data?.message || "Invoice generated successfully"
        );
      } else {
        ToastService.error(
          response.data?.message || "Failed to generate invoice"
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
          response.data?.message || "Invoice download started"
        );
      } else {
        ToastService.error(
          response.data?.message || "Failed to download invoice"
        );
      }
    } catch (error: any) {
      ToastService.error("An error occurred while downloading the invoice");
    }
  };

  return (
    <>
      <PageMeta
        title={`${isWaitingList ? "Waiting List Customer Details" : "Customer Details"} | ${HEADER_CONFIG.NAME}`}
        description={
          isWaitingList ? "Waiting List Customer Details" : "Customer Details"
        }
      />

      <PageBreadcrumbButton
        pageTitle={
          isWaitingList ? "Waiting List Customer Details" : "Customer Details"
        }
        destination_name={isWaitingList ? "Waiting Customers" : "Customers"}
        destination_path={
          isWaitingList ? "waiting-list-customers" : "customers"
        }
        is_reverse={true}
      />

      {/* LOADING */}
      {isPending && (
        <ComponentCard title="Customer Details">
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-600 font-medium">
                Loading customer details...
              </p>
            </div>
          </div>
        </ComponentCard>
      )}

      {/* NO DATA */}
      {!isPending && !customer && (
        <ComponentCard title="Customer Details">
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">
                Customer details not found
              </p>
            </div>
          </div>
        </ComponentCard>
      )}

      {/* CUSTOMER DATA */}
      {!isPending && customer && (
        <>
          {/* Customer Header */}
          <ComponentCard title="Customer Information">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {customer.first_name || ""} {customer.last_name || ""}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Customer ID: {customer.id || "N/A"}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  customer.status
                )}`}
              >
                {customer.status
                  ? customer.status.charAt(0).toUpperCase() +
                    customer.status.slice(1)
                  : "Unknown"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">First Name</p>
                  <p className="font-medium text-gray-900">
                    {customer.first_name || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Last Name</p>
                  <p className="font-medium text-gray-900">
                    {customer.last_name || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">
                    {customer.email || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">
                    {customer.country_code && customer.phone
                      ? `${customer.country_code} ${customer.phone}`
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Hash className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">UUID</p>
                  <p className="font-medium text-gray-900 text-xs break-all">
                    {customer.uuid || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium text-gray-900">
                    {customer.created_at
                      ? formatDateTime(customer.created_at, "short")
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {customer.role || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </ComponentCard>

          {/* Bookings Section */}
          {!isWaitingList && (
            <ComponentCard
              title={`Booking History (${customer.bookings?.length || 0})`}
              className="mt-2"
            >
              {!customer.bookings || customer.bookings.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">
                      No bookings found
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {customer.bookings.map((booking: any) => {
                    const isOpen = openBooking === booking.id.toString();

                    return (
                      <div
                        key={booking.id}
                        className="border rounded-lg bg-gray-50 shadow-sm"
                      >
                        {/* ACCORDION HEADER */}
                        <button
                          onClick={() => toggleAccordion(booking.id.toString())}
                          className="w-full flex justify-between items-center px-5 py-4 text-left hover:bg-gray-100 transition"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-semibold text-gray-900">
                                {booking.product.name}
                              </h3>
                              <span className="text-xs text-gray-500">
                                #{booking.id}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">
                              Booked:{" "}
                              {formatDateTime(
                                booking.booking_timestamp,
                                "short"
                              )}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            {getStatusBadge(booking.appointment_status)}

                            <svg
                              className={`w-5 h-5 text-gray-500 transform transition-transform ${
                                isOpen ? "rotate-180" : ""
                              }`}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </button>

                        {/* ACCORDION BODY */}
                        {isOpen && (
                          <div className="px-5 pb-5 pt-2 space-y-6 border-t bg-white rounded-b-lg">
                            {/* GRID */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {/* SERVICE */}
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
                                  <span className="font-medium">
                                    Description:
                                  </span>{" "}
                                  {booking.product.description}
                                </p>

                                <p>
                                  <span className="font-medium">
                                    Option name:
                                  </span>{" "}
                                  {booking.product_option.name}
                                </p>

                                <div className="grid grid-cols-2 gap-4 mt-3">
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Duration
                                    </p>
                                    <p className="font-medium">
                                      {formatMinutesToDecimalHours(
                                        booking.service_duration
                                      )}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Amount
                                    </p>
                                    <p className="font-medium">
                                      £{booking.service_amount}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* SCHEDULE */}
                              <div className="bg-gray-50 p-4 rounded border space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-blue-600" />
                                  Schedule
                                </h4>

                                <p>
                                  <span className="font-medium">
                                    Request Date:
                                  </span>{" "}
                                  {formatDateTime(
                                    booking.booking_timestamp,
                                    "short"
                                  )}
                                </p>

                                <div className="space-y-0.5">
                                  <p>
                                    <span className="font-medium">Start:</span>{" "}
                                    <span className="text-gray-900 font-semibold">
                                      {formatRelativeTime(
                                        booking.service_start_at
                                      )}
                                    </span>
                                  </p>
                                  <p className="text-sm text-gray-700">
                                    {formatDateTime(
                                      booking.service_start_at,
                                      "short"
                                    )}
                                  </p>
                                </div>

                                <p>
                                  <span className="font-medium">
                                    Duration:
                                  </span>{" "}
                                  {formatMinutesToDecimalHours(
                                    booking.service_duration
                                  )}
                                </p>

                                {booking.service_travel_fee && (
                                  <p>
                                    <span className="font-medium">
                                      Travel Fee:
                                    </span>{" "}
                                    £{booking.service_travel_fee}
                                  </p>
                                )}
                              </div>

                              {/* FREELANCER */}
                              {booking.freelancer && (
                                <div className="bg-gray-50 p-4 rounded border space-y-1">
                                  <h4 className="font-semibold flex items-center gap-2">
                                    <User className="w-4 h-4 text-blue-600" />
                                    Freelancer Information{" "}
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
                                    <span className="font-medium">
                                      Username:
                                    </span>{" "}
                                    {booking.freelancer.username}
                                  </p>
                                  <p>
                                    <span className="font-medium">Email:</span>{" "}
                                    {booking.freelancer.email}
                                  </p>
                                  {booking.freelancer.phone && (
                                    <p>
                                      <span className="font-medium">
                                        Phone:
                                      </span>{" "}
                                      {booking.freelancer.country_code}{" "}
                                      {booking.freelancer.phone}
                                    </p>
                                  )}
                                </div>
                              )}

                              {/* SERVICE LOCATION */}
                              <div className="bg-gray-50 p-4 rounded border space-y-1">
                                <h4 className="font-semibold flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-blue-600" />
                                  Service Location
                                </h4>
                                <p className="font-medium">
                                  {booking.service_place.name}
                                </p>

                                {booking.locations?.length > 0 && (
                                  <div className="mt-3 pt-3 border-t">
                                    {booking.locations.map((loc: any) => (
                                      <div key={loc.id} className="text-sm">
                                        <p>{loc.address_1}</p>
                                        {loc.address_2 && (
                                          <p>{loc.address_2}</p>
                                        )}
                                        <p>
                                          {loc.city}, {loc.postal_code}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* OVERRIDE BOOKING */}
                              <div className="bg-gray-50 p-4 rounded border space-y-2 lg:col-span-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                  <CreditCard className="w-4 h-4 text-blue-600" />
                                  Override Booking
                                </h4>

                                <p className="text-sm text-gray-700">
                                  You can manually override this booking's state
                                  regardless of the customer's payment or
                                  workflow status.
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

                              <div className="bg-gray-50 p-4 rounded border space-y-2 lg:col-span-2">
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
                                    onClick={() =>
                                      handleGenerateInvoice(booking.id)
                                    }
                                  >
                                    <FileText className="w-4 h-4" />
                                    Generate Invoice
                                  </button>

                                  <button
                                    className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1"
                                    onClick={() =>
                                      handleDownloadInvoice(booking.id)
                                    }
                                  >
                                    <FileText className="w-4 h-4" />
                                    Download Invoice
                                  </button>
                                </div>
                              </div>
                            </div>

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
                            {booking.image_references?.length > 0 && (
                              <div className="bg-gray-50 p-4 rounded border">
                                <h4 className="font-semibold flex items-center gap-2 mb-2">
                                  <Image className="w-4 h-4 text-blue-600" />
                                  Reference Images
                                </h4>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  {booking.image_references.map(
                                    (img: any, index: number) => (
                                      <img
                                        key={index}
                                        src={img.image_url}
                                        alt={`Reference ${index + 1}`}
                                        className="rounded border object-cover h-50 w-full"
                                      />
                                    )
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
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </ComponentCard>
          )}
        </>
      )}
    </>
  );
};

export default CustomerDetails;
