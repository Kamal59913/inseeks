export interface Product {
  id: number;
  name: string;
}

export interface ProductOption {
  id: number;
  name: string;
  duration: number;
  price: number;
}

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export interface Location {
  address_1: string;
  address_2?: string;
  city: string;
  postal_code: string;
  latitude?: string | number;
  longitude?: string | number;
}

export interface ImageReference {
  image_url: string;
}

export interface ServicePlace {
  id: number;
  name: string;
}

export interface Booking {
  id: string | number;
  appointment_status: string;
  service_start_at: string;
  service_amount: number;
  product?: Product;
  productOption?: ProductOption;
  servicePlace?: ServicePlace;
  customer?: Customer;
  locations?: Location[];
  imageReferences?: ImageReference[];
  special_instructions?: string;
}

export interface BookingListResponse {
  data: Booking[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
