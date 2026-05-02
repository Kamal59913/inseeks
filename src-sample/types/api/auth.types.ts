// ---------------------------------------------------------------------------
// Auth credentials & password flows
// ---------------------------------------------------------------------------

export interface AuthCredentials {
  email?: string;
  username?: string;
  password?: string;
}

export interface FogetPassword {
  email: string;
}

export interface ResetPassword {
  token: string | null;
  newPassword?: string;
  password?: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export type ForgetPasswordResponse = {
  success: boolean;
  message: string;
};

// ---------------------------------------------------------------------------
// User profile — matches the real /users/profile API response shape
// ---------------------------------------------------------------------------

/** The nested `user` object inside the profile response */
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  country_code?: string;
  phone?: string;
  role?: string;
  primary_image?: string;
  platform_fee?: number | null;
  commission_fee?: number | null;
  customer_fee?: number | null;
  stripe_fee?: number | null;
  is_temp_password?: boolean;
  tutorial_step?: number | null;
  metadata?: {
    dismissed_pages?: string[];
  };
  created_at?: string;
  updated_at?: string;
}

export interface AdditionalInfo {
  id?: number;
  uuid?: string;
  user_id?: number;
  referral_code?: string;
  profile_picture?: string | null;
  referral_user_id?: number | null;
  referral_user_code?: string | null;
  paid_to_referral_user?: boolean;
  referral_bonus_paid?: boolean;
  whats_app_number?: string;
  email?: string;
  sms_number?: string;
  whats_app_number_enabled?: boolean;
  sms_number_enabled?: boolean;
  email_enabled?: boolean;
  bio?: string;
  instagram_handle?: string;
  how_will_you_use_empera?: string | null;
  company_name?: string | null;
  company_role?: string | null;
  charges?: {
    service_categories?: string[];
    charges?: Array<{
      category_slug: string;
      currency: string;
      hourly: string;
      half_day: string;
      full_day: string;
    }>;
  };
  created_at?: string;
  updated_at?: string;
}

export interface UserServicePlace {
  id: number;
  uuid?: string;
  user_id?: number;
  service_place_id?: number;
  postcode?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  radius?: string;
  local_travel_fee?: string;
  created_at?: string;
  updated_at?: string;
}

export interface GoogleCalendarAuth {
  email: string;
  [key: string]: unknown;
}

export interface CategoryRate {
  hourly: string;
  half_day: string;
  full_day: string;
}

/**
 * The full shape of `userData` in the Redux auth store.
 * This is `response.data.data` from GET /users/profile.
 */
export interface UserProfileData {
  user: User;
  additional_info?: AdditionalInfo;
  service_places?: UserServicePlace[];
  stripeAccountId?: string | null;
  freelancerGoogleAuth?: GoogleCalendarAuth[];
  service_categories?: string[];
  service_categories_list?: string[];
  charges?: Array<{
    category_slug: string;
    currency: string;
    hourly: string;
    half_day: string;
    full_day: string;
  }>;
  category_rates?: Record<string, CategoryRate>;
}

// ---------------------------------------------------------------------------
// Legacy / kept for backward compat
// ---------------------------------------------------------------------------

export type UserType = "super" | "admin" | "teacher" | "student" | "parent";

/** @deprecated Use UserProfileData instead */
export type UserDetails = {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  type: UserType;
};

export type UserDetailsResponse = {
  success: boolean;
  message: string;
  data: UserDetails;
};

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}
