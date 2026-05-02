export interface AvailabilitySlot {
  start_time: string;
  end_time: string;
}

export interface DayAvailabilityData {
  day_of_week: number;
  is_enabled: boolean;
  slots: AvailabilitySlot[];
}

export interface AvailabilityResponse {
  success?: boolean;
  message?: string;
  data: DayAvailabilityData[];
}

export interface BulkAvailabilityPayload {
  availability: DayAvailabilityData[];
}
