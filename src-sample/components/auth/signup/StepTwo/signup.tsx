"use client";
import { useEffect, useMemo, useState } from "react";
import { ToastService } from "@/lib/utilities/toastService";
import authService from "@/services/authService";
import { useGlobalStates } from "@/store/hooks/useGlobalStates";
import { usePathname } from "next/navigation";
import { useSignUpForm, INITIAL_VALUES_STEP_TWO } from "./hook/signup-form.hook";
import { StepNavigation } from "./stepNavigation";
import { StepRenderer, getStepsForRole, getStepConfig } from "./steps/registry";
import { ManualEntryState } from "./types";
import { useOnboardingStepTwo } from "@/store/hooks/useOnboardingStepTwo";
import { STEP_INDICES_NAME, StepSecondId, StepId, CLEAR_SIGNUP_ON_SUBMIT } from "@/types/constants/constants";
import Loader from "@/components/ui/loader/loader";
import { useDispatch, useSelector } from "react-redux";
import { goToStep, resetSteps } from "@/store/slices/onboardingStepTwoSlice";
import { fetchCurrentUser } from "@/store/slices/authSlice";
import { AppDispatch } from "@/store/store";
import { formatFieldName } from "@/lib/utilities/revertCamelCaseText";
import { useOnboardingStepOne } from "@/store/hooks/useFreelancerStepOne";
import { resetSteps as resetStepOne } from "@/store/slices/onboardingStepOneSlice";


const SignUpStepTwo: React.FC = ({ }) => {
  const pathname = usePathname();
  const userRole = pathname?.split("/").pop() as "freelancer" | "client";
  const { isButtonLoading } = useGlobalStates();
  const dispatch = useDispatch<AppDispatch>();

  const [workZoneProperty, setWorkZone] = useState<string[]>([]);
  const [isManualAddressEntry, setIsManualAddressEntry] =
    useState<ManualEntryState>({
      isManualEntryHS: false,
      isManualEntryPV: false,
      isManualEntryCH: false,
    });

  const { currentStep, steps, setSteps, nextStep, previousStep } =
    useOnboardingStepTwo();

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);

    const isSuccessScreen = currentStep === steps.length - 1;

    if (isHydrated) {
      if (isSuccessScreen) {
        // If on success screen, stay there (do nothing)
      } else {
        const values = formMethods.getValues();
        const isNotBlank = !!(values.userName || values.password);

        if (isNotBlank) {
          // If has data, security redirect to Password
          if (currentStep > 1) {
            dispatch(goToStep(1));
          }
        } else {
          // If blank and NOT success screen, "start from the same page itseld" (Step 0)
          if (currentStep > 0) {
            dispatch(resetSteps()); // Goes to Step 0
          }
        }
      }
    }
  }, [steps.length, isHydrated]);

  const formMethods = useSignUpForm(userRole!, false, workZoneProperty);

  const workZone = formMethods.watch("workZone");
  const customerType = formMethods.watch("customerType");
  const currentStepName = steps[currentStep];

  const shouldShowCompanyFields = useMemo(
    () => customerType === "professional" || customerType === "both",
    [customerType]
  );
  const stepIds = useMemo(() => {
    return getStepsForRole(workZone);
  }, [workZone, userRole, shouldShowCompanyFields]);

  const totalSteps = stepIds.length;
  const currentStepId = stepIds[currentStep];
  const currentStepConfig = useMemo(
    () => (currentStepId ? getStepConfig(currentStepId) : null),
    [currentStepId]
  );

  const handleNext = async () => {
    if (currentStepId === StepSecondId.USERNAME) {
      try {
        const username = formMethods.getValues("userName");
        await formMethods.trigger("userName");

        const response: any = await authService.checkUsername(username);

        if (response?.status === 400) {
          // ToastService.error(
          //   "This username is already taken. Please choose another."
          // );
          return;
        }
      } catch (err) {
        ToastService.error("Failed to verify username. Please try again.");
        return;
      }
    }

    if (!currentStepConfig?.fields || currentStepConfig.fields.length === 0) {
      nextStep();
      return;
    }

    let fieldsToValidate: any = currentStepConfig.fields;

    if (currentStepConfig.getDynamicFields) {
      const currentFormValues = formMethods.getValues();
      fieldsToValidate = currentStepConfig.getDynamicFields(currentFormValues);
    }

    const isValid = await formMethods.trigger(fieldsToValidate as any);

    if (isValid) nextStep();
  };

  const handlePrevious = () => previousStep();

  const handleFormSubmit = async (data: any, e: any) => {
    e.preventDefault();

    // Block form submission if email is not verified
    // Block form submission checks removed per request

    // if (!isEmailVerified) {
    //   ToastService.error(
    //     "Please wait for email verification to complete before submitting",
    //     "email-not-verified"
    //   );
    //   return;
    // }

    const response: any = await authService?.registerTwo(data);

    if (response.status === 201) {
      ToastService.success(
        response.data.message || "Registered User Successfully"
      );

      if (CLEAR_SIGNUP_ON_SUBMIT) {
        localStorage.removeItem(
          process.env.NEXT_PUBLIC_FORM_STORAGE_PART_SEC_KEY!
        );
        // We DO NOT remove the step storage key here to allow handleNext()
        // and to keep the user on the success screen after refresh.
        formMethods.reset(INITIAL_VALUES_STEP_TWO);
      }

      // Fetch the current user to update the auth state with the new token
      await dispatch(fetchCurrentUser());
      handleNext();
    } else {
      ToastService.error(
        response.data.message || "Sign in failed",
        "sign-in-fail"
      );
      handleNext();
    }
  };

  useEffect(() => {
    const stepIdsAsStrings = stepIds.map((id) => id as string);

    if (JSON.stringify(stepIdsAsStrings) !== JSON.stringify(steps)) {
      setSteps(stepIdsAsStrings);
    }

    //ADDING COUNT TO THE LOCAL STORAGE
    const stepOneTotal =
      Number(
        localStorage.getItem(process.env.NEXT_PUBLIC_STEP_ONE_TOTAL_KEY!)
      ) || 0;

    localStorage.setItem(
      process.env.NEXT_PUBLIC_STEP_TWO_TOTAL_KEY!,
      String(stepOneTotal + stepIdsAsStrings.length)
    );
  }, [stepIds, steps, setSteps]);

  useEffect(() => {
    const subscription = formMethods.watch((values) => {
      if (values.workZone && Array.isArray(values.workZone)) {
        const validZones = values.workZone.filter(
          (zone: any): zone is string => typeof zone === "string"
        );
        setWorkZone(validZones);
      }
    });
    return () => subscription.unsubscribe();
  }, [formMethods]);

  useEffect(() => {
    const subscription = formMethods.watch((values) => {
      const { isManualAddressHS, isManualAddressPV, isManualAddressCH } =
        values;
      setIsManualAddressEntry({
        isManualEntryHS: !!isManualAddressHS,
        isManualEntryPV: !!isManualAddressPV,
        isManualEntryCH: !!isManualAddressCH,
      });
    });
    return () => subscription.unsubscribe();
  }, [formMethods]);

  const handleFormError = (errors: any) => {
    const lastFieldToIgnore = "localTravelFee";

    const keysToShow = Object.keys(errors)
      .filter((key) => key !== lastFieldToIgnore)
      .map((key) => formatFieldName(key));

    if (keysToShow.length === 0) return;

    if (keysToShow.length > 1) {
      ToastService.error(
        `Please fill in these steps: ${keysToShow.join(", ")}`
      );
    } else {
      ToastService.error(`Please fill in this step: ${keysToShow[0]}`);
    }
    console.error("Form Validation Errors:", errors);
  };

  if (!isHydrated) {
    return <Loader />;
  }

  return (
    <div className="p-4 h-full flex flex-col">
      <form
        className="flex-1 flex flex-col justify-start"
        onSubmit={formMethods?.handleSubmit(handleFormSubmit, handleFormError)}
        onKeyDown={(e) => {
          if (
            e.key === "Enter" &&
            (e.target as HTMLElement).tagName !== "TEXTAREA"
          ) {
            e.preventDefault();
          }
        }}
      >

        <div
          className={`flex flex-col gap-14 ${currentStepName === STEP_INDICES_NAME.TRAVEL_ZONE_PAGE
            ? "min-h-[70vh]"
            : "min-h-[50vh]"
            }`}
        >
          {currentStepId && (
            <StepRenderer stepId={currentStepId} formMethods={formMethods} />
          )}
        </div>
        <div className="pb-10">
          <StepNavigation
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrevious={handlePrevious}
            onNext={handleNext}
            isLoading={isButtonLoading("register-two")}
          />
        </div>
      </form>

      {/* <div className="absolute bottom-5 right-5">
        <button
          type="button"
          className="cursor-pointer bg-white text-black p-4 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div> */}
    </div>
  );
};

export default SignUpStepTwo;

