import { validationUtils } from "@/utils/validation";
import { z } from "zod";

export const ServiceCategoryValidation = () => {

  return z.object({
    name: validationUtils?.customField("service category name", 3, 50),
    description:  validationUtils?.customField("service category description", 10, 300),
    status: validationUtils?.boolean()
  });
};

export type ServiceCategoryValidationType = z.infer<ReturnType<typeof ServiceCategoryValidation>>;
