import DefaultLayout from "../../components/Layout/layout";
import { ProtectedRoute } from "@/components/Authentication/wrappers/protected-route";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <DefaultLayout>{children}</DefaultLayout>
    </ProtectedRoute>
  );
}
