import { useMemo, useEffect, useState, useRef } from "react";
import customerService from "@/services/customerService";
import Button from "@/components/ui/button/Button";

// Helper function to format time in 12-hour format
function formatTime12Hour(time24: string): string {
  const [hours, minutes] = time24.split(":").map(Number);
  const ampm = hours >= 12 ? "pm" : "am";
  let h = hours % 12;
  h = h ? h : 12; // 0 should be 12
  const minutesStr = minutes.toString().padStart(2, "0");
  return `${h}:${minutesStr}${ampm}`;
}

interface AvailableSlot {
  start_time: string;
  end_time: string;
  datetime: string;
}

interface DaySlots {
  date: string;
  day: string;
  available_slots: AvailableSlot[];
  slot_count: number;
}

interface TimeStepProps {
  days: { date: Date }[];
  selectedDay: string | null;
  setSelectedDay: (day: string | null) => void;
  selectedSlot: string | null;
  setSelectedSlot: (slot: string | null) => void;
  goNext: () => void;
  freelancerUuid: string;
  productOptionId: number | undefined;
}

export default function TimeStep({
  days,
  selectedDay,
  setSelectedDay,
  selectedSlot,
  setSelectedSlot,
  goNext,
  freelancerUuid,
  productOptionId,
}: TimeStepProps) {
  const [slotsData, setSlotsData] = useState<DaySlots[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [slotError, setSlotError] = useState<string>("");

  // Fetch available slots when component mounts or when productOptionId changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!freelancerUuid || !productOptionId) return;

      try {
        setIsLoading(true);
        // [MODIFIED] Using local time components to avoid UTC shift
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");

        // Constructing ISO-like string using local components
        const today = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

        const response = await customerService.getAvailableSlots(
          freelancerUuid,
          {
            product_option_id: productOptionId,
            start_date: today,
            days_ahead: 8,
          },
        );

        if (response?.data?.data) {
          setSlotsData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching slots:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlots();
  }, [freelancerUuid, productOptionId]);

  // Filter slots to ensure only those after 24 hours from now are shown
  const filteredSlotsData = useMemo(() => {
    const now = new Date();
    const twentyFourHoursFromNow = new Date(
      now.getTime() + 24 * 60 * 60 * 1000,
    );

    return slotsData.map((day) => ({
      ...day,
      available_slots: day.available_slots.filter((slot) => {
        const slotDate = new Date(slot.datetime);
        return slotDate > twentyFourHoursFromNow;
      }),
    }));
  }, [slotsData]);

  // Validate and set selected day based on availability
  useEffect(() => {
    // Wait for slots to load
    if (isLoading || !days.length) return;

    // Check availability of current selection if it exists
    let isSelectionValid = false;
    if (selectedDay) {
      const dayData = filteredSlotsData.find((d) => d.date === selectedDay);
      // Valid if data exists and has slots
      if (dayData && dayData.available_slots.length > 0) {
        isSelectionValid = true;
      }
    }

    // If current selection is valid, maintain it
    if (isSelectionValid) return;

    // If no selection or invalid selection, find the first available day
    // Iterate through 'days' to respect the display order
    for (const day of days) {
      const dateStr = day.date.toISOString().split("T")[0];
      const dayData = filteredSlotsData.find((d) => d.date === dateStr);

      if (dayData && dayData.available_slots.length > 0) {
        setSelectedDay(dateStr);
        return;
      }
    }

    // If we reach here, it means the current selection (if any) is invalid
    // and we couldn't find ANY available day.
    // We should clear the selection so we don't show a disabled day as selected.
    if (selectedDay && !isSelectionValid) {
      setSelectedDay(null);
    }
  }, [days, selectedDay, filteredSlotsData, isLoading, setSelectedDay]);

  // Track previous day to prevent clearing slot on initial mount
  const prevSelectedDay = useRef(selectedDay);

  // Clear selected slot when day changes
  useEffect(() => {
    if (prevSelectedDay.current !== selectedDay) {
      setSelectedSlot(null);
      prevSelectedDay.current = selectedDay;
    }
  }, [selectedDay, setSelectedSlot]);

  // Get time slots for the selected day
  const timeSlots = useMemo(() => {
    if (!selectedDay || !filteredSlotsData.length) return [];

    // const selectedDate = new Date(selectedDay).toISOString().split("T")[0];
    const selectedDate = selectedDay; // Already in correct format

    const dayData = filteredSlotsData.find((d) => d.date === selectedDate);

    if (!dayData || !dayData.available_slots.length) return [];

    // Convert to 12-hour format and show all slots
    return dayData.available_slots.map((slot) =>
      formatTime12Hour(slot.start_time),
    );
  }, [selectedDay, filteredSlotsData]);

  // Validate selected slot against available timeSlots when data loads
  useEffect(() => {
    // If loading or no slot selected, skip
    if (isLoading || !selectedSlot) return;

    // If we have timeSlots and our selected slot is NOT in them, clear it with error
    // Note: timeSlots depends on selectedDay/slotsData.
    // We check length > 0 to ensure we have actually computed slots for the day.
    // If the day is valid but has 0 slots, timeSlots is empty, logic still holds (includes returns false).
    if (!timeSlots.includes(selectedSlot)) {
      // However, timeSlots might be empty if we just switched days and haven't computed yet?
      // timeSlots is a useMemo, so it should be immediate based on dependencies.

      // Additional safety: only clear if we "should" have slots but don't find ours.
      // But if the day is disabled (0 slots), we definitely want to clear.
      setSelectedSlot(null);
      // setSlotError("Selected time is no longer available");
    }
  }, [isLoading, timeSlots, selectedSlot, setSelectedSlot]);

  // Get current month and year for display
  const displayMonth = useMemo(() => {
    const firstDay = days[0]?.date || new Date();
    return firstDay.toLocaleString("en-US", { month: "long", year: "numeric" });
  }, [days]);

  const handleSlotClick = (slot: string) => {
    setSelectedSlot(selectedSlot === slot ? null : slot);
    // Clear error when user selects a slot
    if (selectedSlot !== slot) {
      setSlotError("");
    }
  };

  const handleContinue = () => {
    // Validate slot selection
    if (!selectedSlot) {
      setSlotError("Please select a time slot");
      return;
    }

    // Proceed if slot is selected
    goNext();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-white/60 text-sm">Loading available slots...</div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Choose your time</h3>
      <p className="text-[#EEEEEE] text-xs">{displayMonth}</p>

      <div
        className="mt-4 overflow-x-auto pb-3 overflow-custom"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255, 255, 255, 0.3) rgba(0, 0, 0, 0.1)",
        }}
      >
        <style jsx>{`
          .overflow-custom::-webkit-scrollbar {
            height: 12px;
          }
          .overflow-custom::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 6px;
          }
          .overflow-custom::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 6px;
            cursor: grab;
          }
          .overflow-custom::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5);
          }
          .overflow-custom::-webkit-scrollbar-thumb:active {
            cursor: grabbing;
            background: rgba(255, 255, 255, 0.6);
          }
        `}</style>
        <div className="flex gap-4 px-3">
          {days.map((d: any, index: number) => {
            // const isSelected = selectedDay === d.date.toDateString();
            // const isSelected =
            //   selectedDay === d.date.toISOString().split("T")[0];

            // const dayNum = d.date.getDate();
            // const weekday = d.date.toLocaleString("en-US", {
            //   weekday: "short",
            // });
            // const label = index === 0 ? "Tomorrow" : `${weekday} ${dayNum}`;

            const isoDate = d.date.toISOString().split("T")[0];
            const isSelected = selectedDay === isoDate;
            const dayData = filteredSlotsData.find(
              (slot) => slot.date === isoDate,
            );
            const hasSlots = dayData && dayData.available_slots.length > 0;

            const dayNum = d.date.getDate();
            const weekday = d.date.toLocaleString("en-US", {
              weekday: "short",
            });
            const label = index === 0 ? "Tomorrow" : `${weekday} ${dayNum}`;
            return (
              <div key={index} className="flex flex-col items-center">
                <Button
                  onClick={() =>
                    setSelectedDay(d.date.toISOString().split("T")[0])
                  }
                  disabled={!hasSlots}
                  size="none"
                  variant={isSelected ? "white" : "glass"}
                  borderRadius="rounded-[48px]"
                  className={`w-14 h-14 text-[20px] ${
                    !hasSlots ? "opacity-50" : ""
                  }`}
                  shadow="shadow-[inset_0_4px_4px_0_rgba(210,210,210,0.25)]"
                  blur="backdrop-blur-[94px]"
                >
                  <div className="text-lg">{dayNum}</div>
                </Button>
                <span className="mt-2 text-xs text-purple-200">{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <h3 className="text-sm font-medium mb-2 mt-4">Available slots</h3>
      <p className="text-[#EEEEEE] text-[11px] mb-3">
        Showing available time slots
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3 overflow-y-auto max-h-[220px] content-start overflow-custom pr-1">
        {timeSlots.length > 0 ? (
          timeSlots.map((slot) => (
            <Button
              key={slot}
              type="button"
              onClick={() => handleSlotClick(slot)}
              size="none"
              variant={selectedSlot === slot ? "white" : "glass"}
              borderRadius="rounded-[16px]"
              className={`py-2 h-13 text-xs w-full ${
                selectedSlot !== slot ? "" : ""
              }`}
            >
              {slot}
            </Button>
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-400 text-xs py-4">
            No slots available for this day
          </div>
        )}
      </div>
      {slotError && <p className="mt-1.5 text-xs text-red-500">{slotError}</p>}

      <div className="mt-6">
        <Button
          onClick={handleContinue}
          variant="white"
          size="none"
          borderRadius="rounded-lg"
          className="w-full py-3 text-sm font-bold"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
