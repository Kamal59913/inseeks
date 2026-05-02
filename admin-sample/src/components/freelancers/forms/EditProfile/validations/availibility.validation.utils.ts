import { z } from "zod";

export const SlotSchema = z.object({
  start: z.string().min(1, "Start time required"),
  end: z.string().min(1, "End time required"),
});

export const DaySchema = z.object({
  enabled: z.boolean().default(false),
  slots: z.array(SlotSchema).default([{ start: "09:00", end: "17:00" }]),
});
