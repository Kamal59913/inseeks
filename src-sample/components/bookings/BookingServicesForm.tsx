import { useModalData } from "@/store/hooks/useModal";
import { useUserData } from "@/store/hooks/useUserData";
import { calculatePayout } from "@/lib/utilities/payoutCalculator";
import Button from "../ui/button/Button";
import { Sheet, SheetContent } from "../ui/sheet";
import freelancerBookingsService from "@/services/freelancerBookingsService";
import { ToastService } from "@/lib/utilities/toastService";
import axios from "axios";
import { useState, useEffect } from "react";
import { calculateDistance, geocodeAddress } from "@/lib/utilities/location";
import {
  formatDate,
  formatMinutesToDecimalHours,
} from "@/lib/utilities/timeFormat";
import { ShowIf } from "@/lib/utilities/showIf";
import { useRouter } from "next/navigation";
import SelectContactMode from "../features/SelectContactMode";
import ReferenceImageModal from "../ui/modals/ReferenceImageModal";
import { Booking } from "@/types/api/booking.types";

interface RhsCardProps {
  isOpen: boolean;
  onClose: () => void;
  IdIfEditMode?: string | number;
  currentData: Booking;
}

function BookingServicesForm({
  isOpen,
  onClose,
  IdIfEditMode,
  currentData,
}: RhsCardProps) {
  /*Will do it by API*/
  // const isEditMode = !!IdIfEditMode;
  // const { data: singleServiceData } = useGetServiceById(IdIfEditMode || "", {
  //   enabled: isEditMode,
  // });

  const { open, close } = useModalData();
  const router = useRouter();
  const { userData } = useUserData();

  const platformFee = Number(userData?.user?.platform_fee) || 0;
  const stripeFee = Number(userData?.user?.stripe_fee) || 0;
  const price = currentData?.productOption?.price || 0;
  const totalFee = ((platformFee + stripeFee) / 100) * price;
  const payout = calculatePayout(price, platformFee, stripeFee);

  const [isContactModeOpening, setIsContactModeOpening] = useState({
    isOpenModal: false,
    idIfEditMode: "",
  });

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isOutOfRange, setIsOutOfRange] = useState(false);

  useEffect(() => {
    const checkRange = async () => {
      const homePlace = userData?.service_places?.find(
        (p: any) => p.service_place_id === 1 // keeping any for userData for now as it's separate effort
      );
      const clientLocation = currentData?.locations?.[0];

      if (homePlace && clientLocation) {
        let clientLat = clientLocation.latitude
          ? Number(clientLocation.latitude)
          : null;
        let clientLng = clientLocation.longitude
          ? Number(clientLocation.longitude)
          : null;

        if (clientLat === null || clientLng === null) {
          const addressString = [
            clientLocation.address_1,
            clientLocation.address_2,
            clientLocation.city,
            clientLocation.postal_code,
          ]
            .filter(Boolean)
            .join(", ");

          if (addressString) {
            const coords = await geocodeAddress(addressString);
            if (coords) {
              clientLng = coords[0];
              clientLat = coords[1];
            }
          }
        }

        if (
          clientLat !== null &&
          clientLng !== null &&
          homePlace.latitude &&
          homePlace.longitude
        ) {
          const distance = calculateDistance(
            parseFloat(homePlace.latitude),
            parseFloat(homePlace.longitude),
            clientLat,
            clientLng
          );

          const radiusKm = homePlace.radius
            ? parseFloat(homePlace.radius.replace("km", ""))
            : 0;

          if (distance > radiusKm) {
            setIsOutOfRange(true);
          } else {
            setIsOutOfRange(false);
          }
        }
      }
    };

    if (isOpen && currentData) {
      checkRange();
    }
  }, [isOpen, currentData, userData]);

  const handleImageClick = (idx: number) => {
    setSelectedPhotoIndex(idx);
    setIsPhotoModalOpen(true);
  };

  const declineBooking = async (_id: string, reason: string) => {
      const response = await freelancerBookingsService.declineBookingsById(
        _id,
        reason
      );

      if (response.status === 200) {
        close();
        onClose();

        const paymentResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/payments/${_id}/cancel`
        );

        ToastService.success(
          `${(response as any).data?.message || "Booking Declined Successfully"}`,
          "delete-booking"
        );
      } else {
        if (response?.status !== 401) {
          ToastService.error(
            `${(response as any).data?.message || "Failed Declining Booking"}`,
            "decline-booking-fail"
          );
        }
      }
  
  };

  const acceptBooking = async (_id: string) => {
      const response = await freelancerBookingsService.acceptBookingsById(_id);

      if (response.status === 200) {
        close();
        onClose();

        const paymentResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/payments/${_id}/capture`
        );


        ToastService.success(
          `${(response as any)?.data?.message || "Bookings confirmed successfully"}`,
          "confirmed-booking"
        );
      } else {
        if (response?.status !== 401) {
          ToastService.error(
            `${(response as any)?.data?.message || "Failed confirming booking"}`,
            "booking-confirmation-failed"
          );
        }
      }
  };

  return (
    <Sheet open={isOpen} modal={false}>
      {isOpen && (
        <div
          className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <SheetContent
        side="bottom"
        className="sheet-gradient-bg border-none p-0 overflow-y-auto scrollbar-hide"
      >
        <div className="flex items-center justify-end pt-4 px-4 border-gray-700/50 overflow-hidden">
          <img
            src={"/xIcon.svg"}
            className="cursor-pointer"
            onClick={() => onClose()}
          />
        </div>

        <div className="px-6 pb-6 text-white">
          {/* Header */}
          <div className="text-center mb-5">
            <p className="text-xs mb-2">
              {currentData?.service_start_at &&
                formatDate(currentData.service_start_at, { format: "short" })}
            </p>
            <h1 className="text-base font-semibold mb-2">
              {currentData?.product?.name} {currentData?.productOption?.name}{" "}
              {formatMinutesToDecimalHours(
                currentData?.productOption?.duration || 0
              )}
            </h1>
            <p className="text-xs text-gray-300">
              Option: {currentData?.productOption?.name}
            </p>
            <p className="text-xs text-gray-300">
              {currentData?.servicePlace?.name} • £{currentData?.service_amount}
            </p>
          </div>

          <div className="border-t border-white/10 pt-5">
            {/* Client Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Client</p>
                  <p className="text-base font-medium capitalize">
                    {currentData?.customer?.first_name}{" "}
                    {currentData?.customer?.last_name?.charAt(0)}.
                  </p>
                </div>
                <Button
                  size="none"
                  variant="glass"
                  className={`h-[40px] text-[12px] px-4 font-medium leading-none whitespace-nowrap`}
                  borderRadius="rounded-[16px]"
                  onClick={() => {
                    setIsContactModeOpening({
                      isOpenModal: true,
                      idIfEditMode: "",
                    });
                  }}
                >
                  Contact {currentData?.customer?.first_name}
                </Button>
              </div>
            </div>

            {/* Location Section */}
            <div className="flex justify-between mb-6 items-end">
              <div className="max-w-[200px] break-all">
                <p className="text-xs text-gray-400 mb-2">Location</p>
                <p className="text-sm mb-1">
                  {currentData?.servicePlace?.name || "Client's home"}
                </p>
                {currentData?.locations?.[0] && (
                  <>
                    <p className="text-sm">
                      {currentData.locations[0].address_1}
                    </p>
                    {currentData.locations[0].address_2 && (
                      <p className="text-sm">
                        {currentData.locations[0].address_2}
                      </p>
                    )}
                    <p className="text-sm">
                      {currentData.locations[0].city}{" "}
                      {currentData.locations[0].postal_code}
                    </p>
                  </>
                )}
              </div>
              <div>
                <Button
                  size="none"
                  variant="glass"
                  className={`h-[40px] text-[12px] px-4 font-medium leading-none whitespace-nowrap`}
                  borderRadius="rounded-[16px]"
                  onClick={() => {
                    const location = currentData?.locations?.[0];
                    if (!location) return;

                    const destination = [
                      location.address_1,
                      location.address_2 || "",
                      location.city,
                      location.postal_code,
                    ]
                      .filter(Boolean)
                      .join(", ");

                    // Get precise device location
                    navigator.geolocation.getCurrentPosition(
                      (pos) => {
                        const lat = pos.coords.latitude;
                        const lng = pos.coords.longitude;

                        const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${encodeURIComponent(
                          destination
                        )}`;

                        window.open(mapsUrl, "_blank");
                      },
                      (err) => {
                        console.error(
                          "Location access denied, falling back to Google",
                          err
                        );

                        // fallback: Google will try to guess, but may be inaccurate
                        const fallbackUrl = `https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${encodeURIComponent(
                          destination
                        )}`;
                        window.open(fallbackUrl, "_blank");
                      }
                    );
                  }}
                >
                  Get directions
                </Button>
              </div>
            </div>

            {/* Out of Range Warning */}
            {isOutOfRange && (
              <div className="flex items-center gap-2 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-xl p-3 mb-6">
                <img src="/exclamation_sign.svg" className="w-4 h-4" />
                <p className="text-[12px] text-[#FFD700]">
                  This address is outside of your travel range.
                </p>
              </div>
            )}

            {/* Notes Section */}
            {currentData?.special_instructions && (
              <div className="mb-6 border-t border-white/10 pt-5">
                <p className="text-xs text-gray-400 mb-2">Notes</p>
                <p className="text-sm italic">
                  {currentData.special_instructions}
                </p>
              </div>
            )}

            {/* Photo References */}
            {currentData?.imageReferences &&
              currentData.imageReferences.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs text-gray-400 mb-2">Photo references</p>
                  <div className="flex gap-2">
                    {currentData?.imageReferences?.map(
                      (image: any, idx: number) => {
                        return (
                          <img
                            key={idx}
                            src={image.image_url}
                            alt={`Reference ${idx + 1}`}
                            className="w-20 h-20 rounded-xs object-cover cursor-pointer"
                            onClick={() => handleImageClick(idx)}
                          />
                        );
                      }
                    )}
                  </div>
                </div>
              )}

            {/* Pricing Section */}
            <div className="mb-6 border-t border-white/10 pt-5">
              <div className="flex justify-between text-[12px] mb-1">
                <span className="text-normal">Subtotal</span>
                <span className="text-normal">£{price?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[12px] mb-2">
                <span className="text-normal">Payment processor fees</span>
                <span className="text-normal">-£{totalFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[14px] font-bold mt-3">
                <span>Payout</span>
                <span>£{payout}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <ShowIf condition={currentData?.appointment_status === "pending"}>
                <Button
                  onClick={() => {
                    open("booking-action", {
                      title: "Are you sure you want to decline this booking?",
                      description:
                        "The customer will be notified, and this action cannot be undone.",
                      type: "decline",

                      action: (reason?: any) => {
                        declineBooking(currentData.id as string, reason as string);
                      },
                    });
                  }}
                  size="sm"
                  className="w-40  text-red-500 rounded-[16px]
  border border-white/15
  bg-[linear-gradient(180deg,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0.03)_100%)]
  shadow-[inset_0_4px_4px_0_rgba(255,255,255,0.25)] px-[22px] py-2 text-[14px] font-medium h-full"
                  variant="dark2"
                >
                  Decline ✕
                </Button>
                <Button
                  className="w-full h-[39px] backdrop-blur-[94px] px-[22px] py-2 text-[14px] font-medium"
                  variant="whiteGreen"
                  borderRadius="rounded-[16px]"
                  size="sm"
                  onClick={() => {
                    open("booking-action", {
                      title: "Are you sure you want to accept this booking?",
                      description:
                        "The customer will be notified, and this action cannot be undone.",
                      type: "confirm",
                      action: () => {
                        acceptBooking(currentData.id as string);
                      },
                    });
                  }}
                >
                  Confirm ✓
                </Button>
              </ShowIf>
              <ShowIf
                condition={currentData?.appointment_status === "rejected"}
              >
                <Button
                  onClick={() => {
                    open("booking-action", {
                      title: "Are you sure you want to decline this booking?",
                      description:
                        "The customer will be notified, and this action cannot be undone.",
                      type: "decline",

                      action: (reason?: any) => {
                        declineBooking(currentData.id as string, reason as string);
                      },
                    });
                  }}
                  size="sm"
                  className="w-40 text-red-500 rounded-[14px] shadow-[inset_0_-4px_4px_0_rgba(3,2,2,0.25)] backdrop-blur-[94px] px-[22px] py-1.5 text-[14px] font-medium"
                  variant="dark2"
                  disabled={true}
                >
                  Declined ✕
                </Button>
              </ShowIf>
              <ShowIf
                condition={currentData?.appointment_status === "accepted"}
              >
                <Button
                  className="w-40 backdrop-blur-[94px] px-[22px] py-1.5 text-[14px] font-medium"
                  size="sm"
                  variant="whiteGreen"
                  borderRadius="rounded-[14px]"
                  onClick={() => {
                    open("booking-action", {
                      title: "Are you sure you want to accept this booking?",
                      description:
                        "The customer will be notified, and this action cannot be undone.",
                      type: "confirm",
                      action: () => {
                        acceptBooking(currentData.id as string);
                      },
                    });
                  }}
                  disabled={true}
                >
                  Confirmed ✓
                </Button>
              </ShowIf>
            </div>
          </div>
        </div>
        {isContactModeOpening.isOpenModal && (
          <div>
            <SelectContactMode
              isOpen={isContactModeOpening.isOpenModal}
              currentData={currentData}
              email={currentData?.customer?.email}
              phone={currentData?.customer?.phone}
              onClose={() =>
                setIsContactModeOpening({
                  isOpenModal: false,
                  idIfEditMode: "",
                })
              }
            />
          </div>
        )}
        {isPhotoModalOpen && (
          <ReferenceImageModal
            images={currentData?.imageReferences || []}
            initialIndex={selectedPhotoIndex}
            onClose={() => setIsPhotoModalOpen(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

export default BookingServicesForm;

