"use client";
import React from "react";
import { StepProgress } from "./progressBar";
import { usePathname, useRouter } from "next/navigation";
import { ShowIf } from "@/lib/utilities/showIf";
import { STEP_INDICES_NAME } from "@/types/constants/constants";
import { useOnboardingStepOne } from "@/store/hooks/useFreelancerStepOne";
import { useDispatch } from "react-redux";
import {
  resetSkipSubmitTrigger,
  triggerSkipSubmit,
} from "@/store/slices/executionSlice";

interface props {
  className?: string;
}

export const NavigationHeaderStepOne: React.FC<props> = ({
  className = "",
}) => {
  const { currentStep, previousStep, steps, nextStep, setSkippedField } =
    useOnboardingStepOne();
  const router = useRouter();
  const pathname = usePathname();
  const currentStepName = steps[currentStep];
  const dispatch = useDispatch();

  const handleBack = () => {
    if (currentStep !== 0) {
      previousStep();
    } else {
      router.back();
    }
  };

  const handleSkip = () => {
    switch (currentStepName) {
      case STEP_INDICES_NAME.INSTAGRAM_HANDLE:
        setSkippedField("instagramHandle", true);
        break;
      case STEP_INDICES_NAME.FREELANCER_REFERRAL_DETAILS:
        setSkippedField("freelancerReferralDetails", true);
        dispatch(triggerSkipSubmit());
        setTimeout(() => dispatch(resetSkipSubmitTrigger()), 100);
        break;
    }
    nextStep();
  };

  const isFreelancer = pathname.includes("freelancer");


  const ESTIMATED_STEP_TWO_COUNT = isFreelancer ? 8 : 1; // Adjust as needed

  const stepOneTotal = steps.length; // 4
  const estimatedTotalSteps = stepOneTotal + ESTIMATED_STEP_TWO_COUNT; // 12
  const globalCurrentStep = currentStep + 1; // 1, 2, 3, 4

  return (
    <ShowIf condition={true}>
      <div
        className={`flex items-center justify-center gap-8 px-4 w-full ${className}`}
      >
        <button
          type="button"
          className="text-gray-600 dark:text-white cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleBack}
        >
          <img
            src={"/left-icon.svg"}
            className="h-8 min-w-4 max-w-5 max-h-5" // 32px - medium
            alt="Back"
          />
        </button>
        <div
          className={`bg-gray-200 dark:bg-gray-700 rounded-full h-px ${
            currentStepName === STEP_INDICES_NAME.SEND_EMAIL_PAGE
              ? "invisible"
              : ""
          }`}
        >
          <StepProgress
            currentStep={globalCurrentStep}
            totalSteps={estimatedTotalSteps}
          />
        </div>
        <ShowIf
          condition={
            !!(
              currentStepName === STEP_INDICES_NAME.INSTAGRAM_HANDLE ||
              currentStepName === STEP_INDICES_NAME.FREELANCER_REFERRAL_DETAILS
            )
          }
        >
          <span
            onClick={handleSkip}
            className="min-w-[40px] text-gray-600 dark:text-white cursor-pointer hover:opacity-80 transition-opacity underline"
          >
            Skip
          </span>
        </ShowIf>
      </div>
    </ShowIf>
  );
};

