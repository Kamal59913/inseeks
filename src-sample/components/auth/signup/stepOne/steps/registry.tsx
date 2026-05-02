import React from "react";
import {
  ChargingRateStep,
  CheckBoxStep,
  EmailStep,
  FirstNameStep,
  FreelancerBioStep,
  FreelancerReferralDetailsStep,
  InstagramHandleStep,
  LastNameStep,
  PhoneNumberStep,
  PortfolioImagesStep,
  ExpertiseStep,
} from "./components";
import { RegistryConfig, StepRendererProps } from "./types";
import { StepId } from "@/types/constants/constants";
import { SignUpValidationType } from "../validations/signup.validation";
import { getCategoryConfig } from "../utils/signupUtils";

export const stepRegistry: Record<any, any> = {
  [StepId.FIRST_NAME]: {
    id: StepId.FIRST_NAME,
    component: FirstNameStep,
    fields: ["firstName"],
    validation: "required",
    part: 1
  },
  [StepId.LAST_NAME]: {
    id: StepId.LAST_NAME,
    component: LastNameStep,
    fields: ["lastName"],
    validation: "required",
    part: 1,
  },
  [StepId.EMAIL]: {
    id: StepId.EMAIL,
    component: EmailStep,
    fields: ["email"],
    validation: "required",
    part: 1,
  },
  [StepId.PHONE_NUMBER]: {
    id: StepId.PHONE_NUMBER,
    component: PhoneNumberStep,
    fields: ["phoneNumber"],
    validation: "required",
    part: 1,
  },
    [StepId.INSTAGRAM_HANDLE]: {
    id: StepId.INSTAGRAM_HANDLE,
    component: InstagramHandleStep,
    fields: ["instagramHandle"],
    validation: "required",
    part: 1,
  },
    [StepId.FREELANCER_BIO]: {
    id: StepId.FREELANCER_BIO,
    component: FreelancerBioStep,
    fields: ["freelancerBio"],
    validation: "required",
    part: 1,
  },
  [StepId.AREAS_OF_EXPERTISE]: {
    id: StepId.AREAS_OF_EXPERTISE,
    component: ExpertiseStep,
    fields: ["areasOfExpertise"],
    validation: "required",
    part: 1,
  },
  [StepId.CHARGING_RATES]: {
    id: StepId.CHARGING_RATES,
    component: ChargingRateStep,
    fields: [
      "glamAndGoMinRate",
      "halfDayShootMinRate",
      "fullDayShootMinRate",
      "pressOnsMinRate",
      "nailArtMinRate",
    ],
    getDynamicFields: (formData: any) => {
      const selectedAreas = (formData.areasOfExpertise as string[]) || [];
      const fields: string[] = [];
      selectedAreas.forEach((slug) => {
        const config = getCategoryConfig("", slug);
        config.fields.forEach((field) => {
          fields.push(`category_rates.${slug}.${field.key}`);
        });
      });
      return fields;
    },
    validation: "required",
    part: 1,
  },
    [StepId.PORTFOLIO_IMAGES]: {
    id: StepId.PORTFOLIO_IMAGES,
    component: PortfolioImagesStep,
    fields: ["freelancerPortfolioImages"],
    validation: "required",
    part: 1,
  },
  [StepId.FREELANCER_REFERRAL_DETAILS]: {
    id: StepId.FREELANCER_REFERRAL_DETAILS,
    component: FreelancerReferralDetailsStep,
    fields: ["freelancerReferralDetails"],
    validation: "required",
    part: 1,
  },

  [StepId.CHECK_INBOX]: {
    id: StepId.CHECK_INBOX,
    component: CheckBoxStep,
    validation: "none",
    part: 1,
    isPartEnd: true,
  },
};

export const onboardingFlows = {
  freelancer: {
    base: [
      StepId.FIRST_NAME,
      StepId.LAST_NAME,
      StepId.EMAIL,
      StepId.PHONE_NUMBER,
      StepId.INSTAGRAM_HANDLE,
      StepId.FREELANCER_BIO,
      StepId.AREAS_OF_EXPERTISE,
      StepId.CHARGING_RATES,
      StepId.PORTFOLIO_IMAGES,
      StepId.FREELANCER_REFERRAL_DETAILS,
      StepId.CHECK_INBOX
    ],
  },
  client: {
    base: [
      StepId.FIRST_NAME,
      StepId.LAST_NAME,
      StepId.EMAIL,
      StepId.PHONE_NUMBER,
      StepId.CHECK_INBOX,
    ],
  },
};

export const getStepsForRole = (): StepId[] => {
  return [...onboardingFlows.freelancer.base];
};

export const getStepConfig = (stepId: StepId): RegistryConfig => {
  return stepRegistry[stepId];
};

export const getStepFields = (stepId: StepId): string[] => {
  return stepRegistry[stepId]?.fields || [];
};

export const requiresValidation = (stepId: StepId): boolean => {
  const validation = stepRegistry[stepId]?.validation;
  return validation === "required" || validation === "optional";
};

export const isPartEndStep = (stepId: StepId): boolean => {
  return stepRegistry[stepId]?.isPartEnd || false;
};

export const isPartStartStep = (stepId: StepId): boolean => {
  return stepRegistry[stepId]?.isPartStart || false;
};

export const getStepPart = (stepId: StepId): number => {
  return stepRegistry[stepId]?.part || 1;
};

export const StepRenderer: React.FC<StepRendererProps> = ({
  stepId,
  formMethods,
}) => {
  const stepConfig = stepRegistry[stepId as StepId];

  if (!stepConfig) {
    console.error(`Step component not found for ID: ${stepId}`);
    return null;
  }

  const StepComponent = stepConfig.component;

  return <StepComponent formMethods={formMethods} />;
};

