"use client";
import { Plus, Trash2 } from "lucide-react";
import Switch from "@/components/ui/form/Switch";
import TimeInput from "@/components/ui/form/TimeInput";
import { Day, DayAvailability } from "./types";

interface AvailabilityDayRowProps {
  day: Day;
  label: string;
  data: DayAvailability;
  onToggle: (day: Day) => void;
  onUpdateSlot: (
    day: Day,
    index: number,
    field: "start" | "end",
    value: string,
  ) => void;
  onAddSlot: (day: Day) => void;
  onRemoveSlot: (day: Day, index: number) => void;
}

export default function AvailabilityDayRow({
  day,
  label,
  data,
  onToggle,
  onUpdateSlot,
  onAddSlot,
  onRemoveSlot,
}: AvailabilityDayRowProps) {
  return (
    <div className="flex flex-col gap-3 py-6 border-b border-white/10 last:border-0 lg:flex-row lg:items-start lg:gap-8">
      {/* Day Label & Toggle */}
      <div className="flex items-center justify-between min-w-[140px] lg:pt-2">
        <span className="font-medium text-white/90">{label}</span>
        <Switch
          name={`enabled-${day}`}
          value={data.enabled}
          onChange={() => onToggle(day)}
        />
      </div>

      {/* Slots Container */}
      <div className="flex-1">
        {!data.enabled ? (
          <div className="text-gray-500 py-2 italic text-sm">Unavailable</div>
        ) : (
          <div className="space-y-4">
            {data.slots.map((slot, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
                  <TimeInput
                    registerOptions={`start-${day}-${index}`}
                    value={slot.start}
                    onChange={(e) =>
                      onUpdateSlot(day, index, "start", e.target.value)
                    }
                  />
                  <span className="text-gray-500 px-1">—</span>
                  <TimeInput
                    registerOptions={`end-${day}-${index}`}
                    value={slot.end}
                    onChange={(e) =>
                      onUpdateSlot(day, index, "end", e.target.value)
                    }
                  />
                </div>

                {data.slots.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveSlot(day, index)}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => onAddSlot(day)}
              className="flex items-center gap-2 text-primary-soft hover:text-white text-sm font-medium transition-colors mt-2"
            >
              <Plus size={16} />
              Add more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
