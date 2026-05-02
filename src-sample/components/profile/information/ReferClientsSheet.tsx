import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import { X, Share2, Eye } from "lucide-react";
import { useUserData } from "@/store/hooks/useUserData";
import { getFullProfileUrl } from "@/lib/utilities/profileUtils";
import { copyToClipboard } from "@/lib/utilities/copyToClipboard";
import Button from "@/components/ui/button/Button";
import UrlPreview from "./UrlPreview";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function ReferClientsSheet({ isOpen, onClose }: Props) {
  const { userData } = useUserData();
  const username = userData?.user?.username || "username";
  const profileUrl = getFullProfileUrl(userData?.user?.username || "");

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="sheet-gradient-bg border-none p-0 overflow-y-auto scrollbar-hide"
      >
        <div className="relative flex flex-col items-center px-4 pt-12 pb-8 h-full">
          <SheetClose
            onClick={onClose}
            className="absolute top-6 right-6 text-white hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </SheetClose>

          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-[22px] font-bold text-white leading-tight">
              Earn £25 on your first two bookings
              <br />
              {/* Share your booking link with clients and start earning.{" "} */}
            </h2>
            <p className="text-gray-20 text-[16px]">
              Share your booking link with clients and start earning.
              {/* Share your Empera booking link with clients and earn £25 on your
              first two completed bookings.{" "} */}
            </p>
          </div>

          {/* Avatars */}
          <div className="flex justify-center mb-8 relative w-full max-w-[280px]">
            <img
              src="/welcome_to_empera.png"
              className="w-full h-full object-cover grayscale-[0.3] hover:grayscale-0 transition-all"
              alt=""
            />
          </div>

          {/* Steps */}
          <div className="w-full space-y-4 ">
            {/* Step 1 */}
            <div className="bg-[#282728] border border-white/10 rounded-[8px] py-4 px-6 space-y-4">
              <h3 className="text-white font-medium text-[15px]">
                1. Share your booking link
              </h3>
              <div className="flex gap-2">
                <UrlPreview urlPath={username} />

                <Button
                  variant="glass"
                  size="none"
                  borderRadius="rounded-[12px]"
                  className="w-10 h-10 flex items-center justify-center p-0"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(profileUrl, "_blank");
                  }}
                >
                  <Eye className="w-5 h-5 text-gray-400" />
                </Button>
                <Button
                  variant="glass"
                  size="none"
                  borderRadius="rounded-[12px]"
                  className="px-4 h-10 flex items-center justify-center gap-2 text-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    copyToClipboard(
                      profileUrl,
                      "The profile link is copied to clipboard"
                    );
                  }}
                >
                  <Share2 className="w-5 h-5 text-gray-400" />
                </Button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#282728] border border-white/10 rounded-[8px] py-4 px-6 space-y-4">
              <h3 className="text-white font-medium text-[14px] leading-snug">
                2. Get your first two bookings on Empera. Each booking must be
                of value greater than £50 and must be completed by the 28th of
                February.
              </h3>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center min-w-0">
                  <span className="text-[12px] whitespace-nowrap">
                    Your Username
                  </span>
                </div>
                <UrlPreview urlPath={username} isBaseUrl={false} />

                <Button
                  variant="glass"
                  size="none"
                  borderRadius="rounded-[12px]"
                  className="px-3 h-10 flex items-center justify-center gap-2 text-[12px]"
                  onClick={(e) => {
                    e.preventDefault();
                    copyToClipboard(username, "Username copied to clipboard");
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#282728] border border-white/10 rounded-[8px] py-6 px-6">
              <h3 className="text-white font-medium text-[14px] leading-snug opacity-90">
                3. Once both bookings are completed successfully, you will
                receive £25 from Empera.
              </h3>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ReferClientsSheet;

