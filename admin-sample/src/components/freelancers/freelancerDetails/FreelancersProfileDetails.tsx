import PageMeta from "../../common/PageMeta";
import ComponentCard from "../../common/ComponentCard";
import { HEADER_CONFIG } from "../../../config/headerName";
import { useParams } from "react-router-dom";
import PageBreadcrumbButton from "../../common/PageBreadCrumbButton";
import {
  Calendar,
  User,
  XCircle,
  CheckCircle,
  Mail,
  Phone,
  Hash,
  Shield,
  Percent,
  PoundSterlingIcon,
  Users,
} from "lucide-react";
import { useGetFreelancerDetailsById } from "@/hooks/queries/freelancers/useGetFreelancersDetailsById";
import { useGetFreelancerReferrals } from "@/hooks/queries/freelancers/useGetFreelancerReferrals";
import { FilterTabs } from "./FreelancerFilterTabs";
import { useNavigate } from "react-router-dom";
import { formatDateTime } from "@/utils/formateDate";

const FreelancerDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data: freelancerDetailsData, isPending } =
    useGetFreelancerDetailsById(id || "", {
      enabled: true,
    });

  const { data: freelancerReferralsData } = useGetFreelancerReferrals(id || "");
  const referralsCount = freelancerReferralsData?.data?.data?.length || 0;

  const navigate = useNavigate();
  const freelancer = freelancerDetailsData?.data?.data;



  // const getStatusColor = (status?: string) => {
  //   if (!status) return "bg-gray-100 text-gray-800";
  //   const colors: Record<string, string> = {
  //     active: "bg-green-100 text-green-800",
  //     inactive: "bg-gray-100 text-gray-800",
  //     suspended: "bg-red-100 text-red-800",
  //   };
  //   return colors[status] || "bg-gray-100 text-gray-800";
  // };

  return (
    <>
      <PageMeta
        title={`Freelancer Details | ${HEADER_CONFIG.NAME}`}
        description="Freelancer Details"
      />

      <PageBreadcrumbButton
        pageTitle="Freelancer Details"
        destination_name="Freelancers"
        destination_path="freelancers"
        is_reverse={true}
      />

      {/* LOADING */}
      {isPending && (
        <ComponentCard title="Freelancer Details">
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-600 font-medium">
                Loading freelancer details...
              </p>
            </div>
          </div>
        </ComponentCard>
      )}

      {/* NO DATA */}
      {!isPending && !freelancer && (
        <ComponentCard title="Freelancer Details">
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">Freelancer not found</p>
            </div>
          </div>
        </ComponentCard>
      )}

      {/* FREELANCER DATA */}
      {!isPending && freelancer && (
        <>
          {/* Freelancer Header */}
          <ComponentCard
            footerContent={
              <FilterTabs
                activeTab="profile"
                onChange={(tab) => {
                  if (tab === "booking") {
                    navigate(`/freelancers/booking-details/${id}`);
                  } else if (tab === "edit_profile") {
                    navigate(`/freelancers/edit/${id}`);
                  } else if (tab === "referral_details") {
                    navigate(`/freelancers/referral-details/${id}`);
                  }
                }}
                referralCount={referralsCount}
              />
            }
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {freelancer.first_name || ""} {freelancer.last_name || ""}
                  </h2>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Freelancer ID: {freelancer.id || "N/A"}
                </p>
              </div>
              {/* <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  freelancer.status
                )}`}
                >
                {freelancer.status
                  ? freelancer.status.charAt(0).toUpperCase() +
                    freelancer.status.slice(1)
                  : "Unknown"}
                  {freelancer.account_verified ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                       Account Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <XCircle className="w-4 h-4" />
                        Account Not Active
                      </span>
                    )}
               </span> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">First Name</p>
                  <p className="font-medium text-gray-900">
                    {freelancer.first_name || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Last Name</p>
                  <p className="font-medium text-gray-900">
                    {freelancer.last_name || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="font-medium text-gray-900">
                    @{freelancer.username || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">
                    {freelancer.email || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">
                    {freelancer.country_code && freelancer.phone
                      ? `${freelancer.country_code} ${freelancer.phone}`
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Hash className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">UUID</p>
                  <p className="font-medium text-gray-900 text-xs break-all">
                    {freelancer.uuid || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {freelancer.role || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Account Verified</p>
                  <p className="font-medium text-gray-900">
                    {freelancer.account_verified ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Verified
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center gap-1">
                        <XCircle className="w-4 h-4" />
                        Not Verified
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium text-gray-900">
                    {freelancer.created_at
                      ? formatDateTime(freelancer.created_at, 'short')
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium text-gray-900">
                    {freelancer.updated_at
                      ? formatDateTime(freelancer.updated_at, 'short')
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Referral User Section */}
            {freelancer.referral_user && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  Referred By
                </h3>

                <div className="bg-gray-50 p-4 rounded-lg border border-indigo-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-indigo-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="font-medium text-gray-900">
                          {freelancer.referral_user.first_name || ""}{" "}
                          {freelancer.referral_user.last_name || ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-indigo-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Username</p>
                        <p className="font-medium text-gray-900">
                          @{freelancer.referral_user.username || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-indigo-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-gray-900">
                          {freelancer.referral_user.email || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Hash className="w-5 h-5 text-indigo-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Referrer ID</p>
                        <p className="font-medium text-gray-900">
                          {freelancer.referral_user.id || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Hash className="w-5 h-5 text-indigo-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">UUID</p>
                        <p className="font-medium text-gray-900 text-xs break-all">
                          {freelancer.referral_user.uuid || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Financial Information Section */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <PoundSterlingIcon className="w-5 h-5 text-blue-600" />
                Financial Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Percent className="w-5 h-5 text-blue-600" />
                    <p className="text-sm text-gray-600">Platform Fee</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {freelancer.platform_fee || 0}%
                  </p>
                </div>

                {/* <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Percent className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-gray-600">Commission Fee</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {freelancer.commission_fee || 0}%
                  </p>
                </div> */}

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <p className="text-sm text-gray-600">Total Bookings</p>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">
                    {freelancer.bookings?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </ComponentCard>
        </>
      )}
    </>
  );
};

export default FreelancerDetails;