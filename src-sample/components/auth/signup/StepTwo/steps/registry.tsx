import React from "react";
import {
  DashboardRedirectStep,
  PasswordStep,
  PostalCodeStep,
  TravelZoneStep,
  UserNameStep,
  WelcomeScreenStep,
} from "./components";
import { RegistryConfig, StepRendererProps } from "./types";
import { StepSecondId } from "@/types/constants/constants";

export const stepRegistry: Record<StepSecondId, RegistryConfig> = {
  [StepSecondId.WELCOME_FREELANCER]: {
    id: StepSecondId.WELCOME_FREELANCER,
    component: WelcomeScreenStep,
    validation: "none",
    part: 2,
    isPartStart: true,
  },
  [StepSecondId.PASSWORD]: {
    id: StepSecondId.PASSWORD,
    component: PasswordStep,
    fields: ["password"],
    validation: "required",
    part: 2,
  },
  [StepSecondId.USERNAME]: {
    id: StepSecondId.USERNAME,
    component: UserNameStep,
    fields: ["userName"],
    validation: "required",
    part: 2,
  },
  [StepSecondId.POSTAL_CODE]: {
    id: StepSecondId.POSTAL_CODE,
    component: PostalCodeStep,
    fields: ["freelancerPostalCode"],
    validation: "required",
    part: 2,
  },

  [StepSecondId.TRAVEL_ZONE]: {
    id: StepSecondId.TRAVEL_ZONE,
    component: TravelZoneStep,
    fields: ["serviceRadius", "serviceLocation", "localTravelFee"],
    validation: "required",
    part: 2,
  },

  [StepSecondId.DASHBOARD_REDIRECT]: {
    id: StepSecondId.DASHBOARD_REDIRECT,
    component: DashboardRedirectStep,
    validation: "none",
    part: 2,
    isPartEnd: true,
  },
};

export const onboardingFlows = {
  freelancer: {
    base: [
      StepSecondId.WELCOME_FREELANCER,
      StepSecondId.PASSWORD,
      StepSecondId.USERNAME,
      StepSecondId.POSTAL_CODE,
      StepSecondId.TRAVEL_ZONE,
    ],
    end: [StepSecondId.DASHBOARD_REDIRECT],
  },
};

export const getStepsForRole = (workZone: string[] = []): StepSecondId[] => {
  const steps: StepSecondId[] = [
    StepSecondId.WELCOME_FREELANCER,
    StepSecondId.PASSWORD,
    StepSecondId.USERNAME,
    StepSecondId.POSTAL_CODE,
    StepSecondId.TRAVEL_ZONE,
    StepSecondId.DASHBOARD_REDIRECT,
  ];

  return steps;
};

export const getStepConfig = (stepId: StepSecondId): RegistryConfig => {
  return stepRegistry[stepId];
};

export const getStepFields = (stepId: StepSecondId): string[] => {
  return stepRegistry[stepId]?.fields || [];
};

export const requiresValidation = (stepId: StepSecondId): boolean => {
  const validation = stepRegistry[stepId]?.validation;
  return validation === "required" || validation === "optional";
};

export const isPartEndStep = (stepId: StepSecondId): boolean => {
  return stepRegistry[stepId]?.isPartEnd || false;
};

export const isPartStartStep = (stepId: StepSecondId): boolean => {
  return stepRegistry[stepId]?.isPartStart || false;
};

export const getStepPart = (stepId: StepSecondId): number => {
  return stepRegistry[stepId]?.part || 1;
};

export const StepRenderer: React.FC<StepRendererProps> = ({
  stepId,
  formMethods,
}) => {
  const stepConfig = stepRegistry[stepId as StepSecondId];

  if (!stepConfig) {
    console.error(`Step component not found for ID: ${stepId}`);
    return null;
  }

  const StepComponent = stepConfig.component;

  return <StepComponent formMethods={formMethods} />;
};

