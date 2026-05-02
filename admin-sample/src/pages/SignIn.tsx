
import SignInForm from "@/components/authentications/login/SignInForm";
import PageMeta from "@/components/common/PageMeta";
import { HEADER_CONFIG } from "@/config/headerName";
import AuthLayout from "@/layout/AuthPageLayout";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title={`Sign in - ${HEADER_CONFIG.NAME}`}
        description="This is sign in page"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
