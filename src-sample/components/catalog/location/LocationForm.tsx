"use client";

import React, { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import Label from "@/components/ui/form/label";
import MapBoxRadiusSelector from "@/components/features/mapboxmap";
import { useLocationForm } from "./hook/location.hook";
import profileService from "@/services/profileService";
import { ToastService } from "@/lib/utilities/toastService";
import { useUserData } from "@/store/hooks/useUserData";
import { useAppSelector } from "@/store/hooks";
import PostcodeAddressFormV2 from "@/components/ui/form/SearchableListInputV2";
interface LocationFormProps {
  onSubmitSuccess?: () => void;
  onSubmitError?: (error: any) => void;
}

const LocationForm: React.FC<LocationFormProps> = ({
  onSubmitSuccess,
  onSubmitError,
}) => {
  const [showAddressEditor, setShowAddressEditor] = useState(false);

  const locationSaveTrigger = useAppSelector(
    (state) => state.executionStates.locationSaveTrigger,
  );
  const { userData } = useUserData();
  const formMethods = useLocationForm(userData, showAddressEditor);

  const handleFormSubmit = async (data: any) => {
    const isValid = await formMethods.trigger();

    if (!isValid) {
      return;
    }

    try {
      const response: any = await profileService.updateLocationProfile(data);

      if (response?.data) {
        ToastService.success("Location updated successfully");
      } else {
        if (response?.status !== 401) {
          ToastService.error("Failed to update location");
        }
      }
    } catch (err: any) {
      if (err?.response?.status !== 401 && err?.status !== 401) {
        ToastService.error("Failed to update location");
      }
    }
  };

  useEffect(() => {
    if (locationSaveTrigger > 0) {
      handleFormSubmit(formMethods.getValues());
    }
  }, [locationSaveTrigger]);

  const address = formMethods.watch("freelancerAddress");
  const postcode = formMethods.watch("freelancerPostalCode");

  return (
    <form onSubmit={formMethods.handleSubmit(handleFormSubmit)}>
      <div
        className="
          space-y-8
          overflow-y-auto 
          max-h-[70vh] 
          pr-2
          [&::-webkit-scrollbar]:w-1
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-track]:bg-gray-800
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-gray-600
        "
      >
        {/* Location Preview */}
        {!showAddressEditor && (
          <div className="space-y-3">
            <h3 className="text-white text-sm font-normal text-center mb-4">
              Your location
            </h3>

            <div
              className="relative bg-linear-to-br from-[#2a2a35] to-[#1f1f28] 
              rounded-2xl p-4 border border-white/5 hover:border-white/10 
              transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-white text-sm font-medium mb-1">
                    {address || postcode || ""}
                  </p>
                  {address && (
                    <p className="text-white/50 text-xs">{postcode || ""}</p>
                  )}
                </div>

                {/* ONLY pencil opens editor */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAddressEditor(true);
                  }}
                  className="shrink-0 w-8 h-8 flex items-center justify-center 
                  rounded-full bg-white/5 hover:bg-white/10 transition-colors ml-3"
                >
                  ✏️
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Location Editor */}
        {showAddressEditor && (
          <div className="space-y-4">
            <h3 className="text-white text-sm font-normal text-center mb-4">
              Your location
            </h3>

            <Label isRequired={false} variant="lg">
              Enter your postcode
            </Label>

            <PostcodeAddressFormV2
              formMethods={formMethods}
              field="freelancerAddress"
              typingField="freelancerPostalCode"
              postcodeField="freelancerPostalCode"
            />

            <button
              type="button"
              onClick={() => setShowAddressEditor(false)}
              className="w-full mt-4 py-3 bg-white text-black rounded-xl 
              font-semibold hover:bg-gray-100 transition-colors"
            >
              Done
            </button>
          </div>
        )}

        {/* Travel Radius */}
        <div className="space-y-4 pb-6">
          <Label isRequired={false} className="text-center">
            How far are you willing to travel?
          </Label>
          <MapBoxRadiusSelector
            formMethods={formMethods}
            autoFocus={false}
            initialRadius={formMethods.getValues("serviceRadius")}
          />
        </div>
      </div>
    </form>
  );
};

export default LocationForm;
