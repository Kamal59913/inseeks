"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Form,
  FormField,
  FormItem,
  Field,
  FieldError,
  InputGroupInput,
  FieldGroup,
  Button,
  Label,
} from "@repo/ui/index";
import { Lock } from "lucide-react";
import { ModalEntry } from "@/store/useModalStore";
import {
  usePasswordChangeForm,
  PasswordUpdateFormData,
} from "../Settings/PasswordSettings/use-settings-form.hook";
import profileService from "@/lib/api/services/profileService";
import { ToastService } from "@/lib/utilities/toastService";
import { useGlobalStore } from "@/store/useGlobalStore";
import { PASSWORD_POLICY_CONFIG } from "@/lib/config/config";

interface PasswordModalProps {
  modal: ModalEntry;
  onClose: () => void;
}

const PasswordModal = ({ modal, onClose }: PasswordModalProps) => {
  const form = usePasswordChangeForm();
  const { buttonLoaders } = useGlobalStore();

  const onSubmit = async (data: PasswordUpdateFormData) => {
    const payload = {
      current_password: data.currentPassword,
      new_password: data.newPassword,
      confirm_password: data.confirmPassword,
    };

    const response: any = await profileService.upDatePassword(payload);
    if (
      (response.status === 200 || response.status === 201) &&
      response?.data?.status === true
    ) {
      form.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      ToastService.success(
        response?.data?.message || "Password updated successfully",
      );
      onClose();
    } else {
      ToastService.error(
        response?.data?.message ||
          response?.message ||
          "Failed to update password",
      );
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white border-0">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-4"
          >
            <FieldGroup className="space-y-4">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-2">
                    <Label isRequired className="text-sm font-medium text-gray-700">
                      Old Password
                    </Label>
                    <Field data-invalid={fieldState.invalid}>
                      <InputGroupInput
                        {...field}
                        type="password"
                        placeholder="Old Password"
                        noOfSpaceAllowed={0}
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
                    <Label isRequired className="text-sm font-medium text-gray-700">
                      New Password
                    </Label>
                    <Field data-invalid={fieldState.invalid}>
                      <InputGroupInput
                        {...field}
                        type="password"
                        placeholder="New Password"
                        noOfSpaceAllowed={0}
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
                    <Label isRequired className="text-sm font-medium text-gray-700">
                      Confirm Password
                    </Label>
                    <Field data-invalid={fieldState.invalid}>
                      <InputGroupInput
                        {...field}
                        type="password"
                        placeholder="Confirm Password"
                        noOfSpaceAllowed={0}
                        maxLength={PASSWORD_POLICY_CONFIG.INPUT_MAX_LENGTH}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  </FormItem>
                )}
              />
            </FieldGroup>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="bg-primary text-white hover:bg-primary/90 flex items-center gap-2"
                loadingState={buttonLoaders["change-password"]}
              >
                <Lock className="w-4 h-4" />
                Update Password
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordModal;
