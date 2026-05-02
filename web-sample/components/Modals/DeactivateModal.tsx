"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Form,
  FormField,
  FormItem,
  Field,
  FieldError,
  FieldGroup,
  InputGroupInput,
  Button,
} from "@repo/ui/index";
import { ModalEntry } from "@/store/useModalStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useRouter } from "next/navigation";
import { ToastService } from "@/lib/utilities/toastService";
import authService from "@/lib/api/services/authService";
import { PASSWORD_POLICY_CONFIG } from "@/lib/config/config";

const DeactivateSchema = z.object({
  password: z
    .string()
    .min(1, "Password is required")
    .max(
      PASSWORD_POLICY_CONFIG.MAX_LENGTH,
      `Password cannot exceed ${PASSWORD_POLICY_CONFIG.MAX_LENGTH} characters`,
    ),
});

type DeactivateFormData = z.infer<typeof DeactivateSchema>;

interface DeactivateModalProps {
  modal: ModalEntry;
  onClose: () => void;
}

const DeactivateModal = ({ modal, onClose }: DeactivateModalProps) => {
  const { userData, logout } = useAuthStore();
  const { buttonLoaders } = useGlobalStore();
  const router = useRouter();

  const isLoading = buttonLoaders["deactivate-account"] || false;

  const form = useForm<DeactivateFormData>({
    resolver: zodResolver(DeactivateSchema),
    mode: "onChange",
    defaultValues: { password: "" },
  });

  const onSubmit = async (data: DeactivateFormData) => {
    const response = await authService.deactivateAccount({
      username: userData?.username,
      password: data.password,
    });

    if (response?.status === 200 || response?.status === 201) {
      console.log("this is the response", response);
      ToastService.success("Account deactivated successfully.");
      onClose();
      logout();
      router.push("/");
    } else {
      const msg =
        response?.data?.detail?.message ||
        response?.data?.message ||
        "Failed to deactivate account.";
      ToastService.error(msg);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[360px] px-6 py-8 bg-white border-0 shadow-xl rounded-3xl overflow-hidden items-center">
        <DialogTitle className="sr-only">Confirm Deactivation</DialogTitle>

        <div className="flex flex-col items-center text-center space-y-6 w-full">
          <div className="space-y-2">
            <h3 className="text-[22px] font-[500] text-gray-900 mb-2">
              Deactivate Account?
            </h3>
            <p className="text-gray-500 text-[15px]">
              Your account will be permanently deleted after{" "}
              <span className="font-semibold text-gray-700">90 days</span>.
              Enter your password to confirm.
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4"
            >
              <FieldGroup>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <Field data-invalid={fieldState.invalid}>
                        <InputGroupInput
                          {...field}
                          type="password"
                          placeholder="Enter your password"
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

              <div className="flex flex-col w-full pt-1 gap-2">
                <Button
                  type="submit"
                  className="px-6 text-white font-semibold transition-all active:scale-[0.98] rounded-lg"
                  variant="destructive"
                  loadingState={isLoading}
                  disabled={isLoading}
                >
                  Deactivate
                </Button>
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  className="px-6 font-semibold transition-all active:scale-[0.98] rounded-lg"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeactivateModal;
