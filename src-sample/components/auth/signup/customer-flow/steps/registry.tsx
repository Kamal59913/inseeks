import React from "react";
import {
  AdvertisementStep,
  CompanyNameStep,
  CompanyRoleStep,
  CustomerTypeStep,
  EmailStep,
  FirstNameStep,
  LastNameStep,
  PhoneNumberStep,
  WelcomeScreenStep,
} from "./components";
import { CustomerRegistryConfig, StepRendererProps } from "./types";
import { CustomerStepId } from "@/types/constants/constants";

export const stepRegistry: Record<CustomerStepId, CustomerRegistryConfig> = {
  [CustomerStepId.FIRST_NAME]: {
    id: CustomerStepId.FIRST_NAME,
    component: FirstNameStep,
    fields: ["firstName"],
    validation: "required",
    part: 1,
  },
  [CustomerStepId.LAST_NAME]: {
    id: CustomerStepId.LAST_NAME,
    component: LastNameStep,
    fields: ["lastName"],
    validation: "required",
    part: 1,
  },
  [CustomerStepId.EMAIL]: {
    id: CustomerStepId.EMAIL,
    component: EmailStep,
    fields: ["email"],
    validation: "required",
    part: 1,
  },
  [CustomerStepId.ADVERTISEMENT]: {
    id: CustomerStepId.ADVERTISEMENT,
    component: AdvertisementStep,
    fields: [],
    validation: "none",
    part: 1,
  },
  [CustomerStepId.HOW_WILL_YOU_USE_EMPERA]: {
    id: CustomerStepId.HOW_WILL_YOU_USE_EMPERA,
    component: CustomerTypeStep,
    fields: ["customerType"],
    validation: "required",
    part: 1,
  },
  [CustomerStepId.COMPANY_NAME]: {
    id: CustomerStepId.COMPANY_NAME,
    component: CompanyNameStep,
    fields: ["companyName"],
    validation: "optional",
    part: 1,
  },
  [CustomerStepId.WHAT_IS_YOUR_ROLE]: {
    id: CustomerStepId.WHAT_IS_YOUR_ROLE,
    component: CompanyRoleStep,
    fields: ["companyPosition"],
    validation: "optional",
    part: 1,
  },
  [CustomerStepId.PHONE_NUMBER]: {
    id: CustomerStepId.PHONE_NUMBER,
    component: PhoneNumberStep,
    fields: ["phoneNumber", "countryCode"],
    validation: "required",
    part: 1,
  },
  [CustomerStepId.EMPERA_WAITING_LIST]: {
    id: CustomerStepId.EMPERA_WAITING_LIST,
    component: WelcomeScreenStep,
    validation: "none",
    part: 1,
    isPartEnd: true,
  },
};

export const onboardingFlows = {
  client: {
    base: [
      CustomerStepId.FIRST_NAME,
      CustomerStepId.LAST_NAME,
      CustomerStepId.EMAIL,
      CustomerStepId.ADVERTISEMENT,
      CustomerStepId.HOW_WILL_YOU_USE_EMPERA,
      CustomerStepId.COMPANY_NAME,
      CustomerStepId.WHAT_IS_YOUR_ROLE,
      CustomerStepId.PHONE_NUMBER,
      CustomerStepId.EMPERA_WAITING_LIST,
    ],
  },
};

export const getStepsForRole = (): CustomerStepId[] => {
  return [...onboardingFlows.client.base];
};

export const getStepConfig = (
  stepId: CustomerStepId
): CustomerRegistryConfig => {
  return stepRegistry[stepId];
};

export const getStepFields = (stepId: CustomerStepId): string[] => {
  return stepRegistry[stepId]?.fields || [];
};

export const requiresValidation = (stepId: CustomerStepId): boolean => {
  const validation = stepRegistry[stepId]?.validation;
  return validation === "required" || validation === "optional";
};

export const isPartEndStep = (stepId: CustomerStepId): boolean => {
  return stepRegistry[stepId]?.isPartEnd || false;
};

export const isPartStartStep = (stepId: CustomerStepId): boolean => {
  return stepRegistry[stepId]?.isPartStart || false;
};

export const getStepPart = (stepId: CustomerStepId): number => {
  return stepRegistry[stepId]?.part || 1;
};

export const StepRenderer: React.FC<StepRendererProps> = ({
  stepId,
  formMethods,
}) => {
  const stepConfig = stepRegistry[stepId as CustomerStepId];

  if (!stepConfig) {
    console.error(`Step component not found for ID: ${stepId}`);
    return null;
  }

  const StepComponent = stepConfig.component;

  return <StepComponent formMethods={formMethods} />;
};

