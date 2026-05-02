"use client";
import React from "react";
import { StepProgress } from "./progressBar";
import { useRouter } from "next/navigation";
import { ShowIf } from "@/lib/utilities/showIf";
import { useCustomerOnboarding } from "@/store/hooks/useCustomerOnboarding";
import { STEP_INDICES_NAME } from "@/types/constants/constants";
import { getStepsForRole } from "../auth/signup/customer-flow/steps/registry";

interface Props {
  className?: string;
}

export const NavigationHeaderCustomer: React.FC<Props> = ({
  className = "",
}) => {
  const { currentStep, previousStep, steps } = useCustomerOnboarding();
  const router = useRouter();

  const handleBack = () => {
    if (currentStep !== 0) {
      previousStep();
    } else {
      router.back();
    }
  };

  const totalStepsCount = steps.length || getStepsForRole().length;
  const currentStepDisplay = currentStep + 1;
  const currentStepName = steps[currentStep] || getStepsForRole()[currentStep];

  return (
    <ShowIf condition={true}>
      <div
        className={`flex items-center justify-center gap-8 w-full px-10 ${className}`}
      >
        <button
          type="button"
          className="text-gray-600 dark:text-white cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleBack}
        >
          <img
            src={"/left-icon.svg"}
            className="h-8 min-w-4 max-w-5 max-h-5"
            alt="Back"
          />
        </button>
        <div
          className={`w-[40vw] bg-gray-200 dark:bg-gray-700 rounded-full h-px ${
            currentStepName === STEP_INDICES_NAME.EMPERA_WAITING_LIST
              ? "invisible"
              : ""
          }`}
        >
          {" "}
          <StepProgress
            currentStep={currentStepDisplay}
            totalSteps={totalStepsCount || 1}
          />
        </div>
      </div>
    </ShowIf>
  );
};

