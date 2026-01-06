import { type NexHealthCoreClient } from '../lib/client.js';
import {
  type NexHealthApiResponse,
  type NexHealthMoneyAmount,
} from '../lib/types.js';

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

/**
 * Create the claims endpoint handlers.
 *
 * @param client - The NexHealth core client
 * @param baseUrl - The base URL for the API
 * @returns The claims endpoint methods
 */
export const claims = (client: NexHealthCoreClient, baseUrl: string) => {
  return {
    /**
     * List insurance claims for a location.
     *
     * You can filter by patient, provider, guarantor, or updated_since.
     * You must provide at least one filter.
     *
     * Supported integrations: Dentrix, Dentrix Enterprise, Eaglesoft, Open Dental.
     *
     * @see https://docs.nexhealth.com/v20240412/reference/getclaims
     *
     * @param params - Query parameters including required location_id and subdomain
     * @returns A promise that resolves to the list of claims
     *
     * @example
     * ```typescript
     * const claims = await nexhealth.claims.list({
     *   location_id: 123,
     *   subdomain: 'your-subdomain',
     *   patient_id: 456,
     * });
     * ```
     */
    list: async (
      params: NexHealthClaimsQueryParams,
    ): Promise<NexHealthClaim[]> => {
      const response = await client.request<NexHealthClaimsResponse>(
        baseUrl,
        'GET',
        '/claims',
        {
          params,
        },
      );

      // Handle both wrapped and unwrapped response formats
      if (response.data?.claims) {
        return response.data.claims;
      }

      // New API version may return claims directly in data
      if (Array.isArray(response.data)) {
        return response.data as unknown as NexHealthClaim[];
      }

      // Fallback - return empty if structure is unexpected
      return [];
    },
  };
};
