import { charges } from './endpoints/charges.js';
import { claims } from './endpoints/claims.js';
import { patients } from './endpoints/patients.js';
import { payments } from './endpoints/payments.js';
import { paymentTypes } from './endpoints/paymentTypes.js';
import { nexhealthClient } from './lib/client.js';

export {
  createConsoleLogger,
  createNoOpLogger,
  type Logger,
  setLogger,
} from './lib/logger.js';
export * from './lib/types.js';

// Endpoints specific types
export {
  type NexHealthCharge,
  type NexHealthChargesQueryParams,
  type NexHealthChargesResponse,
} from './endpoints/charges.js';
export {
  type NexHealthClaim,
  type NexHealthClaimsQueryParams,
  type NexHealthClaimsResponse,
  type NexHealthClaimTotals,
} from './endpoints/claims.js';
export {
  type NexHealthPatient,
  type NexHealthPatientBio,
  type NexHealthPatientsQueryParams,
  type NexHealthPatientsResponse,
} from './endpoints/patients.js';
export {
  type NexHealthChargeSplits,
  type NexHealthPayment,
  type NexHealthPaymentCreateBody,
  type NexHealthPaymentCreateParams,
  type NexHealthPaymentResponse,
  type NexHealthProviderSplits,
} from './endpoints/payments.js';
export {
  type NexHealthPaymentType,
  type NexHealthPaymentTypesQueryParams,
  type NexHealthPaymentTypesResponse,
} from './endpoints/paymentTypes.js';

/**
 * Create a NexHealth API client.
 *
 * @param apiKey - Your NexHealth API key from the Developer Portal
 * @returns The NexHealth client instance
 *
 * @example
 * ```typescript
 * const nexhealth = createNexHealthClient('your-api-key');
 *
 * // Authenticate first (required before making other API calls)
 * await nexhealth.authenticate();
 *
 * // List patients for a location
 * const patientList = await nexhealth.patients.list({ location_id: 123 });
 * ```
 */
export const createNexHealthClient = (apiKey: string) => {
  const baseUrl = 'https://nexhealth.info';

  const client = nexhealthClient(apiKey);

  return {
    /**
     * Authenticate with the NexHealth API.
     * This must be called before making any other API requests.
     * The bearer token is valid for 1 hour.
     *
     * @see https://docs.nexhealth.com/reference/authentication-1
     * @returns The bearer token
     */
    authenticate: () => client.authenticate(baseUrl),

    /**
     * Clear the current authentication state.
     * Useful for logging out or forcing re-authentication.
     */
    clearAuth: client.clearAuth,

    /**
     * Get the current bearer token.
     * Returns null if not authenticated.
     */
    getToken: client.getToken,

    /**
     * Check if the client is currently authenticated with a valid token.
     * Returns false if not authenticated or if the token is expired.
     */
    isAuthenticated: client.isAuthenticated,

    /**
     * Charge management endpoints.
     *
     * Note: Only supported for Dentrix, Dentrix Enterprise, Eaglesoft and Open Dental.
     *
     * @see https://docs.nexhealth.com/v20240412/reference/getcharges
     */
    charges: charges(client, baseUrl),

    /**
     * Claims management endpoints.
     *
     * Note: Only supported for Dentrix, Dentrix Enterprise, Eaglesoft and Open Dental.
     *
     * @see https://docs.nexhealth.com/v20240412/reference/getclaims
     */
    claims: claims(client, baseUrl),

    /**
     * Patient management endpoints.
     *
     * @see https://docs.nexhealth.com/reference/getpatients
     */
    patients: patients(client, baseUrl),

    /**
     * Payment management endpoints.
     *
     * Note: Only supported for Dentrix, Dentrix Enterprise, Eaglesoft and Open Dental.
     *
     * @see https://docs.nexhealth.com/v20240412/reference/postpayments
     */
    payments: payments(client, baseUrl),

    /**
     * Payment types management endpoints.
     *
     * Payment types represent the different methods a practice accepts for payments.
     *
     * Note: Only supported for Dentrix, Dentrix Enterprise, Eaglesoft and Open Dental.
     *
     * @see https://docs.nexhealth.com/v20240412/reference/getpaymenttypes
     */
    paymentTypes: paymentTypes(client, baseUrl),

    // Internal references for endpoint implementations
    _baseUrl: baseUrl,
    _client: client,
  };
};

export type NexHealthClient = ReturnType<typeof createNexHealthClient>;

export default createNexHealthClient;
