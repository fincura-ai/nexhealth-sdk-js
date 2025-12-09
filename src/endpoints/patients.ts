import { type NexHealthCoreClient } from '../lib/client.js';
import {
  type NexHealthPatient,
  type NexHealthPatientsQueryParams,
  type NexHealthPatientsResponse,
} from '../lib/types.js';

/**
 * Create the patients endpoint handlers.
 *
 * @param client - The NexHealth core client
 * @param baseUrl - The base URL for the API
 * @returns The patients endpoint methods
 */
export const patients = (client: NexHealthCoreClient, baseUrl: string) => {
  return {
    /**
     * List patients for a location.
     *
     * @see https://docs.nexhealth.com/reference/getpatients
     *
     * @param params - Query parameters including required location_id
     * @returns A promise that resolves to the list of patients
     *
     * @example
     * ```typescript
     * const patients = await nexhealth.patients.list({
     *   location_id: 123,
     *   per_page: 50,
     *   page: 1,
     * });
     * ```
     */
    list: async (
      params: NexHealthPatientsQueryParams,
    ): Promise<NexHealthPatient[]> => {
      const response = await client.request<NexHealthPatientsResponse>(
        baseUrl,
        'GET',
        '/patients',
        {
          params,
        },
      );

      return response.data;
    },
  };
};
