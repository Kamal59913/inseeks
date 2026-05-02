import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CustomerOnboardingState {
  currentStep: number;
  steps: string[];
}

const STEP_STORAGE_KEY = "customer_onboarding_step";

const savedStep =
  typeof window !== "undefined"
    ? Number(localStorage.getItem(STEP_STORAGE_KEY))
    : 0;

const initialState: CustomerOnboardingState = {
  currentStep: isNaN(savedStep) ? 0 : savedStep,
  steps: [],
};

const customerOnboardingSlice = createSlice({
  name: "customerOnboarding",
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
      if (action.payload >= 0 && action.payload < state.steps.length) {
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
  customerOnboardingSlice.actions;

export default customerOnboardingSlice.reducer;

