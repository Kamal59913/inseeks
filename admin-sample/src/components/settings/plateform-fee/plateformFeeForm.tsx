import ComponentCard from "../../common/ComponentCard";
import Label from "@shared/common/components/ui/form/Label.tsx";
import { useGlobalStates } from "../../../redux/hooks/useGlobalStates";
import Button from "../../ui/button/Button";
import { ToastService } from "../../../utils/toastService";
import { useUserData } from "@/redux/hooks/useUserData";
import "react-phone-input-2/lib/style.css";
import { usePlateformFeeForm } from "./hook/plateformFee.form.hook";
import NumberInputV2 from "@shared/common/components/ui/form/input/NumberInputV2.js";
import platformFeeService from "@/api/services/plateformFeeService";

const PlateformFeeForm: React.FC = () => {
  const { isButtonLoading } = useGlobalStates();
  const { userData } = useUserData();
  const formMethods = usePlateformFeeForm(userData?.user?.platform_fee);
  const handleFormSubmit = async (formData: any) => {
    const response: any = await platformFeeService.updateGlobalFee(formData);

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
          <ComponentCard title="Change Plateform Fee">
            <form onSubmit={formMethods.handleSubmit(handleFormSubmit)}>
              <div className="">
                <Label isRequired={true}>Platefrom Fee (In Percentage)</Label>
                <div className="relative">
                  <NumberInputV2
                    placeholder="Platform Fee"
                    registerOptions="plateformFee"
                    register={formMethods?.register}
                    errors={formMethods.formState.errors}
                    autoFocus={true}
                    maxLength={3}
                  />
                </div>
              </div>

              <div className="mt-6">
                <Button
                  type="submit"
                  loadingState={isButtonLoading("update-global-platform-fee")}
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

export default PlateformFeeForm;
