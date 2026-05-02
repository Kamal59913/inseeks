"use client";
import Button from "@/components/ui/button/Button";
import { LinkOpener } from "@/lib/utilities/socialLinks";
import { ToastService } from "@/lib/utilities/toastService";
import { useRouter } from "next/navigation";

const CustomerDecideSelect = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 m-auto w-full">
      <Button
           size="rg"
        variant="dark"
        className="font-medium"
        onClick={() => {
          router.push("/get-started-customer");
        }}
      >
        {" "}
        Get early access to the Mobile App{" "}
      </Button>
      <Button
        className="font-medium"
        size="rg"
        onClick={() => {
          if (process.env.NEXT_PUBLIC_FREELANCER_LANDING_SITE) {
            LinkOpener(process.env.NEXT_PUBLIC_FREELANCER_LANDING_SITE || "");
          } else {
            ToastService.error(
              "Freelancer landing site not configured",
              "freelancer_landing_site_not_found"
            );
          }
        }}
      >
        {" "}
        Book a freelancer{" "}
      </Button>
    </div>
  );
};
export default CustomerDecideSelect;

