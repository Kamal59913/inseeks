import { z } from "zod";

const SlotSchema = z.object({
  start: z.string().min(1, "Start time required"),
  end: z.string().min(1, "End time required"),
});

const DaySchema = z.object({
  enabled: z.boolean().default(false),
  slots: z.array(SlotSchema).default([{ start: "09:00", end: "17:00" }]),
});

export const AvailabilityValidation = () =>
  z.object({
    calendars: z
      .array(
        z.object({
          id: z.string(),
          email: z.string().email(),
        })
      )
      .optional()
      .default([]),
    availability: z.object({
      monday: DaySchema,
      tuesday: DaySchema,
      wednesday: DaySchema,
      thursday: DaySchema,
      friday: DaySchema,
      saturday: DaySchema,
      sunday: DaySchema,
    }),
  });

export type AvailabilityValidationType = z.infer<
  ReturnType<typeof AvailabilityValidation>
>;
