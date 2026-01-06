// NexHealth SDK Types

/**
 * Standard NexHealth API response wrapper
 */
export type NexHealthApiResponse<T> = {
  code: boolean;
  count?: number;
  data: T;
  description: string[] | string;
  error: string[];
};

// Authentication Types

/**
 * Response from the /authenticates endpoint
 */
export type NexHealthAuthResponse = NexHealthApiResponse<{
  token: string;
}>;

/**
 * Decoded JWT token payload (for reference)
 */
export type NexHealthTokenPayload = {
  exp: number; // Expiration timestamp
  iat: number; // Issued at timestamp
  jti: string; // JWT ID
  scp: string; // Scope
  sub: string; // Subject (user ID)
};

// Patient Types

/**
 * NexHealth Patient Bio information
 */
export type NexHealthPatientBio = {
  city?: string;
  date_of_birth?: string;
  email?: string;
  first_name?: string;
  gender?: string;
  last_name?: string;
  middle_name?: string;
  new_patient?: boolean;
  non_patient?: boolean;
  phone_number?: string;
  preferred_language?: string;
  state?: string;
  street_address?: string;
  zip_code?: string;
};

/**
 * NexHealth Patient object
 *
 * @see https://docs.nexhealth.com/reference/getpatients
 */
export type NexHealthPatient = {
  balance?: {
    amount: string;
    currency: string;
  };
  billing_type?: string;
  bio?: NexHealthPatientBio;
  chart_id?: string;
  created_at?: string;
  email_unsubscribed_at?: string | null;
  foreign_id?: number;
  foreign_id_type?: string;
  guarantor_id?: number | null;
  id: number;
  inactive?: boolean;
  institution_id?: number;
  last_sync_time?: string;
  location_ids?: number[];
  sms_unsubscribed_at?: string | null;
  unsubscribed_at?: string | null;
  updated_at?: string;
};

/**
 * Query parameters for listing patients
 *
 * @see https://docs.nexhealth.com/reference/getpatients
 */
export type NexHealthPatientsQueryParams = {
  /**
   * Filter by date of birth (YYYY-MM-DD format)
   */
  date_of_birth?: string;
  /**
   * Filter by email address
   */
  email?: string;
  /**
   * Filter by first name
   */
  first_name?: string;
  /**
   * Filter by patient ID
   */
  id?: number;
  /**
   * Filter by inactive status
   */
  inactive?: boolean;
  /**
   * Filter by last name
   */
  last_name?: string;
  /**
   * Required: Used to scope the request to the specified location
   */
  location_id: number;
  /**
   * Fuzzy search across first and last name
   */
  name?: string;
  /**
   * Filter new patients
   */
  new_patient?: boolean;
  /**
   * Page number for pagination
   */
  page?: number;
  /**
   * Number of results per page
   */
  per_page?: number;
  /**
   * Filter by phone number
   */
  phone_number?: string;
  /**
   * Filter by patient foreign_id from EHR
   */
  provider_id?: number;
  /**
   * Return patients updated since this timestamp
   */
  since?: string;
  /**
   * Required Used to scope the request to the specified institution
   */
  subdomain: string;
};

/**
 * Response from GET /patients endpoint
 */
export type NexHealthPatientsResponse = NexHealthApiResponse<{
  patients: NexHealthPatient[];
}>;

// Charge Types

/**
 * NexHealth money amount object
 */
export type NexHealthMoneyAmount = {
  amount: string;
  currency: string;
};

/**
 * NexHealth Charge object (individual procedure/service line item)
 *
 * @see https://docs.nexhealth.com/v20240412/reference/getcharges
 */
export type NexHealthCharge = {
  charged_at?: string;
  deleted_at?: string | null;
  description?: string;
  fee?: NexHealthMoneyAmount;
  foreign_id?: string;
  guarantor_id?: number;
  id: number;
  location_id?: number;
  patient_id?: number;
  procedure_code?: string;
  procedure_id?: number;
  provider_id?: number;
  updated_at?: string;
};

/**
 * Query parameters for listing charges
 *
 * @see https://docs.nexhealth.com/v20240412/reference/getcharges
 */
export type NexHealthChargesQueryParams = {
  /**
   * Filter by guarantor ID
   */
  guarantor_id?: number;
  /**
   * Required: Used to scope the request to the specified location
   */
  location_id: number;
  /**
   * Page number for pagination
   */
  page?: number;
  /**
   * Filter by patient ID
   */
  patient_id?: number;
  /**
   * Number of results per page
   */
  per_page?: number;
  /**
   * Filter by procedure code
   */
  procedure?: string;
  /**
   * Filter by provider ID
   */
  provider_id?: number;
  /**
   * Required: Used to scope the request to the specified institution
   */
  subdomain: string;
  /**
   * Return charges updated since this timestamp
   */
  updated_since?: string;
};

/**
 * Response from GET /charges endpoint
 */
export type NexHealthChargesResponse = NexHealthApiResponse<NexHealthCharge[]>;

// Claim Types

/**
 * NexHealth Claim totals object
 */
export type NexHealthClaimTotals = {
  amount_billed_to_insurance?: NexHealthMoneyAmount;
  estimated_insurance_payment?: NexHealthMoneyAmount;
  insurance_payment?: NexHealthMoneyAmount;
  write_off?: NexHealthMoneyAmount;
};

/**
 * NexHealth Claim object
 *
 * @see https://docs.nexhealth.com/v20240412/reference/getclaims
 */
export type NexHealthClaim = {
  date_of_service?: string;
  deleted_at?: string | null;
  guarantor_id?: number;
  id: number;
  location_id?: number;
  note?: string;
  patient_id?: number;
  primary_insurance_plan_id?: number;
  provider_id?: number;
  received_at?: string;
  secondary_insurance_plan_id?: number;
  sent_at?: string;
  status?: string;
  totals?: NexHealthClaimTotals;
  updated_at?: string;
};

/**
 * Query parameters for listing claims
 *
 * @see https://docs.nexhealth.com/v20240412/reference/getclaims
 */
export type NexHealthClaimsQueryParams = {
  /**
   * Filter by guarantor ID
   */
  guarantor_id?: number;
  /**
   * Required: Used to scope the request to the specified location
   */
  location_id: number;
  /**
   * Page number for pagination
   */
  page?: number;
  /**
   * Filter by patient ID
   */
  patient_id?: number;
  /**
   * Number of results per page
   */
  per_page?: number;
  /**
   * Filter by provider ID
   */
  provider_id?: number;
  /**
   * Required: Used to scope the request to the specified institution
   */
  subdomain: string;
  /**
   * Return claims updated since this timestamp
   */
  updated_since?: string;
};

/**
 * Response from GET /claims endpoint
 */
export type NexHealthClaimsResponse = NexHealthApiResponse<{
  claims: NexHealthClaim[];
}>;

// Payment Types

/**
 * NexHealth Payment object
 *
 * @see https://docs.nexhealth.com/v20240412/reference/postpayments
 */
export type NexHealthPayment = {
  amount?: NexHealthMoneyAmount;
  charge_splits?: Record<string, NexHealthMoneyAmount>;
  created_at?: string;
  deleted_at?: string | null;
  foreign_id?: string;
  guarantor_id?: number;
  id: number;
  location_id?: number;
  notes?: string;
  paid_at?: string;
  patient_id?: number;
  payment_type_id?: number;
  provider_id?: number;
  provider_splits?: Record<string, number>;
  transaction_id?: string;
  updated_at?: string;
};

/**
 * Charge splits for payment creation.
 * Maps charge IDs to negative amounts representing how much of the payment applies to each charge.
 *
 * @example
 * ```typescript
 * {
 *   "123456": -37,
 *   "123457": -100
 * }
 * ```
 */
export type NexHealthChargeSplits = Record<string, number>;

/**
 * Provider splits for payment creation.
 * Maps provider IDs to decimal percentages (should sum to 1.0 or less).
 *
 * @example
 * ```typescript
 * {
 *   "provider_1": -0.5,
 *   "provider_2": -0.5
 * }
 * ```
 */
export type NexHealthProviderSplits = Record<string, number>;

/**
 * Request body for creating a payment
 *
 * @see https://docs.nexhealth.com/v20240412/reference/postpayments
 */
export type NexHealthPaymentCreateBody = {
  /**
   * Payment amount in dollars (negative for payments received).
   * For example, -138 represents a $138 payment received.
   */
  amount: number;
  /**
   * Optional: Splits the payment across multiple charges.
   * Keys are charge IDs, values are negative amounts.
   */
  charge_splits?: NexHealthChargeSplits;
  /**
   * Currency code (default: USD)
   */
  currency?: string;
  /**
   * Optional notes about the payment
   */
  notes?: string;
  /**
   * ISO 8601 timestamp when payment was made
   */
  paid_at?: string;
  /**
   * Required: The patient ID for the payment
   */
  patient_id: number;
  /**
   * Payment type ID from the EHR.
   * Either payment_type_id or type_name must be provided.
   */
  payment_type_id?: number;
  /**
   * Payment type name (e.g., "Insurance Payment", "Patient Payment").
   * Either payment_type_id or type_name must be provided.
   */
  type_name?: string;
  /**
   * Optional: Splits the payment across multiple providers.
   * Keys are provider IDs, values are decimal percentages (negative).
   */
  provider_splits?: NexHealthProviderSplits;
  /**
   * Unique transaction ID for idempotency.
   * Recommended format: "API:{unique_id}"
   */
  transaction_id?: string;
};

/**
 * Query parameters for creating a payment
 *
 * @see https://docs.nexhealth.com/v20240412/reference/postpayments
 */
export type NexHealthPaymentCreateParams = {
  /**
   * Required: Used to scope the request to the specified location
   */
  location_id: number;
  /**
   * Required: Used to scope the request to the specified institution
   */
  subdomain: string;
};

/**
 * Response from POST /payments endpoint
 */
export type NexHealthPaymentResponse = NexHealthApiResponse<{
  payment: NexHealthPayment;
}>;

// Payment Type Types

/**
 * NexHealth Payment Type object
 *
 * @see https://docs.nexhealth.com/v20240412/reference/payment-types
 */
export type NexHealthPaymentType = {
  active: boolean;
  id: number;
  name: string;
  updated_at: string;
};

/**
 * Query parameters for listing payment types
 *
 * @see https://docs.nexhealth.com/v20240412/reference/getpaymenttypes
 */
export type NexHealthPaymentTypesQueryParams = {
  /**
   * Required: Used to scope the request to the specified location
   */
  location_id: number;
  /**
   * Required: Used to scope the request to the specified institution
   */
  subdomain: string;
};

/**
 * Response from GET /payment_types endpoint
 */
export type NexHealthPaymentTypesResponse = NexHealthApiResponse<
  NexHealthPaymentType[]
>;
