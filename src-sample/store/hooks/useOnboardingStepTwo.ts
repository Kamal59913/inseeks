import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { nextStep, previousStep, goToStep, setSteps } from "../slices/onboardingStepTwoSlice";

export const useOnboardingStepTwo = () => {
  const dispatch: AppDispatch = useDispatch();
  const { currentStep, steps } = useSelector((state: RootState) => state.onboardingStepTwo);

  return {
    currentStep,
    steps,
    setSteps: (stepsArray: string[]) => dispatch(setSteps(stepsArray)),
    nextStep: () => dispatch(nextStep()),
    previousStep: () => dispatch(previousStep()),
    goToStep: (index: number) => dispatch(goToStep(index)),
  };
};

