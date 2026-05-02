"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { ProfileValidationContact } from "../validations/profile-contact.validation";

import { countries } from "@/lib/utilities/phoneInput";

const splitPhoneNumber = (fullNumber: string) => {
  if (!fullNumber) return { countryCode: "GB", phoneNumber: "" }; // Default to GB or empty?

  // Sort by label length (desc) to match longest prefix first (e.g. +1-684 before +1)
  // Clean fullNumber to ensure it has '+' if labels have '+', or normalize.
  // Assuming fullNumber comes from backend as e.g. "+1234567890"

  const sorted = [...countries].sort((a, b) => b.label.length - a.label.length);

  for (const country of sorted) {
    // Check if number starts with the country label directly
    if (fullNumber.startsWith(country.label)) {
      return {
        countryCode: country.code, // The ISO code (e.g., "US")
        phoneNumber: fullNumber.slice(country.label.length).trim(),
      };
    }
    // Handle case where fullNumber might not have space but label has "+1 " ? No, label is "+1"
  }

  // Fallback
  return { countryCode: "GB", phoneNumber: fullNumber };
};

export const useProfileFormContacts = (data?: any) => {
  const isInitialMount = useRef(true);

  // Calculate default values based on data availability
  const whatsappData = data?.additional_info?.whats_app_number || "";
  const textData = data?.additional_info?.sms_number || "";

  const { countryCode: initialWaCode, phoneNumber: initialWaNum } =
    splitPhoneNumber(whatsappData);
  const { countryCode: initialTextCode, phoneNumber: initialTextNum } =
    splitPhoneNumber(textData);

  const formMethods = useForm({
    shouldFocusError: false,
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      whatsapp: whatsappData,
      whatsappCountryCode: initialWaCode,
      whatsappPhoneNumber: initialWaNum,

      additional_email: "",

      text: textData,
      textCountryCode: initialTextCode,
      textPhoneNumber: initialTextNum,

      isWhatsAppEnabled: false,
      isEmailEnabled: false,
      isTextEnabled: false,
    },
    resolver: (values, context, options) => {
      const config = {
        isWhatsAppEnabled: !!values.isWhatsAppEnabled,
        isEmailEnabled: !!values.isEmailEnabled,
        isTextEnabled: !!values.isTextEnabled,
      };

      // Update the combined fields for validation/submission if needed?
      // Actually validator checks specific fields now.

      return (zodResolver(ProfileValidationContact(config)) as any)(
        values,
        context,
        options,
      );
    },
  });

  useEffect(() => {
    if (data) {
      const wa = data?.additional_info?.whats_app_number || "";
      const sms = data?.additional_info?.sms_number || "";

      const waSplit = splitPhoneNumber(wa);
      const smsSplit = splitPhoneNumber(sms);

      formMethods.reset({
        whatsapp: wa,
        whatsappCountryCode: waSplit.countryCode,
        whatsappPhoneNumber: waSplit.phoneNumber,

        additional_email: data?.additional_info?.email || "",

        text: sms,
        textCountryCode: smsSplit.countryCode,
        textPhoneNumber: smsSplit.phoneNumber,

        isWhatsAppEnabled: !!data?.additional_info?.whats_app_number_enabled,
        isEmailEnabled: !!data?.additional_info?.email_enabled,
        isTextEnabled: !!data?.additional_info?.sms_number_enabled,
      });
    }

    // After first mount, set to false
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, [
    data?.additional_info?.whats_app_number,
    data?.additional_info?.email,
    data?.additional_info?.sms_number,
    data?.additional_info?.whats_app_number_enabled,
    data?.additional_info?.email_enabled,
    data?.additional_info?.sms_number_enabled,
    formMethods,
  ]);

  return formMethods;
};

