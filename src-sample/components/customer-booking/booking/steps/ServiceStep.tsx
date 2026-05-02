import { formatMinutesToDecimalHours } from "@/lib/utilities/timeFormat";
import React, { useState } from "react";
import Button from "@/components/ui/button/Button";

import {
  Freelancer,
  FreelancerService,
  ServiceOption,
} from "@/types/api/freelancer.types";

type ServiceStepProps = {
  venueOption: string;
  setVenueOption: (v: string) => void;
  service: FreelancerService | null | undefined;
  selectedOptionId: number | null;
  setSelectedOptionId: (id: number | null) => void;
  goNext: () => void;
  selected: Freelancer;
};

export default function ServiceStep({
  venueOption,
  setVenueOption,
  service,
  selectedOptionId,
  setSelectedOptionId,
  goNext,
  selected,
}: ServiceStepProps) {
  const options = service?.options || [];

  const [optionError, setOptionError] = useState<string>("");


  const handleOptionClick = (optId: number) => {
    // Allow unselecting by clicking the same option again
    if (selectedOptionId === optId) {
      setSelectedOptionId(null);
    } else {
      setSelectedOptionId(optId);
      // Clear error when user selects an option
      setOptionError("");
    }
  };

  const handleContinue = () => {
    let hasError = false;

    // Validate option selection
    if (!selectedOptionId) {
      setOptionError("Please select a service option");
      hasError = true;
    }

    // Only proceed if no errors
    if (!hasError) {
      goNext();
    }
  };

  /* 
  // [NEW] AUTO-SKIP LOGIC: Skip this step if only one option exists
  */
  React.useEffect(() => {
    if (options.length === 1) {
      if (selectedOptionId !== options[0].id) {
        setSelectedOptionId(options[0].id);
      }
      goNext();
    }
  }, [options, setSelectedOptionId, goNext, selectedOptionId]);

  if (options.length === 1) {
    return null;
  }

  // NEW RENDER LOGIC
  return (
    <div>
      <h4 className="text-sm text-purple-200 mb-2">
        {options.length > 1
          ? service
            ? `Choose an option for "${service.name}"`
            : "Choose an option"
          : service
            ? `Service Details`
            : "Service Details"}
      </h4>

      {!service && (
        <p className="text-sm text-purple-300">
          No service selected. Please go back and select a service.
        </p>
      )}

      {service && (
        <div className="space-y-3">
          {options.map((opt: any) => {
            const isSelected = selectedOptionId === opt.id;
            return (
              <Button
                key={opt.id}
                onClick={() => handleOptionClick(opt.id)}
                size="none"
                variant={isSelected ? "white" : "glass"}
                className={`w-full py-5 px-4 block ${!isSelected ? "" : ""}`}
                borderRadius="rounded-[16px]"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="text-left">
                    <h4
                      className={`capitalize mb-1 text-[12px] font-[500] ${
                        isSelected ? "text-black" : "text-[#FFFFFF]"
                      }`}
                    >
                      {opt.name}
                    </h4>
                    <p
                      className={`capitalize tracking-wide text-[11px] font-[400] ${
                        isSelected ? "text-black/70" : "text-[#FFFFFFCC]"
                      }`}
                    >
                      {formatMinutesToDecimalHours(opt.duration)}
                    </p>
                  </div>
                  <div
                    className={`text-[12px] font-[500] ${
                      isSelected ? "text-black" : "text-[#FFFFFF]"
                    }`}
                  >
                    £{opt.price.toFixed(2)}
                  </div>
                </div>
              </Button>
            );
          })}

          {options.length === 0 && (
            <p className="text-sm text-purple-300">
              This service has no options configured.
            </p>
          )}
        </div>
      )}
      {optionError && (
        <p className="mt-1.5 text-xs text-red-500">{optionError}</p>
      )}

      <div className="mt-6">
        <Button
          onClick={handleContinue}
          variant={!service ? "dark" : "white"}
          disabled={!service}
          size="none"
          borderRadius="rounded-lg"
          className="w-full py-3 text-sm font-bold"
        >
          Choose time
        </Button>
      </div>
    </div>
  );
}
