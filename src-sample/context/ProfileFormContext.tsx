"use client";
import { createContext, useContext } from "react";
import { UseFormReturn } from "react-hook-form";

interface ProfileFormContextType {
  formMethods: UseFormReturn<any>;
}

const ProfileFormContext = createContext<ProfileFormContextType | undefined>(undefined);

export const ProfileFormProvider = ProfileFormContext.Provider;

export const useProfileFormContext = () => {
  const context = useContext(ProfileFormContext);
  if (!context) {
    throw new Error("useProfileFormContext must be used within ProfileFormProvider");
  }
  return context;
};
