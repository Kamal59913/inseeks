import { useState } from "react";
import PageMeta from "../../common/PageMeta";
import ComponentCard from "../../common/ComponentCard";
import { HEADER_CONFIG } from "../../../config/headerName";
import { useParams } from "react-router-dom";
import PageBreadcrumbButton from "../../common/PageBreadCrumbButton";
import { useGetFreelancerBookingsById } from "@/hooks/queries/freelancers/useGetFreelancersBookings";
import { useNavigate } from "react-router-dom";
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
import { queryClient } from "@/utils/queryClient";
import { FilterTabs } from "./FreelancerFilterTabs";
import { useGetFreelancerReferrals } from "@/hooks/queries/freelancers/useGetFreelancerReferrals";
import {
  formatDateTime,
  formatMinutesToDecimalHours,
  formatRelativeTime,
} from "@/utils/formateDate";
import bookingsService from "@/api/services/bookingsService";


const FreelancerBookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { open, close } = useModalData();

  const { data: freelancerBookingDetails, isPending } =
    useGetFreelancerBookingsById(id || "", {
      enabled: true,
    });
  const { data: freelancerReferralsData } = useGetFreelancerReferrals(id || "");
  const referralsCount = freelancerReferralsData?.data?.data?.length || 0;
  const navigate = useNavigate();
  const bookings = freelancerBookingDetails?.data?.data?.bookings || [];

  const [openBooking, setOpenBooking] = useState<string | null>(null);

  const toggleAccordion = (bookingId: string) => {
    setOpenBooking((prev) => (prev === bookingId ? null : bookingId));
  };

  // Toggle this to false to enable force actions always
  const restrictForceActions = false;

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
            }
          );

          if (response?.status === 200) {
            ToastService.success(
              response.data.message || "Booking cancelled successfully",
              "force-cancel-booking"
            );
            await queryClient.invalidateQueries({
              queryKey: ["get-freelancer-bookings-byId"],
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
              queryKey: ["get-freelancer-bookings-byId"],
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
        title={`Freelancer Booking Details | ${HEADER_CONFIG.NAME}`}
        description="Freelancer Booking Details"
      />

      <PageBreadcrumbButton
        pageTitle="Freelancer Booking Details"
        destination_name="Freelancer Bookings"
        destination_path="freelancers"
        is_reverse={true}
      />

      <ComponentCard
        footerContent={
          <FilterTabs
            activeTab="booking"
            onChange={(tab) => {
              if (tab === "profile") {
                navigate(`/freelancers/${id}`);
              } else if (tab === "edit_profile") {
                navigate(`/freelancers/edit/${id}`);
              } else if (tab === "referral_details") {
                navigate(`/freelancers/referral-details/${id}`);
              }
            }}
            referralCount={referralsCount}
          />
        }
      >
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
        {!isPending && bookings.length === 0 && (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No bookings found</p>
            </div>
          </div>
        )}

        {/* ACCORDION WRAPPER */}
        <div className="space-y-4">
          {bookings.map((booking: any) => {
            const isOpen = openBooking === booking.id;

            return (
              <div
                key={booking.id}
                className="border rounded-lg bg-gray-50 shadow-sm"
              >
                {/* ACCORDION HEADER */}
                <button
                  onClick={() => toggleAccordion(booking.id)}
                  className="w-full flex justify-between items-center px-5 py-4 text-left hover:bg-gray-100 transition"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {getCustomerDisplayName(booking.customer)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDateTime(booking.booking_timestamp, "short")}
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
                      <div className="bg-gray-50 p-4 rounded border space-y-2">
                        <h4 className="font-semibold flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-blue-600" />
                          Override Booking
                        </h4>

                        <p className="text-sm text-gray-700">
                          You can manually override this booking's state
                          regardless of the customer's payment or workflow
                          status.
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
                          <span className="font-medium">Option name:</span>{" "}
                          {booking.productOption.name}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mt-3">
                          <div>
                            <p className="text-sm text-gray-500">Duration</p>
                            <p className="font-medium">
                              {formatMinutesToDecimalHours(
                                booking.service_duration
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Amount</p>
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
                          {formatMinutesToDecimalHours(
                            booking.service_duration
                          )}
                        </p>
                      </div>

                      {/* CUSTOMER - ONLY PHONE AND EMAIL */}
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
                          {booking.customer.country_code}{" "}
                          {booking.customer.phone}
                        </p>
                      </div>

                      {/* FREELANCER */}
                      {booking.freelancer && (
                        <div className="bg-gray-50 p-4 rounded border space-y-1">
                          <h4 className="font-semibold flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-600" />
                            Freelancer Information
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
                    </div>

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
      </ComponentCard>
    </>
  );
};

export default FreelancerBookingDetails;
