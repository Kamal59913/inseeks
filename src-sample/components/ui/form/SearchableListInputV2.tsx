"use client";
import React, { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import Input from "./Input";
import { SingleOnBoard } from "../dropdown/SingleOnboardController";
import addressService from "@/services/addressService";

const fetchAddresses = async (postcode: string) => {
  try {
    const response = await addressService.getAutocomplete(postcode);
    const suggestions = response?.data?.data?.suggestions || [];

    return suggestions.map((s: any) => ({
      id: s.id,
      value: s.id, // IMPORTANT: id is the value returned by SingleOnBoard
      label: s.address,
      description: s.postcode?.toUpperCase() || postcode.toUpperCase(),
      rawAddress: s.address, // keep original for line1
    }));
  } catch {
    return [];
  }
};


interface PostcodeAddressFormV2Prop {
  formMethods: any;
  field: string;
  typingField: string;
  postcodeField?: string;
}

const PostcodeAddressFormV2: React.FC<PostcodeAddressFormV2Prop> = ({
  formMethods,
  field,
  typingField,
  postcodeField,
}) => {
  const [postalCodeRecommendations, setPostalCodeRecommendations] =
    useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [noResultsFound, setNoResultsFound] = useState(false);

  const postalCode = formMethods.watch(typingField);

  const fetchFullAddress = async (id: string) => {
    try {
      const response = await addressService.getFullAddress(id);
      const full = response?.data?.data;
      if (postcodeField) {
        formMethods.setValue(postcodeField, full?.postcode || "");
      }
    } catch (error) {
      console.error("Full address lookup failed:", error);
    }
  };

  // const fetchFullAddress = async (id: string) => {
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
  //     formMethods.setValue("postalCodeHomeStudio", full?.postcode || "");
  //   } catch (error) {
  //     console.error("Full address fetch failed:", error);
  //   }
  // };

  useEffect(() => {
    const searchAddresses = async () => {
      const trimmedPostalCode = postalCode?.replace(/\s/g, "") || "";

      if (trimmedPostalCode && trimmedPostalCode.length >= 3) {
        setIsLoading(true);
        setNoResultsFound(false);

        try {
          const results = await fetchAddresses(trimmedPostalCode);

          if (results.length === 0) {
            setNoResultsFound(true);
            setPostalCodeRecommendations([]);
          } else {
            setPostalCodeRecommendations(results);
            setNoResultsFound(false);
          }
        } catch {
          setPostalCodeRecommendations([]);
          setNoResultsFound(true);
        } finally {
          setIsLoading(false);
        }
      } else {
        setPostalCodeRecommendations([]);
        setNoResultsFound(false);
        formMethods.setValue(field, "");
      }
    };

    const timeout = setTimeout(searchAddresses, 400);
    return () => clearTimeout(timeout);
  }, [postalCode, formMethods, field, typingField]);

  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    // Reset selection when recommendations change
    setSelectedId("");
  }, [postalCodeRecommendations]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-2 text-center">
        <p className="text-sm text-gray-400">
          This helps clients know where to find you when booking at your space.
        </p>
        <p className="text-sm text-gray-400">
          Your address will remain private and never shown publicly.
        </p>
      </div>

      <Input
        register={formMethods.register}
        registerOptions={typingField}
        type="text"
        placeholder="Postcode"
        variant="transparent"
        errors={formMethods.formState.errors}
        maxLength={10}
        autoFocus={true}
      />

      {isLoading && (
        <div className="text-center text-gray-400 py-4 mt-6">
          Searching addresses...
        </div>
      )}

      {!isLoading && noResultsFound && (
        <div className="text-center text-red-500 py-4 mt-6">
          Unable to find a match. Please check your postcode or add address
          manually.
        </div>
      )}

      {!isLoading && postalCodeRecommendations.length > 0 && (
        <Controller
          name={field}
          control={formMethods.control}
          render={({ field: ctrlField, fieldState }) => (
            <SingleOnBoard
              title=""
              options={postalCodeRecommendations}
              value={selectedId} // Use local state for visual selection
              onChange={(id: string) => {
                setSelectedId(id);

                const selectedOpt = postalCodeRecommendations.find(
                  (o: any) => o.id === id
                );

                if (selectedOpt) {
                  // Set address (address string)
                  ctrlField.onChange(selectedOpt.label);

                  // Fetch full backend details using ID
                  fetchFullAddress(id);
                }
              }}
              errorMessage={fieldState.error}
              variant="list"
            />
          )}
        />
      )}
    </div>
  );
};

export default PostcodeAddressFormV2;

