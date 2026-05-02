"use client";
import SelectContactMode from "@/components/features/SelectContactMode";
import Button from "@/components/ui/button/Button";
import { useState } from "react";

import { Freelancer } from "@/types/api/freelancer.types";

export default function ConfirmStep({
  selected,
  closeModal,
  freelancer,
}: {
  selected: Freelancer;
  closeModal: () => void;
  freelancer: Freelancer | undefined;
}) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <>
      <div className="text-center py-8 px-6">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          className="mx-auto mb-4"
        >
          <path
            fill="none"
            stroke="#fff"
            strokeWidth="1.5"
            d="M2 12 L9 19 L22 4"
          />
        </svg>

        <h3 className="text-xl font-semibold">Booking request sent!</h3>
        <p className="text-sm text-purple-300 mt-2">
          Thank you for your request. You'll receive an email as soon as the
          artist confirms.
        </p>

        <div className="mt-6">
          <Button
            size="rg"
            className="w-full rounded-full font-medium"
            onClick={closeModal}
          >
            Done
          </Button>
        </div>

        <div className="mt-3">
          <Button
            size="rg"
            variant="dark"
            className="w-full rounded-full font-medium"
            onClick={(e) => {
              e.preventDefault();
              setIsContactModalOpen(true);
            }}
          >
            Send message to {freelancer?.first_name}
          </Button>
        </div>
      </div>
      <SelectContactMode
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        freelancerData={freelancer}
        mode="profile"
        emptyMessage="Freelancer have not provided any Contacts"
      />
    </>
  );
}
