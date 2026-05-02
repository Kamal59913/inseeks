import React from "react";
import { ProfileHeader } from "@/components/Profile/ProfileHeader";

export default async function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  return (
    <div className="flex flex-col min-h-full">
      <ProfileHeader username={username} />
      <div className="flex-1 px-6">
        {children}
      </div>
    </div>
  );
}
