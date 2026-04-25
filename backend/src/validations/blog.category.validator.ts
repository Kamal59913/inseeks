// validations/blog.validation.ts
import { z } from "zod";

export const createBlogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

export const updateBlogSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});
