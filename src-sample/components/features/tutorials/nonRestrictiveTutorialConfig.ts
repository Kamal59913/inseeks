// Tutorial popup configuration for non-restrictive flow
interface PopupConfig {
  module: string;
  route: string;
  title: string;
  description: string;
  ctaText: string;
}

export const NON_RESTRICTIVE_TUTORIAL_CONFIG: PopupConfig[] = [
  {
    module: "information",
    route: "/profile/information",
    title: "Welcome to your Empera Profile.",
    description:
      "Firstly please make sure that your personal information is accurate.",
    ctaText: "Review my information",
  },
  {
    module: "photos",
    route: "/profile/photos",
    title: "Update your portfolio",
    description:
      "Update your portfolio to showcase your best work. We recommend to upload at least 5 high quality pictures.",
    ctaText: "Update my porftolio",
  },
  {
    module: "contact",
    route: "/profile/contact",
    title: "Add your contact information",
    description:
      "Add your personal contact information to make sure your clients can reach you.",
    ctaText: "Review my contacts",
  },
  {
    module: "services",
    route: "/catalog/services",
    title: "Create your services",
    description: "Now create your services to allow customers to book you.",
    ctaText: "Create services",
  },
  {
    module: "availability",
    route: "/catalog/availability",
    title: "Update your availabilities",
    description:
      "Finally, add the days and times youre open to work. These slots will be shown as bookable times to clients.",
    ctaText: "Update my availabilities",
  },
  {
    module: "wallet",
    route: "/wallet",
    title: "Add your billing details and connect to Stripe",
    description: "Update my availabilities",
    ctaText: "Connect to Stripe",
  },
  {
    module: "finished_step",
    route: "/profile/information",
    title: "Your profile is ready!",
    description:
      "You can now share your Public profile link and receive your first bookings. You can always go back and edit your profile.",
    ctaText: "FinishedStep",
  },
];

// Helper to get config for a specific route
export const getTutorialConfigForRoute = (
  route: string
): PopupConfig | undefined => {
  return NON_RESTRICTIVE_TUTORIAL_CONFIG.find(
    (config) => config.route === route
  );
};

