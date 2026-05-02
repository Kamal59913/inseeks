"use client";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";

const UserTypeSelect = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 m-auto w-full">
      <Button
        size="rg"
        
        onClick={() => {
          router.push("/get-started-freelancer");
        }}
      >
        {" "}
        For <span className="font-semibold">Freelancer</span>{" "}
      </Button>

      <Button
        size="rg"
        variant="dark"
        onClick={() => {
          router.push("/customer-onboarding-screen");
        }}
      >
        {" "}
        For <span className="font-semibold">Customer</span>{" "}
      </Button>
    </div>
  );
};
export default UserTypeSelect;

