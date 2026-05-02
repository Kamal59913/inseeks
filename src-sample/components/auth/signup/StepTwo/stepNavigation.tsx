import React from "react";
import Button from "@/components/ui/button/Button";
import { usePathname } from "next/navigation";
import { ShowIf } from "@/lib/utilities/showIf";
import { STEP_INDICES_NAME } from "@/types/constants/constants";
import { useOnboardingStepTwo } from "@/store/hooks/useOnboardingStepTwo";

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
  const { steps, currentStep } = useOnboardingStepTwo();
  const pathname = usePathname();
  const isFreelancer = pathname.includes("freelancer");
  const currentStepName = steps[currentStep];
  const isWorkZoneSelect =
    currentStepName === STEP_INDICES_NAME.TRAVEL_ZONE_PAGE;

    const isWelcomeScreenFirstPart =
    currentStepName === STEP_INDICES_NAME.WELCOME_SCREEN;

  const isLastStepInForm = currentStepName === STEP_INDICES_NAME.TRAVEL_ZONE_PAGE;

  const buttonLabel = isWorkZoneSelect
  ? "Finish"
  : isWelcomeScreenFirstPart
    ? "Start your journey"
    : "Continue";


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
            type={isLastStepInForm ? "submit" : "button"}
            onClick={isLastStepInForm ? undefined : onNext}
            loadingState={isLoading}
          >
            {buttonLabel}
          </Button>
        </ShowIf>
    </div>
  );
};

