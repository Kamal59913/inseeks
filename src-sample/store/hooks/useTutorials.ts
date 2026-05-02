// hooks/useTutorial.ts
import { useSelector, useDispatch } from "react-redux";
import {
  setTutorialStep,
  nextTutorialStep,
  completeTutorial,
} from "../slices/tutorialSlice";
import { AppDispatch, RootState } from "../store";

export const useTutorial = () => {
  const tutorialState = useSelector((state: RootState) => state.tutorial);
  const dispatch: AppDispatch = useDispatch();

  return {
    // State values
    currentStep: tutorialState.currentStep,
    isActive: tutorialState.isActive,
    isCompleted: tutorialState.isCompleted,

    // Actions
    setTutorialStep: (step: number) => dispatch(setTutorialStep(step)),
    nextTutorialStep: () => dispatch(nextTutorialStep()),
    completeTutorial: () => dispatch(completeTutorial()),

    // Helper methods
    isOnStep: (step: number) => tutorialState.currentStep === step,
    hasCompletedStep: (step: number) => tutorialState.currentStep > step,
    canAccessRoute: () => !tutorialState.isActive,
  };
};

