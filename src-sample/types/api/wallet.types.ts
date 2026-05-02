export interface BillingInfoPayload {
  generateInvoices: boolean;
  billingName: string;
  address1: string;
  address2?: string;
  postcode: string;
  city: string;
  vatNumber?: string;
}

export interface ConnectAccountResponse {
  success: boolean;
  message?: string;
  clientSecret?: string;
  account_id?: string;
}

export interface PayoutStatsResponse {
  success: boolean;
  data: {
    total_earnings: number;
    pending_payout: number;
    last_payout: number;
  };
}

export interface BillingInfo {
  generateInvoices: boolean;
  billingName: string;
  address1: string;
  address2: string;
  postcode: string;
  city: string;
  vatNumber: string;
}

export interface BillingInfoResponse {
  success: boolean;
  message?: string;
  data: BillingInfo;
}

/** Stripe external bank account (from Stripe Connect) */
export interface StripeExternalAccount {
  id: string;
  bank_name: string;
  last4: string;
  currency?: string;
  country?: string;
  status?: string;
}

/** Booking reference inside a transaction */
export interface TransactionBooking {
  id: number | string;
  service_start_at?: string;
  service_duration?: number;
  special_instructions?: string;
  option_name?: string;
  imageReferences?: Array<{ image_url: string }>;
  location?: {
    address_1?: string;
    address_2?: string;
    city?: string;
    postal_code?: string;
  };
  product?: { name?: string };
}

/** Customer info inside a transaction */
export interface TransactionBookingUser {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

/** A single wallet transaction row */
export interface Transaction {
  paymentId: string;
  amount: number;
  transactionStatus: string;
  booking?: TransactionBooking;
  bookingUser?: TransactionBookingUser;
}
