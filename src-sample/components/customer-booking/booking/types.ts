export const Step = {
  SERVICE: 0,
  TIME: 1,
  DETAILS: 2,
  LOCATION: 3,
  CUSTOMER: 4,
  PAYMENT: 5,
  CONFIRM: 6,
} as const;

export type Step = (typeof Step)[keyof typeof Step];

export type BookingLocation = {
  line1: string;
  line2: string;
  postal: string;
  city: string;
};

export interface Freelancer {
  free_lancer_id: number;
  uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  account_verified: boolean;
  additional_info: {
    profile_picture: string | null;
    bio: string;
    whats_app_number: string;
    sms_number: string;
    email: string;
    whats_app_number_enabled: boolean;
    sms_number_enabled: boolean;
    email_enabled: boolean;
  };
  service_areas: {
    address: string;
    latitude: string;
    longitude: string;
    radius: string;
  }[];

  portfolio: {
    id: number;
    image_url: string;
    caption: string;
    is_primary: boolean;
  }[];

  services: {
    id: number;
    name: string;
    description: string;
    category: { name: string };
    options: { id: number; name: string; price: number; duration: number }[];
  }[];
}

export type SelectedServiceState = {
  serviceId: number | null;
  optionId: number | null;
};
