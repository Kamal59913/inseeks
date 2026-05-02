// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// const TOTAL_STEPS = 6; // 0 → 5

// interface TutorialState {
//   currentStep: number;
//   isCompleted: boolean;
//   isActive: boolean;
// }

// const getDerivedState = (step: number) => ({
//   currentStep: step,
//   isCompleted: step >= TOTAL_STEPS - 1,
//   isActive: step < TOTAL_STEPS - 1,
// });

// const initialState: TutorialState = {
//   ...getDerivedState(0),
// };

// const tutorialSlice = createSlice({
//   name: "tutorial",
//   initialState,
//   reducers: {
//     setTutorialStep: (state, action: PayloadAction<number>) => {
//       const step = Math.min(Math.max(action.payload, 0), TOTAL_STEPS - 1);
//       Object.assign(state, getDerivedState(step));
//     },

//     nextTutorialStep: (state) => {
//       const nextStep = Math.min(state.currentStep + 1, TOTAL_STEPS - 1);
//       Object.assign(state, getDerivedState(nextStep));
//     },

//     completeTutorial: (state) => {
//       Object.assign(state, {
//         currentStep: TOTAL_STEPS - 1,
//         isCompleted: true,
//         isActive: false,
//       });
//     },
//   },
// });

// export const { setTutorialStep, nextTutorialStep, completeTutorial } =
//   tutorialSlice.actions;

// export default tutorialSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TutorialState {
  currentStep: number;
  isCompleted: boolean;
  isActive: boolean;
}

const initialState: TutorialState = {
  currentStep: 1,
  isCompleted: false,
  isActive: true,
};

const tutorialSlice = createSlice({
  name: "tutorial",
  initialState,
  reducers: {
    setTutorialStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
      state.isCompleted = action.payload >= 8;
      state.isActive = action.payload < 8;
    },
    nextTutorialStep: (state) => {
      state.currentStep += 1;
      state.isCompleted = state.currentStep >= 8;
      state.isActive = state.currentStep < 8;
    },
    completeTutorial: (state) => {
      state.currentStep = 8;
      state.isCompleted = true;
      state.isActive = false;
    },
  },
});

export const { setTutorialStep, nextTutorialStep, completeTutorial } =
  tutorialSlice.actions;
export default tutorialSlice.reducer;

