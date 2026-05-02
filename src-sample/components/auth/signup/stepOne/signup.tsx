"use client";
import React, { useEffect, useMemo, useState } from "react";
import { ToastService } from "@/lib/utilities/toastService";
import authService from "@/services/authService";
import { useGlobalStates } from "@/store/hooks/useGlobalStates";
import { usePathname } from "next/navigation";
import { useSignUpForm, INITIAL_VALUES_STEP_ONE } from "./hook/signup-form.hook";
import { StepNavigation } from "./stepNavigation";
import { StepRenderer, getStepsForRole, getStepConfig } from "./steps/registry";
import { useOnboardingStepOne } from "@/store/hooks/useFreelancerStepOne";
import Loader from "@/components/ui/loader/loader";
import { useDispatch, useSelector } from "react-redux";
import { resetSteps } from "@/store/slices/onboardingStepOneSlice";
import { formatFieldName } from "@/lib/utilities/revertCamelCaseText";
import { StepId, STEP_INDICES_NAME, CLEAR_SIGNUP_ON_SUBMIT } from "@/types/constants/constants";
import { RegisterOneFormData } from "@/types/api/services.types";
import { RootState } from "@/store/store";
import { ApiResponse } from "@/types/api/base";
import { FieldErrors, Path } from "react-hook-form";
import { SignUpValidationType } from "./validations/signup.validation";

export default function SignUpStepOne() {
  const pathname = usePathname();
  const userRole = pathname?.split("/").pop() as "freelancer" | "client";
  const { isButtonLoading } = useGlobalStates();
  const dispatch = useDispatch();

  const {
    currentStep,
    steps,
    setSteps,
    nextStep,
    previousStep,
    skippedFields,
    setSkippedField,
  } = useOnboardingStepOne();

  const [isHydrated, setIsHydrated] = useState(false);
  const skipSubmitTrigger = useSelector(
    (state: RootState) => state.executionStates.skipSubmitTrigger
  );
  useEffect(() => {
    setIsHydrated(true);

    const isSuccessScreen = currentStep === steps.length - 1;

    // Logic: If blank and NOT the success screen, start from the same page (Step 0)
    if (!isSuccessScreen && isHydrated) {
      const values = formMethods.getValues();
      const isBlank = !values.firstName && !values.email;

      if (isBlank && currentStep > 0) {
        // "start from the same page itseld" -> meaning the beginning of this section
        dispatch(resetSteps()); // This will go to step 0
      }
    }
  }, [steps.length, isHydrated]);

  const formMethods = useSignUpForm(skippedFields);

  const stepIds = useMemo(() => {
    return getStepsForRole();
  }, [userRole]);

  const totalSteps = stepIds.length;
  const currentStepId = stepIds[currentStep];
  const currentStepConfig = useMemo(
    () => (currentStepId ? getStepConfig(currentStepId) : null),
    [currentStepId]
  );
  const currentStepName = steps[currentStep];

  const handleNext = async () => {
    if (!currentStepConfig?.fields || currentStepConfig.fields.length === 0) {
      nextStep();
      return;
    }

    let fieldsToValidate: Path<SignUpValidationType>[] = currentStepConfig.fields as Path<SignUpValidationType>[];

    if (currentStepConfig.getDynamicFields) {
      const currentFormValues = formMethods.getValues();
      fieldsToValidate = currentStepConfig.getDynamicFields(currentFormValues) as Path<SignUpValidationType>[];
    }

    const isValid = await formMethods.trigger(fieldsToValidate as any);

    if (isValid) {
      if (currentStepId === StepId.EMAIL) {
        try {
          const email = formMethods.getValues("email");
          const response = await authService.checkValue(email);
          if (response?.status === 400) return; // Block if already exists
        } catch (err) {
          return;
        }
      }

      if (currentStepId === StepId.FREELANCER_REFERRAL_DETAILS) {
        try {
          const referral = formMethods.getValues("freelancerReferralDetails");
          if (referral && referral.trim().length > 0) {
            const response = await authService.checkValue(referral);
            if (response?.status === 200) return; // Block if NOT found (is available)
          }
        } catch (err) {
          return;
        }
      }

      nextStep();
    }
  };

  const handlePrevious = () => {
    const previousStepId = stepIds[currentStep - 1];
    if (previousStepId === STEP_INDICES_NAME.INSTAGRAM_HANDLE) {
      setSkippedField("instagramHandle", false);
    } else if (previousStepId === STEP_INDICES_NAME.CHARGING_RATES) {
      setSkippedField("chargingRates", false);
    } else if (
      previousStepId === STEP_INDICES_NAME.FREELANCER_REFERRAL_DETAILS
    ) {
      setSkippedField("freelancerReferralDetails", false);
    }
    previousStep();
  };

  const handleFormSubmit = async (data: SignUpValidationType, e?: React.BaseSyntheticEvent) => {
    e?.preventDefault();

    // Final guard for referral since it's a submit step
    if (currentStepId === StepId.FREELANCER_REFERRAL_DETAILS) {
      const referral = data.freelancerReferralDetails;
      if (referral && referral.trim().length > 0) {
        try {
          const response = await authService.checkValue(referral);
          if (response?.status === 200) return; // Block
        } catch (err) {
          return;
        }
      }
    }

    const response = await authService?.registerOne(data as RegisterOneFormData);

    if (response.status === 201) {
      ToastService.success(
        response.data.message || "Registered User Successfully"
      );

      if (CLEAR_SIGNUP_ON_SUBMIT) {
        localStorage.removeItem(
          process.env.NEXT_PUBLIC_FORM_STORAGE_PART_ONE_KEY!
        );
        // We DO NOT remove the step storage key here to allow handleNext()
        // and to keep the user on the success screen after refresh.
        formMethods.reset(INITIAL_VALUES_STEP_ONE);
      }

      handleNext();
    } else {
      ToastService.error(
        response.data.message || "Sign in failed",
        "sign-in-fail"
      );
      // handleNext();
    }
  };

  useEffect(() => {
    const stepIdsAsStrings = stepIds.map((id) => id as string);
    if (JSON.stringify(stepIdsAsStrings) !== JSON.stringify(steps)) {
      setSteps(stepIdsAsStrings);
    }

    //ADDING COUNT TO THE LOCAL STORAGE
    localStorage.setItem(
      process.env.NEXT_PUBLIC_STEP_ONE_TOTAL_KEY!,
      String(stepIdsAsStrings.length)
    );
  }, [stepIds, steps, setSteps]);

  useEffect(() => {
    if (skipSubmitTrigger > 0) {
      formMethods?.handleSubmit(handleFormSubmit, handleFormError)();
    }
  }, [skipSubmitTrigger]);


  if (!isHydrated) {
    return <Loader />;
  }

  const handleFormError = (errors: FieldErrors<SignUpValidationType>) => {
    const lastFieldToIgnore = "freelancerReferralDetails";

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

  return (
    <div className="p-4 h-full flex flex-col">
      {/* 🧠 Debug Section */}
      {/* <div className="bg-gray-100 text-gray-800 p-4 mb-4 rounded-lg shadow-sm space-y-2">
        <h1 className="text-lg font-bold">🧭 Onboarding Debug Info</h1>
        <h1>📍 Current Part: {currentPart}</h1>
        <h1>📍 Current Step ID: {currentStepId || "N/A"}</h1>
        <h1>📍 Is Part End Step: {isPartEnd ? "✅ Yes" : "❌ No"}</h1>
        <h1>📍 Will Complete Part 1: {willCompletePart1 ? "✅ Yes" : "❌ No"}</h1>
      </div> */}

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
          className={`flex flex-col gap-14 
            ${
            currentStepName === STEP_INDICES_NAME.PORTFOLIO_IMAGES
              ? "min-h-[60vh]"
              : currentStepName === STEP_INDICES_NAME.CHARGING_RATES
              ? "min-h-[64vh]"
              : "min-h-[50vh]"
          }`
        }
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
            isLoading={isButtonLoading("register-one")}
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
}

