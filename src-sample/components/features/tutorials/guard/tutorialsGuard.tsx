"use client"
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { STEP_ROUTE_MAP } from '@/components/features/tutorials/TutorialManager';
import { RootState } from '@/store/store';

export const TutorialGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  
  // FIX: Access tutorial state from your actual redux structure
  // You need to add tutorial slice to your store first
  const { currentStep, isActive } = useSelector((state: RootState) => state.tutorial);

  useEffect(() => {
    // If tutorial is active (not completed)
    if (isActive) {
      const expectedRoute = STEP_ROUTE_MAP[currentStep];
      if (!expectedRoute) return;

      // If user tries to access a route that's not the current tutorial step
      if (pathname !== expectedRoute && !pathname.startsWith('/onboarding')) {
        // Redirect to current tutorial step
        router.replace(expectedRoute);
      }
    }
  }, [currentStep, isActive, pathname, router]);

  return <>{children}</>;
};

