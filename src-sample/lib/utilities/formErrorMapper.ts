import { UseFormSetError, FieldValues, Path } from "react-hook-form";
import { BadResponse } from "@/types/api/response.types";

/**
 * Utility to map server validation errors to react-hook-form fields.
 * Assumes the server returns errors in the format: { errors: { field_name: ["error message"] } }
 * or directly in the message field if it's a single string.
 */
export const setFormErrors = <T extends FieldValues>(
  errorResponse: BadResponse,
  setError: UseFormSetError<T>,
) => {
  const serverErrors = errorResponse.data?.errors;

  if (serverErrors && typeof serverErrors === "object") {
    Object.entries(serverErrors).forEach(([field, messages]) => {
      const message = Array.isArray(messages) ? messages[0] : String(messages);

      // We cast 'field' to Path<T> as we trust the mapping for this utility
      setError(field as Path<T>, {
        type: "server",
        message: message,
      });
    });
    return true;
  }

  return false;
};
