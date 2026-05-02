export const STEP_INDICES = {
  SEND_EMAIL_PAGE: 3,
  TRAVEL_ZONE_PAGE: 9,
  DASHBOARD_REDIRECT_PAGE: 10,
} as const;

export const STEP_INDICES_NAME = {
  SEND_EMAIL_PAGE: "check-inbox",
  TRAVEL_ZONE_PAGE: "travel-zone",
  DASHBOARD_REDIRECT_PAGE: "dashboard-redirect",
  WELCOME_SCREEN: "welcome-screen-freelancer",
  INSTAGRAM_HANDLE: "instagramhandle",
  CHARGING_RATES: "charging-rates",
  POSTAL_CODE: "postal-code",
  FREELANCER_REFERRAL_DETAILS: "freelancer-referral-details",
  EMPERA_WAITING_LIST: "empera_waiting_list",
  ADVERTISEMENT: "advertisement",
  PORTFOLIO_IMAGES: "portfolio-images",
} as const;

export const WORKZONE_NAMES = {
  HOME_OR_STUDIO: "home-or-studio",
  PROFESSIONAL_VENUES: "professional-venues",
  CLIENT_HOMES: "client-homes",
};

export const FREELANCER_SERVICES = {
  MAKE_UP: "make-up",
  HAIR: "hair",
  NAILS: "nails",
};

export enum StepId2 {
  FIRST_NAME = "firstname",
  LAST_NAME = "lastname",
  USAGETYPE = "usagetype",
  EMAIL = "email",
  COMPANYNAME = "companyname",
  ROLE = "role",
  PHONENUMBER = "phonenumber",
}

export enum CustomerStepId {
  FIRST_NAME = "firstname",
  LAST_NAME = "lastname",
  EMAIL = "email",
  ADVERTISEMENT = "advertisement",
  HOW_WILL_YOU_USE_EMPERA = "how_will_you_use_empera",
  COMPANY_NAME = "company_name",
  WHAT_IS_YOUR_ROLE = "what_is_your_role",
  PHONE_NUMBER = "phone_number",
  EMPERA_WAITING_LIST = "empera_waiting_list",
}

export enum StepId {
  FIRST_NAME = "firstname",
  LAST_NAME = "lastname",
  EMAIL = "email",
  CHECK_INBOX = "check-inbox",
  PHONE_NUMBER = "phonenumber",
  INSTAGRAM_HANDLE = "instagramhandle",
  FREELANCER_BIO = "freelancer-bio",
  TRAVEL_ZONE = "travel-zone",
  PORTFOLIO_IMAGES = "portfolio-images",
  FREELANCER_REFERRAL_DETAILS = "freelancer-referral-details",
  CHARGING_RATES = "charging-rates",
  AREAS_OF_EXPERTISE = "areas-of-expertise",
}
export enum StepSecondId {
  WELCOME_FREELANCER = "welcome-screen-freelancer",
  PASSWORD = "password",
  USERNAME = "username",
  POSTAL_CODE = "postal-code",
  TRAVEL_ZONE = "travel-zone",
  DASHBOARD_REDIRECT = "dashboard-redirect",
}

export const freelancerServices = [
  {
    value: FREELANCER_SERVICES.MAKE_UP,
    label: "Make-up",
    description: "",
    icon: "",
  },
  {
    value: FREELANCER_SERVICES.HAIR,
    label: "Hair",
    description: "",
    icon: "",
  },
  {
    value: FREELANCER_SERVICES.NAILS,
    label: "Nails",
    description: "",
    icon: "",
  },
];

export const CLEAR_SIGNUP_ON_SUBMIT = true;

