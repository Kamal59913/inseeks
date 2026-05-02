import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpValidation } from "../validations/signup.validation";
import { useEffect } from "react";

const FORM_STORAGE_KEY = process.env.NEXT_PUBLIC_FORM_STORAGE_PART_SEC_KEY!;

export const INITIAL_VALUES_STEP_TWO = {
  // ===== BASIC INFO =====
  userName: "",
  password: "",

  // ===== WORK ZONE =====
  workZone: [],

  // ===== POSTAL CODE =====
  freelancerPostalCode: "",

  // ===== EMAIL VERIFIED =====
  isEmailVerified: false,

  // ===== MANUAL ENTRY FLAGS =====
  isManualAddressFreelancer: false,

  // ===== TRAVEL & LOCATION =====
  isInternationBooking: false,
  serviceRadius: 5,
  serviceLocation: {
    longitude: -0.1276,
    latitude: 51.5074,
  },
  localTravelFee: "",
};

export const useSignUpForm = (
  userRole: string,
  isBehalfCompanyState: boolean = false,
  workZone: string[] = [],
) => {
  const savedForm =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem(FORM_STORAGE_KEY) || "null")
      : null;

  const formMethods = useForm({
    shouldFocusError: false,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(
      SignUpValidation(userRole, isBehalfCompanyState, workZone),
    ),
    defaultValues: savedForm || INITIAL_VALUES_STEP_TWO,
  });

  useEffect(() => {
    const subscription = formMethods.watch((values) => {
      // ✅ Exclude password before saving
      const { password, ...safeValues } = values;

      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(safeValues));
    });
    return () => subscription.unsubscribe();
  }, [formMethods]);

  return formMethods;
};

