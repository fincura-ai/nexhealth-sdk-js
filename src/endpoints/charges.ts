import { type NexHealthCoreClient } from '../lib/client.js';
import {
  type NexHealthApiResponse,
  type NexHealthMoneyAmount,
} from '../lib/types.js';

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

/**
 * Create the charges endpoint handlers.
 *
 * @param client - The NexHealth core client
 * @param baseUrl - The base URL for the API
 * @returns The charges endpoint methods
 */
export const charges = (client: NexHealthCoreClient, baseUrl: string) => {
  return {
    /**
     * List charges for a location.
     *
     * Note: This endpoint is only supported for Dentrix, Dentrix Enterprise,
     * Eaglesoft and Open Dental.
     *
     * @see https://docs.nexhealth.com/v20240412/reference/getcharges
     *
     * @param params - Query parameters including required location_id and at least one filter (patient, provider, guarantor, or updated_since)
     * @returns A promise that resolves to the list of charges
     *
     * @example
     * ```typescript
     * const charges = await nexhealth.charges.list({
     *   location_id: 123,
     *   subdomain: 'your-subdomain',
     *   patient_id: 456,
     * });
     * ```
     */
    list: async (
      params: NexHealthChargesQueryParams,
    ): Promise<NexHealthCharge[]> => {
      const response = await client.request<NexHealthChargesResponse>(
        baseUrl,
        'GET',
        '/charges',
        {
          params,
        },
      );

      // Response data is directly an array of charges
      if (Array.isArray(response.data)) {
        return response.data;
      }

      return [];
    },
  };
};
