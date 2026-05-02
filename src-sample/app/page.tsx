import UserTypeSelect from "@/components/auth/user-type-select/userTypeSelect";
import FullScreenLayout from "@/components/layouts/FullScreenLayout";

export default function Home() {
  return (
    <FullScreenLayout>
      <UserTypeSelect />
    </FullScreenLayout>
  );
}

