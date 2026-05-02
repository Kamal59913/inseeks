import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Joyride, { Step, CallBackProps, STATUS } from "react-joyride";
import { nextTutorialStep } from "@/store/slices/tutorialSlice";
import tutorialsService from "@/services/tutorialsService";
import { RootState } from "@/store/store";

// Enhanced config with metadata
interface TutorialStepConfig {
  route: string;
  buttonText: string;
  description?: string;
  title?: string;
  joyrideSteps: Step[];
}

export const TUTORIAL_STEPS_CONFIG: Record<number, TutorialStepConfig> = {
  1: {
    route: "/profile/information",
    buttonText: "Save Information",
    title: "Welcome to Your Profile",
    description:
      "Firstly please make sure that your personal information is accurate.",
    joyrideSteps: [],
  },
  2: {
    route: "/profile/photos",
    buttonText: "Save my portfolio",
    description:
      "Update your portfolio to showcase your best work. We recommend to upload at least 5 high quality pictures.",
    joyrideSteps: [],
  },
  3: {
    route: "/profile/contact",
    buttonText: "Save my Contacts",
    description:
      "Add your personal contact information to make sure your clients can reach you.",
    joyrideSteps: [
      {
        target: ".service-form",
        content: "Add your first service here. This is what clients will book.",
        disableBeacon: true,
        placement: "center",
      },
      {
        target: ".service-price",
        content: "Set your pricing for this service.",
      },
    ],
  },
  4: {
    route: "/catalog/services",
    buttonText: "Save my services",
    description: `Now create your services to allow customers to book you. `,
    joyrideSteps: [
      {
        target: ".availability-calendar",
        content: "Set your available hours so clients know when to book you.",
        disableBeacon: true,
      },
    ],
  },
  5: {
    route: "/catalog/availability",
    buttonText: "Save my availabilities",
    description: `Finally, add the days and times you’re open to work. 
These slots will be shown as bookable times to clients.`,
    joyrideSteps: [
      //   {
      //     target: '.profile-bio',
      //     content: 'Tell clients about yourself and your experience.',
      //     disableBeacon: true,
      //   },
      //   {
      //     target: '.profile-skills',
      //     content: 'Add your skills to attract the right clients.',
      //   },
      // ],
    ],
  },
  6: {
    route: "/wallet",
    buttonText: "Connect to Stripe",
    description:
      "Connect your bank account to Stripe to receive your payments.",
    joyrideSteps: [
      {
        target: ".wallet-form",
        content:
          "Connect your bank account to Stripe to receive your payments.",
        disableBeacon: true,
      },
    ],
  },
  7: {
    route: "/profile/information",
    buttonText: "Finish tutorial",
    description: `Your profile is ready! You can now share your Public profile link (below) and receive your first bookings. You can always go back and edit your profile.`,
    joyrideSteps: [],
  },
};

// Helper to get step route
export const STEP_ROUTE_MAP: Record<number, string> = Object.entries(
  TUTORIAL_STEPS_CONFIG
).reduce((acc, [step, config]) => {
  acc[Number(step)] = config.route;
  return acc;
}, {} as Record<number, string>);

// export const TutorialManager: React.FC = () => {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const { currentStep, isActive } = useSelector((state: RootState) => state.tutorial);
//   const [runJoyride, setRunJoyride] = useState(false);

//   // Get current step config
//   const currentStepConfig = TUTORIAL_STEPS_CONFIG[currentStep];
//   const currentSteps = currentStepConfig?.joyrideSteps || [];

//   useEffect(() => {
//     // Start joyride when steps are available
//     if (isActive && currentSteps.length > 0) {
//       setRunJoyride(true);
//     }
//   }, [currentStep, isActive, currentSteps.length]);

//   const handleJoyrideCallback = async (data: CallBackProps) => {
//     const { status } = data;

//     if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
//       setRunJoyride(false);

//       try {
//         await tutorialsService.updateTutorialStep(currentStep + 1);
//         dispatch(nextTutorialStep());

//         const nextStepConfig = TUTORIAL_STEPS_CONFIG[currentStep + 1];
//         if (nextStepConfig) {
//           router.push(nextStepConfig.route);
//         }
//       } catch (error) {
//         console.error('Failed to update tutorial step:', error);
//       }
//     }
//   };

//   if (!isActive || currentSteps.length === 0) {
//     return null;
//   }

//   return (
//     <Joyride
//       steps={currentSteps}
//       run={runJoyride}
//       continuous
//       showProgress
//       showSkipButton={false}
//       disableCloseOnEsc
//       disableOverlayClose
//       hideCloseButton
//       callback={handleJoyrideCallback}
//       styles={{
//         options: {
//           primaryColor: '#b47ed6',
//           zIndex: 10000,
//           backgroundColor: '#2d1b3d',
//         },
//         tooltip: {
//           borderRadius: 8,
//           color: '#fff',
//         },
//         buttonNext: {
//           backgroundColor: '#b47ed6',
//           borderRadius: 9999,
//           padding: '8px 16px',
//         },
//         buttonBack: {
//           color: '#b47ed6',
//         },
//       }}
//       locale={{
//         back: 'Back',
//         close: 'Close',
//         last: 'Complete Step',
//         next: 'Next',
//       }}
//     />
//   );
// };

// Export helper to get button text
export const getStepButtonText = (step: number): string => {
  return TUTORIAL_STEPS_CONFIG[step]?.buttonText || "Continue";
};

// Export helper to get step title
export const getStepTitle = (step: number): string => {
  return TUTORIAL_STEPS_CONFIG[step]?.title || "";
};

export const getStepDescription = (step: number): string => {
  return TUTORIAL_STEPS_CONFIG[step]?.description || "";
};

