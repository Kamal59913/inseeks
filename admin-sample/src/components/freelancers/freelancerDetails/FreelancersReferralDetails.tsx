import { useState } from "react";
import PageMeta from "../../common/PageMeta";
import ComponentCard from "../../common/ComponentCard";
import { HEADER_CONFIG } from "../../../config/headerName";
import { useParams } from "react-router-dom";
import PageBreadcrumbButton from "../../common/PageBreadCrumbButton";
import { useGetFreelancerReferrals } from "@/hooks/queries/freelancers/useGetFreelancerReferrals";
import { useNavigate } from "react-router-dom";
import {
  User,
  Calendar,
  Mail,
  XCircle,
  Hash,
} from "lucide-react";

import { FilterTabs } from "./FreelancerFilterTabs";
import { formatDateTime } from "@/utils/formateDate";

const FreelancersReferralDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data: freelancerReferralsData, isPending } =
    useGetFreelancerReferrals(id || "");

  const navigate = useNavigate();
  // Accessing typical API structure: response.data.data
  const referrals = freelancerReferralsData?.data?.data || [];

  const [openReferral, setOpenReferral] = useState<number | null>(null);

  const toggleAccordion = (referralId: number) => {
    setOpenReferral((prev) => (prev === referralId ? null : referralId));
  };

  return (
    <>
      <PageMeta
        title={`Freelancer Referral Details | ${HEADER_CONFIG.NAME}`}
        description="Freelancer Referral Details"
      />

      <PageBreadcrumbButton
        pageTitle="Freelancer Referral Details"
        destination_name="Freelancers"
        destination_path="freelancers"
        is_reverse={true}
      />

      <ComponentCard
        footerContent={
          <FilterTabs
            activeTab="referral_details"
            referralCount={referrals.length}
            onChange={(tab) => {
              if (tab === "profile") {
                navigate(`/freelancers/${id}`);
              } else if (tab === "booking") {
                navigate(`/freelancers/booking-details/${id}`);
              } else if (tab === "edit_profile") {
                navigate(`/freelancers/edit/${id}`);
              }
            }}
          />
        }
      >
        {/* LOADING */}
        {isPending && (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-600 font-medium">
                Loading referral details...
              </p>
            </div>
          </div>
        )}

        {/* NO DATA */}
        {!isPending && referrals.length === 0 && (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No referrals found</p>
            </div>
          </div>
        )}

        {/* REFERRAL LIST */}
        <div className="space-y-4">
          {referrals.map((referral: any) => {
            const isOpen = openReferral === referral.id;

            return (
              <div
                key={referral.id}
                className="border rounded-lg bg-gray-50 shadow-sm"
              >
                {/* ACCORDION HEADER */}
                <button
                  onClick={() => toggleAccordion(referral.id)}
                  className="w-full flex justify-between items-center px-5 py-4 text-left hover:bg-gray-100 transition"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                      {referral.first_name} {referral.last_name}
                      <span className="text-sm font-normal text-gray-500">
                        (@{referral.username})
                      </span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5 hidden sm:flex">
                      <Calendar className="w-4 h-4" />
                      Referred:{" "}
                      {formatDateTime(
                        referral.referral_date || referral.created_at,
                        "short"
                      )}
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-500 transform transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* ACCORDION BODY */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-2 space-y-6 border-t bg-white rounded-b-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* USER INFO */}
                      <div className="bg-gray-50 p-4 rounded border space-y-3">
                        <h4 className="font-semibold flex items-center gap-2 text-gray-800">
                          <User className="w-4 h-4 text-blue-600" />
                          Freelancer Information
                           <a
                            className="text-blue-600"
                            href={`/freelancers/${referral.uuid}`}
                          >
                            (Visit Profile)
                          </a>
                        </h4>

                        <div className="space-y-2">
                          <div className="flex justify-between border-b pb-2 border-gray-200/50">
                            <span className="text-sm text-gray-500">
                              First Name
                            </span>
                            <span className="font-medium text-sm">
                              {referral.first_name}
                            </span>
                          </div>
                          <div className="flex justify-between border-b pb-2 border-gray-200/50">
                            <span className="text-sm text-gray-500">
                              Last Name
                            </span>
                            <span className="font-medium text-sm">
                              {referral.last_name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">
                              Username
                            </span>
                            <span className="font-medium text-sm">
                              @{referral.username}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* CONTACT INFO */}
                      <div className="bg-gray-50 p-4 rounded border space-y-3">
                        <h4 className="font-semibold flex items-center gap-2 text-gray-800">
                          <Mail className="w-4 h-4 text-blue-600" />
                          Contact Details
                        </h4>

                        <div className="space-y-2">
                          <div className="flex justify-between border-b pb-2 border-gray-200/50">
                            <span className="text-sm text-gray-500">Email</span>
                            <span className="font-medium text-sm">
                              {referral.email}
                            </span>
                          </div>
                          <div className="flex justify-between pb-2">
                            <span className="text-sm text-gray-500">Phone</span>
                            <span className="font-medium text-sm">
                              {referral.country_code} {referral.phone}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* META INFO */}
                      <div className="bg-gray-50 p-4 rounded border space-y-3">
                        <h4 className="font-semibold flex items-center gap-2 text-gray-800">
                          <Hash className="w-4 h-4 text-blue-600" />
                          Other Details
                        </h4>

                        <div className="space-y-2">
                          <div className="flex justify-between border-b pb-2 border-gray-200/50">
                            <span className="text-sm text-gray-500">
                             UUID
                            </span>
                            <span className="font-medium text-sm break-all text-right ml-4">
                              {referral.uuid}
                            </span>
                          </div>
                          <div className="flex justify-between border-b pb-2 border-gray-200/50">
                            <span className="text-sm text-gray-500">
                              User ID
                            </span>
                            <span className="font-medium text-sm">
                              {referral.id}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">
                              Account Created
                            </span>
                            <span className="font-medium text-sm">
                              {formatDateTime(referral.created_at, "short")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ComponentCard>
    </>
  );
};

export default FreelancersReferralDetails;
