import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import {
  nextStep,
  previousStep,
  goToStep,
  setSteps,
  resetSteps,
} from "../slices/customerOnboardingSlice";

export const useCustomerOnboarding = () => {
  const dispatch: AppDispatch = useDispatch();
  const { currentStep, steps } = useSelector(
    (state: RootState) => state.customerOnboarding
  );

  return {
    currentStep,
    steps,
    setSteps: (stepsArray: string[]) => dispatch(setSteps(stepsArray)),
    nextStep: () => dispatch(nextStep()),
    previousStep: () => dispatch(previousStep()),
    goToStep: (index: number) => dispatch(goToStep(index)),
    resetSteps: () => dispatch(resetSteps()),
  };
};

