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
export type NexHealthPatientsResponse = NexHealthApiResponse<
  NexHealthPatient[]
>;
