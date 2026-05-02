import Loader from "@/components/ui/loader/loader";

/**
 * loading.tsx — Next.js App Router loading state for the (freelancer) route group.
 * Shown while /bookings, /catalog/*, /profile/*, or /wallet pages are loading.
 */
export default function Loading() {
  return <Loader />;
}
