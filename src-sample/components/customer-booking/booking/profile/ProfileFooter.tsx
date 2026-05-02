"use client";

import React from "react";
import Button from "@/components/ui/button/Button";

interface ProfileFooterProps {
  handleWhatsappOpen: () => void;
  handleInstagramOpen: () => void;
}

const ProfileFooter: React.FC<ProfileFooterProps> = ({
  handleWhatsappOpen,
  handleInstagramOpen,
}) => {
  return (
    <footer className="mt-12 pt-6 border-t border-white/10 text-center text-[11px]">
      <img
        src="/footer-logo.svg"
        className="max-w-[295px] w-full mx-auto mb-3"
      />
      <p className="mb-4 text-[16px] font-[500]">
        Beauty in a hurry, not a rush.
      </p>

      <div className="flex items-center justify-center gap-3 mb-4 mt-6">
        <Button
          variant="glass"
          size="none"
          borderRadius="rounded-[30px]"
          onClick={handleWhatsappOpen}
          className="px-4 py-2 text-sm font-medium leading-none"
        >
          Contact
        </Button>
        <Button
          variant="glass"
          size="none"
          borderRadius="rounded-[30px]"
          onClick={handleInstagramOpen}
          className="px-4 py-2 text-sm font-medium leading-none"
        >
          Follow us
        </Button>
      </div>

      <p className="text-xs font-medium mb-4 mt-10">
        Empera © {new Date().getFullYear()} all rights reserved
      </p>
    </footer>
  );
};

export default ProfileFooter;
