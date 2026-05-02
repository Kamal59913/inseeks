import { WORKZONE_NAMES } from "@/types/constants/constants";

export const customerTypeOptions = [
  { value: "personal", label: "For Personal User" },
  { value: "professional", label: "For Professional User" },
  { value: "both", label: "Both" },
];

export const whereToWork = [
  { 
    value: WORKZONE_NAMES.HOME_OR_STUDIO, 
    label: "Home or studio",
    description: "Host clients in your own space.",
    icon: "🏠"
  },
  { 
    value: WORKZONE_NAMES.PROFESSIONAL_VENUES, 
    label: "Professional venues",
    description: "Join photoshoots, shows, or corporate events.",
    icon: "📷"
  },
  { 
    value: WORKZONE_NAMES.CLIENT_HOMES, 
    label: "Clients' homes",
    description: "Travel to them for extra convenience.",
    icon: "🎨"
  },
];
