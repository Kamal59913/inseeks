// hooks/useBookingPersistence.ts
import { useState, useEffect, useCallback } from "react";
import { BookingLocation, Step } from "../booking/types";

export interface BookingState {
  step: number;
  venueOption: string;
  selectedDay: string;
  selectedSlot: string | null;
  notes: string;
  promoApplied: string | null;
  appliedCoupons: {
    code: string;
    discountType: "flat" | "percentage";
    discountValue: number;
  }[];
  location: BookingLocation;
  imagePreviews: (string | null)[];
  uploadedUrls: (string | null)[]; // Changed from imageFiles
  isUploading: boolean[]; // New state for UI loading
  customerData: {
    first_name: string;
    last_name: string;
    country_code: string;
    phone: string;
    email: string;
    enable_newsletter?: boolean;
  };
  paymentData: {
    cardNumber: string;
    expiry: string;
    cvc: string;
    country: string;
    postal: string;
    promo: string;
    // Apple Pay fields
    paymentMethod?: string;
    paymentMethodId?: string;
    clientSecret?: string;
  };
  selectedServiceId: number | null;
  selectedOptionId: number | null;
}

const STORAGE_KEY = "empera_booking_data";
const STORAGE_VERSION = "v4"; // Renamed receive_offers to enable_newsletter
const EXPIRY_HOURS = 24;

interface StorageData {
  version: string;
  timestamp: number;
  data: BookingState;
}

// Utility to check if data is expired
function isExpired(timestamp: number, hours: number): boolean {
  const now = Date.now();
  const expiryTime = hours * 60 * 60 * 1000;
  return now - timestamp > expiryTime;
}

export function useBookingPersistence(
  freelancerId: string,
  initialServiceId?: number | null,
  initialOptionId?: number | null,
) {
  const serviceKeyPart = initialServiceId
    ? `_s${initialServiceId}`
    : "_general";
  const storageKey = `${STORAGE_KEY}_${freelancerId}${serviceKeyPart}`;

  // Default initial state
  const getDefaultState = (): BookingState => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
      step: 0,
      venueOption: "",
      selectedDay: tomorrow.toDateString(),
      selectedSlot: null,
      notes: "",
      promoApplied: null,
      appliedCoupons: [],
      location: {
        line1: "",
        line2: "",
        postal: "",
        city: "London",
      },
      imagePreviews: [null, null, null],
      uploadedUrls: [null, null, null],
      isUploading: [false, false, false],
      customerData: {
        first_name: "",
        last_name: "",
        country_code: "+44",
        phone: "",
        email: "",
        enable_newsletter: false,
      },
      paymentData: {
        cardNumber: "",
        expiry: "",
        cvc: "",
        country: "United Kingdom",
        postal: "",
        promo: "",
      },
      selectedServiceId: initialServiceId ?? null,
      selectedOptionId: initialOptionId ?? null,
    };
  };

  const [bookingState, setBookingState] =
    useState<BookingState>(getDefaultState);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        const stored = localStorage.getItem(storageKey);

        if (!stored) {
          setIsHydrated(true);
          return;
        }

        const parsed: StorageData = JSON.parse(stored);

        // Check version compatibility
        if (parsed.version !== STORAGE_VERSION) {
          localStorage.removeItem(storageKey);
          setIsHydrated(true);
          return;
        }

        // Check expiry
        if (isExpired(parsed.timestamp, EXPIRY_HOURS)) {
          localStorage.removeItem(storageKey);
          setIsHydrated(true);
          return;
        }

        // Reset uploading state on load and restore previews from persistent URLs
        const cleanState = {
          ...parsed.data,
          isUploading: [false, false, false],
          // Critical: Overwrite imagePreviews with uploadedUrls to avoid dead blob: URLs
          imagePreviews: parsed.data.uploadedUrls || [null, null, null],
          uploadedUrls: parsed.data.uploadedUrls || [null, null, null],
        };

        setBookingState(cleanState);
      } catch (error) {
        console.error("Error loading persisted booking data:", error);
        localStorage.removeItem(storageKey);
      } finally {
        setIsHydrated(true);
      }
    };

    loadPersistedData();
  }, [storageKey]);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!isHydrated) return;

    // If we are at the CONFIRM step, do NOT persist.
    // Instead, clear any existing storage so that a refresh resets the flow.
    if (bookingState.step === Step.CONFIRM) {
      localStorage.removeItem(storageKey);
      return;
    }

    const saveData = async () => {
      try {
        const storageData: StorageData = {
          version: STORAGE_VERSION,
          timestamp: Date.now(),
          data: {
            ...bookingState,
            // Don't persist isUploading state, ensuring it defaults specifically on load
          },
        };

        localStorage.setItem(storageKey, JSON.stringify(storageData));
      } catch (error) {
        console.error("Error saving booking data:", error);
      }
    };

    saveData();
  }, [bookingState, storageKey, isHydrated]);

  // Clear persisted data
  const clearPersistedData = useCallback(() => {
    localStorage.removeItem(storageKey);
    setBookingState(getDefaultState());
  }, [storageKey]);

  // Update specific fields
  const updateBookingState = useCallback((updates: Partial<BookingState>) => {
    setBookingState((prev) => ({ ...prev, ...updates }));
  }, []);

  return {
    bookingState,
    updateBookingState,
    setBookingState,
    clearPersistedData,
    isHydrated,
  };
}
