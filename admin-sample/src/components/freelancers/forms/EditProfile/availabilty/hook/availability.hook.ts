import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { AvailabilityValidation } from "../validations/availability.validation";
import type { AvailabilityValidationType } from "../validations/availability.validation";

export const useAvailibilityForm = (
  data?: Partial<AvailabilityValidationType>
) => {
  const isInitialMount = useRef(true);

  const formMethods = useForm<AvailabilityValidationType>({
    shouldFocusError: false,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(AvailabilityValidation() as any),
    defaultValues: {
      calendars: data?.calendars || [],
      availability: {
        monday: data?.availability?.monday || {
          enabled: true,
          slots: [
            { start: "09:00", end: "13:00" },
            { start: "15:00", end: "17:00" },
          ],
        },
        tuesday: data?.availability?.tuesday || {
          enabled: true,
          slots: [{ start: "09:00", end: "17:00" }],
        },
        wednesday: data?.availability?.wednesday || {
          enabled: false,
          slots: [],
        },
        thursday: data?.availability?.thursday || {
          enabled: true,
          slots: [{ start: "09:00", end: "17:00" }],
        },
        friday: data?.availability?.friday || {
          enabled: true,
          slots: [{ start: "09:00", end: "17:00" }],
        },
        saturday: data?.availability?.saturday || {
          enabled: true,
          slots: [{ start: "09:00", end: "17:00" }],
        },
        sunday: data?.availability?.sunday || { enabled: false, slots: [] },
      },
    },
  });

  useEffect(() => {
    if (data) {
      formMethods.reset({
        calendars: data?.calendars || [],
        availability: {
          monday: data?.availability?.monday || {
            enabled: true,
            slots: [
              { start: "09:00", end: "13:00" },
              { start: "15:00", end: "17:00" },
            ],
          },
          tuesday: data?.availability?.tuesday || {
            enabled: true,
            slots: [{ start: "09:00", end: "17:00" }],
          },
          wednesday: data?.availability?.wednesday || {
            enabled: false,
            slots: [],
          },
          thursday: data?.availability?.thursday || {
            enabled: true,
            slots: [{ start: "09:00", end: "17:00" }],
          },
          friday: data?.availability?.friday || {
            enabled: true,
            slots: [{ start: "09:00", end: "17:00" }],
          },
          saturday: data?.availability?.saturday || {
            enabled: true,
            slots: [{ start: "09:00", end: "17:00" }],
          },
          sunday: data?.availability?.sunday || { enabled: false, slots: [] },
        },
      });
    }

    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, [data, formMethods]);

  return formMethods;
};
