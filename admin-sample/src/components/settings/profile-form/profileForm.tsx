import ComponentCard from "../../../components/common/ComponentCard";
import Label from "@shared/common/components/ui/form/Label.tsx";
import { useGlobalStates } from "../../../redux/hooks/useGlobalStates";
import Input from "@shared/common/components/ui/form/input/InputField.tsx";
import Button from "../../../components/ui/button/Button";
import { ToastService } from "../../../utils/toastService";
import profileService from "../../../api/services/profileService";
import { useProfileForm } from "./hook/useProfile.form.hook";
import { Controller } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useUserData } from "@/redux/hooks/useUserData";
import EmailInput from "@shared/common/components/ui/form/input/EmailInputField.js";

const ProfileForm: React.FC = () => {
  const { isButtonLoading } = useGlobalStates();
  const { userData } = useUserData();
  const formMethods = useProfileForm(userData);
  const handleFormSubmit = async (formData: any) => {
    const response: any = await profileService.upDateProfile(formData);

    if (response.status === 201) {
      ToastService.success(response.data.message || "Operation succeeded");
    } else {
      ToastService.error(response.data.message || "Operation Failed");
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="">
          <ComponentCard title="Update Profile">
            <form onSubmit={formMethods.handleSubmit(handleFormSubmit)}>
              <div className="">
                <Label isRequired={true}>First Name</Label>
                <div className="relative">
                  <Input
                    placeholder="First name"
                    registerOptions="firsName"
                    register={formMethods?.register}
                    errors={formMethods.formState.errors}
                    autoFocus={true}
                    maxLength={51}
                  />
                </div>
              </div>
              <div className="mt-5">
                <Label isRequired={true}>Last Name</Label>
                <div className="relative">
                  <Input
                    placeholder="Last name"
                    registerOptions="lastName"
                    register={formMethods?.register}
                    errors={formMethods.formState.errors}
                    maxLength={51}
                  />
                </div>
              </div>
              <div className="mt-5">
                <Label isRequired={true}>Username</Label>
                <div className="relative">
                  <Input
                    placeholder="Username"
                    registerOptions="userName"
                    register={formMethods?.register}
                    errors={formMethods.formState.errors}
                    maxLength={51}
                  />
                </div>
              </div>

              <div className="mt-5">
                <Label isRequired={false}>Email</Label>
                <div className="relative">
                  <EmailInput
                    placeholder="Email"
                    registerOptions="email"
                    register={formMethods?.register}
                    errors={formMethods.formState.errors}
                    maxLength={151}
                    disabled={true}
                  />
                </div>
              </div>

              <div className="mt-5">
                <Label isRequired={true}>Phone</Label>
                <div className="relative">
                  <Controller
                    name="phone"
                    control={formMethods.control}
                    render={({ field: { onChange, value } }) => (
                      <PhoneInput
                        containerClass="w-full"
                        inputClass="!w-full !h-[44px]"
                        country="gb"
                        value={value}
                        onChange={(phone, country: any) => {
                          // Store both phone and country data
                          formMethods.setValue("phoneData", {
                            fullPhone: phone,
                            countryCode: `+${country.dialCode}`,
                            phoneNumber: phone.replace(country.dialCode, ""),
                          });
                          onChange(phone);
                        }}
                        placeholder="1 (800) 123-4567"
                      />
                    )}
                  />
                  {formMethods?.formState?.errors.phone && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {formMethods?.formState?.errors?.phone?.message?.toString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-6">
                <Button
                  type="submit"
                  loadingState={isButtonLoading("update-profile")}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </ComponentCard>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
