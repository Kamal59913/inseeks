"use client";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";

const WelcomeScreen = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 m-auto w-full px-4">
      <Button
        size="rg"
        className="font-semibold"
        variant="dark"
        onClick={() => {
          router.push("/login/freelancer");
        }}
      >
        {" "}
        Login{" "}
      </Button>
      <Button
        size="rg"
        className="font-semibold"
        onClick={() => {
          router.push("/signup/freelancer");
        }}
      >
        {" "}
        {/* Sign Up{" "} */}
        Join Empera{" "}
      </Button>
    </div>
  );
};
export default WelcomeScreen;

