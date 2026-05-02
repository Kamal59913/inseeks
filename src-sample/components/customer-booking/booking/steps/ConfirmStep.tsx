"use client";
import SelectContactMode from "@/components/features/SelectContactMode";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { LinkOpener } from "@/lib/utilities/socialLinks";
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

  const handleFAQClick = () => {
    const faqUrl = process.env.NEXT_PUBLIC_FREELANCER_LANDING_SITE_HELP_PAGE;
    if (faqUrl) {
      LinkOpener(faqUrl);
    }
  };

  return (
    <>
      <Modal
        isOpen={true}
        onClose={closeModal}
        className="max-w-[360px] m-4"
        outsideClick={false}
      >
        <div className="sheet-gradient-bg text-center items-center no-scrollbar relative w-full overflow-y-auto rounded-2xl py-10 px-6">
          {/* Centered Paper Plane Icon */}
          <div className="flex justify-center mb-4">
            <img
              src="/message_sent.svg"
              alt="Message sent"
              className="w-12 h-12 min-w-[48px] min-h-[48px]"
            />
          </div>

          {/* Main heading */}
          <h3 className="text-[16px] font-[700] text-white mb-2">
            Booking request sent!
          </h3>

          {/* Description text */}
          <p className="text-[12px] text-[#EEEEEE] mt-2">
            Thank you for your request. <br />
            You'll receive an email as soon as the artist confirms.
          </p>

          {/* Bold warning text */}
          <p className="text-[12px] font-[700] text-white mt-2">
            Your booking is NOT confirmed until the artist accepts.
          </p>

          {/* FAQ Button */}
          <div className="mt-6">
            <Button
              size="rg"
              className="w-full rounded-full font-[700]"
              onClick={handleFAQClick}
            >
              Frequently Asked Questions
            </Button>
          </div>

          {/* Send Message Button */}
          <div className="mt-3">
            <Button
              size="rg"
              variant="dark"
              className="w-full rounded-full font-[700]"
              onClick={(e) => {
                e.preventDefault();
                setIsContactModalOpen(true);
              }}
            >
              Send message to {freelancer?.first_name}
            </Button>
          </div>
        </div>
      </Modal>

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
