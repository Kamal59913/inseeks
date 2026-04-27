import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormProps } from "react-hook-form";
import { ZodType, ZodTypeDef } from "zod";

interface UseAppFormOptions<TSchema extends ZodType<any, ZodTypeDef, any>>
  extends Omit<UseFormProps<any>, "resolver"> {
  schema: TSchema;
}

export const useAppForm = <TSchema extends ZodType<any, ZodTypeDef, any>>({
  schema,
  defaultValues,
  mode = "onChange",
  reValidateMode = "onChange",
  ...options
}: UseAppFormOptions<TSchema>) =>
  useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode,
    reValidateMode,
    shouldFocusError: false,
    ...options,
  });
