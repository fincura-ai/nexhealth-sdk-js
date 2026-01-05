import { type NexHealthCoreClient } from '../lib/client.js';
import {
  type NexHealthPayment,
  type NexHealthPaymentCreateBody,
  type NexHealthPaymentCreateParams,
  type NexHealthPaymentResponse,
} from '../lib/types.js';

/**
 * Create the payments endpoint handlers.
 *
 * @param client - The NexHealth core client
 * @param baseUrl - The base URL for the API
 * @returns The payments endpoint methods
 */
export const payments = (client: NexHealthCoreClient, baseUrl: string) => {
  return {
    /**
     * Create a payment in the EHR.
     *
     * Note: This endpoint is only supported for Dentrix, Dentrix Enterprise,
     * Eaglesoft and Open Dental.
     *
     * @see https://docs.nexhealth.com/v20240412/reference/postpayments
     *
     * @param params - Query parameters including required location_id and subdomain
     * @param body - The payment details
     * @returns A promise that resolves to the created payment
     *
     * @example
     * ```typescript
     * const payment = await nexhealth.payments.create(
     *   { location_id: 123, subdomain: 'my-practice' },
     *   {
     *     patient_id: 456,
     *     amount: -138, // Negative = payment received
     *     payment_type_id: 10,
     *     transaction_id: 'API:unique-id',
     *     paid_at: '2024-05-20T21:00:00+00:00',
     *     charge_splits: {
     *       '789': -100,
     *       '790': -38,
     *     },
     *     notes: 'Insurance payment',
     *   }
     * );
     * ```
     */
    create: async (
      params: NexHealthPaymentCreateParams,
      body: NexHealthPaymentCreateBody,
    ): Promise<NexHealthPayment> => {
      const response = await client.request<NexHealthPaymentResponse>(
        baseUrl,
        'POST',
        '/payments',
        {
          data: { payment: body },
          params,
        },
      );

      return response.data.payment;
    },
  };
};
