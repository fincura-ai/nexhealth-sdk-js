import { patients } from './endpoints/patients.js';
import { nexhealthClient } from './lib/client.js';

export {
  createConsoleLogger,
  createNoOpLogger,
  type Logger,
  setLogger,
} from './lib/logger.js';
export * from './lib/types.js';

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
     * Patient management endpoints.
     *
     * @see https://docs.nexhealth.com/reference/getpatients
     */
    patients: patients(client, baseUrl),

    // Internal references for endpoint implementations
    _baseUrl: baseUrl,
    _client: client,
  };
};

export type NexHealthClient = ReturnType<typeof createNexHealthClient>;

export default createNexHealthClient;
