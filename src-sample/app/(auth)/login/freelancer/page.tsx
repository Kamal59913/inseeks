"use client";
import SignInScreen from "@/components/auth/login/login";
import { PublicRoute } from "@/components/auth/wrapper/public";

const page = () => {
  return (
    <PublicRoute>
      <SignInScreen/>
      </PublicRoute>
  );
};
export default page;

