import {
  Button,
  Form,
  FormField,
  FormItem,
  Field,
  FieldError,
  InputGroupInput,
  FieldGroup,
  Label,
} from "@repo/ui/index";
import { Lock } from "lucide-react";
import React from "react";
import {
  usePasswordChangeForm,
  PasswordUpdateFormData,
} from "./use-settings-form.hook";
import profileService from "@/lib/api/services/profileService";
import { ToastService } from "@/lib/utilities/toastService";
import { useGlobalStore } from "@/store/useGlobalStore";
import { PASSWORD_POLICY_CONFIG } from "@/lib/config/config";

const PasswordSettings = () => {
  const form = usePasswordChangeForm();
  const { buttonLoaders } = useGlobalStore();

  const onSubmit = async (data: PasswordUpdateFormData) => {
    const payload = {
      current_password: data.currentPassword,
      new_password: data.newPassword,
      confirm_password: data.confirmPassword,
    };

    const response: any = await profileService.upDatePassword(payload);
    if ((response.status === 200 || response.status === 201) && response?.data?.status === true) {
      form.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      ToastService.success(response?.data?.message || "Password updated successfully");
    } else {
      ToastService.error(response?.data?.message || response?.message || "Failed to update password");
    }
  };

  return (
    <div className="px-3 border-gray-100 mt-4">
      <div className="bg-[#fcf7fe] p-3 rounded-lg">
        <h3 className="mb-1 font-semibold text-gray-900">Change Password</h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-2">
                      <Label isRequired className="text-sm text-gray-700">
                        Old Password
                      </Label>
                      <Field data-invalid={fieldState.invalid}>
                        <InputGroupInput
                          {...field}
                          type="password"
                          placeholder="Old Password"
                          className="bg-white hover:bg-white-50 "
                          maxLength={PASSWORD_POLICY_CONFIG.INPUT_MAX_LENGTH}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-2">
                      <Label isRequired className="text-sm text-gray-700">
                        New Password
                      </Label>
                      <Field data-invalid={fieldState.invalid}>
                        <InputGroupInput
                          {...field}
                          type="password"
                          placeholder="New Password"
                          className="bg-white hover:bg-white-50 "
                          maxLength={PASSWORD_POLICY_CONFIG.INPUT_MAX_LENGTH}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-2">
                      <Label isRequired className="text-sm text-gray-700">
                        Confirm Password
                      </Label>
                      <Field data-invalid={fieldState.invalid}>
                        <InputGroupInput
                          {...field}
                          type="password"
                          placeholder="Confirm Password"
                          className="bg-white hover:bg-white-50 "
                          maxLength={PASSWORD_POLICY_CONFIG.INPUT_MAX_LENGTH}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    </FormItem>
                  )}
                />
              </div>
            </FieldGroup>

            <div className="pt-2">
              <Button
                type="submit"
                className="bg-[#F3E8FF] text-[#AF52DE] hover:bg-[#F3E8FF]/80 flex items-center justify-center gap-2"
                size="sm"
                loadingState={buttonLoaders["change-password"]}
              >
                <Lock style={{ width: "16px", height: "16px" }} />
                Change Password
              </Button>

              
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PasswordSettings;
