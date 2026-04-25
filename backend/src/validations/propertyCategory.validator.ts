import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string({
    required_error: "Category name is required",
  }).min(3, "Category name must be at least 3 characters"),

  description: z.string().optional(),

  status: z.enum(["active", "inactive", "archived"]).optional(),

  parentCategory: z.string().optional(), // ObjectId as string

  showInMenu: z.boolean().optional(),

  isHomepageCat: z.boolean().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(3).optional(),

  description: z.string().optional(),

  status: z.enum(["active", "inactive", "archived"]).optional(),

  parentCategory: z.string().optional(),

  showInMenu: z.boolean().optional(),

  isHomepageCat: z.boolean().optional(),
});
