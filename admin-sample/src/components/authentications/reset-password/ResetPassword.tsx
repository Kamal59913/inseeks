import PageMeta from "@/components/common/PageMeta";
import { HEADER_CONFIG } from "@/config/headerName";
import AuthLayout from "@/layout/AuthPageLayout";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPassword() {
  return (
    <>
      <PageMeta
        title={`Reset Password - ${HEADER_CONFIG.NAME}`}
        description="This is reset pasword page"
      />
      <AuthLayout>
        <ResetPasswordForm />
      </AuthLayout>
    </>
  );
}
