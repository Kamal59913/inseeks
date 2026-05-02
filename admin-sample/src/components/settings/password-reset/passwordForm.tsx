import ComponentCard from "../../../components/common/ComponentCard";
import Label from "@shared/common/components/ui/form/Label.tsx";
import { useGlobalStates } from "../../../redux/hooks/useGlobalStates";
import Button from "../../../components/ui/button/Button";
import { ToastService } from "../../../utils/toastService";
import profileService from "../../../api/services/profileService";
import { usePasswordForm } from "./validation/usePassword.form.hook";
import { PasswordInput } from "@shared/common/components/ui/form/input/PasswordInput.tsx";

const PasswordForm: React.FC = () => {
  const { isButtonLoading } = useGlobalStates();

  const formMethods = usePasswordForm();

  const handleFormSubmit = async (formData: any) => {
    const response: any = await profileService.upDatePassword(formData);
    if (response.status === 201) {
      formMethods.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      ToastService.success(response.data.message || "Operation succeeded");
    } else {
      // formMethods.reset({
      //   currentPassword: "",
      //   newPassword: "",
      //   confirmPassword: "",
      // });
      ToastService.error(response.data.message || "Operation Failed");
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="">
          <ComponentCard title="Change Password">
            <form onSubmit={formMethods.handleSubmit(handleFormSubmit)}>
              <div className="">
                <Label isRequired={true}>Old Password</Label>
                <div className="relative">
                  <PasswordInput
                    register={formMethods?.register}
                    registerOptions="currentPassword"
                    errors={formMethods.formState.errors}
                    placeholder="Enter your password"
                    maxLength={65}
                  />
                </div>
              </div>

              <div className="mt-5">
                <Label isRequired={true}>New Password</Label>
                <div className="relative">
                  <PasswordInput
                    register={formMethods?.register}
                    registerOptions="newPassword"
                    errors={formMethods.formState.errors}
                    placeholder="Enter your password"
                    maxLength={65}
                  />
                </div>
              </div>
              <div className="mt-5">
                <Label isRequired={true}>Confirm Password</Label>
                <div className="relative">
                  <PasswordInput
                    register={formMethods?.register}
                    registerOptions="confirmPassword"
                    errors={formMethods.formState.errors}
                    placeholder="Enter your password"
                    maxLength={65}
                  />
                </div>
              </div>
              <div className="mt-6">
                <Button
                  type="submit"
                  loadingState={isButtonLoading("update-password")}
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

export default PasswordForm;
