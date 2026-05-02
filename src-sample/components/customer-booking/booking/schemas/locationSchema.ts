import * as z from "zod";

export const locationSchema = z.object({
  line1: z.string().min(1, "Address line 1 is required"),
  line2: z.string().optional(),
  postal: z.string().min(1, "Postal code is required"),
  city: z.string().min(1, "City is required"),
});

export type LocationFormValues = z.infer<typeof locationSchema>;

