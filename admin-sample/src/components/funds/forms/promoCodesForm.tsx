import PageMeta from "../../common/PageMeta";
import ComponentCard from "../../common/ComponentCard";
import { useGlobalStates } from "../../../redux/hooks/useGlobalStates";
import Button from "../../ui/button/Button";
import { ToastService } from "../../../utils/toastService";
import { HEADER_CONFIG } from "../../../config/headerName";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PageBreadcrumbButton from "../../common/PageBreadCrumbButton";
import serviceCategoryService from "@/api/services/serviceCategoryService";
// import { useServiceCategoriesById } from "@/hooks/queries/serviceCategories/useServiceCategoriesById";
import Label from "@shared/common/components/ui/form/Label.tsx";
import Input from "@shared/common/components/ui/form/input/InputField.tsx";
import { usePromoCodeForm } from "./hook/promoCode.form.hook";
import NumberInputV2 from "@shared/common/components/ui/form/input/NumberInputV2.js";
import { Controller } from "react-hook-form";
import Switch from "@shared/common/components/ui/form/switch/Switch.js";
import promoCodeService from "@/api/services/promoCodeService";
import DatePicker from "@shared/common/components/ui/form/date-picker/date-picker-input.js";

interface PromoCodesFormProps {
  role: string;
}

const PromoCodesForm: React.FC<PromoCodesFormProps> = ({ role }) => {
  const { isButtonLoading } = useGlobalStates();
  const { id } = useParams<{ id: string }>();

  const isEditMode = role === "edit" && !!id;

  const navigate = useNavigate();
  // const { data: singleServiceCategoryData } = useServiceCategoriesById(
  //   id || "",
  //   {
  //     enabled: isEditMode,
  //   }
  // );

  const formMethods = usePromoCodeForm(
    role,
    // singleServiceCategoryData?.data?.data
  );

  const handleFormSubmit = async (formData: any) => {
    const response = isEditMode
      ? await serviceCategoryService.updateServiceCategoriesById(formData, id)
      : await promoCodeService.createPromoCode(formData);

    if (response.status === 201) {
      ToastService.success(response?.data?.message || "Operation succeeded");
      navigate("/promo-code-management");
    } else if (response.status === 200) {
      ToastService.success(
        response.data.message || "Profile updated successfully"
      );
    } else {
      ToastService.error(response?.data?.message || "Operation Failed");
    }
  };

  return (
    <>
      <PageMeta
        title={`Add a Promo Code | ${HEADER_CONFIG.NAME}`}
        description="Add a Promo Code"
      />
      <PageBreadcrumbButton
        pageTitle={`${isEditMode ? "Edit Promo Code" : "Create Promo Code"}`}
        destination_name="Promo Code"
        destination_path="promo-code-management"
        is_reverse={true}
      />

      <form onSubmit={formMethods.handleSubmit(handleFormSubmit)}>
        <ComponentCard
          title={`${isEditMode ? "Edit Promo Code" : "Add Promo Code"}`}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="cstm-input">
                <Label isRequired={true}>Code</Label>
                 <Input
                    placeholder="Code"
                    registerOptions="code"
                    register={formMethods?.register}
                    errors={formMethods.formState.errors}
                    autoFocus={true}
                    maxLength={11}
                  />
              </div>

              <div className="cstm-input">
                <Label isRequired={true}>Discount Percentage</Label>
                <NumberInputV2
                    placeholder="Discount Percentage"
                    registerOptions="discount_percent"
                    register={formMethods?.register}
                    errors={formMethods.formState.errors}
                    autoFocus={true}
                    maxLength={3}
                  />
              </div>
                 <div className="cstm-input">
                <Label isRequired={true}>Expires At</Label>
                 <Controller
                    control={formMethods.control}
                    name="expires_at"
                    render={({ field, fieldState }) => (
                      <DatePicker
                        id="date-picker"
                        label="Date Picker Input"
                        placeholder="Select a date"
                        errorMessage={fieldState.error}
                        defaultDate={
                          field.value instanceof Date &&
                          !isNaN(field.value.getTime())
                            ? field.value
                            : undefined
                        }
                        onChange={(dates) => {
                          const selectedDate = dates[0];
                          field.onChange(selectedDate);
                          formMethods.trigger("expires_at");
                        }}
                      />
                    )}
                  />
              </div>
               <div className="cstm-input">
                <Label isRequired={true}>Maximum Uses</Label>
               <NumberInputV2
                    placeholder="Maximum Uses"
                    registerOptions="max_uses"
                    register={formMethods?.register}
                    errors={formMethods.formState.errors}
                    autoFocus={true}
                    maxLength={3}
                  />
              </div>
                <div className="cstm-input">
                <Label isRequired={true}>Is Promo Code Active</Label>
              <Controller
                  name="active"
                  control={formMethods.control}
                  render={({ field }) => (
                    <Switch
                      value={field.value}
                      onChange={field.onChange}
                      errors={formMethods.formState.errors}
                      name="active"
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </ComponentCard>

        <div className="mt-6">
             <Button
                  type="submit"
                  loadingState={isButtonLoading("create-promo-code")}
                >
                  Add Promo Code
                </Button>
        </div>
      </form>
    </>
  );
};

export default PromoCodesForm;
