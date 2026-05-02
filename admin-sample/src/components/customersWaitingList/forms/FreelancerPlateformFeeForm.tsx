import PageMeta from "../../common/PageMeta";
import ComponentCard from "../../common/ComponentCard";
import { useGlobalStates } from "../../../redux/hooks/useGlobalStates";
import Button from "../../ui/button/Button";
import { ToastService } from "../../../utils/toastService";
import { HEADER_CONFIG } from "../../../config/headerName";
import PageBreadcrumbButton from "../../common/PageBreadCrumbButton";
import Label from "@shared/common/components/ui/form/Label.tsx";
import NumberInputV2 from "@shared/common/components/ui/form/input/NumberInputV2.tsx";
import { usePlateformFeeForm } from "@/components/settings/plateform-fee/hook/plateformFee.form.hook";
import platformFeeService from "@/api/services/plateformFeeService";
import { useParams } from "react-router-dom";
import { useGetFreelancersPlateformFee } from "@/hooks/queries/freelancers/useGetFreelancersPlateformFee";

interface FreelancerPlateformFeeFormProps {
  role: string;
}

const FreelancerPlateformFeeForm: React.FC<FreelancerPlateformFeeFormProps> = ({
  role,
}) => {
  const { isButtonLoading } = useGlobalStates();
  const { id } = useParams<{ id: string }>();
  const isEditMode = role === "edit" && !!id;

  const { data: freelancerPlateformFee } = useGetFreelancersPlateformFee(
    id || "",
    {
      enabled: isEditMode,
    }
  );

  const formMethods = usePlateformFeeForm(freelancerPlateformFee?.data?.data?.platform_fee || 0);

  const handleFormSubmit = async (formData: any) => {
    console.log("this is the formData");
    if (!id) {
      ToastService.error(
        "Freelancer ID is missing. Unable to update platform fee."
      );
      return;
    }

    const response: any = await platformFeeService.updateFreelancerFee(
      id,
      formData
    );

    if (response.status === 201) {
      ToastService.success(response.data.message || "Operation succeeded");
    } else {
      ToastService.error(response.data.message || "Operation Failed");
    }
  };

  return (
    <>
      <PageMeta
        title={`Change Plateform Fee | ${HEADER_CONFIG.NAME}`}
        description="Change Plateform Fee"
      />
      <PageBreadcrumbButton
        pageTitle={`Change Plateform Fee`}
        destination_name="Change Plateform Fee"
        destination_path="freelancers"
        is_reverse={true}
      />

      <form onSubmit={formMethods.handleSubmit(handleFormSubmit)}>
        <ComponentCard title={`Change Plateform Fee`}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="cstm-input">
                <Label isRequired={true}>Platefrom Fee (In Percentage)</Label>
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
          </div>
        </ComponentCard>

        <div className="mt-6">
          <Button
            type="submit"
            loadingState={isButtonLoading("update-freelancer-platform-fee")}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </>
  );
};

export default FreelancerPlateformFeeForm;
