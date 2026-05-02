import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ExecutionState {
  photoSaveTrigger: number;
  serviceSaveTrigger: number;
  locationSaveTrigger: number;
  availabilitySaveTrigger: number;
  skipSubmitTrigger: number;
  isServiceSaveDisabled: boolean;
  isPhotoSaving: boolean;
  photoSaveStatus: "idle" | "success" | "error";
  isServiceSaving: boolean;
  serviceSaveStatus: "idle" | "success" | "error";
  isAvailabilitySaving: boolean;
  availabilitySaveStatus: "idle" | "success" | "error";
  contactSaveTrigger: number;
  isContactSaving: boolean;
  contactSaveStatus: "idle" | "success" | "error";
  stripeSaveStatus: "idle" | "success" | "error";
  isTutorialProcessing: boolean;
  currentTransitionTarget: number | null;

  // Actions
  triggerPhotoSave: () => void;
  resetPhotoSaveTrigger: () => void;
  triggerServiceSave: () => void;
  resetServiceSaveTrigger: () => void;
  triggerLocationSave: () => void;
  resetLocationSaveTrigger: () => void;
  triggerAvailabilitySave: () => void;
  resetAvailabilitySaveTrigger: () => void;
  setServiceSaveDisabled: (disabled: boolean) => void;
  triggerSkipSubmit: () => void;
  resetSkipSubmitTrigger: () => void;
  setPhotoSaving: (isSaving: boolean) => void;
  setPhotoSaveStatus: (status: "idle" | "success" | "error") => void;
  setServiceSaving: (isSaving: boolean) => void;
  setServiceSaveStatus: (status: "idle" | "success" | "error") => void;
  setAvailabilitySaving: (isSaving: boolean) => void;
  setAvailabilitySaveStatus: (status: "idle" | "success" | "error") => void;
  triggerContactSave: () => void;
  resetContactSaveTrigger: () => void;
  setContactSaving: (isSaving: boolean) => void;
  setContactSaveStatus: (status: "idle" | "success" | "error") => void;
  setTutorialProcessing: (isProcessing: boolean) => void;
  setStripeSaveStatus: (status: "idle" | "success" | "error") => void;
  setCurrentTransitionTarget: (target: number | null) => void;
}

export const useExecutionStore = create<ExecutionState>()(
  devtools((set) => ({
    photoSaveTrigger: 0,
    serviceSaveTrigger: 0,
    locationSaveTrigger: 0,
    availabilitySaveTrigger: 0,
    skipSubmitTrigger: 0,
    isServiceSaveDisabled: false,
    isPhotoSaving: false,
    photoSaveStatus: "idle",
    isServiceSaving: false,
    serviceSaveStatus: "idle",
    isAvailabilitySaving: false,
    availabilitySaveStatus: "idle",
    contactSaveTrigger: 0,
    isContactSaving: false,
    contactSaveStatus: "idle",
    stripeSaveStatus: "idle",
    isTutorialProcessing: false,
    currentTransitionTarget: null,

    triggerPhotoSave: () =>
      set((state) => ({ photoSaveTrigger: state.photoSaveTrigger + 1 })),
    resetPhotoSaveTrigger: () => set({ photoSaveTrigger: 0 }),
    triggerServiceSave: () =>
      set((state) => ({ serviceSaveTrigger: state.serviceSaveTrigger + 1 })),
    resetServiceSaveTrigger: () => set({ serviceSaveTrigger: 0 }),
    triggerLocationSave: () =>
      set((state) => ({ locationSaveTrigger: state.locationSaveTrigger + 1 })),
    resetLocationSaveTrigger: () => set({ locationSaveTrigger: 0 }),
    triggerAvailabilitySave: () =>
      set((state) => ({
        availabilitySaveTrigger: state.availabilitySaveTrigger + 1,
      })),
    resetAvailabilitySaveTrigger: () => set({ availabilitySaveTrigger: 0 }),
    setServiceSaveDisabled: (isServiceSaveDisabled) =>
      set({ isServiceSaveDisabled }),
    triggerSkipSubmit: () =>
      set((state) => ({ skipSubmitTrigger: state.skipSubmitTrigger + 1 })),
    resetSkipSubmitTrigger: () => set({ skipSubmitTrigger: 0 }),
    setPhotoSaving: (isPhotoSaving) => set({ isPhotoSaving }),
    setPhotoSaveStatus: (photoSaveStatus) => set({ photoSaveStatus }),
    setServiceSaving: (isServiceSaving) => set({ isServiceSaving }),
    setServiceSaveStatus: (serviceSaveStatus) => set({ serviceSaveStatus }),
    setAvailabilitySaving: (isAvailabilitySaving) =>
      set({ isAvailabilitySaving }),
    setAvailabilitySaveStatus: (availabilitySaveStatus) =>
      set({ availabilitySaveStatus }),
    triggerContactSave: () =>
      set((state) => ({ contactSaveTrigger: state.contactSaveTrigger + 1 })),
    resetContactSaveTrigger: () => set({ contactSaveTrigger: 0 }),
    setContactSaving: (isContactSaving) => set({ isContactSaving }),
    setContactSaveStatus: (contactSaveStatus) => set({ contactSaveStatus }),
    setTutorialProcessing: (isTutorialProcessing) =>
      set({ isTutorialProcessing }),
    setStripeSaveStatus: (stripeSaveStatus) => set({ stripeSaveStatus }),
    setCurrentTransitionTarget: (currentTransitionTarget) =>
      set({ currentTransitionTarget }),
  })),
);
