import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OnboardingState {
  currentStep: number;
  steps: string[];
  currentStepName: string | null;
  isLastStep: boolean;
  skippedFields: {
    instagramHandle: boolean;
    chargingRates: boolean;
    freelancerReferralDetails: boolean;
  };
}

const STEP_STORAGE_KEY = process.env.NEXT_PUBLIC_STEP_ONE_STORAGE_KEY!;
const SKIPPED_FIELDS_STORAGE_KEY = `${STEP_STORAGE_KEY}_skipped_fields`;

const savedStep =
  typeof window !== "undefined"
    ? Number(localStorage.getItem(STEP_STORAGE_KEY))
    : 0;

const savedSkippedFields =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem(SKIPPED_FIELDS_STORAGE_KEY) || "null")
    : null;

const initialState: OnboardingState = {
  currentStep: isNaN(savedStep) ? 0 : savedStep,
  steps: [],
  currentStepName: null,
  isLastStep: false,
  skippedFields: savedSkippedFields || {
    instagramHandle: false,
    chargingRates: false,
    freelancerReferralDetails: false,
  },
};

const onboardingsStepOneSlice = createSlice({
  name: "onboardingStepOne",
  initialState,
  reducers: {
    setSteps: (state, action: PayloadAction<string[]>) => {
      state.steps = action.payload;
    },
    nextStep: (state) => {
      if (state.currentStep < state.steps.length - 1) {
        state.currentStep += 1;
        localStorage.setItem(STEP_STORAGE_KEY!, String(state.currentStep));
      }
    },
    previousStep: (state) => {
      if (state.currentStep > 0) {
        state.currentStep -= 1;
        localStorage.setItem(STEP_STORAGE_KEY!, String(state.currentStep));
      }
    },
    goToStep: (state, action: PayloadAction<number>) => {
      if (action.payload >= 0 && action.payload < state.steps.length) {
        state.currentStep = action.payload;
        localStorage.setItem(STEP_STORAGE_KEY!, String(state.currentStep));
      }
    },
    setSkippedField: (
      state,
      action: PayloadAction<{
        field: keyof OnboardingState["skippedFields"];
        value: boolean;
      }>
    ) => {
      state.skippedFields[action.payload.field] = action.payload.value;
      localStorage.setItem(
        SKIPPED_FIELDS_STORAGE_KEY,
        JSON.stringify(state.skippedFields)
      );
    },
    resetSteps: (state) => {
      state.currentStep = 0;
      state.steps = [];
      state.skippedFields = {
        instagramHandle: false,
        chargingRates: false,
        freelancerReferralDetails: false,
      };
      localStorage.removeItem(STEP_STORAGE_KEY!);
      localStorage.removeItem(SKIPPED_FIELDS_STORAGE_KEY);
    },
  },
});

export const {
  setSteps,
  nextStep,
  previousStep,
  goToStep,
  setSkippedField,
  resetSteps,
} = onboardingsStepOneSlice.actions;

export default onboardingsStepOneSlice.reducer;

