import {
  AvailabilityResponse,
  BulkAvailabilityPayload,
  AvailabilitySlot,
} from "@/types/api/availability.types";
import { Day, AvailabilityValidationType } from "./types";

const dayToNumber: Record<Day, number> = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 7,
};

const numberToDay: Record<number, Day> = {
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
  7: "sunday",
};

export const transformApiToForm = (
  apiData: AvailabilityResponse,
): AvailabilityValidationType => {
  const availability: any = {
    monday: { enabled: false, slots: [{ start: "09:00", end: "13:00" }] },
    tuesday: { enabled: false, slots: [{ start: "09:00", end: "13:00" }] },
    wednesday: { enabled: false, slots: [{ start: "09:00", end: "13:00" }] },
    thursday: { enabled: false, slots: [{ start: "09:00", end: "13:00" }] },
    friday: { enabled: false, slots: [{ start: "09:00", end: "13:00" }] },
    saturday: { enabled: false, slots: [{ start: "09:00", end: "13:00" }] },
    sunday: { enabled: false, slots: [{ start: "09:00", end: "13:00" }] },
  };

  if (apiData?.data) {
    apiData.data.forEach((dayData) => {
      const dayName = numberToDay[dayData.day_of_week];
      if (dayName) {
        const slots =
          dayData.is_enabled && dayData.slots.length > 0
            ? dayData.slots.map((slot: AvailabilitySlot) => ({
                start: slot.start_time.substring(0, 5),
                end: slot.end_time.substring(0, 5),
              }))
            : [{ start: "09:00", end: "13:00" }];

        availability[dayName] = {
          enabled: dayData.is_enabled,
          slots,
        };
      }
    });
  }

  return { availability };
};

export const transformFormToApi = (
  formData: AvailabilityValidationType,
): BulkAvailabilityPayload => {
  const availability = Object.entries(formData.availability).map(
    ([dayName, dayData]: [any, any]) => ({
      day_of_week: dayToNumber[dayName as Day],
      is_enabled: dayData.enabled,
      slots: dayData.slots.map((slot: any) => ({
        start_time: `${slot.start}:00`,
        end_time: `${slot.end}:00`,
      })),
    }),
  );

  return { availability };
};
