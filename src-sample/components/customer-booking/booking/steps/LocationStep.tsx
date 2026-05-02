"use client";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { locationSchema, LocationFormValues } from "../schemas/locationSchema";
import Label from "@/components/ui/form/label";
import Input from "@/components/ui/form/Input";
import addressService from "@/services/addressService";
import Button from "@/components/ui/button/Button";

const fetchAddresses = async (search_word: string) => {
  const response = await addressService.getAutocomplete(search_word);
  const suggestions = response?.data?.data?.suggestions || [];

  return suggestions.map((s: any) => ({
    id: s.id,
    url: s.id,
    label: s.address,
    value: s.address,
    description: search_word.toUpperCase(), // Displaying the search term as description or keeping it empty if preferred
  }));
};

// const fetchAddresses = async (postcode: string) => {
//   try {
//     const response = await axios.get(
//       `https://api.getAddress.io/autocomplete/${encodeURIComponent(postcode)}`,
//       {
//         params: {
//           "api-key": process.env.NEXT_PUBLIC_GET_ADDRESS,
//           all: true,
//           "show-postcode": true,
//         },
//       }
//     );

//     const suggestions = response?.data?.suggestions || [];

//     return suggestions.map((s: any) => ({
//       id: s.id,
//       value: s.id,
//       label: s.address,
//       description: postcode.toUpperCase(),
//       rawAddress: s.address,
//     }));
//   } catch (error) {
//     console.error("Error fetching from getAddress.io", error);
//     return [];
//   }
// };

export default function LocationStep({
  location,
  setLocation,
  goNext,
}: {
  location: LocationFormValues;
  setLocation: (loc: Partial<LocationFormValues>) => void;
  goNext: () => void;
}) {
  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: location,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = form;

  const [addressRecommendations, setAddressRecommendations] = useState<any[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [noResultsFound, setNoResultsFound] = useState(false);

  // Save last selected ID
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);

  // Ref to track if the update is from a manual selection
  const isSelectionUpdate = useRef(false);

  // Ref for the dropdown container to detect clicks outside
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Watch line1 instead of postal for search
  const line1 = watch("line1");

  useEffect(() => {
    // If this update was triggered by selecting an option, skip the search
    if (isSelectionUpdate.current) {
      isSelectionUpdate.current = false;
      return;
    }

    const searchTerm = line1?.trim() ?? "";

    if (!searchTerm || searchTerm.length < 3) {
      setAddressRecommendations([]);
      setNoResultsFound(false);
      return;
    }

    const search = async () => {
      setIsLoading(true);
      const results = await fetchAddresses(searchTerm);

      if (results.length === 0) {
        setNoResultsFound(true);
        setAddressRecommendations([]);
      } else {
        setAddressRecommendations(results);
        setNoResultsFound(false);
      }

      setIsLoading(false);
    };

    const timer = setTimeout(search, 400);
    return () => clearTimeout(timer);
  }, [line1]);

  useEffect(() => {
    const sub = watch((data) => setLocation(data));
    return () => sub.unsubscribe();
  }, [watch]);

  // Click-outside handler to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setAddressRecommendations([]);
      }
    };

    if (addressRecommendations.length > 0) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [addressRecommendations]);

  const fetchFullAddress = async (id: string) => {
    const response = await addressService.getFullAddress(id);
    const full = response?.data?.data;

    // Auto-fill but allow editing
    setValue("postal", full?.postcode || "");
    setValue("city", full?.town_or_city || "");
    // Note: line1 is already set by the selection in the dropdown handler

    setLastSelectedId(id);
  };

  //   const fetchFullAddress = async (id: string) => {
  //   const apiKey = process.env.NEXT_PUBLIC_GET_ADDRESS;

  //   if (!apiKey) {
  //     console.error("API key not found");
  //     return;
  //   }

  //   try {
  //     const response = await axios.get(
  //       `https://api.getAddress.io/get/${id}?api-key=${apiKey}`
  //     );

  //     const full = response?.data;
  //     setValue("postal", full?.postcode || "");
  //     setValue("city", full?.town_or_city || "");
  //   } catch (error) {
  //     console.error("Full address fetch failed:", error);
  //   }
  // };

  return (
    <form onSubmit={handleSubmit(() => goNext())} className="space-y-4">
      {/* Address Line 1 with Search */}
      <div>
        <Label isRequired={false}>First line of address</Label>
        <div className="relative">
          <Input
            register={register}
            registerOptions="line1"
            type="text"
            placeholder="Start typing address..."
            disabled={false}
            errors={errors}
            autoFocus={true} // Moving autoFocus here as it's the primary interaction point now
          />

          {/* Dropdown Results for Address Search */}
          {isLoading && (
            <p className="text-gray-400 text-[11px] mt-2">Searching…</p>
          )}

          {!isLoading && noResultsFound && (
            <p className="text-red-400 text-[11px] mt-2">No results found.</p>
          )}

          {!isLoading && addressRecommendations.length > 0 && (
            <div
              ref={dropdownRef}
              className="mt-2 bg-[#1a0a1a] border border-white/10 rounded-lg max-h-[160px] overflow-auto absolute z-10 w-full"
            >
              {addressRecommendations.map((opt) => {
                const isPreviouslySelected = opt.id === lastSelectedId;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      // Mark this as a selection update so the effect doesn't re-trigger search
                      isSelectionUpdate.current = true;
                      const trimmedAddress = opt.label
                        .split(",")
                        .slice(0, -2) // remove city + postal code
                        .join(",")
                        .trim();
                      setValue("line1", trimmedAddress);
                      fetchFullAddress(opt.id);
                      setAddressRecommendations([]); // Clear results after selection
                    }}
                    className={`block w-full text-left p-3 text-xs hover:bg-white/10 
                      ${isPreviouslySelected ? "bg-white/20" : "bg-[#1a0a1a]"}`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Address Line 2 */}
      <div>
        <Label isRequired={false}>Second line of address</Label>
        <Input
          register={register}
          registerOptions="line2"
          type="text"
          placeholder="Second line of address (optional)"
          errors={errors}
        />
      </div>

      {/* POSTAL + CITY */}
      <div className="grid grid-cols-2 gap-3">
        {/* Postal */}
        <div>
          <Label isRequired={false}>Postal code</Label>
          <Input
            register={register}
            registerOptions="postal"
            type="text"
            placeholder="Postal code"
            errors={errors}
            disabled={false} // Enabled for manual edit
          />
        </div>

        {/* City */}
        <div>
          <Label isRequired={false}>City</Label>
          <Input
            register={register}
            registerOptions="city"
            type="text"
            placeholder="City" // Changed from Auto-filled to generic
            errors={errors}
            disabled={false} // Enabled for manual edit
          />
        </div>
      </div>

      <Button
        type="submit"
        variant="white"
        size="none"
        borderRadius="rounded-lg"
        className="w-full py-3 text-sm font-bold mt-6"
      >
        Continue
      </Button>
    </form>
  );
}
