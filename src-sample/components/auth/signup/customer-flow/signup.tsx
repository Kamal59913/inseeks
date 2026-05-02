"use client";
import { useEffect, useMemo, useState } from "react";
import { ToastService } from "@/lib/utilities/toastService";
import authService from "@/services/authService";
import { useGlobalStates } from "@/store/hooks/useGlobalStates";
import { usePathname } from "next/navigation";
import { useSignUpForm } from "./hook/signup-form.hook";
import { StepNavigation } from "./stepNavigation";
import { StepRenderer, getStepsForRole, getStepConfig } from "./steps/registry";
import { useCustomerOnboarding } from "@/store/hooks/useCustomerOnboarding";
import Loader from "@/components/ui/loader/loader";
import { STEP_INDICES_NAME, CustomerStepId } from "@/types/constants/constants";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { goToStep } from "@/store/slices/customerOnboardingSlice";
import { formatFieldName } from "@/lib/utilities/revertCamelCaseText";

export default function CustomerSignUp() {
  const pathname = usePathname();
  const userRole = pathname?.split("/").pop() as "freelancer" | "client";
  const { isButtonLoading } = useGlobalStates();

  const { currentStep, steps, setSteps, nextStep, previousStep } =
    useCustomerOnboarding();
  const dispatch = useDispatch();
  const currentStepName = steps[currentStep];

  const [isHydrated, setIsHydrated] = useState(false);
  const skipSubmitTrigger = useSelector(
    (state: RootState) => state.executionStates.skipSubmitTrigger
  );
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const formMethods = useSignUpForm();

  const stepIds = useMemo(() => {
    const baseSteps = getStepsForRole();
    const customerType = formMethods.watch("customerType");

    if (customerType === "personal") {
      return baseSteps.filter(
        (step) =>
          step !== CustomerStepId.COMPANY_NAME &&
          step !== CustomerStepId.WHAT_IS_YOUR_ROLE
      );
    }
    return baseSteps;
  }, [userRole, formMethods.watch("customerType")]);

  // Bounds check safety
  useEffect(() => {
    if (isHydrated && stepIds.length > 0 && currentStep >= stepIds.length) {
      dispatch(goToStep(0));
    }
  }, [isHydrated, stepIds.length, currentStep, dispatch]);

  const totalSteps = stepIds.length;
  const currentStepId = stepIds[currentStep];
  const currentStepConfig = useMemo(
    () => (currentStepId ? getStepConfig(currentStepId) : null),
    [currentStepId]
  );

  const handleNext = async () => {
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

  const handlePrevious = () => {
    previousStep();
  };

  const handleFormSubmit = async (data: any, e?: any) => {
    e?.preventDefault();
    const response = await authService?.customerOnboarding(data);

    if (response.status === 201) {
      ToastService.success(
        response.data.message || "Registered User Successfully"
      );
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
      "customer_onboarding_total_steps",
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

  const handleFormError = (errors: any) => {
    const lastFieldToIgnore = "phoneNumber";

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
          className={`flex flex-col gap-14 ${
            currentStepName === STEP_INDICES_NAME.ADVERTISEMENT
              ? "min-h-[60vh]"
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

