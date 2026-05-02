import {
  Button,
  Form,
  FormField,
  FormItem,
  Field,
  FieldError,
  InputGroupInput,
  FieldGroup,
  Label
} from "@repo/ui/index";
import { useSettingsForm } from "./use-settings-form.hook";
import { SettingsValidationType } from "./settings.validation";
import { useAuthStore } from "@/store/useAuthStore";
import profileService from "@/lib/api/services/profileService";
import { ToastService } from "@/lib/utilities/toastService";
import { useGlobalStore } from "@/store/useGlobalStore";

const AccountSettings = () => {
  const { userData, fetchCurrentUser } = useAuthStore();
  const { buttonLoaders } = useGlobalStore();
  const form = useSettingsForm(userData);

  const onSubmit = async (data: SettingsValidationType) => {
    const payload = {
      username: data.username,
      phone: data.phoneData?.phoneNumber || data.phone,
      country_code: data.phoneData?.countryCode.replace("+", "") || "91",
      email: data.email,
    };

    const response: any = await profileService.updateAccountDetails(payload);

    if (response?.status === true || response?.status === 200) {
      ToastService.success(
        response?.data?.message ||
          response?.message ||
          "Settings updated successfully",
      );
      await fetchCurrentUser();
    } else {
      ToastService.error(
        response?.data?.message ||
          response?.message ||
          "Failed to update settings",
      );
    }
  };

  return (
    <div className="px-3 border-gray-100 mt-4">
      <div className="bg-[#fcf7fe] p-3 rounded-lg">
        <h3 className="mb-1 font-semibold text-gray-900">Account Settings</h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-2">
                      <Label className="text-sm text-gray-700">Username</Label>
                      <Field data-invalid={fieldState.invalid}>
                        <InputGroupInput
                          {...field}
                          placeholder="Username"
                          className="bg-white hover:bg-white-50 "
                          autoFocus={true}
                          noOfSpaceAllowed={0}
                          maxLength={51}
                          disabled={true}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name="phone"
                  render={({ field: { onChange }, fieldState }) => (
                    <FormItem className="space-y-2">
                      <label className="text-sm text-gray-700">Phone</label>
                      <Field data-invalid={fieldState.invalid}>
                        <PhoneInput
                          containerClass="w-full"
                          inputClass="!w-full !h-[40px]"
                          country="in"
                          value={form.getValues("phoneData.phoneNumber")}
                          disabled={true}
                          hideDropdown={true}
                          disableCountryCode={true}
                          placeholder="800 123-4567"
                          onChange={(phone: string, country: any) => {
                            // Store both phone and country data
                            const dialCode = country?.dialCode || "";
                            form.setValue("phoneData", {
                              fullPhone: dialCode + phone,
                              countryCode: dialCode,
                              phoneNumber: phone,
                            });
                            onChange(dialCode + phone); // Keep the full phone in the main field
                          }}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    </FormItem>
                  )}
                /> */}
                <FormField
                  control={form.control}
                  name="phoneData.phoneNumber"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-2">
                      <Label className="text-sm text-gray-700">Phone</Label>
                      <Field data-invalid={fieldState.invalid}>
                        <InputGroupInput
                          {...field}
                          placeholder="Phone"
                          className="bg-white hover:bg-white-50 "
                          noOfSpaceAllowed={0}
                          maxLength={151}
                          disabled={true}
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
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-2">
                      <Label className="text-sm text-gray-700">Email</Label>
                      <Field data-invalid={fieldState.invalid}>
                        <InputGroupInput
                          {...field}
                          placeholder="Email"
                          className="bg-white hover:bg-white-50 "
                          noOfSpaceAllowed={0}
                          maxLength={151}
                          disabled={true}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-2">
                      <label className="text-sm text-gray-700">Password</label>
                      <Field data-invalid={fieldState.invalid}>
                        <InputGroupInput
                          {...field}
                          type="password"
                          placeholder="Password"
                          className="bg-white hover:bg-white-50 "
                          noOfSpaceAllowed={0}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    </FormItem>
                  )}
                /> */}
              </div>
            </FieldGroup>

            <div className="pt-2">
              <Button
                type="submit"
                size="sm"
                loadingState={buttonLoaders["update-account"]}
              >
                Update
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AccountSettings;
