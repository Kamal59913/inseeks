"use client";

import BookingsLayout from "@/components/layouts/bookingsLayout";

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BookingsLayout>
        {children}
    </BookingsLayout>
  );
}

