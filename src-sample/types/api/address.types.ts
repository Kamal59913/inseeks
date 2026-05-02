import { ApiResponse } from "./base";

export interface AddressAutocompleteItem {
  id: string;
  description: string;
}

export type AddressAutocompleteResponse = ApiResponse<
  AddressAutocompleteItem[]
>;

export interface FullAddress {
  address: string;
  postcode: string;
  latitude: number;
  longitude: number;
}

export type FullAddressResponse = ApiResponse<FullAddress>;
