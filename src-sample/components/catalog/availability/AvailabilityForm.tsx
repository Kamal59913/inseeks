"use client";
import React, { useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import Switch from "@/components/ui/form/Switch";
import TimeInput from "@/components/ui/form/TimeInput";
import { AvailabilityValidationType } from "./validations/availability.validation";
import { useAvailibilityForm } from "./hook/availability.hook";
import availabilitySlotBookingService from "@/services/availabilitySlotBookingService";
import { ToastService } from "@/lib/utilities/toastService";
import { useDispatch, useSelector } from "react-redux";
import { getAuthToken } from "@/lib/utilities/tokenManagement";
import { useUserData } from "@/store/hooks/useUserData";
import { useModalData } from "@/store/hooks/useModal";
import { setAvailabilitySaving, setAvailabilitySaveStatus } from "@/store/slices/executionSlice";

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

// Map day names to day_of_week numbers
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

// (Removed generateTimeOptions and TIME_OPTIONS)

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

interface ApiSlot {
  start_time: string;
  end_time: string;
}

interface ApiDayData {
  day_of_week: number;
  is_enabled: boolean;
  slots: ApiSlot[];
}

interface ApiResponse {
  data: ApiDayData[];
}

interface ApiPayloadSlot {
  start_time: string;
  end_time: string;
}

interface ApiPayloadDay {
  day_of_week: number;
  is_enabled: boolean;
  slots: ApiPayloadSlot[];
}

interface ApiPayload {
  availability: ApiPayloadDay[];
}

/* ---------------------------------------------------------
    ⭐ NEW: Native Time Picker Component (<input type="time">)
    --------------------------------------------------------- */
// (Removed TimeSelector component and interfaces)

/* ---------------------------------------------------------
    Transform API → Form
    --------------------------------------------------------- */
const transformApiToForm = (
  apiData: ApiResponse
): Partial<AvailabilityValidationType> => {
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
    apiData.data.forEach((dayData: ApiDayData) => {
      const dayName = numberToDay[dayData.day_of_week];
      if (dayName) {
        const slots =
          dayData.is_enabled && dayData.slots.length > 0
            ? dayData.slots.map((slot: ApiSlot) => ({
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

/* ---------------------------------------------------------
    Transform Form → API
    --------------------------------------------------------- */
const transformFormToApi = (
  formData: AvailabilityValidationType
): ApiPayload => {
  const availability = DAYS.map((day: Day) => ({
    day_of_week: dayToNumber[day],
    is_enabled: formData.availability[day].enabled,
    slots: formData.availability[day].enabled
      ? formData.availability[day].slots.map((slot) => ({
          start_time: `${slot.start}:00`,
          end_time: `${slot.end}:00`,
        }))
      : [],
  }));

  return { availability };
};

/* ---------------------------------------------------------
    MAIN COMPONENT
    --------------------------------------------------------- */
const AvailabilityForm: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const formMethods = useAvailibilityForm();
  const { userData } = useUserData();
  const availabilitySaveTrigger = useSelector(
    (state: any) => state.executionStates.availabilitySaveTrigger
  );

  const { watch, setValue, handleSubmit } = formMethods;
  const availability = watch("availability");
  const { open, close } = useModalData();
  /* ---------------- Load availability from API ---------------- */
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setIsLoading(true);
        const response = await availabilitySlotBookingService.getAvailability();

        if (response?.status === 200) {
          const formData = transformApiToForm(response.data);

          DAYS.forEach((day: Day) => {
            if (formData.availability?.[day]) {
              setValue(`availability.${day}`, formData.availability[day]);
            }
          });
        }
      } catch (error: any) {
        if (error?.response?.status !== 401 && error?.status !== 401) {
          ToastService.error(
            "Failed to load availability data",
            "booking-saving"
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailability();
  }, [setValue]);

  /* ---------------- Toggle day on/off ---------------- */
  const toggleDay = (day: Day): void => {
    const current = availability[day];
    const newEnabled = !current.enabled;

    const slots =
      newEnabled && current.slots.length === 0
        ? [{ start: "09:00", end: "13:00" }]
        : current.slots;

    setValue(`availability.${day}`, { enabled: newEnabled, slots });
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

    // We can't easily prevent typing partially, but on blur/change we can check.
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
    setValue(`availability.${day}.slots`, updatedSlots);
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
    setValue(`availability.${day}.slots`, slots);
  };

  const removeSlot = (day: Day, index: number) => {
    const slots = [...availability[day].slots];
    slots.splice(index, 1);
    setValue(`availability.${day}.slots`, slots);
  };

  const dispatch = useDispatch();
  const onSubmit = async (data: AvailabilityValidationType) => {
    try {
      setIsSaving(true);
      dispatch(setAvailabilitySaving(true));
      dispatch(setAvailabilitySaveStatus('idle'));

      const payload = transformFormToApi(data);
      const response =
        await availabilitySlotBookingService.updateAvailabilityBulk(payload);

      if (response?.data) {
        ToastService.success(
          response.data?.message || "Availability saved successfully!",
          "booking-saving"
        );
        dispatch(setAvailabilitySaveStatus('success'));
      } else {
        dispatch(setAvailabilitySaveStatus('error')); // ENSURE STATUS UPDATES
        if (response?.status !== 401) {
          ToastService.error("Failed to save availability.", "booking-saving");
        }
      }
    } catch (error: any) {
      dispatch(setAvailabilitySaveStatus('error')); // ENSURE STATUS UPDATES
      if (error?.response?.status !== 401 && error?.status !== 401) {
        ToastService.error("Failed to save availability.", "booking-saving");
      }
    } finally {
      setIsSaving(false);
      dispatch(setAvailabilitySaving(false));
    }
  };

  useEffect(() => {
    if (availabilitySaveTrigger > 0) {
      onSubmit(formMethods.getValues());
    }
  }, [availabilitySaveTrigger]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center text-gray-400">
        Loading availability...
      </div>
    );
  }

  const handleConnectGoogleCalendar = async () => {
    const token = getAuthToken();

    window.location.href = `${process.env.NEXT_PUBLIC_SERVER_URL}/google-calendar/connect?token=${token}`;
  };

  const deleteCalenderSync = async (email: string) => {
    const response: any =
      await availabilitySlotBookingService.deleteCalenderSync(email);
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

  return (
    <div className="flex items-center justify-center">
      {/* (Removed datalist) */}

      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {(!userData?.freelancerGoogleAuth ||
            userData.freelancerGoogleAuth.length === 0) && (
            <div className="space-y-3 mb-8">
              <span className="text-[14px] text-gray-300">
                Connect your calendar to show real time availabilities
              </span>

              <button
                type="button"
                onClick={handleConnectGoogleCalendar}
                className="w-full h-[54px] bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.07)_100%)] shadow-[inset_0_4px_4px_0_rgba(255,255,255,0.25)] backdrop-blur-[82px] text-white rounded-[14px] flex items-center justify-center gap-3 transition-all border border-white/10"
              >
                <span className="font-medium text-[15px] tracking-wide text-gray-100">
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
          )}

          {(userData?.freelancerGoogleAuth?.length ?? 0) > 0 && (
            <div className="space-y-3 mb-8">
              <span className="text-[14px] text-gray-300">
                Connected Calendars
              </span>

              {userData?.freelancerGoogleAuth?.map((cal: any, idx: number) => (
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
                          title: "Delete Confirmation!",
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

          <span className="text-[16px] font-medium text-gray-400">
            Customers will be able to send requests within these availabilities
          </span>

          <div className="space-y-0">
            {DAYS.map((day: Day) => {
              const d = availability[day];

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
                          d.enabled ? "text-white" : "text-gray-500"
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
        </form>
      </div>
    </div>
  );
};

export default AvailabilityForm;
