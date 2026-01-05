import { type NexHealthCoreClient } from '../lib/client.js';
import {
  type NexHealthPaymentType,
  type NexHealthPaymentTypesQueryParams,
  type NexHealthPaymentTypesResponse,
} from '../lib/types.js';

/**
 * Create the payment types endpoint handlers.
 *
 * @param client - The NexHealth core client
 * @param baseUrl - The base URL for the API
 * @returns The payment types endpoint methods
 */
export const paymentTypes = (client: NexHealthCoreClient, baseUrl: string) => {
  return {
    /**
     * List payment types for a location.
     *
     * Payment types represent the different methods a practice accepts for
     * payments, such as cash, credit card, check, or insurance payments.
     *
     * Note: This endpoint is only supported for Dentrix, Dentrix Enterprise,
     * Eaglesoft and Open Dental.
     *
     * @see https://docs.nexhealth.com/v20240412/reference/getpaymenttypes
     *
     * @param params - Query parameters including required location_id and subdomain
     * @returns A promise that resolves to the list of payment types
     *
     * @example
     * ```typescript
     * const types = await nexhealth.paymentTypes.list({
     *   location_id: 123,
     *   subdomain: 'my-practice',
     * });
     * ```
     */
    list: async (
      params: NexHealthPaymentTypesQueryParams,
    ): Promise<NexHealthPaymentType[]> => {
      const response = await client.request<NexHealthPaymentTypesResponse>(
        baseUrl,
        'GET',
        '/payment_types',
        {
          params,
        },
      );

      // Response data is directly an array of payment types
      if (Array.isArray(response.data)) {
        return response.data;
      }

      return [];
    },
  };
};
