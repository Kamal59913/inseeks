import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OnboardingState {
  currentStep: number;
  steps: string[];
  currentStepName: string | null;
  isLastStep: boolean;
}

const STEP_STORAGE_KEY = process.env.NEXT_PUBLIC_STEP_TWO_STORAGE_KEY!;

let savedStep = 0;

// ✅ Ensure code only runs in the browser
if (typeof window !== "undefined") {
  const storedStep = Number(localStorage.getItem(STEP_STORAGE_KEY));

  if (!isNaN(storedStep)) {
    savedStep = storedStep;
    localStorage.setItem(STEP_STORAGE_KEY, String(savedStep));
  } else {
    localStorage.setItem(STEP_STORAGE_KEY, "0");
    savedStep = 0;
  }
}

const initialState: OnboardingState = {
  currentStep: savedStep,
  steps: [],
  currentStepName: null,
  isLastStep: false,
};

const onboardingStepTwoSlice = createSlice({
  name: "onboardingStepTwo",
  initialState,
  reducers: {
    setSteps: (state, action: PayloadAction<string[]>) => {
      state.steps = action.payload;
    },
    nextStep: (state) => {
      if (state.currentStep < state.steps.length - 1) {
        state.currentStep += 1;
        localStorage.setItem(STEP_STORAGE_KEY, String(state.currentStep));
      }
    },
    previousStep: (state) => {
      if (state.currentStep > 0) {
        state.currentStep -= 1;
        localStorage.setItem(STEP_STORAGE_KEY, String(state.currentStep));
      }
    },
    goToStep: (state, action: PayloadAction<number>) => {
      // Allow setting even if steps is empty (e.g. initial mount)
      if (
        state.steps.length === 0 ||
        (action.payload >= 0 && action.payload < state.steps.length)
      ) {
        state.currentStep = action.payload;
        localStorage.setItem(STEP_STORAGE_KEY, String(state.currentStep));
      }
    },
    resetSteps: (state) => {
      state.currentStep = 0;
      state.steps = [];
      localStorage.removeItem(STEP_STORAGE_KEY);
    },
  },
});

export const { setSteps, nextStep, previousStep, goToStep, resetSteps } =
  onboardingStepTwoSlice.actions;

export default onboardingStepTwoSlice.reducer;

