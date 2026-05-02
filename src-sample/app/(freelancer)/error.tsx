"use client";

/**
 * error.tsx — Next.js App Router error boundary for the (freelancer) route group.
 * Displayed when an unhandled error occurs in /bookings, /catalog/*, /profile/*, or /wallet.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8 text-center">
      <div className="text-5xl">⚠️</div>
      <h2 className="text-xl font-semibold text-white">Something went wrong</h2>
      <p className="text-sm text-gray-400 max-w-sm">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-2 px-5 py-2.5 text-sm font-medium rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
