"use client";
import React from "react";
import { StepProgress } from "./progressBar";
import { useRouter } from "next/navigation";
import { ShowIf } from "@/lib/utilities/showIf";
import { STEP_INDICES_NAME } from "@/types/constants/constants";
import { useOnboardingStepTwo } from "@/store/hooks/useOnboardingStepTwo";

interface props {
  className?: string;
}

export const NavigationHeaderStepTwo: React.FC<props> = ({
  className = "",
}) => {
  const { currentStep, previousStep, steps } = useOnboardingStepTwo();
  const router = useRouter();
  const currentStepName = steps[currentStep];

  const handleBack = () => {
    if (currentStep !== 0) {
      previousStep();
    } else {
      router.back();
    }
  };

  const shouldHideProgressBar =
    currentStepName === STEP_INDICES_NAME.DASHBOARD_REDIRECT_PAGE;

  //Change
  const stepOneTotal =
    typeof window !== "undefined"
      ? Number(
          localStorage.getItem(process.env.NEXT_PUBLIC_STEP_ONE_TOTAL_KEY!)
        ) || 4
      : 4;
  const stepTwoTotal = steps.length;
  const globalTotalSteps = stepOneTotal + stepTwoTotal; // Actual total now
  const globalCurrentStep = stepOneTotal + currentStep + 1; // 5, 6, 7... 12

  if (!currentStepName) return null; // Wait until store initializes
  return (
    <ShowIf condition={currentStepName !== STEP_INDICES_NAME.WELCOME_SCREEN}>
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
            className="h-8 min-w-4 max-w-5 max-h-5" // 32px - medium
          />
        </button>
        <div
          className={`w-[40vw] bg-gray-200 dark:bg-gray-700 rounded-full h-px ${
            shouldHideProgressBar ? "invisible" : ""
          }`}
        >
          <StepProgress
            currentStep={globalCurrentStep}
            totalSteps={globalTotalSteps}
          />
        </div>
      </div>
    </ShowIf>
  );
};

