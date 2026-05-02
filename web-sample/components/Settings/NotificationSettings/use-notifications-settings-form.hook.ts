import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  NotificationsSettingsValidation,
  NotificationsSettingsValidationType,
} from "./notifications-settings.validation";

export const useNotificationsSettingsForm = (initialData?: any) => {
  const formMethods = useForm<NotificationsSettingsValidationType>({
    shouldFocusError: false,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(NotificationsSettingsValidation as any),
    defaultValues: {
      pause_all: initialData?.pause_all || false,
      is_enable_likes: initialData?.is_enable_likes || false,
      is_enable_comments: initialData?.is_enable_comments || false,
      is_enable_follows: initialData?.is_enable_follows || false,
      is_enable_system: initialData?.is_enable_system || false,
      is_enable_reposts: initialData?.is_enable_reposts || false,
    },
  });

  useEffect(() => {
    if (initialData) {
      formMethods.reset({
        pause_all: initialData?.pause_all || false,
        is_enable_likes: initialData?.is_enable_likes || false,
        is_enable_comments: initialData?.is_enable_comments || false,
        is_enable_follows: initialData?.is_enable_follows || false,
        is_enable_system: initialData?.is_enable_system || false,
        is_enable_reposts: initialData?.is_enable_reposts || false,
      });
    }
  }, [initialData]);

  return formMethods;
};
