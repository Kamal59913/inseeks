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
  AlertCircle,
  Image,
  Mail,
  Phone,
  Hash,
  Instagram,
  Briefcase,
  DollarSign,
  UserCheck,
} from "lucide-react";

import { useGetFreelancerApplicationById } from "@/hooks/queries/freelancerApplications/useGetFreelancerApplicationById";
import { useModalData } from "@/redux/hooks/useModal";
import { ToastService } from "@/utils/toastService";
import freelancersApplicationService from "@/api/services/freelancersApplicationService";
import { formatDateTime } from "@/utils/formateDate";

const FreelancerApplicationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { open, close } = useModalData();

  const { data: FreelancerApplicationDetails, isPending } =
    useGetFreelancerApplicationById(id || "", {
      enabled: true,
    });

  const application = FreelancerApplicationDetails?.data?.data;
  console.log("this is the adpplicayion", application)
  // Toggle this to false to enable actions always
  const restrictApplicationActions = true;

  const isApproved = application?.freelancer_application_status === "approved";
  // const isRejected = application?.freelancer_application_status === "rejected";

  const handleApprove = () => {
    open("complete-modal", {
      title: "Approve Application!",
      description:
        "Are you sure you want to approve this freelancer application? Once approved, the applicant will be granted access and this action cannot be reverted.",
      action: async () => {
        try {
          const response: any =
            await freelancersApplicationService.approveFreelancerApplication(
              application?.uuid
            );

          if (response?.status === 200 || response?.status === 201) {
            ToastService.success(
              response.data.message || "Application approved successfully",
              "approve-application"
            );
            close();
          } else {
            ToastService.error(
              response?.response?.data?.message ||
                "Failed to approve application",
              "approve-application-error"
            );
          }
        } catch (error) {
          ToastService.error("An error occurred", "approve-application-error");
        }
      },
    });
  };

  // const handleReject = () => {
  //   open("cancel-modal", {
  //     title: "Reject Application!",
  //     inputLabel: "Rejection Reason",
  //     inputPlaceholder: "Enter reason for rejecting this application...",
  //     confirmText: "Reject",
  //     validationRequired: true,
  //     action: async (reason: string) => {
  //       try {
  //         const response: any =
  //           await freelancersApplicationService.rejectFreelancerApplication(
  //             application?.uuid,
  //             { reason }
  //           );

  //         if (response?.status === 200 || response?.status === 201) {
  //           ToastService.success(
  //             response.data.message || "Application rejected successfully",
  //             "reject-application"
  //           );
  //           close();
  //         } else {
  //           ToastService.error(
  //             response?.response?.data?.message ||
  //               "Failed to reject application",
  //             "reject-application-error"
  //           );
  //         }
  //       } catch (error) {
  //         ToastService.error("An error occurred", "reject-application-error");
  //       }
  //     },
  //   });
  // };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;

    const statusConfig: Record<
      string,
      { bg: string; text: string; icon: any }
    > = {
      approved: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: CheckCircle,
      },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        icon: AlertCircle,
      },
      rejected: { bg: "bg-red-100", text: "text-red-800", icon: XCircle },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
      >
        <Icon className="w-4 h-4" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // const isPending_status = application?.freelancer_application_status === "pending";
  // const isApproved = application?.freelancer_application_status === "approved";
  // const isRejected = application?.freelancer_application_status === "rejected";

  return (
    <>
      <PageMeta
        title={`Freelancer Application Details | ${HEADER_CONFIG.NAME}`}
        description="Freelancer Application Details"
      />

      <PageBreadcrumbButton
        pageTitle="Freelancer Application Details"
        destination_name="Freelancer Applications"
        destination_path="freelancer-applications-management"
        is_reverse={true}
      />

      {/* LOADING */}
      {isPending && (
        <ComponentCard title="Freelancer Application Details">
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-600 font-medium">
                Loading freelancer application details...
              </p>
            </div>
          </div>
        </ComponentCard>
      )}

      {/* NO DATA */}
      {!isPending && !application && (
        <ComponentCard title="Freelancer Application Details">
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">
                Freelancer application not found
              </p>
            </div>
          </div>
        </ComponentCard>
      )}

      {/* APPLICATION DATA */}
      {!isPending && application && (
        <>
          {/* {isPending_status && ( */}
          <ComponentCard title="Application Actions" className="">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-lg border border-gray-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Review Required</p>
                  <p className="text-sm text-gray-600 mt-1">
                    This application is pending your review. Please approve or
                    reject the application.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                {/* <button
                  onClick={handleReject}
                  className={`px-3 py-1.5 text-sm rounded ${
                    restrictApplicationActions && isRejected
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                  disabled={restrictApplicationActions && isRejected}
                >
                  Reject Application
                </button> */}
                <button
                  onClick={handleApprove}
                  className={`px-3 py-1.5 text-sm rounded ${
                    restrictApplicationActions && isApproved
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                  disabled={restrictApplicationActions && isApproved}
                >
                  Approve Application
                </button>
              </div>
            </div>
          </ComponentCard>
          {/* Application Header */}
          <ComponentCard title="Freelancer Application Information" className="mt-2">
            <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {application.first_name || ""} {application.last_name || ""}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Application ID: {application.id || "N/A"}
                </p>
              </div>
              {getStatusBadge(application.freelancer_application_status)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">First Name</p>
                  <p className="font-medium text-gray-900">
                    {application.first_name || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Last Name</p>
                  <p className="font-medium text-gray-900">
                    {application.last_name || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">
                    {application.email || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">
                    {application.country_code && application.phone
                      ? `${application.country_code} ${application.phone}`
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Hash className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">UUID</p>
                  <p className="font-medium text-gray-900 text-xs break-all">
                    {application.uuid || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Applied On</p>
                  <p className="font-medium text-gray-900">
                    {application.created_at
                      ? formatDateTime(application.created_at, "short")
                      : "N/A"}
                  </p>
                </div>
              </div>

              {application.instagram_handle && (
                <div className="flex items-start gap-3">
                  <Instagram className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Instagram</p>
                    <p className="font-medium text-gray-900">
                      @{application.instagram_handle}
                    </p>
                  </div>
                </div>
              )}

              {application.charges && (
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Charges</p>
                    
                    {/* Per-Category Charges */}
                    {application.charges.charges && application.charges.charges.length > 0 ? (
                      <div className="space-y-2">
                        {application.charges.charges.map((charge: any, idx: number) => {
                          const categorySlug = charge.category_slug?.toLowerCase() || '';
                          
                          // Define labels based on category using .includes() for safer matching
                          let hourlyLabel = "Hourly";
                          let halfDayLabel = "Half Day";
                          let fullDayLabel = "Full Day";
                          let hideFullDay = false;
                          
                          if (categorySlug.includes("makeup")) {
                            hourlyLabel = "Min. glam and go";
                            halfDayLabel = "Min. half day shoot rate (4h)";
                            fullDayLabel = "Min. full day shoot rate";
                          } else if (categorySlug.includes("hair")) {
                            hourlyLabel = "Min. style and go";
                            halfDayLabel = "Min. half day shoot rate (4h)";
                            fullDayLabel = "Min. full day shoot rate";
                          } else if (categorySlug.includes("nail")) {
                            hourlyLabel = "Min. press ons (per set)";
                            halfDayLabel = "Min. nail art (per set)";
                            hideFullDay = true;
                          }
                          
                          return (
                            <div key={idx}>
                              <p className="font-medium text-gray-900 text-sm capitalize mb-1">
                                {charge.category_slug} ({charge.currency || 'GBP'})
                              </p>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 ml-2">
                                <p className="text-sm text-gray-700">
                                  {hourlyLabel}: <span className="text-blue-600 font-medium">£{charge.hourly || 0}</span>
                                </p>
                                <p className="text-sm text-gray-700">
                                  {halfDayLabel}: <span className="text-blue-600 font-medium">£{charge.half_day || 0}</span>
                                </p>
                                {!hideFullDay && (
                                  <p className="text-sm text-gray-700">
                                    {fullDayLabel}: <span className="text-blue-600 font-medium">£{charge.full_day || 0}</span>
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      // Fallback to old format if new format is not available
                      application.charges.hourly !== undefined && (
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          <p className="font-medium text-gray-900 text-sm">
                            Hourly:{" "}
                            <span className="text-blue-600">
                              £{application.charges.hourly || 0}
                            </span>
                          </p>
                          <p className="font-medium text-gray-900 text-sm">
                            Half Day:{" "}
                            <span className="text-blue-600">
                              £{application.charges.half_day || 0}
                            </span>
                          </p>
                          <p className="font-medium text-gray-900 text-sm">
                            Full Day:{" "}
                            <span className="text-blue-600">
                              £{application.charges.full_day || 0}
                            </span>
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {application.referral_user_code && (
                <div className="flex items-start gap-3">
                  <UserCheck className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Referral Code</p>
                    <p className="font-medium text-gray-900">
                      {application.referral_user_code}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bio Section */}
            {application.bio && (
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-2">Bio</p>
                    <p className="text-gray-900 leading-relaxed">
                      {application.bio}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Rejection Reason */}
            {application.freelancer_application_rejection_reason && (
              <div className="mt-6 bg-red-50 rounded border border-red-300 p-4">
                <h4 className="font-semibold text-red-800 flex items-center gap-2 mb-1">
                  <XCircle className="w-4 h-4" />
                  Rejection Reason
                </h4>
                <p className="text-red-700">
                  {application.freelancer_application_rejection_reason}
                </p>
              </div>
            )}
          </ComponentCard>

          {/* Portfolio Section */}
          <ComponentCard
            title={`Portfolio (${application.portfolio?.length || 0} images)`}
            className="mt-2"
          >
            {!application.portfolio || application.portfolio.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">
                    No portfolio images found
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {application.portfolio.map((item: any, index: number) => (
                  <div
                    key={item.id}
                    className="relative group rounded-lg overflow-hidden border shadow-sm bg-white"
                  >
                    <div className="aspect-square relative">
                      <img
                        src={item.thumbnail || item.image_url}
                        alt={`Portfolio ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {item.is_primary && (
                        <div className="absolute top-2 right-2">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
                            <CheckCircle className="w-3 h-3" />
                            Primary
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ComponentCard>
          {/* Action Buttons Card - Only for Pending Applications */}

          {/* )} */}
        </>
      )}
    </>
  );
};

export default FreelancerApplicationDetails;
