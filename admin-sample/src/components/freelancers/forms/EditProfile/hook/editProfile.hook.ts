import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EditProfileValidation,
  EditProfileValidationType,
} from "../validations/editProfile.validation";

export const useEditProfileForm = (
  defaultValues: Partial<EditProfileValidationType> = {},
  skippedFields?: {
    instagramHandle?: boolean;
    chargingRates?: boolean;
    freelancerReferralDetails?: boolean;
  },
  activeStep: string = "basic"
) => {
  const formMethods = useForm<EditProfileValidationType>({
    shouldFocusError: false,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: (values, context, options) => {
      const config = {
        isWhatsAppEnabled: !!values.isWhatsAppEnabled,
        isEmailEnabled: !!values.isEmailEnabled,
        isTextEnabled: !!values.isTextEnabled,
        skippedFields,
      };
      const schema = EditProfileValidation(activeStep, config);
      return (zodResolver(schema as any) as any)(values, context, options);
    },
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      phoneData: {
        fullPhone: "",
        countryCode: "",
        phoneNumber: "",
      },
      // Legacy
      phoneNumber: "",
      countryCode: "",
      instagramHandle: "",
      freelancerBio: "",
      glamAndGoMinRate: "",
      halfDayShootMinRate: "",
      fullDayShootMinRate: "",
      // freelancerReferralDetails: "",
      freelancerPortfolioImages: [],
      userName: "",
      password: "",
      freelancerPostalCode: "",
      isEmailVerified: false,
      isWhatsAppEnabled: false,
      whatsapp: "",
      isEmailEnabled: false,
      additional_email: "",
      isTextEnabled: false,
      text: "",
      availability: {
        monday: { enabled: false, slots: [{ start: "09:00", end: "13:00" }] },
        tuesday: { enabled: false, slots: [{ start: "09:00", end: "13:00" }] },
        wednesday: {
          enabled: false,
          slots: [{ start: "09:00", end: "13:00" }],
        },
        thursday: { enabled: false, slots: [{ start: "09:00", end: "13:00" }] },
        friday: { enabled: false, slots: [{ start: "09:00", end: "13:00" }] },
        saturday: { enabled: false, slots: [{ start: "09:00", end: "13:00" }] },
        sunday: { enabled: false, slots: [{ start: "09:00", end: "13:00" }] },
      },
      calendars: [],
      services: [],
      serviceRadius: 5,
      serviceLocation: {
        longitude: -0.1276,
        latitude: 51.5074,
      },
      isInternationBooking: false,
      ...defaultValues,
    },
  });

  return formMethods;
};
