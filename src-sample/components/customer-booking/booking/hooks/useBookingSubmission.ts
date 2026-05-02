"use client";
import customerService from "@/services/customerService";
import paymentService from "@/services/paymentService";
import { ToastService } from "@/lib/utilities/toastService";
import { Step } from "../types";
import { AxiosError } from "axios";

import {
  Freelancer,
  FreelancerService,
  ServiceOption,
} from "@/types/api/freelancer.types";
import { BookingState } from "../../hook/useBookingPersistence";

interface BookingSubmissionProps {
  bookingState: BookingState;
  updateBookingState: (data: Partial<BookingState>) => void;
  selected: Freelancer;
  selectedService: FreelancerService | undefined;
  selectedOption: ServiceOption | undefined;
  freelancerProfile: Freelancer | undefined;
  total: number;
  setPageLoading: (loading: boolean) => void;
  clearPersistedData: () => void;
  convertTo24Hour: (time: string) => string;
}

export function useBookingSubmission({
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
}: BookingSubmissionProps) {
  async function handleSubmitBooking(paymentDataOverride?: {
    paymentMethod?: string;
    paymentMethodId?: string;
    clientSecret?: string;
    country?: string;
    postal?: string;
    promo?: string;
  }) {
    try {
      setPageLoading(true);

      const effectivePaymentData = {
        ...bookingState.paymentData,
        ...paymentDataOverride,
      };

      if (!freelancerProfile || !selectedService || !selectedOption) {
        throw new Error("Missing required data");
      }

      const servicePlaceId =
        freelancerProfile.service_areas?.[0]?.service_place?.id;
      if (!servicePlaceId) {
        throw new Error("Service place not available");
      }

      const customerPayload = {
        first_name: bookingState.customerData.first_name,
        last_name: bookingState.customerData.last_name,
        country_code: bookingState.customerData.country_code,
        phone: bookingState.customerData.phone,
        email: bookingState.customerData.email,
        enable_newsletter: bookingState.customerData.enable_newsletter ?? false,
      };

      const custRes: any =
        await customerService.createCustomer(customerPayload);
      const customer_id = custRes?.data?.data?.id;

      if (custRes?.status !== 201) {
        throw new Error(custRes?.data?.message || "Validation Failed");
      }

      const uploadedImages = (bookingState.uploadedUrls || [])
        .filter((url): url is string => Boolean(url))
        .map((url: string) => ({ image_url: url }));

      const time24 = convertTo24Hour(bookingState.selectedSlot ?? "12:00pm");
      const selectedDate = new Date(bookingState.selectedDay);
      const dateISO = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;
      const startAt = `${dateISO}T${time24}:00Z`;

      const bookingPayload = {
        freelancer_id: selected.id,
        customer_id,
        service_place_id: servicePlaceId,
        product_id: selectedService.id,
        product_option_id: selectedOption.id,
        service_start_at: startAt,
        service_amount: selectedOption.price,
        service_duration: selectedOption.duration,
        promo_code: "",
        location: {
          address_1: bookingState.location.line1,
          address_2: bookingState.location.line2,
          postal_code: bookingState.location.postal,
          city: bookingState.location.city,
        },
        images: uploadedImages,
        special_instructions: bookingState.notes,
      };

      const bookingRes: any =
        await customerService.bookAppointment(bookingPayload);
      const bookingId = bookingRes?.data?.data?.id;

      if (bookingRes?.status !== 201) {
        throw new Error(bookingRes?.data?.message || "Validation Failed");
      }

      const paymentCode =
        bookingState.appliedCoupons.length > 0
          ? bookingState.appliedCoupons[bookingState.appliedCoupons.length - 1]
              .code
          : "";

      const paymentBase = {
        userId: customer_id,
        freelancerId: selected.id,
        bookingId: bookingId,
        amount: total,
        couponCode: paymentCode,
        currency: "GBP",
        description: "Service Booking Payment",
        paymentMethodId: effectivePaymentData.paymentMethodId!,
      };

      if (effectivePaymentData.paymentMethod === "applepay") {
        const applePayload = {
          ...paymentBase,
          clientSecret: effectivePaymentData.clientSecret,
        };
        const paymentRes: any = await paymentService.makePayment(applePayload);
        if (paymentRes?.status !== 201 && paymentRes?.status !== 200) {
          throw new Error(paymentRes?.data?.message || "Payment Failed");
        }
      } else {
        if (!effectivePaymentData.paymentMethodId)
          throw new Error("Payment method not found");
        const paymentRes: any = await paymentService.makePayment(paymentBase);
        if (paymentRes?.status !== 201 && paymentRes?.status !== 200) {
          throw new Error(paymentRes?.data?.message || "Payment Failed");
        }
      }

      clearPersistedData();
      updateBookingState({ step: Step.CONFIRM });
      setPageLoading(false);
      ToastService.success(
        "Booking request sent successfully!",
        "booking-success",
      );
    } catch (err: unknown) {
      setPageLoading(false);
      const status =
        err instanceof AxiosError ? err.response?.status : undefined;
      const message =
        err instanceof Error ? err.message : "Failed to send booking request.";
      if (status !== 401) {
        ToastService.error(message, "booking-error");
      }
    }
  }

  return { handleSubmitBooking };
}
