import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import {
  nextStep,
  previousStep,
  goToStep,
  setSteps,
  setSkippedField,
} from "../slices/onboardingStepOneSlice";

export const useOnboardingStepOne = () => {
  const dispatch: AppDispatch = useDispatch();
  const { currentStep, steps, skippedFields } = useSelector(
    (state: RootState) => state.onboardingStepOne
  );

  return {
    currentStep,
    steps,
    skippedFields,
    setSteps: (stepsArray: string[]) => dispatch(setSteps(stepsArray)),
    nextStep: () => dispatch(nextStep()),
    previousStep: () => dispatch(previousStep()),
    goToStep: (index: number) => dispatch(goToStep(index)),
    setSkippedField: (
      field: "instagramHandle" | "chargingRates" | "freelancerReferralDetails",
      value: boolean
    ) => dispatch(setSkippedField({ field, value })),
  };
};

