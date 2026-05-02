import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  photoSaveTrigger: 0,
  serviceSaveTrigger: 0,
  locationSaveTrigger: 0,
  availabilitySaveTrigger: 0,
  skipSubmitTrigger: 0,
  isServiceSaveDisabled: false,
  isPhotoSaving: false,
  photoSaveStatus: "idle" as "idle" | "success" | "error",
  isServiceSaving: false,
  serviceSaveStatus: "idle" as "idle" | "success" | "error",
  isAvailabilitySaving: false,
  availabilitySaveStatus: "idle" as "idle" | "success" | "error",
  contactSaveTrigger: 0,
  isContactSaving: false,
  contactSaveStatus: "idle" as "idle" | "success" | "error",
  stripeSaveStatus: "idle" as "idle" | "success" | "error",
  isTutorialProcessing: false,
  currentTransitionTarget: null as number | null,
};

const executionStatesSlice = createSlice({
  name: "executionStates",
  initialState,
  reducers: {
    triggerPhotoSave: (state) => {
      state.photoSaveTrigger += 1;
    },
    resetPhotoSaveTrigger: (state) => {
      state.photoSaveTrigger = 0;
    },
    triggerServiceSave: (state) => {
      state.serviceSaveTrigger += 1;
    },
    resetServiceSaveTrigger: (state) => {
      state.serviceSaveTrigger = 0;
    },
    triggerLocationSave: (state) => {
      state.locationSaveTrigger += 1;
    },
    resetLocationSaveTrigger: (state) => {
      state.locationSaveTrigger = 0;
    },
    triggerAvailabilitySave: (state) => {
      state.availabilitySaveTrigger += 1;
    },
    resetAvailabilitySaveTrigger: (state) => {
      state.availabilitySaveTrigger = 0;
    },
    setServiceSaveDisabled: (state, action) => {
      state.isServiceSaveDisabled = action.payload;
    },
    triggerSkipSubmit: (state) => {
      state.skipSubmitTrigger += 1;
    },
    resetSkipSubmitTrigger: (state) => {
      state.skipSubmitTrigger = 0;
    },
    setPhotoSaving: (state, action) => {
      state.isPhotoSaving = action.payload;
    },
    setPhotoSaveStatus: (state, action) => {
      state.photoSaveStatus = action.payload;
    },
    setServiceSaving: (state, action) => {
      state.isServiceSaving = action.payload;
    },
    setServiceSaveStatus: (state, action) => {
      state.serviceSaveStatus = action.payload;
    },
    setAvailabilitySaving: (state, action) => {
      state.isAvailabilitySaving = action.payload;
    },
    setAvailabilitySaveStatus: (state, action) => {
      state.availabilitySaveStatus = action.payload;
    },
    triggerContactSave: (state) => {
      state.contactSaveTrigger += 1;
    },
    resetContactSaveTrigger: (state) => {
      state.contactSaveTrigger = 0;
    },
    setContactSaving: (state, action) => {
      state.isContactSaving = action.payload;
    },
    setContactSaveStatus: (state, action) => {
      state.contactSaveStatus = action.payload;
    },
    setTutorialProcessing: (state, action) => {
      state.isTutorialProcessing = action.payload;
    },
    setStripeSaveStatus: (state, action) => {
      state.stripeSaveStatus = action.payload;
    },
    setCurrentTransitionTarget: (state, action) => {
      state.currentTransitionTarget = action.payload;
    },
  },
});

export const {
  triggerPhotoSave,
  resetPhotoSaveTrigger,
  triggerServiceSave,
  resetServiceSaveTrigger,
  triggerLocationSave,
  resetLocationSaveTrigger,
  triggerAvailabilitySave,
  resetAvailabilitySaveTrigger,
  setServiceSaveDisabled,
  triggerSkipSubmit,
  resetSkipSubmitTrigger,
  setPhotoSaving,
  setPhotoSaveStatus,
  setServiceSaving,
  setServiceSaveStatus,
  setAvailabilitySaving,
  setAvailabilitySaveStatus,
  triggerContactSave,
  resetContactSaveTrigger,
  setContactSaving,
  setContactSaveStatus,
  setTutorialProcessing,
  setStripeSaveStatus,
  setCurrentTransitionTarget,
} = executionStatesSlice.actions;
export default executionStatesSlice.reducer;

