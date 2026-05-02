import PageMeta from "../../common/PageMeta";
import AuthLayout from "../../../layout/AuthPageLayout";
import { HEADER_CONFIG } from "../../../config/headerName";
import ForgetPasswordForm from "./ForgetPasswordForm";
export default function ForgetPassword() {
  return (
    <>
      <PageMeta
        title={`Forget Password - ${HEADER_CONFIG.NAME}`}
        description="This is the forget password page"
      />
      <AuthLayout>
        <ForgetPasswordForm />
      </AuthLayout>
    </>
  );
}
