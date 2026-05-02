export type Day =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface Slot {
  start: string;
  end: string;
}

export interface DayAvailability {
  enabled: boolean;
  slots: Slot[];
}

export interface AvailabilityValidationType {
  availability: Record<Day, DayAvailability>;
}
