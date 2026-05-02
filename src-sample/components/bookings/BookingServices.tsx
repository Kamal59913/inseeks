"use client";
import { SingleOnBoard } from "../ui/dropdown/SingleOnboardController";
import { useState, useMemo } from "react";
import { useModalData } from "@/store/hooks/useModal";
import { ToastService } from "@/lib/utilities/toastService";
import BookingServicesForm from "./BookingServicesForm";
import freelancerServicesService from "@/services/freelancerServicesService";
import { useGetFreeLancerBookings } from "@/hooks/bookingServices/useGetBookingServices";
import { bookingStatusOptions } from "@/lib/utilities/typOptions";
import {
  formatDate,
  formatMinutesToDecimalHours,
} from "@/lib/utilities/timeFormat";
import { Booking } from "@/types/api/booking.types";

const BookingServices = () => {
  const [currentBookingType, setCurrentBookingType] = useState("pending");
  const [currentData, setCurrentData] = useState<Booking>();
  const { close } = useModalData();
  const [isFormOpening, setIsFormOpening] = useState({
    isOpenModal: false,
    idIfEditMode: "" as string | number,
  });

  const { data: localData, isPending } = useGetFreeLancerBookings({
    page: 1,
    limit: 1000,
  });

  const bookingsList = localData?.data?.data || [];

  // Filter for Upcoming tab (Pending + Accepted)
  const pendingBookings = useMemo(
    () => bookingsList.filter((item: Booking) => item.appointment_status === "pending"),
    [bookingsList]
  );
  const acceptedBookings = useMemo(
    () => bookingsList.filter((item: Booking) => item.appointment_status === "accepted"),
    [bookingsList]
  );

  // Filter for other tabs
  const otherBookings = useMemo(() => {
    if (currentBookingType === "accepted") {
      return bookingsList.filter((item: Booking) => item.appointment_status === "completed");
    }
    return bookingsList.filter((item: Booking) => item.appointment_status === currentBookingType);
  }, [bookingsList, currentBookingType]);

  const deleteBooking = async (_id: string) => {
    const response = await freelancerServicesService.deleteServicesById(_id);

    if (response.status === 200) {
      ToastService.success(
        `${(response as any).data?.message || "Booking Deleted Successfully"}`,
        "delete-booking"
      );
      close();
    } else {
      if (response?.status !== 401) {
        ToastService.error(
          `${(response as any).data?.message || "Failed Deleting Booking"}`,
          "delete-booking-fail"
        );
      }
    }
  };

  return (
    <>
      <SingleOnBoard
        title=""
        options={bookingStatusOptions}
        value={currentBookingType}
        onChange={(value) => {
          setCurrentBookingType(value);
        }}
        variant="pills"
      />

      {currentBookingType === "pending" ? (
        <div className="flex flex-col h-[60vh] mt-6 overflow-hidden">
          {/* PENDING CONFIRMATION SECTION */}
          <div className="flex flex-wrap mb-4">
            <h2 className="text-sm font-normal text-white mb-3 flex-shrink-0">
              Pending confirmation
            </h2>
            <div className=" flex gap-3 flex-col w-full pr-3 max-h-[190px] overflow-y-auto">
              {pendingBookings.map((booking: Booking) => (
                <div
                  key={booking.id}
                  className="text-[12px] bg-white rounded-2xl px-5 py-4 hover:opacity-90 transition-all duration-200 cursor-pointer shadow-sm shadow-[inset_0_-4px_4px_0_rgba(99,90,90,0.25)]"
                  onClick={() => {
                    setIsFormOpening({
                      isOpenModal: true,
                      idIfEditMode: booking.id,
                    });
                    setCurrentData(booking);
                  }}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex-1 flex items-center gap-3">
                      <span className="w-3 h-3 inline-block bg-[#7B5BDA] rounded-full flex-shrink-0"></span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-[#7B5BDA] text-xs">
                            {formatDate(booking.service_start_at, { format: "short" })}
                          </span>
                        </div>

                      <h3 className="text-[12px] font-normal text-gray-900 mb-0">
                        {booking.product?.name} - {booking.productOption?.name}{" "}
                        {formatMinutesToDecimalHours(
                          booking?.productOption?.duration || 0
                        )}
                      </h3>

                      <p className="text-black font-medium">
                        {booking.servicePlace?.name}
                      </p>
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <span className="text-[12px] font-normal text-gray-900">
                        £{booking.service_amount}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {pendingBookings.length === 0 && !isPending && (
                <p className="text-center text-gray-500 text-xs py-4">
                  No pending bookings.
                </p>
              )}
            </div>
          </div>

          {/* ACCEPTED BOOKINGS SECTION */}
          <div className="flex-1 flex flex-col min-h-0">
            <h2 className="text-sm font-normal text-white mb-3 flex-shrink-0">
              Accepted bookings
            </h2>
            <div className="flex-1 overflow-y-auto space-y-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:min-h-[50px] dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 pr-2 pb-4">
              {acceptedBookings.map((booking: Booking) => (
                <div
                  key={booking.id}
                  className="text-[12px] service-category-card px-5 py-4 hover:to-[#3a3a45] transition-all duration-200 cursor-pointer"
                  onClick={() => {
                    setIsFormOpening({
                      isOpenModal: true,
                      idIfEditMode: booking.id,
                    });
                    setCurrentData(booking);
                  }}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {/* <span className="w-2 h-2 rounded-full bg-purple-500"></span> */}
                        <span className="font-bold text-[#7B5BDA]">
                          {formatDate(booking.service_start_at, { format: "short" })}
                        </span>
                      </div>

                      <h3 className="text-[12px] font-normal text-white mb-1">
                        {booking.product?.name} - {booking.productOption?.name}{" "}
                        {formatMinutesToDecimalHours(
                          booking?.productOption?.duration || 0
                        )}
                      </h3>

                      <p className="font-medium">
                        {booking.servicePlace?.name}
                      </p>
                    </div>

                    <div className="text-right ml-4">
                      <span className="text-[12px] font-normal text-white">
                        £{booking.service_amount}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {acceptedBookings.length === 0 && !isPending && (
                <p className="text-center text-gray-500 text-xs py-4">
                  No accepted bookings.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* OTHER TABS (Completed, Rejected) */
        <div className="mt-6 space-y-2 max-h-[60vh] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:min-h-[50px] dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 pr-2">
          {otherBookings.map((booking: Booking) => (
            <div
              key={booking.id}
              className="text-[12px] service-category-card px-5 py-4 hover:to-[#3a3a45] transition-all duration-200 cursor-pointer"
              onClick={() => {
                setIsFormOpening({
                  isOpenModal: true,
                  idIfEditMode: booking.id,
                });
                setCurrentData(booking);
              }}
            >
              <div className="flex items-start justify-between w-full">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    <span className="font-medium text-purple-600 dark:text-purple-400">
                      {formatDate(booking.service_start_at, { format: "short" })}
                    </span>
                  </div>

                  <h3 className="text-[12px] font-semibold text-gray-900 dark:text-white mb-1">
                    {booking.product?.name} - {booking.productOption?.name}{" "}
                    {formatMinutesToDecimalHours(
                      booking?.productOption?.duration || 0
                    )}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400">
                    {booking.servicePlace?.name}
                  </p>
                </div>

                <div className="text-right ml-4">
                  <span className="text-[12px] font-normal text-gray-900 dark:text-white">
                    £{booking.service_amount}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {otherBookings.length === 0 && !isPending && (
            <p className="text-center text-gray-500 mt-6">No bookings found.</p>
          )}
        </div>
      )}

      {isFormOpening.isOpenModal && (
        <div>
          <BookingServicesForm
            IdIfEditMode={isFormOpening.idIfEditMode}
            isOpen={isFormOpening.isOpenModal}
            currentData={currentData!}
            onClose={() =>
              setIsFormOpening({
                isOpenModal: false,
                idIfEditMode: "",
              })
            }
          />
        </div>
      )}
    </>
  );
};

export default BookingServices;

