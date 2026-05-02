import { UseFormReturn } from "react-hook-form";
import { SignUpValidationType } from "../validations/signup.validation";
import { ComponentType } from "react";
import { StepSecondId } from "@/types/constants/constants";

export interface StepComponentProps {
  formMethods: UseFormReturn<SignUpValidationType>;
}

export interface RegistryConfig {
  id: StepSecondId;
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
  stepId: StepSecondId | string;
  formMethods: UseFormReturn<SignUpValidationType>;
}

export interface StepConfig {
  id: StepSecondId;
  fields?: string[];
}

export interface StepsConfig {
  freelancer: StepConfig[];
  client: StepConfig[];
}

