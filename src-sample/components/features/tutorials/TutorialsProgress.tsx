import Button from "@/components/ui/button/Button";
import { ShowIf } from "@/lib/utilities/showIf";
import { useTutorial } from "@/store/hooks/useTutorials";
import {
  getStepButtonText,
  getStepDescription,
  getStepTitle,
  STEP_ROUTE_MAP,
} from "./TutorialManager";
import tutorialsService from "@/services/tutorialsService";
import PaymentSettingsShhet from "../../wallet/PaymentSettingsForm";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  setAvailabilitySaveStatus,
  setTutorialProcessing,
  setStripeSaveStatus,
  triggerPhotoSave,
  resetPhotoSaveTrigger,
  triggerServiceSave,
  resetServiceSaveTrigger,
  triggerAvailabilitySave,
  resetAvailabilitySaveTrigger,
  triggerContactSave,
  resetContactSaveTrigger,
  setPhotoSaveStatus,
  setContactSaveStatus,
  setServiceSaveStatus,
  setCurrentTransitionTarget,
} from "@/store/slices/executionSlice";
import { useEffect, useState, useMemo } from "react";
import { useModalData } from "@/store/hooks/useModal";
import { RootState } from "@/store/store";

// Configuration interface for step actions
interface StepActionConfig {
  trigger: () => any;
  resetTrigger: () => any;
  setStatus: (status: "idle" | "success" | "error") => any;
  selector: (state: RootState) => "idle" | "success" | "error";
  modalTitle: string;
  modalDescription: string;
}

export const TutorialProgress: React.FC = () => {
  const { currentStep, isActive, setTutorialStep } = useTutorial();
  const [maxAchievedStep, setMaxAchievedStep] = useState(currentStep);
  const totalSteps = 7;
  const router = useRouter();
  const dispatch = useDispatch();
  const { open, close } = useModalData();
  const [isPaymentSheetOpen, setIsPaymentSheetOpen] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);

  // Using Redux state so transition intent survives remounts (caused by fetchCurrentUser)
  const currentTransitionTarget = useSelector(
    (state: RootState) => state.executionStates.currentTransitionTarget
  );

  const isGlobalProcessing = useSelector(
    (state: RootState) => state.executionStates.isTutorialProcessing
  );

  // Configuration Map
  // We use useMemo to ensure selectors are stable, though strictly not necessary if defined outside
  // But since we need 'state' for selectors, we define them here accessibly or use raw selector functions
  const stepConfig: Record<number, StepActionConfig> = {
    2: {
      trigger: triggerPhotoSave,
      resetTrigger: resetPhotoSaveTrigger,
      setStatus: setPhotoSaveStatus,
      selector: (state: RootState) => state.executionStates.photoSaveStatus,
      modalTitle: "Are you sure you want to save this order",
      modalDescription: "Your orderings will be updated.",
    },
    3: {
      trigger: triggerContactSave,
      resetTrigger: resetContactSaveTrigger,
      setStatus: setContactSaveStatus,
      selector: (state: RootState) => state.executionStates.contactSaveStatus,
      modalTitle: "Are you sure you want to save the contacts",
      modalDescription: "Your contacts will be updated.",
    },
    4: {
      trigger: triggerServiceSave,
      resetTrigger: resetServiceSaveTrigger,
      setStatus: setServiceSaveStatus,
      selector: (state: RootState) => state.executionStates.serviceSaveStatus,
      modalTitle: "Are you sure you want to save this order",
      modalDescription: "Your service orderings will be updated.",
    },
    5: {
      trigger: triggerAvailabilitySave,
      resetTrigger: resetAvailabilitySaveTrigger,
      setStatus: setAvailabilitySaveStatus,
      selector: (state: RootState) => state.executionStates.availabilitySaveStatus,
      modalTitle: "Are you sure you want to save availability the slots",
      modalDescription: "Your availability slots will be updated.",
    },
  };

  // Select the current status dynamically based on the current step
  const currentStepStatus = useSelector((state: RootState) => {
    const config = stepConfig[currentStep];
    return config ? config.selector(state) : "idle";
  });

  const handleStepUpdate = async (newStep: number, isForward: boolean) => {
    if (isProcessing || isGlobalProcessing) return;

    if (isForward) {
      // 1. If we are moving forward to an already achieved step, just go
      if (currentStep < maxAchievedStep) {
        await performStepTransition(newStep);
        return;
      }

      // 6. Special case for Stripe (Step 6)
      if (currentStep === 6) {
        setIsPaymentSheetOpen(true);
        return;
      }

      // 2. Check if current step needs saving (has config)
      const config = stepConfig[currentStep];
      // 3. If no config (e.g. Step 1 or 7), just transition
      if (!config) {
        setIsProcessing(true);
        await performStepTransition(newStep);
        setIsProcessing(false);
        return;
      }

      // Proactive check: If already successful, just transition
      if (currentStepStatus === "success") {
        setIsProcessing(false);
        dispatch(setTutorialProcessing(false));
        await performStepTransition(newStep);
        dispatch(config.setStatus("idle"));
        dispatch(setCurrentTransitionTarget(null));
        return;
      }

      // Save intent to Redux (persist across remounts)
      dispatch(setCurrentTransitionTarget(newStep));

      open("submit-confirmation", {
        title: config.modalTitle,
        description: config.modalDescription,
        action: async () => {
          setIsProcessing(true);
          dispatch(config.setStatus("idle"));
          dispatch(config.trigger());
          setTimeout(() => dispatch(config.resetTrigger()), 100);
          close();
        },
        cancel: () => {
          setIsProcessing(false);
          dispatch(setCurrentTransitionTarget(null)); // Only clear on manual cancel
        },
      });
    } else {
      // Backwards navigation
      await stepBack(newStep);
    }
  };

  // Unified Effect to handle transitions when Save completes
  useEffect(() => {
    if (currentTransitionTarget === null) return;

    // Ensure the target is actually next step (sanity check) or just valid
    // For now we assume if it's set, we want to go there if success.

    // We also need to make sure we are looking at the RIGHT step's success
    // The currentStepStatus selector already pulls the status for `currentStep`

    if (currentStepStatus === "success") {

      performStepTransition(currentTransitionTarget).then(() => {
        setIsProcessing(false);
        dispatch(setTutorialProcessing(false));

        // Reset status and target AFTER transition
        const config = stepConfig[currentStep];
        if (config) dispatch(config.setStatus("idle"));
        dispatch(setCurrentTransitionTarget(null));
      });
    } else if (currentStepStatus === "error") {
      setIsProcessing(false);
      dispatch(setTutorialProcessing(false));
      // Don't clear currentTransitionTarget - let user retry
    }
  }, [currentStep, currentStepStatus, currentTransitionTarget, dispatch]);

  const performStepTransition = async (newStep: number) => {
    setTutorialStep(newStep);

    if (newStep > maxAchievedStep) {
      setMaxAchievedStep(newStep);
      try {
        await tutorialsService.updateTutorialStep(newStep);
      } catch (error) {
        console.error("Failed to persist tutorial step:", error);
      }
    }

    const nextRoute = STEP_ROUTE_MAP[newStep];
    if (nextRoute) {
      router.push(nextRoute);
    }
  };

  const stepBack = async (newStep: number) => {
    setTutorialStep(newStep);
    const nextRoute = STEP_ROUTE_MAP[newStep];
    if (nextRoute) {
      router.push(nextRoute);
    }
  };

  // Keep maxAchievedStep in sync
  useEffect(() => {
    if (currentStep > maxAchievedStep) {
      setMaxAchievedStep(currentStep);
    }
  }, [currentStep, maxAchievedStep]);

  // Clean up when currentStep changes
  useEffect(() => {
    setIsProcessing(false);
    dispatch(setTutorialProcessing(false));
    dispatch(setStripeSaveStatus("idle"));
    // DO NOT clear currentTransitionTarget here.
    // It should survive the remount caused by fetchCurrentUser.
  }, [currentStep, dispatch]);

  if (currentStep >= 8 || !isActive) return null;

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 w-full max-w-[393px]">
      <div className="bg-[#2d1b3d] rounded-lg px-6 py-3 shadow-xl border border-white/80">
        <div
          className="grid gap-1.5 mb-3"
          style={{ gridTemplateColumns: `repeat(${totalSteps}, 1fr)` }}
        >
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNum = index + 1;
            const isAchieved = stepNum <= maxAchievedStep;
            return (
              <div
                key={index}
                onClick={() => {
                  if (isAchieved && stepNum !== currentStep) {
                    setTutorialStep(stepNum);
                    const route = STEP_ROUTE_MAP[stepNum];
                    if (route) router.push(route);
                  }
                }}
                className={`h-1 rounded-full transition-all duration-300 ${
                  isAchieved ? "cursor-pointer" : "cursor-default"
                } ${index < currentStep ? "bg-white" : "bg-[#4a2f5a]"}`}
              />
            );
          })}
        </div>

        <div className="mb-1">
          <ShowIf condition={getStepTitle(currentStep) != ""}>
            <p className="text-[16px] font-medium mb-1">
              {getStepTitle(currentStep)!!}
            </p>
          </ShowIf>
          <p className="text-[14px]">{getStepDescription(currentStep)}</p>
        </div>

        <div className="flex justify-end items-center gap-3">
          <ShowIf condition={currentStep > 1}>
            <Button
              size="sm"
              variant="dark"
              className="rounded-[25px] text-[14px] font-medium"
              disabled={isProcessing}
              onClick={() => handleStepUpdate(currentStep - 1, false)}
            >
              Back
            </Button>
          </ShowIf>
          <Button
            size="sm"
            variant="white"
            borderRadius="rounded-[25px]"
            className="backdrop-blur-[94px] text-[14px] font-medium"
            loadingState={isProcessing || isGlobalProcessing}
            onClick={() => handleStepUpdate(currentStep + 1, true)}
          >
            {getStepButtonText(currentStep)}
          </Button>
        </div>
      </div>
      <PaymentSettingsShhet
        isOpen={isPaymentSheetOpen}
        onClose={() => setIsPaymentSheetOpen(false)}
      />
    </div>
  );
};

