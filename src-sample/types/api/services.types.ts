export interface RegisterOneFormData {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  instagramHandle?: string;
  freelancerBio?: string;
  areasOfExpertise?: string[];
  category_rates?: Record<
    string,
    {
      hourly: number | string;
      half_day: number | string;
      full_day: number | string;
    }
  >;
  freelancerPortfolioImages?: Array<{
    image_url: string;
    thumbnail_url: string;
  }>;
  freelancerReferralDetails?: string;
}

export interface CustomerOnboardingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  customerType: string;
  companyName?: string;
  companyPosition?: string;
}

export interface RegisterTwoFormData {
  userName: string;
  password?: string;
  serviceLocation?: {
    latitude?: number | string;
    longitude?: number | string;
    postcode?: string;
    address?: string;
  };
  serviceRadius?: number | string;
  localTravelFee?: number | string;
  // Address fields (manual entry variants)
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export interface UpdateProfileFormData {
  firstName?: string;
  lastName?: string;
  additional_email?: string;
  whatsapp?: string;
  bio?: string;
  text?: string;
  isWhatsAppEnabled?: boolean;
  isTextEnabled?: boolean;
  isEmailEnabled?: boolean;
}

export interface UpdateLocationFormData {
  serviceLocation?: {
    latitude?: number | string;
    longitude?: number | string;
    postcode?: string;
    address?: string;
  };
  serviceRadius?: number | string;
  localTravelFee?: number | string;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Portfolio
// ---------------------------------------------------------------------------

export interface PortfolioImageFormData {
  image_url: string;
  thumbnail_url?: string;
  image_caption?: string;
  status?: boolean;
}

// ---------------------------------------------------------------------------
// Services / Bookings (shared option shape)
// ---------------------------------------------------------------------------

export interface ServiceProductOption {
  id: number;
  product_name?: string;
  product_duration?: string;
  product_price?: string;
  product_payout?: string;
}

export interface ServiceFormData {
  product_name: string;
  product_description: string;
  product_category: string;
  is_product_options?: boolean;
  initial_product_duration: string | undefined;
  initial_product_price: string | undefined;
  initial_product_payout?: string | undefined;
  product_options?: ServiceProductOption[];
}
