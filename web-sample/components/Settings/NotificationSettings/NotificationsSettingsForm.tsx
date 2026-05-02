import React, { useEffect } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  Switch,
  FieldGroup,
} from "@repo/ui/index";
import {
  User,
  Heart,
  MessageCircle,
  Users,
  Settings2,
  Repeat,
  AlertCircle,
} from "lucide-react";
import { useNotificationsSettingsForm } from "./use-notifications-settings-form.hook";
import { NotificationsSettingsValidationType } from "./notifications-settings.validation";
import notificationService from "@/lib/api/services/notificationService";
import { ToastService } from "@/lib/utilities/toastService";
import { useGlobalStore } from "@/store/useGlobalStore";

const NotificationsSettings = () => {
  const [permissionStatus, setPermissionStatus] =
    React.useState<NotificationPermission>(
      typeof window !== "undefined" ? Notification.permission : "default",
    );

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check permission status periodically or on mount
    setPermissionStatus(Notification.permission);
  }, []);
  const startButtonLoading = useGlobalStore(
    (state) => state.startButtonLoading,
  );
  const stopButtonLoading = useGlobalStore((state) => state.stopButtonLoading);

  const form = useNotificationsSettingsForm();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response: any =
          await notificationService.getNotificationSettings();
        if (response?.status === true) {
          form.reset(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch notification settings", error);
      }
    };

    fetchSettings();
  }, [form]);

  const onSubmit = async (data: NotificationsSettingsValidationType) => {
    startButtonLoading("update-notification-settings");
    try {
      const response: any =
        await notificationService.updateNotificationSettings(data);
      if (response?.status === true) {
        ToastService.success("Notification settings updated successfully");
      } else {
        throw new Error(response?.message || "Failed to update settings");
      }
    } catch (error: any) {
      ToastService.error(
        error?.message || "Failed to update notification settings",
      );
    } finally {
      stopButtonLoading("update-notification-settings");
    }
  };

  return (
    <div className="px-3 border-gray-100 mt-3">
      <div className="bg-[#fcf7fe] p-3 rounded-lg">
        <h3 className="mb-3 font-semibold text-gray-900">
          Notifications Settings
        </h3>

        {/* {permissionStatus === "denied" && ( */}
        <div className="mb-4 p-3 bg-white rounded-lg flex items-start gap-3">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">
              Notifications are blocked
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Click the lock icon in your browser's address bar and set
              Notifications to "Allow" to receive updates.
            </p>
          </div>
        </div>
        {/* )} */}

        <Form {...form}>
          <form
            id="notifications-settings-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                {/* Pause All */}
                <FormField
                  control={form.control}
                  name="pause_all"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between py-2 bg-white px-3 rounded-lg">
                      <div className="flex items-center gap-3 m-0">
                        <User className="w-5 h-5 text-gray-500" />
                        <FormLabel className="text-gray-700 text-sm leading-relaxed">
                          Pause All
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          name={field.name}
                          value={field.value}
                          onChange={(val) => {
                            field.onChange(val);
                            // Trigger submit with the newly updated value
                            form.handleSubmit((currentData) =>
                              onSubmit({ ...currentData, [field.name]: val }),
                            )();
                          }}
                          size="sm"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Likes */}
                <FormField
                  control={form.control}
                  name="is_enable_likes"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between py-2 bg-white px-3 rounded-lg">
                      <div className="flex items-center gap-3 m-0">
                        <Heart className="w-5 h-5 text-gray-500" />
                        <FormLabel className="text-gray-700 text-sm leading-relaxed">
                          Likes
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          name={field.name}
                          value={field.value}
                          onChange={(val) => {
                            field.onChange(val);
                            // Trigger submit with the newly updated value
                            form.handleSubmit((currentData) =>
                              onSubmit({ ...currentData, [field.name]: val }),
                            )();
                          }}
                          size="sm"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Comments */}
                <FormField
                  control={form.control}
                  name="is_enable_comments"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between py-2 bg-white px-3 rounded-lg">
                      <div className="flex items-center gap-3 m-0">
                        <MessageCircle className="w-5 h-5 text-gray-500" />
                        <FormLabel className="text-gray-700 text-sm leading-relaxed">
                          Comments
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          name={field.name}
                          value={field.value}
                          onChange={(val) => {
                            field.onChange(val);
                            // Trigger submit with the newly updated value
                            form.handleSubmit((currentData) =>
                              onSubmit({ ...currentData, [field.name]: val }),
                            )();
                          }}
                          size="sm"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Follows */}
                <FormField
                  control={form.control}
                  name="is_enable_follows"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between py-2 bg-white px-3 rounded-lg">
                      <div className="flex items-center gap-3 m-0">
                        <Users className="w-5 h-5 text-gray-500" />
                        <FormLabel className="text-gray-700 text-sm leading-relaxed">
                          New Followers
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          name={field.name}
                          value={field.value}
                          onChange={(val) => {
                            field.onChange(val);
                            // Trigger submit with the newly updated value
                            form.handleSubmit((currentData) =>
                              onSubmit({ ...currentData, [field.name]: val }),
                            )();
                          }}
                          size="sm"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* System */}
                <FormField
                  control={form.control}
                  name="is_enable_system"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between py-2 bg-white px-3 rounded-lg">
                      <div className="flex items-center gap-3 m-0">
                        <Settings2 className="w-5 h-5 text-gray-500" />
                        <FormLabel className="text-gray-700 text-sm leading-relaxed">
                          System
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          name={field.name}
                          value={field.value}
                          onChange={(val) => {
                            field.onChange(val);
                            // Trigger submit with the newly updated value
                            form.handleSubmit((currentData) =>
                              onSubmit({ ...currentData, [field.name]: val }),
                            )();
                          }}
                          size="sm"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Repost */}
                <FormField
                  control={form.control}
                  name="is_enable_reposts"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between py-2 bg-white px-3 rounded-lg">
                      <div className="flex items-center gap-3 m-0">
                        <Repeat className="w-5 h-5 text-gray-500" />
                        <FormLabel className="text-gray-700 text-sm leading-relaxed">
                          Repost
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          name={field.name}
                          value={field.value}
                          onChange={(val) => {
                            field.onChange(val);
                            // Trigger submit with the newly updated value
                            form.handleSubmit((currentData) =>
                              onSubmit({ ...currentData, [field.name]: val }),
                            )();
                          }}
                          size="sm"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </FieldGroup>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NotificationsSettings;
