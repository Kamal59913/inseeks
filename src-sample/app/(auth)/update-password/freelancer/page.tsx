"use client";
import UpdatePasswordScreen from "@/components/auth/reset-password/update-password";
import { ProtectedRoute } from "@/components/auth/wrapper/protected";

const page = () => {
  return (
    <ProtectedRoute>
      <UpdatePasswordScreen />
    </ProtectedRoute>
  );
};
export default page;

