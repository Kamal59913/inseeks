import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import globalReducer from "./slices/globalSlice";
import modalReducer from "./slices/modalSlice";
import onboardingStepOneReducer from "./slices/onboardingStepOneSlice";
import onboardingStepTwoReducer from "./slices/onboardingStepTwoSlice";
import customerOnboardingReducer from "./slices/customerOnboardingSlice";
import executionStatesReducer from "./slices/executionSlice";
import tutorialReducer from "./slices/tutorialSlice";
import nonRestrictiveTutorialReducer from "./slices/nonRestrictiveTutorialSlice";
export const store = configureStore({
  reducer: {
    global: globalReducer,
    auth: authReducer,
    modal: modalReducer,
    onboardingStepOne: onboardingStepOneReducer,
    onboardingStepTwo: onboardingStepTwoReducer,
    customerOnboarding: customerOnboardingReducer,
    executionStates: executionStatesReducer,
    tutorial: tutorialReducer,
    nonRestrictiveTutorial: nonRestrictiveTutorialReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
