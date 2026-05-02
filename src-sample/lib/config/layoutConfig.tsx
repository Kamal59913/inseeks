// lib/config/layoutConfig.ts
import FullScreenLayout from "@/components/layouts/FullScreenLayout";
import OnboardingScreenLayout from "@/components/layouts/OnboardingScreenLayout";
import AuthCenteredLayout from "@/components/layouts/AuthCenteredLayout";

type LayoutComponent = React.ComponentType<{ children: React.ReactNode }>;

interface LayoutRule {
  match: (pathname: string) => boolean;
  component: LayoutComponent;
}

// Define rules in priority order (first match wins)
export const LAYOUT_RULES: LayoutRule[] = [
  // Specific paths first (higher priority)
  {
    match: (path) => ["/signup", "/login"].includes(path),
    component: FullScreenLayout,
  },
  {
    match: (path) =>
      [
        "/user-type",
        "/login/freelancer",
        "/get-started-freelancer",
        "/forget-password/freelancer",
        "/reset-password/freelancer",
        "/update-password/freelancer",
        "/directions",
        "/customer",
      ].includes(path),
    component: AuthCenteredLayout,
  },
  {
    match: (path) => path.startsWith("/signup/") || path === "/get-started-customer",
    component: OnboardingScreenLayout,
  },
  // Add more specific rules as needed
];

export const DEFAULT_LAYOUT = OnboardingScreenLayout;

export function getLayoutForPath(pathname: string): LayoutComponent {
  const rule = LAYOUT_RULES.find((rule) => rule.match(pathname));
  return rule ? rule.component : DEFAULT_LAYOUT;
}

