import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const useAppForm = ({
  schema,
  defaultValues,
  mode = "onChange",
  reValidateMode = "onChange",
  ...options
}) =>
  useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode,
    reValidateMode,
    shouldFocusError: false,
    ...options,
  });
