import { type NexHealthCoreClient } from '../lib/client.js';
import {
  type NexHealthApiResponse,
  type NexHealthMoneyAmount,
} from '../lib/types.js';

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
