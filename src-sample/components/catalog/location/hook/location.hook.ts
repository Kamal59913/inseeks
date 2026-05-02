import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LocationValidation } from "../validations/location.validation";
import { useEffect, useRef } from "react";
import { WORKZONE_NAMES } from "@/types/constants/constants";

export const useLocationForm = (userData: any, isEditing: boolean = false) => {
  const isInitialMount = useRef(true);

  const formMethods = useForm({
    shouldFocusError: false,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(LocationValidation(isEditing)),
    defaultValues: {
      freelancerPostalCode: "",
      freelancerAddress: "",
      isInternationBooking: false,
      serviceRadius: 5,
      serviceLocation: {
        longitude: -0.1276,
        latitude: 51.5074,
      },
      localTravelFee: "",
    },
  });

  useEffect(() => {
    if (userData && isInitialMount.current) {
      const locations = userData.service_places || [];

      // Get the first available location to populate shared fields
      const firstLoc = locations[0];

      if (firstLoc) {
        formMethods.reset({
          freelancerPostalCode: firstLoc.postcode || "",
          freelancerAddress: firstLoc.address || "",
          isInternationBooking: false,
          serviceRadius: firstLoc.radius
            ? parseInt(firstLoc.radius.replace("km", ""))
            : 5,
          serviceLocation: {
            longitude: firstLoc.longitude
              ? parseFloat(firstLoc.longitude)
              : -0.1276,
            latitude: firstLoc.latitude
              ? parseFloat(firstLoc.latitude)
              : 51.5074,
          },
          localTravelFee: firstLoc.local_travel_fee || "",
        });
      }

      isInitialMount.current = false;
    }
  }, [userData, formMethods]);

  return formMethods;
};

