import { type NexHealthCoreClient } from '../lib/client.js';
import {
  type NexHealthCharge,
  type NexHealthChargesQueryParams,
  type NexHealthChargesResponse,
} from '../lib/types.js';

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
