import apiClient from "./clients/apiClient";
import {
  AuthCredentials,
  FogetPassword,
  ForgetPasswordResponse,
  ResetPassword,
  ResetPasswordResponse,
} from "@/types/api/auth.types";
import {
  RegisterOneFormData,
  CustomerOnboardingFormData,
  RegisterTwoFormData,
} from "@/types/api/services.types";
import { ApiResponse } from "@/types/api/base";
import { store } from "@/store/store";
import { fetchCurrentUser } from "@/store/slices/authSlice";
import {
  setPageLoading,
  startButtonLoading,
  stopButtonLoading,
  setAuthLoading,
} from "@/store/slices/globalSlice";
import { setAuthToken } from "@/lib/utilities/tokenManagement";
import { handleAuthError, handleError } from "@/lib/utilities/handleAuth";
import { addressUtils } from "@/lib/payloadFormatting";

const authService = {
  login: async (credentials: AuthCredentials) => {
    store.dispatch(setAuthLoading(true));
    store.dispatch(startButtonLoading("login"));
    try {
      const response = await apiClient.post<
        ApiResponse<{ access_token: string }>
      >("/users/login", credentials, {
        skipAuthRedirect: true,
        headers: {
          Authorization: undefined,
          "Content-Type": "application/json",
        },
      });
      if (response?.data?.data?.access_token) {
        setAuthToken(response?.data?.data?.access_token);
      }
      await store.dispatch(fetchCurrentUser());

      return response;
    } catch (error) {
      return handleAuthError(error);
    } finally {
      store.dispatch(stopButtonLoading("login"));
    }
  },

  registerOne: async (formData: RegisterOneFormData) => {
    store.dispatch(startButtonLoading("register-one"));
    store.dispatch(setPageLoading(true));

    try {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        country_code: formData.countryCode,
        phone: formData.phoneNumber,
        instagram_handle: formData.instagramHandle,
        bio: formData.freelancerBio,
        service_categories: formData.areasOfExpertise || [],
        charges: Object.entries(formData.category_rates || {}).map(
          ([slug, rates]: [
            string,
            {
              hourly: string | number;
              half_day: string | number;
              full_day: string | number;
            },
          ]) => ({
            category_slug: slug,
            currency: "GBP",
            hourly: Number(rates.hourly) || 0,
            half_day: Number(rates.half_day) || 0,
            full_day: Number(rates.full_day) || 0,
          }),
        ),
        images: formData.freelancerPortfolioImages || [],
        referred_by: formData.freelancerReferralDetails || "",
      };
      const response = await apiClient.post<ApiResponse<unknown>>(
        "/freelancers/apply",
        payload,
        {
          headers: {
            Authorization: undefined,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 201) {
        const keys = [
          process.env.NEXT_PUBLIC_FORM_STORAGE_PART_SEC_KEY,
          process.env.NEXT_PUBLIC_STEP_TWO_STORAGE_KEY,
        ];

        keys.forEach((key) => key && localStorage.removeItem(key));
      }
      return response;
    } catch (error) {
      return handleAuthError(error);
    } finally {
      store.dispatch(setPageLoading(false));
      store.dispatch(stopButtonLoading("register-one"));
    }
  },

  customerOnboarding: async (formData: CustomerOnboardingFormData) => {
    store.dispatch(startButtonLoading("register-one-customer"));
    store.dispatch(setPageLoading(true));

    try {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phoneNumber,
        country_code: formData.countryCode,
        how_will_you_use_empera: formData.customerType,
        company_name: formData.companyName || "",
        company_role: formData.companyPosition || "",
      };
      const response = await apiClient.post<ApiResponse<unknown>>(
        "/users/signup/customer",
        payload,
        {
          headers: {
            Authorization: undefined,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 201) {
        const keys = [
          "customer_onboarding_form_data",
          "customer_onboarding_step",
          "customer_onboarding_total_steps",
        ];
        keys.forEach((key) => key && localStorage.removeItem(key));
      }
      return response;
    } catch (error) {
      return handleAuthError(error);
    } finally {
      store.dispatch(setPageLoading(false));
      store.dispatch(stopButtonLoading("register-one-customer"));
    }
  },

  registerTwo: async (formData: RegisterTwoFormData) => {
    store.dispatch(startButtonLoading("register-two"));
    store.dispatch(setPageLoading(true));

    try {
      const freelancerAddress = addressUtils.getFreelancerAddress(formData);

      const payload = {
        username: formData.userName,
        password: formData.password,
        places: [
          {
            service_place_id: 1,
            postcode: freelancerAddress.postcode,
            address: freelancerAddress.address,
            latitude: formData.serviceLocation?.latitude?.toString() || "",
            longitude: formData.serviceLocation?.longitude?.toString() || "",
            radius: formData.serviceRadius?.toString() || "0",
            local_travel_fee: formData.localTravelFee?.toString() || "0",
          },
        ],
      };

      const response = await apiClient.post<ApiResponse<unknown>>(
        "/freelancers/set-password-username-places",
        payload,
        {
          headers: {
            Authorization: undefined,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 201) {
        const keys = [
          process.env.NEXT_PUBLIC_FORM_STORAGE_PART_ONE_KEY,
          process.env.NEXT_PUBLIC_FORM_STORAGE_PART_SEC_KEY,
          process.env.NEXT_PUBLIC_STEP_ONE_STORAGE_KEY,
        ];

        keys.forEach((key) => key && localStorage.removeItem(key));
      }

      // setAuthToken(response?.data?.data?.access_token);
      return response;
    } catch (error) {
      return handleAuthError(error);
    } finally {
      store.dispatch(stopButtonLoading("register-two"));
      store.dispatch(setPageLoading(false));
    }
  },

  checkUsername: async (username: string) => {
    try {
      const payload = {
        username: username,
      };
      const response = await apiClient.post<ApiResponse<unknown>>(
        "/users/freelancer/username/check",
        payload,
      );

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
    }
  },

  checkValue: async (value: string) => {
    try {
      const payload = {
        value: value,
      };
      const response = await apiClient.post<ApiResponse<unknown>>(
        "/users/freelancer/check",
        payload,
      );

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
    }
  },

  emailVerification: async (token: string) => {
    return await apiClient.get(
      `/users/register/freelancer/verify?token=${token}`,
    );
  },
  getProfile: async () => {
    return await apiClient.get("/api/auth/profile");
  },

  forgetPassword: async (credentials: FogetPassword) => {
    store.dispatch(setAuthLoading(true));
    store.dispatch(startButtonLoading("forget-password"));
    try {
      const response = await apiClient.post<ForgetPasswordResponse>(
        "/users/password/forgot/freelancer",
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return response;
    } catch (error) {
      return handleAuthError(error);
    } finally {
      store.dispatch(stopButtonLoading("forget-password"));
      store.dispatch(setAuthLoading(false));
    }
  },

  changePassword: async (credentials: FogetPassword) => {
    store.dispatch(startButtonLoading("change-password"));
    try {
      const response = await apiClient.post<ForgetPasswordResponse>(
        "/users/password/update/email-link/freelancer",
        credentials,
      );

      return response;
    } catch (error) {
      return handleAuthError(error);
    } finally {
      store.dispatch(stopButtonLoading("change-password"));
    }
  },

  resetPassword: async (credentials: ResetPassword) => {
    store.dispatch(startButtonLoading("reset-password"));

    try {
      const response = await apiClient.post<ResetPasswordResponse>(
        `/users/password/reset/freelancer`,
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return response;
    } catch (error) {
      return handleAuthError(error);
    } finally {
      store.dispatch(stopButtonLoading("reset-password"));
    }
  },

  passwordUpdateLink: async (credentials: ResetPassword) => {
    store.dispatch(startButtonLoading("reset-password"));
    try {
      const response = await apiClient.post<ResetPasswordResponse>(
        `/users/password/update/email/freelancer`,
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return response;
    } catch (error) {
      return handleAuthError(error);
    } finally {
      store.dispatch(stopButtonLoading("reset-password"));
    }
  },
};

export default authService;
