import React from "react";
import Button from "@/components/ui/button/Button";
import { usePathname } from "next/navigation";
import { ShowIf } from "@/lib/utilities/showIf";
import { STEP_INDICES_NAME } from "@/types/constants/constants";
import { useOnboardingStepOne } from "@/store/hooks/useFreelancerStepOne";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  isLoading?: boolean;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  onNext,
  isLoading,
}) => {
  const { steps, currentStep } = useOnboardingStepOne();
  const pathname = usePathname();
  const currentStepName = steps[currentStep];
  const isWorkZoneSelect =
    currentStepName === STEP_INDICES_NAME.TRAVEL_ZONE_PAGE;

  const secondLastStepIndex =
    steps && steps.length >= 2 ? steps.length - 2 : -1;

  const isSecondLastStep = currentStep === secondLastStepIndex;

  return (
    <div className="flex items-center justify-center">
      <ShowIf
        condition={
          !(
            currentStepName === STEP_INDICES_NAME.SEND_EMAIL_PAGE ||
            currentStepName === STEP_INDICES_NAME.DASHBOARD_REDIRECT_PAGE
          )
        }
      >
        <Button
          size="rg"
          className="w-[305px] font-semibold"
          type={isSecondLastStep ? "submit" : "button"}
          onClick={isSecondLastStep ? undefined : onNext}
          loadingState={isLoading}
        >
          {isWorkZoneSelect ? "Finish" : "Continue"}
        </Button>
      </ShowIf>
    </div>
  );
};

