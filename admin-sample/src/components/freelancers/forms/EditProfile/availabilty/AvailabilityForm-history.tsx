// "use client";

// import React, { useEffect, useState } from "react";
// import { Plus, Trash2 } from "lucide-react";
// import Switch from "@/components/ui/form/Switch";
// import { AvailabilityValidationType } from "./validations/availability.validation";
// import { useAvailibilityForm } from "./hook/availability.hook";
// import availabilitySlotBookingService from "@/app/api/services/availabilitySlotBookingService";
// import { ToastService } from "@/lib/utilities/toastService";
// import { useSelector } from "react-redux";

// const DAYS = [
//   "monday",
//   "tuesday",
//   "wednesday",
//   "thursday",
//   "friday",
//   "saturday",
//   "sunday",
// ] as const;

// type Day = (typeof DAYS)[number];

// const dayLabelMap: Record<Day, string> = {
//   monday: "Monday",
//   tuesday: "Tuesday",
//   wednesday: "Wednesday",
//   thursday: "Thursday",
//   friday: "Friday",
//   saturday: "Saturday",
//   sunday: "Sunday",
// };

// // Map day names to day_of_week numbers
// const dayToNumber: Record<Day, number> = {
//   monday: 1,
//   tuesday: 2,
//   wednesday: 3,
//   thursday: 4,
//   friday: 5,
//   saturday: 6,
//   sunday: 7,
// };

// const numberToDay: Record<number, Day> = {
//   1: "monday",
//   2: "tuesday",
//   3: "wednesday",
//   4: "thursday",
//   5: "friday",
//   6: "saturday",
//   7: "sunday",
// };

// // Generate 30-minute interval time options
// const generateTimeOptions = (): string[] => {
//   const options: string[] = [];
//   for (let hour = 0; hour < 24; hour++) {
//     for (let minute = 0; minute < 60; minute += 30) {
//       const h = hour.toString().padStart(2, "0");
//       const m = minute.toString().padStart(2, "0");
//       options.push(`${h}:${m}`);
//     }
//   }
//   return options;
// };

// const TIME_OPTIONS = generateTimeOptions();

// // Add minutes to a time
// const addMinutes = (time: string, minutes: number): string => {
//   const [hours, mins] = time.split(":").map(Number);
//   const totalMinutes = hours * 60 + mins + minutes;
//   const newHours = Math.floor(totalMinutes / 60) % 24;
//   const newMins = totalMinutes % 60;
//   return `${newHours.toString().padStart(2, "0")}:${newMins
//     .toString()
//     .padStart(2, "0")}`;
// };

// // Convert time string "HH:MM" to minutes from midnight
// const timeToMinutes = (time: string): number => {
//   const [hours, mins] = time.split(":").map(Number);
//   return hours * 60 + mins;
// };

// interface ApiSlot {
//   start_time: string;
//   end_time: string;
// }

// interface ApiDayData {
//   day_of_week: number;
//   is_enabled: boolean;
//   slots: ApiSlot[];
// }

// interface ApiResponse {
//   data: ApiDayData[];
// }

// interface ApiPayloadSlot {
//   start_time: string;
//   end_time: string;
// }

// interface ApiPayloadDay {
//   day_of_week: number;
//   is_enabled: boolean;
//   slots: ApiPayloadSlot[];
// }

// interface ApiPayload {
//   availability: ApiPayloadDay[];
// }

// /* ---------------------------------------------------------
//    ⭐ NEW: Native Time Picker Component (<input type="time">)
//    --------------------------------------------------------- */
// interface TimeSelectorProps {
//   value: string;
//   onChange: (value: string) => void;
//   className?: string;
//   max?: string;
//   min?: string;
// }

// const TimeSelector: React.FC<TimeSelectorProps> = ({
//   value,
//   onChange,
//   className,
//   max,
//   min,
// }) => {
//   return (
//     <div className="relative">
//       <input
//         type="time"
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className={`${className} appearance-none bg-transparent`}
//         style={{ colorScheme: "dark" }} // Ensures native icon is light-colored
//         step={1800} // 30-minute intervals
//         list="time-options"
//         max={max}
//         min={min}
//         required
//       />
//     </div>
//   );
// };

// /* ---------------------------------------------------------
//    Transform API → Form
//    --------------------------------------------------------- */
// const transformApiToForm = (
//   apiData: ApiResponse
// ): Partial<AvailabilityValidationType> => {
//   const availability: any = {
//     monday: { enabled: false, slots: [{ start: "09:00", end: "13:00" }] },
//     tuesday: { enabled: false, slots: [{ start: "09:00", end: "13:00" }] },
//     wednesday: { enabled: false, slots: [{ start: "09:00", end: "13:00" }] },
//     thursday: { enabled: false, slots: [{ start: "09:00", end: "13:00" }] },
//     friday: { enabled: false, slots: [{ start: "09:00", end: "13:00" }] },
//     saturday: { enabled: false, slots: [{ start: "09:00", end: "13:00" }] },
//     sunday: { enabled: false, slots: [{ start: "09:00", end: "13:00" }] },
//   };

//   if (apiData?.data) {
//     apiData.data.forEach((dayData: ApiDayData) => {
//       const dayName = numberToDay[dayData.day_of_week];
//       if (dayName) {
//         const slots =
//           dayData.is_enabled && dayData.slots.length > 0
//             ? dayData.slots.map((slot: ApiSlot) => ({
//                 start: slot.start_time.substring(0, 5),
//                 end: slot.end_time.substring(0, 5),
//               }))
//             : [{ start: "09:00", end: "13:00" }];

//         availability[dayName] = {
//           enabled: dayData.is_enabled,
//           slots,
//         };
//       }
//     });
//   }

//   return { availability };
// };

// /* ---------------------------------------------------------
//    Transform Form → API
//    --------------------------------------------------------- */
// const transformFormToApi = (
//   formData: AvailabilityValidationType
// ): ApiPayload => {
//   const availability = DAYS.map((day: Day) => ({
//     day_of_week: dayToNumber[day],
//     is_enabled: formData.availability[day].enabled,
//     slots: formData.availability[day].enabled
//       ? formData.availability[day].slots.map((slot) => ({
//           start_time: `${slot.start}:00`,
//           end_time: `${slot.end}:00`,
//         }))
//       : [],
//   }));

//   return { availability };
// };

// /* ---------------------------------------------------------
//    MAIN COMPONENT
//    --------------------------------------------------------- */
// const AvailabilityForm: React.FC = () => {
//   const [isLoading, setIsLoading] = React.useState<boolean>(true);
//   const [isSaving, setIsSaving] = React.useState<boolean>(false);
//   const formMethods = useAvailibilityForm();

//   const availabilitySaveTrigger = useSelector(
//     (state: any) => state.executionStates.availabilitySaveTrigger
//   );

//   const { watch, setValue, handleSubmit } = formMethods;
//   const availability = watch("availability");

//   /* ---------------- Load availability from API ---------------- */
//   useEffect(() => {
//     const fetchAvailability = async () => {
//       try {
//         setIsLoading(true);
//         const response = await availabilitySlotBookingService.getAvailability();

//         if (response?.status === 200) {
//           const formData = transformApiToForm(response.data);

//           DAYS.forEach((day: Day) => {
//             if (formData.availability?.[day]) {
//               setValue(`availability.${day}`, formData.availability[day]);
//             }
//           });
//         }
//       } catch (error: any) {
//         if (error?.response?.status !== 401 && error?.status !== 401) {
//           ToastService.error(
//             "Failed to load availability data",
//             "booking-saving"
//           );
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAvailability();
//   }, [setValue]);

//   /* ---------------- Toggle day on/off ---------------- */
//   const toggleDay = (day: Day): void => {
//     const current = availability[day];
//     const newEnabled = !current.enabled;

//     const slots =
//       newEnabled && current.slots.length === 0
//         ? [{ start: "09:00", end: "13:00" }]
//         : current.slots;

//     setValue(`availability.${day}`, { enabled: newEnabled, slots });
//   };

//   /* ---------------- Update slot time ---------------- */
//   const updateSlot = (
//     day: Day,
//     index: number,
//     field: "start" | "end",
//     value: string
//   ) => {
//     // Basic validation
//     // If start is updated, it must be < end
//     // If end is updated, it must be > start

//     // We can't easily prevent typing partially, but on blur/change we can check.
//     const currentSlot = availability[day].slots[index];
//     const updatedSlots = [...availability[day].slots];

//     // Check constraints
//     if (field === "start") {
//       if (timeToMinutes(value) >= timeToMinutes(currentSlot.end)) {
//         // Invalid: start cannot be >= end
//         ToastService.error("Start time must be before end time");
//         return;
//       }
//     } else {
//       if (timeToMinutes(value) <= timeToMinutes(currentSlot.start)) {
//         // Invalid: end cannot be <= start
//         ToastService.error("End time must be after start time");
//         return;
//       }
//     }

//     updatedSlots[index] = { ...updatedSlots[index], [field]: value };
//     setValue(`availability.${day}.slots`, updatedSlots);
//   };

//   /* ---------------- Add new slot ---------------- */
//   const addSlot = (day: Day) => {
//     const slots = [...availability[day].slots];
//     const last = slots[slots.length - 1];

//     // Calculate new start time: Last End Time + 1 hour (60 minutes)
//     const newStart = addMinutes(last.end, 60);

//     // Calculate new end time: New Start Time + 1 hour (60 minutes)
//     const newEnd = addMinutes(newStart, 60);

//     // Validation
//     const lastEndMinutes = timeToMinutes(last.end);
//     const newStartMinutes = timeToMinutes(newStart);
//     // const newEndMinutes = timeToMinutes(newEnd);

//     // If wrapped around or exceeds 23:59 (1439 minutes)
//     if (newStartMinutes < lastEndMinutes || newStartMinutes > 1439) {
//       return;
//     }

//     if (timeToMinutes(newEnd) < newStartMinutes) {
//       return;
//     }

//     slots.push({ start: newStart, end: newEnd });
//     setValue(`availability.${day}.slots`, slots);
//   };

//   /* ---------------- Remove slot ---------------- */
//   const removeSlot = (day: Day, index: number) => {
//     const slots = [...availability[day].slots];
//     slots.splice(index, 1);
//     setValue(`availability.${day}.slots`, slots);
//   };

//   /* ---------------- Save API ---------------- */
//   const onSubmit = async (data: AvailabilityValidationType) => {
//     try {
//       setIsSaving(true);
//       const payload = transformFormToApi(data);
//       const response =
//         await availabilitySlotBookingService.updateAvailabilityBulk(payload);

//       if (response?.data) {
//         ToastService.success(
//           response.data?.message || "Availability saved successfully!",
//           "booking-saving"
//         );
//       } else {
//         if (response?.status !== 401) {
//           ToastService.error("Failed to save availability.", "booking-saving");
//         }
//       }
//     } catch (error: any) {
//       if (error?.response?.status !== 401 && error?.status !== 401) {
//         ToastService.error("Failed to save availability.", "booking-saving");
//       }
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   useEffect(() => {
//     if (availabilitySaveTrigger > 0) {
//       onSubmit(formMethods.getValues());
//     }
//   }, [availabilitySaveTrigger]);
//   /* ---------------- Loading State ---------------- */
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center text-gray-400">
//         Loading availability...
//       </div>
//     );
//   }

//   // const connectCall = async () => {
//   //   const res = await fetch(
//   //     `${process.env.NEXT_PUBLIC_SERVER_URL}/google-calendar/connect`
//   //   );
//   //   const data = await res.json();
//   //   console.log(data);
//   // };
//   const connectCall = async () => {
//     window.location.href = `${process.env.NEXT_PUBLIC_SERVER_URL}/google-calendar/connect`;
//   };
//   /* ---------------- UI ---------------- */
//   return (
//     <div className="flex items-center justify-center">
//       {/* Datalist for time options */}
//       <datalist id="time-options">
//         {TIME_OPTIONS.map((time) => (
//           <option key={time} value={time} />
//         ))}
//       </datalist>

//       <div className="w-full max-w-md">
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           <div className="space-y-3 mb-8">
//             <span className="text-[14px] text-gray-300">
//               Connect your calendar to show real time availabilities
//             </span>
//             <button
//               type="button"
//               onClick={async () => {
//                 try {
//                   // await availabilitySlotBookingService.syncWithCalenderDate({});
//                   connectCall();
//                 } catch (error) {
//                   console.error(error);
//                 }
//               }}
//               className="w-full h-[54px] bg-gradient-to-b from-[#3a2a46] to-[#2a1e36] hover:from-[#453254] hover:to-[#322440] text-white rounded-[14px] flex items-center justify-center gap-3 transition-all border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.2)] relative overflow-hidden group active:scale-[0.98]"
//             >
//               <span className="font-medium text-[15px] tracking-wide text-gray-100">
//                 Connect your Google Calendar
//               </span>
//               <svg
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-6 h-6"
//               >
//                 <rect x="2" y="3" width="20" height="18" rx="4" fill="white" />
//                 <path
//                   d="M17.333 1.667V4.333"
//                   stroke="#120B18"
//                   strokeWidth="1.5"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//                 <path
//                   d="M6.667 1.667V4.333"
//                   stroke="#120B18"
//                   strokeWidth="1.5"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//                 <path
//                   d="M2.667 8.333H21.333"
//                   stroke="#120B18"
//                   strokeWidth="1.5"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//                 <path
//                   d="M15.5 13.5H18.5"
//                   stroke="#4285F4"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//                 <path
//                   d="M17 12V15"
//                   stroke="#4285F4"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//                 <rect x="5" y="12" width="6" height="5" rx="1" fill="#34A853" />
//               </svg>
//             </button>
//           </div>

//           <span className="text-[16px] font-medium text-gray-400">
//             Customers will be able to send requests within these availabilities
//           </span>

//           <div className="space-y-0">
//             {DAYS.map((day: Day) => {
//               const d = availability[day];

//               return (
//                 <div
//                   key={day}
//                   className="py-4 border-b border-gray-800/50 last:border-0"
//                 >
//                   <div className="flex justify-between items-start">
//                     <div className="flex items-center gap-4 min-w-[132px] pt-2">
//                       <Switch
//                         value={d.enabled}
//                         onChange={() => toggleDay(day)}
//                         name={`availability-${day}`}
//                       />
//                       <span
//                         className={`text-sm font-medium ${
//                           d.enabled ? "text-white" : "text-gray-500"
//                         }`}
//                       >
//                         {dayLabelMap[day]}
//                       </span>
//                     </div>

//                     <div className="flex-1">
//                       {d.enabled && (
//                         <div className="space-y-3">
//                           {d.slots.map((slot, i) => (
//                             <div
//                               key={i}
//                               className="flex items-center justify-end gap-3"
//                             >
//                               <TimeSelector
//                                 value={slot.start}
//                                 onChange={(v) => updateSlot(day, i, "start", v)}
//                                 max={slot.end}
//                                 className="bg-[#120B18] border border-gray-800 rounded-lg px-2 py-1.5 text-gray-300 text-[12px] w-[80px]  text-center focus:outline-none focus:border-purple-500 transition-colors"
//                               />

//                               <span className="text-gray-600 font-medium">
//                                 -
//                               </span>

//                               <TimeSelector
//                                 value={slot.end}
//                                 onChange={(v) => updateSlot(day, i, "end", v)}
//                                 min={slot.start}
//                                 className="bg-[#120B18] border border-gray-800 rounded-lg px-2 py-1.5 text-gray-300 text-[12px] w-[80px] text-center focus:outline-none focus:border-purple-500 transition-colors"
//                               />

//                               <div className="w-8 flex justify-center">
//                                 {i === 0 ? (
//                                   <button
//                                     type="button"
//                                     onClick={() => addSlot(day)}
//                                     className="p-1.5 hover:bg-gray-800/50 rounded-md transition-colors"
//                                   >
//                                     <Plus className="w-5 h-5 text-gray-400" />
//                                   </button>
//                                 ) : (
//                                   <button
//                                     type="button"
//                                     onClick={() => removeSlot(day, i)}
//                                     className="p-1.5 hover:bg-gray-800/50 rounded-md transition-colors"
//                                   >
//                                     <Trash2 className="w-5 h-5 text-gray-400" />
//                                   </button>
//                                 )}
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AvailabilityForm;
