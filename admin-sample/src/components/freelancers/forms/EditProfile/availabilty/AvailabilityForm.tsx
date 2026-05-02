"use client";
import React from "react";
import { Plus, Trash2 } from "lucide-react";

import { useFormContext } from "react-hook-form";
import { ToastService } from "@/utils/toastService";
import { getAuthToken } from "@/utils/getToken";
import Switch from "@shared/common/components/ui/form/switch/Switch.js";
import { useUserData } from "@/redux/hooks/useUserData";
import { useModalData } from "@/redux/hooks/useModal";
import freelancersService from "@/api/services/freelancersService";
import TimeInput from "@shared/common/components/ui/form/input/TimeInput.tsx";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

type Day = (typeof DAYS)[number];

const dayLabelMap: Record<Day, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

// Add minutes to a time
const addMinutes = (time: string, minutes: number): string => {
  const [hours, mins] = time.split(":").map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMins = totalMinutes % 60;
  return `${newHours.toString().padStart(2, "0")}:${newMins
    .toString()
    .padStart(2, "0")}`;
};

// Convert time string "HH:MM" to minutes from midnight
const timeToMinutes = (time: string): number => {
  const [hours, mins] = time.split(":").map(Number);
  return hours * 60 + mins;
};

/* ---------------------------------------------------------
    MAIN COMPONENT
    --------------------------------------------------------- */
const AvailabilityForm: React.FC = () => {
  const { userData } = useUserData();
  const { open, close } = useModalData();
  
  // Use parent form context instead of local hook
  const { watch, setValue } = useFormContext();
  const availability = watch("availability");

  /* ---------------- Toggle day on/off ---------------- */
  const toggleDay = (day: Day): void => {
    const current = availability[day];
    const newEnabled = !current.enabled;

    const slots =
      newEnabled && current.slots.length === 0
        ? [{ start: "09:00", end: "13:00" }]
        : current.slots;

    setValue(`availability.${day}`, { enabled: newEnabled, slots }, { shouldDirty: true });
  };

  // Check if a slot overlaps with any other slots
  const isOverlapping = (
    newStart: number,
    newEnd: number,
    slots: any[],
    excludeIndex: number = -1
  ): boolean => {
    return slots.some((slot, index) => {
      if (index === excludeIndex) return false;
      const existingStart = timeToMinutes(slot.start);
      const existingEnd = timeToMinutes(slot.end);

      // Overlap condition: (StartA < EndB) and (EndA > StartB)
      return newStart < existingEnd && newEnd > existingStart;
    });
  };

  /* ---------------- Update slot time ---------------- */
  const updateSlot = (
    day: Day,
    index: number,
    field: "start" | "end",
    value: string
  ) => {
    // Basic validation
    // If start is updated, it must be < end
    // If end is updated, it must be > start

    const currentSlot = availability[day].slots[index];
    const updatedSlots = [...availability[day].slots];

    // Calculate potentially new times
    const newStart = field === "start" ? value : currentSlot.start;
    const newEnd = field === "end" ? value : currentSlot.end;

    const newStartMinutes = timeToMinutes(newStart);
    const newEndMinutes = timeToMinutes(newEnd);

    // Check basic constraints
    if (newStartMinutes >= newEndMinutes) {
      if (field === "start") {
         ToastService.error("Start time must be before end time");
      } else {
         ToastService.error("End time must be after start time");
      }
      return;
    }

    // Check overlap
    if (isOverlapping(newStartMinutes, newEndMinutes, updatedSlots, index)) {
      ToastService.error("Time slots cannot overlap");
      return;
    }

    updatedSlots[index] = { ...updatedSlots[index], [field]: value };
    setValue(`availability.${day}.slots`, updatedSlots, { shouldDirty: true });
  };

  /* ---------------- Add new slot ---------------- */
  const addSlot = (day: Day) => {
    const slots = [...availability[day].slots];
    const last = slots[slots.length - 1];

    // Calculate new start time: Last End Time + 1 hour (60 minutes)
    const newStart = addMinutes(last.end, 60);

    // Calculate new end time: New Start Time + 1 hour (60 minutes)
    const newEnd = addMinutes(newStart, 60);

    // Validation
    const lastEndMinutes = timeToMinutes(last.end);
    const newStartMinutes = timeToMinutes(newStart);
    const newEndMinutes = timeToMinutes(newEnd);

    // If wrapped around or exceeds 23:59 (1439 minutes)
    if (newStartMinutes < lastEndMinutes || newStartMinutes > 1439) {
      return;
    }

    if (timeToMinutes(newEnd) < newStartMinutes) {
      return;
    }

    // Check overlap for new slot
    if (isOverlapping(newStartMinutes, newEndMinutes, slots)) {
       ToastService.error("Cannot add slot: overlaps with existing slot");
       return;
    }

    slots.push({ start: newStart, end: newEnd });
    setValue(`availability.${day}.slots`, slots, { shouldDirty: true });
  };

  const removeSlot = (day: Day, index: number) => {
    const slots = [...availability[day].slots];
    slots.splice(index, 1);
    setValue(`availability.${day}.slots`, slots, { shouldDirty: true });
  };

  const handleConnectGoogleCalendar = async () => {
    const token = getAuthToken();
    window.location.href = `${process.env.NEXT_PUBLIC_SERVER_URL}/google-calendar/connect?token=${token}`;
  };

  const deleteCalenderSync = async (email: string) => {
    const response: any =
      await freelancersService.deleteCalenderSync(email);
    if (response.status === 201) {
      ToastService.success(
        response?.data?.message || "Calendar sync removed successfully.",
        "success-calender-sync"
      );
      close();
    } else {
      if (response?.status !== 401) {
        ToastService.error(
          response?.data?.message || "Failed to remove calendar sync.",
          "delete-calender-sync"
        );
      }
    }
  };

  if (!availability) {
      return null;
  }

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="space-y-6">
          {/* {(!userData?.freelancerGoogleAuth ||
            userData.freelancerGoogleAuth.length === 0) && (
            <div className="space-y-3 mb-8">
              <span className="text-[14px] font-medium">
                Connect your calendar to show real time availabilities
              </span>

             <button
  type="button"
  onClick={handleConnectGoogleCalendar}
  className="w-full h-[54px] bg-white dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.07)_100%)] border border-gray-300 dark:border-white/10 dark:shadow-[inset_0_4px_4px_0_rgba(255,255,255,0.25)] dark:backdrop-blur-[82px] text-black dark:text-white rounded-[14px] flex items-center justify-center gap-3 transition-all hover:bg-gray-50 dark:hover:bg-white/5"
>
  <span className="font-medium text-[15px] tracking-wide text-gray-900 dark:text-gray-100">
    Connect your Google Calendar
  </span>
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect
      x="2"
      y="3"
      width="20"
      height="18"
      rx="4"
      fill="white"
      stroke="#E5E7EB"
      strokeWidth="0.5"
    />
    <path
      d="M17.333 1.667V4.333"
      stroke="#120B18"
      strokeWidth="1.5"
    />
    <path
      d="M6.667 1.667V4.333"
      stroke="#120B18"
      strokeWidth="1.5"
    />
    <path
      d="M2.667 8.333H21.333"
      stroke="#120B18"
      strokeWidth="1.5"
    />
    <path d="M15.5 13.5H18.5" stroke="#4285F4" strokeWidth="2" />
    <path d="M17 12V15" stroke="#4285F4" strokeWidth="2" />
    <rect
      x="5"
      y="12"
      width="6"
      height="5"
      rx="1"
      fill="#34A853"
    />
  </svg>
</button>
            </div>
          )} */}

          {userData?.freelancerGoogleAuth?.length > 0 && (
            <div className="space-y-3 mb-8">
              <span className="text-[14px] text-gray-300">
                Connected Calendars
              </span>

              {userData.freelancerGoogleAuth.map((cal: any, idx: number) => (
                <div key={idx} className="flex gap-2">
                  <div className="flex items-center justify-between bg-[#FFFFFF0D] border border-white/10 rounded-lg px-3 py-3 w-90">
                    <span className="text-gray-200 text-sm">{cal.email}</span>

                    <div className="flex items-center gap-3">
                      <span className="text-green-400 text-xs font-medium">
                        Connected ✔
                      </span>
                    </div>
                  </div>
                  <button
                    className="p-1 rounded-md w-10 group"
                    onClick={(e) => {
                      e.preventDefault();
                      {
                        open("delete-action", {
                          description:
                            "Are you sure you want to remove this calendar sync?",
                          action: () => {
                            deleteCalenderSync(cal.email);
                          },
                        });
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-400 transition-colors" />
                  </button>
                </div>
              ))}

              {/* Add new calendar */}
              <button
                type="button"
                onClick={handleConnectGoogleCalendar}
                className="w-50 h-[16px] rounded-[16px] border border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.07)_100%)] shadow-[inset_0_4px_4px_0_rgba(255,255,255,0.25)] backdrop-blur-[82px] py-5 px-4 cursor-pointer flex items-center justify-center gap-2"
              >
                Add new calendar <Plus className="w-4 h-4" />
              </button>
            </div>
          )}

          <span className="text-[16px] font-medium">
            Customers will be able to send requests within these availabilities
          </span>

          <div className="space-y-0">
            {DAYS.map((day: Day) => {
              const d = availability[day];
              if (!d) return null;

              return (
                <div
                  key={day}
                  className="py-4 border-b border-gray-800/50 last:border-0"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4 min-w-[132px] pt-2">
                      <Switch
                        value={d.enabled}
                        onChange={() => toggleDay(day)}
                        name={`availability-${day}`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          d.enabled ? "" : "text-gray-500"
                        }`}
                      >
                        {dayLabelMap[day]}
                      </span>
                    </div>

                    <div className="flex-1">
                      {d.enabled && (
                        <div className="space-y-3">
                          {d.slots.map((slot: any, i: number) => (
                            <div
                              key={i}
                              className="flex items-center justify-end gap-3"
                            >
                              <TimeInput
                                value={slot.start}
                                onChange={(e) => updateSlot(day, i, "start", e.target.value)}
                                max={slot.end}
                                step={1800}
                                registerOptions={`start-${day}-${i}`}
                                style={{ colorScheme: "dark" }}
                                required={true}
                                className="bg-[#120B18] border border-gray-800 rounded-lg px-2 py-1.5 text-gray-300 text-[12px] w-[80px] text-center focus:outline-none focus:border-purple-500 transition-colors"
                              />

                              <span className="text-gray-600 font-medium">
                                -
                              </span>

                              <TimeInput
                                value={slot.end}
                                onChange={(e) => updateSlot(day, i, "end", e.target.value)}
                                min={slot.start}
                                step={1800}
                                registerOptions={`end-${day}-${i}`}
                                style={{ colorScheme: "dark" }}
                                required={true}
                                className="bg-[#120B18] border border-gray-800 rounded-lg px-2 py-1.5 text-gray-300 text-[12px] w-[80px] text-center focus:outline-none focus:border-purple-500 transition-colors"
                              />

                              <div className="w-8 flex justify-center">
                                {i === 0 ? (
                                  <button
                                    type="button"
                                    onClick={() => addSlot(day)}
                                    className="p-1.5 hover:bg-gray-800/50 rounded-md transition-colors"
                                  >
                                    <Plus className="w-5 h-5 text-gray-400" />
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => removeSlot(day, i)}
                                    className="p-1.5 hover:bg-gray-800/50 rounded-md transition-colors"
                                  >
                                    <Trash2 className="w-5 h-5 text-gray-400" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityForm;
