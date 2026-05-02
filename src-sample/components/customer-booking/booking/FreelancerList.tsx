"use client";
import { useGetFreelancerList } from "@/hooks/freelancerServices/useGetFreeLancerServices";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";

export default function FreelancerList() {
  const router = useRouter();
  const { data } = useGetFreelancerList();
  const freelancers = data?.data?.data || [];

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-3xl mx-auto py-8">
        <div className="grid gap-4">
          <h2 className="text-xl font-semibold text-white">Freelancers</h2>

          <div className="grid grid-cols-1 gap-4">
            {freelancers.map((f: any) => (
              <div
                key={f.id}
                className="bg-gradient-to-b from-[#2a0723] to-[#140212] rounded-2xl p-4 flex items-center gap-4 shadow-inner"
              >
                <img
                  src={
                    f.thumbnail ||
                    "/default_profile.svg"
                  }
                  className="w-20 h-20 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-semibold text-sm">
                        {f.first_name} {f.last_name}
                      </div>
                      <div className="text-sm text-purple-200">
                        {f.service_categories}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="rg"
                    onClick={() => router.push(`/${f.username}`)}
                    variant="white"
                    borderRadius="rounded-full"
                    className="mt-2 px-4 py-1 font-medium text-sm"
                  >
                    View & Book
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

