import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";
import { useGlobalStates } from "../../../redux/hooks/useGlobalStates";
import Button from "../../../components/ui/button/Button";
import { ToastService } from "../../../utils/toastService";
import { HEADER_CONFIG } from "../../../config/headerName";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PageBreadcrumbButton from "../../../components/common/PageBreadCrumbButton";
import { useServiceCategoryForm } from "./hook/serviceCategory.hook";
import serviceCategoryService from "@/api/services/serviceCategoryService";
import { useServiceCategoriesById } from "@/hooks/queries/serviceCategories/useServiceCategoriesById";
import Label from "@shared/common/components/ui/form/Label.tsx";
import Input from "@shared/common/components/ui/form/input/InputField.tsx";

interface ServiceCategoryFormProps {
  role: string;
}

const ServiceCategoryForm: React.FC<ServiceCategoryFormProps> = ({ role }) => {
  const { isButtonLoading } = useGlobalStates();
  const { id } = useParams<{ id: string }>();

  const isEditMode = role === "edit" && !!id;

  const navigate = useNavigate();
  const { data: singleServiceCategoryData } = useServiceCategoriesById(
    id || "",
    {
      enabled: isEditMode,
    }
  );

  const formMethods = useServiceCategoryForm(
    role,
    singleServiceCategoryData?.data?.data
  );

  const handleFormSubmit = async (formData: any) => {
    const response = isEditMode
      ? await serviceCategoryService.updateServiceCategoriesById(formData, id)
      : await serviceCategoryService.createServiceCategories(formData);

    if (response.status === 201) {
      ToastService.success(response?.data?.message || "Operation succeeded");
      navigate("/service-categories");
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
        title={`Add a Service Category | ${HEADER_CONFIG.NAME}`}
        description="Add a Service Category"
      />
      <PageBreadcrumbButton
        pageTitle={`${isEditMode ? "Edit Service Category" : "Create Service Category"}`}
        destination_name="Service Category"
        destination_path="service-categories"
        is_reverse={true}
      />

      <form onSubmit={formMethods.handleSubmit(handleFormSubmit)}>
        <ComponentCard
          title={`${isEditMode ? "Edit Service Category" : "Add Service Category"}`}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="cstm-input">
                <Label isRequired={true}>Service Category Name</Label>
                <Input
                  type="text"
                  register={formMethods.register}
                  registerOptions="name"
                  errors={formMethods.formState.errors}
                  placeholder="Service Category Name"
                  autoFocus={true}
                  maxLength={51}
                />
              </div>

              <div className="cstm-input">
                <Label isRequired={true}>Service Category Description</Label>
                <Input
                  type="text"
                  register={formMethods.register}
                  registerOptions="description"
                  errors={formMethods.formState.errors}
                  placeholder="Service Category Description"
                  autoFocus={false}
                  maxLength={301}
                />
              </div>
            </div>
          </div>
        </ComponentCard>

        <div className="mt-6">
          <Button
            type="submit"
            loadingState={
              isEditMode
                ? isButtonLoading("edit-service-class")
                : isButtonLoading("add-service-class")
            }
          >
            Save Changes
          </Button>
        </div>
      </form>
    </>
  );
};

export default ServiceCategoryForm;
