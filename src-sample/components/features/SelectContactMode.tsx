import { Sheet, SheetContent } from "../ui/sheet";
import { ToastService } from "@/lib/utilities/toastService";
import { copyToClipboard } from "@/lib/utilities/copyToClipboard";

interface RhsCardProps {
  isOpen: boolean;
  onClose: () => void;
  currentData?: any; // For booking mode
  freelancerData?: any; // For profile mode
  email?: string;
  phone?: string;
  mode?: "booking" | "profile";
  emptyMessage?: string;
}

function SelectContactMode({
  isOpen,
  onClose,
  currentData,
  freelancerData,
  email,
  phone,
  mode = "booking",
  emptyMessage = "No Contacts are available",
}: RhsCardProps) {
  const handleCopy = (text: string, type: string) => {
    if (text) {
      copyToClipboard(text, `${type} copied to clipboard`);
    } else {
      ToastService.error(`No ${type.toLowerCase()} available`);
    }
  };

  const handleEmailClick = () => {
    if (mode === "profile") {
      handleCopy(freelancerData?.additional_info?.email, "Email");
    } else {
      const emailToCopy = email || currentData?.freelancer?.email;
      handleCopy(emailToCopy, "Email");
    }
  };

  const handlePhoneClick = () => {
    // In booking mode, this is just "Phone"
    const phoneToCopy = phone || currentData?.freelancer?.phone;
    handleCopy(phoneToCopy, "Phone number");
  };

  const handleWhatsAppClick = () => {
    handleCopy(
      freelancerData?.additional_info?.whats_app_number,
      "WhatsApp number"
    );
  };

  const handleSMSClick = () => {
    handleCopy(freelancerData?.additional_info?.sms_number, "SMS number");
  };

  // Determine which buttons to show
  const showEmail =
    mode === "booking" ||
    (mode === "profile" && freelancerData?.additional_info?.email_enabled);

  const showPhone = mode === "booking"; // Only for booking mode as per requirement

  const showWhatsApp =
    mode === "profile" &&
    freelancerData?.additional_info?.whats_app_number_enabled;

  const showSMS =
    mode === "profile" && freelancerData?.additional_info?.sms_number_enabled;

  const hasAnyContact = showEmail || showPhone || showWhatsApp || showSMS;

  const getName = () => {
    if (mode === "profile") {
      return freelancerData?.first_name || "Freelancer";
    }
    return (
      currentData?.customer?.first_name ||
      currentData?.freelancer?.first_name ||
      "Contact"
    );
  };

  return (
    <Sheet open={isOpen}>
      <SheetContent
        side="bottom"
        className="border-none p-0 h-auto overflow-y-auto scrollbar-hide rounded-t-3xl bg-linear-to-b from-[#25002E] to-black text-white pb-8"
      >
        {/* Close Button */}
        <div className="flex items-center justify-end pt-4 px-4 h-full">
          <img
            src={"/xIcon.svg"}
            className="cursor-pointer opacity-80 hover:opacity-100"
            onClick={onClose}
            alt="Close"
          />
        </div>

        {/* Title */}
        <h2 className="capitalize text-[16px] font-semibold px-6 mb-4">
          Message {getName()}
        </h2>

        {/* Options */}
        <div className="px-6 space-y-3">
          {!hasAnyContact && (
             <div className="text-gray-400 text-center py-4 text-sm">
             {emptyMessage}
           </div>
          )}

          {showWhatsApp && (
            <button
              onClick={handleWhatsAppClick}
              className="flex w-full justify-between text-[12px] service-category-card px-5 py-4 hover:to-[#3a3a45] transition-all duration-200 cursor-pointer"
            >
              <span className="text-[14px] font-medium">WhatsApp</span>
              {/* You might want to add a WhatsApp icon here if available, reusing mail/phone for now or generic */}
              <img src="/text_and_phone.svg" className="w-6" alt="WhatsApp" />
            </button>
          )}

          {showEmail && (
            <button
              onClick={handleEmailClick}
              className="flex w-full justify-between text-[12px] service-category-card px-5 py-4 hover:to-[#3a3a45] transition-all duration-200 cursor-pointer"
            >
              <span className="text-[14px] font-medium">Email</span>
              <img src="/mail.svg" className="w-6" alt="Email" />
            </button>
          )}

          {showSMS && (
            <button
              onClick={handleSMSClick}
              className="flex w-full justify-between text-[12px] service-category-card px-5 py-4 hover:to-[#3a3a45] transition-all duration-200 cursor-pointer"
            >
              <span className="text-[14px] font-medium">Text</span>
              <img src="/text_and_phone.svg" className="w-6" alt="Text" />
            </button>
          )}

          {showPhone && (
            <button
              onClick={handlePhoneClick}
              className="flex w-full justify-between text-[12px] service-category-card px-5 py-4 hover:to-[#3a3a45] transition-all duration-200 cursor-pointer"
            >
              <span className="text-[14px] font-medium">Phone</span>
              <img src="/text_and_phone.svg" className="w-6" alt="Phone" />
            </button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default SelectContactMode;

