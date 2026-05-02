import { UseFormReturn } from "react-hook-form";
import { SignUpValidationType } from "../validations/signup.validation";
import { ComponentType } from "react";
import { StepId } from "@/types/constants/constants";

export interface StepComponentProps {
  formMethods: UseFormReturn<SignUpValidationType>;
}

export interface RegistryConfig {
  id: StepId;
  component: ComponentType<StepComponentProps>;
  fields?: (keyof SignUpValidationType)[];
  getDynamicFields?: (formValues: any) => string[];
  validation?: "required" | "optional" | "none";
  workZoneType?: string;
  part?: number;
  isPartEnd?: boolean;
  isPartStart?: boolean;
}

export interface StepRendererProps {
  stepId: StepId | string;
  formMethods: UseFormReturn<SignUpValidationType>;
}

export interface StepConfig {
  id: StepId;
  fields?: string[];
}

export interface StepsConfig {
  freelancer: StepConfig[];
  client: StepConfig[];
}

