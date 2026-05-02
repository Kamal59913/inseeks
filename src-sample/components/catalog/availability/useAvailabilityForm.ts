"use client";
import { ToastService } from "@/lib/utilities/toastService";
import { Day, AvailabilityValidationType } from "./types";
import { UseFormReturn, useWatch } from "react-hook-form";
import { timeToMinutes, addMinutes } from "./utils";

export function useAvailabilityForm(
  formMethods: UseFormReturn<AvailabilityValidationType>,
) {
  const { setValue, control } = formMethods;
  const availability = useWatch({ control, name: "availability" });

  const toggleDay = (day: Day): void => {
    const current = availability[day];
    const newEnabled = !current.enabled;
    const slots =
      newEnabled && current.slots.length === 0
        ? [{ start: "09:00", end: "13:00" }]
        : current.slots;
    setValue(`availability.${day}`, { enabled: newEnabled, slots });
  };

  const isOverlapping = (
    newStart: number,
    newEnd: number,
    slots: any[],
    excludeIndex: number = -1,
  ): boolean => {
    return slots.some((slot, index) => {
      if (index === excludeIndex) return false;
      const existingStart = timeToMinutes(slot.start);
      const existingEnd = timeToMinutes(slot.end);
      return newStart < existingEnd && newEnd > existingStart;
    });
  };

  const updateSlot = (
    day: Day,
    index: number,
    field: "start" | "end",
    value: string,
  ) => {
    const currentSlot = availability[day].slots[index];
    const updatedSlots = [...availability[day].slots];
    const newStart = field === "start" ? value : currentSlot.start;
    const newEnd = field === "end" ? value : currentSlot.end;
    const newStartMinutes = timeToMinutes(newStart);
    const newEndMinutes = timeToMinutes(newEnd);

    if (newStartMinutes >= newEndMinutes) {
      ToastService.error(
        field === "start"
          ? "Start time must be before end time"
          : "End time must be after start time",
      );
      return;
    }

    if (isOverlapping(newStartMinutes, newEndMinutes, updatedSlots, index)) {
      ToastService.error("Time slots cannot overlap");
      return;
    }

    updatedSlots[index] = { ...updatedSlots[index], [field]: value };
    setValue(`availability.${day}.slots`, updatedSlots);
  };

  const addSlot = (day: Day) => {
    const slots = [...availability[day].slots];
    const last = slots[slots.length - 1];
    const newStart = addMinutes(last.end, 60);
    const newEnd = addMinutes(newStart, 60);
    const lastEndMinutes = timeToMinutes(last.end);
    const newStartMinutes = timeToMinutes(newStart);
    const newEndMinutes = timeToMinutes(newEnd);

    if (newStartMinutes < lastEndMinutes || newStartMinutes > 1439) return;
    if (timeToMinutes(newEnd) < newStartMinutes) return;

    if (isOverlapping(newStartMinutes, newEndMinutes, slots)) {
      ToastService.error("Cannot add slot: overlaps with existing slot");
      return;
    }

    slots.push({ start: newStart, end: newEnd });
    setValue(`availability.${day}.slots`, slots);
  };

  const removeSlot = (day: Day, index: number) => {
    const slots = [...availability[day].slots];
    slots.splice(index, 1);
    setValue(`availability.${day}.slots`, slots);
  };

  return { toggleDay, updateSlot, addSlot, removeSlot };
}
