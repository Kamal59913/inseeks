import { AuthWrapper } from "@/components/auth/routes/AuthWrapper";
import { PublicRoute } from "@/components/auth/routes/ProtectedRoute";
import ForgetPassword from "@/components/authentications/forget-password/ForgetPassword";
import ResetPassword from "@/components/authentications/reset-password/ResetPassword";
import BookingsModule from "@/components/bookings/bookingsModule";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import CustomersModule from "@/components/customers/customersModule";
import FreelancerPlateformFeeForm from "@/components/freelancers/forms/FreelancerPlateformFeeForm";
import FreelancerBookingDetails from "@/components/freelancers/freelancerDetails/FreelancersBookingsDetails";
import FreelancersModule from "@/components/freelancers/freelancersModule";
import PromoCodesForm from "@/components/promoCodes/forms/promoCodesForm";
import PromoCodesModule from "@/components/promoCodes/promoCodesModule";
import ServiceCategoryForm from "@/components/serviceCategories/forms/ServiceCategoryForm";
import ServiceCategoriesModule from "@/components/serviceCategories/serviceCategoriesModule";
import AccountSettingsModule from "@/components/settings/settings";
import AppLayout from "@/layout/AppLayout";
import SignIn from "@/pages/SignIn";
import { RouteObject } from "react-router-dom";
import FundsModule from "@/components/funds/promoCodesModule";
import FreelancerApplicationsModule from "@/components/freelancerApplications/freelancerApplicationsModule";
import ReferralsModule from "@/components/referrals/referralsModule";
import BookingDetails from "@/components/bookings/booking-details/BookingsDetails";
import CustomerDetails from "@/components/customers/customer-details/CustomerDetails";
import FreelancerApplicationDetails from "@/components/freelancerApplications/freelancer-application-details/FreelancerApplicationDetails";
import FreelancerProfileDetails from "@/components/freelancers/freelancerDetails/FreelancersProfileDetails";
import FreelancersReferralDetails from "@/components/freelancers/freelancerDetails/FreelancersReferralDetails";
import ConsolidatedEditProfileForm from "@/components/freelancers/forms/EditProfile/ConsolidatedEditProfileForm";
import WaitCustomersListModule from "@/components/customersWaitingList/customersModule";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <PublicRoute>
        <SignIn />
      </PublicRoute>
    ),
  },
  {
    path: "/forget-password",
    element: <ForgetPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    element: (
      <AuthWrapper>
        <ScrollToTop />
        <AppLayout />
      </AuthWrapper>
    ),

    children: [
      { path: "customers", element: <CustomersModule /> },
      { path: "customers/:id", element: <CustomerDetails /> },

      { path: "waiting-list-customers", element: <WaitCustomersListModule /> },
      {
        path: "waiting-list-customers/:id",
        element: <CustomerDetails isWaitingList={true} />,
      },

      { path: "freelancers", element: <FreelancersModule /> },
      { path: "freelancers/:id", element: <FreelancerProfileDetails /> },
      {
        path: "freelancers/booking-details/:id",
        element: <FreelancerBookingDetails />,
      },
      {
        path: "freelancers/referral-details/:id",
        element: <FreelancersReferralDetails />,
      },
      {
        path: "freelancers/edit/:id",
        element: <ConsolidatedEditProfileForm />,
      },
      {
        path: "freelancers/update-plateform-fee/:id",
        element: <FreelancerPlateformFeeForm role={"edit"} />,
      },

      {
        path: "freelancer-applications-management",
        element: <FreelancerApplicationsModule />,
      },
      {
        path: "freelancer-applications-management/:id",
        element: <FreelancerApplicationDetails />,
      },

      { path: "bookings", element: <BookingsModule /> },
      {
        path: "bookings/:id",
        element: <BookingDetails />,
      },
      { path: "service-categories", element: <ServiceCategoriesModule /> },
      {
        path: "service-categories/add-service-category",
        element: <ServiceCategoryForm role="add" />,
      },
      {
        path: "service-categories/edit-service-category/:id",
        element: <ServiceCategoryForm role="edit" />,
      },

      { path: "promo-code-management", element: <PromoCodesModule /> },
      {
        path: "promo-code-management/create-promo-code",
        element: <PromoCodesForm role="add" />,
      },

      { path: "funds", element: <FundsModule /> },

      { path: "referrals", element: <ReferralsModule /> },

      // {
      //   path: "service-categories/add-service-category",
      //   element: <ServiceCategoryForm role="add" />,
      // },
      // {
      //   path: "service-categories/edit-service-category/:id",
      //   element: <ServiceCategoryForm role="edit" />,
      // },
      { path: "settings", element: <AccountSettingsModule /> },
      { path: "settings/password-change", element: <AccountSettingsModule /> },
    ],
  },
];
