import { type NexHealthCoreClient } from '../lib/client.js';
import {
  type NexHealthClaim,
  type NexHealthClaimsQueryParams,
  type NexHealthClaimsResponse,
} from '../lib/types.js';

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
