import { BaseApiResponse } from "./baseApi.types";

export interface ServiceOption {
  id: number;
  name: string;
  duration: number; // in minutes
  price: number;
  discount: number;
}

export interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
}

export interface FreelancerService {
  id: number;
  name: string;
  description: string;
  status: boolean;
  category: ServiceCategory;
  options: ServiceOption[];
}

export interface PortfolioItem {
  id: number;
  image_url: string;
  thumbnail: string;
  caption?: string;
  is_primary: boolean;
}

export interface ServicePlace {
  id: number;
  name: string;
}

export interface ServiceArea {
  id: number;
  service_place: ServicePlace;
  address: string;
  postcode: string;
  latitude: string | number;
  longitude: string | number;
  radius: string | number;
  local_travel_fee: string | number;
}

export interface AdditionalInfo {
  bio?: string;
  instagram_handle?: string;
}

export interface Freelancer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  username: string;
  uuid: string;
  primary_image?: string;
  services: FreelancerService[];
  portfolio: PortfolioItem[];
  service_areas: ServiceArea[];
  additional_info: AdditionalInfo;
  customer_fee_percent?: number;
}

export interface FreelancerResponse extends BaseApiResponse {
  data: Freelancer;
}

export interface FreelancerListResponse extends BaseApiResponse {
  data: Freelancer[];
  total: number;
  page: number;
  limit: number;
}
