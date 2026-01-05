import axios, { AxiosError, type AxiosRequestConfig, type Method } from 'axios';

import { getLogger } from './logger.js';
import { type NexHealthAuthResponse } from './types.js';

/**
 * Create a client for the NexHealth API.
 *
 * @param apiKey - The NexHealth API key
 * @returns The NexHealth client.
 */
export const nexhealthClient = (apiKey: string) => {
  let bearerToken: string | null = null;
  let tokenExpiresAt: number | null = null;

  /**
   * Get default headers for API requests.
   * Uses bearer token if authenticated, otherwise uses API key.
   */
  const getHeaders = (useApiKey = false) => ({
    Accept: 'application/json',
    Authorization: useApiKey ? apiKey : `Bearer ${bearerToken}`,
    'Content-Type': 'application/json',
    'Nex-Api-Version': 'v20240412',
  });

  /**
   * Authenticate with the NexHealth API and obtain a bearer token.
   * The token is valid for 1 hour.
   *
   * @see https://docs.nexhealth.com/reference/authentication-1
   * @returns The bearer token
   */
  const authenticate = async (baseUrl: string): Promise<string> => {
    const log = getLogger();

    try {
      log.debug('NexHealth API authentication request');

      const response = await axios.request<NexHealthAuthResponse>({
        headers: getHeaders(true), // Use API key for auth
        method: 'POST',
        url: `${baseUrl}/authenticates`,
      });

      log.debug('NexHealth API authentication response', {
        status: response.status,
      });

      if (!response.data.code || !response.data.data?.token) {
        throw new Error('Authentication failed: No token received');
      }

      bearerToken = response.data.data.token;

      // Parse JWT to get expiration time (tokens are valid for 1 hour)
      // JWT format: header.payload.signature
      const payloadBase64 = bearerToken.split('.')[1];
      if (payloadBase64) {
        try {
          const payload = JSON.parse(
            Buffer.from(payloadBase64, 'base64').toString('utf8'),
          );
          tokenExpiresAt = payload.exp * 1_000; // Convert to milliseconds
        } catch {
          // If we can't parse the token, set expiration to 55 minutes from now
          tokenExpiresAt = Date.now() + 55 * 60 * 1_000;
        }
      }

      return bearerToken;
    } catch (error) {
      if (error instanceof AxiosError) {
        delete error.config;
        delete error.request;
        delete error.response?.request;

        throw new Error(
          `NexHealth authentication failed: ${
            error.response?.data?.description ||
            error.response?.data?.error?.[0] ||
            error.message ||
            'Unknown error'
          }`,
          { cause: error },
        );
      } else {
        throw error;
      }
    }
  };

  /**
   * Check if the current token is valid and not expired.
   */
  const isAuthenticated = (): boolean => {
    if (!bearerToken || !tokenExpiresAt) {
      return false;
    }

    // Add 1 minute buffer before expiration
    return Date.now() < tokenExpiresAt - 60 * 1_000;
  };

  /**
   * Get the current bearer token.
   */
  const getToken = (): string | null => bearerToken;

  /**
   * Clear the current authentication state.
   */
  const clearAuth = (): void => {
    bearerToken = null;
    tokenExpiresAt = null;
  };

  /**
   * Execute a request to the NexHealth API.
   * Requires authentication before making requests.
   *
   * @param baseUrl - The base URL to use.
   * @param method - The HTTP method to use.
   * @param path - The path to request.
   * @param [config] - custom configuration for the request.
   * @returns The result of the request.
   */
  const request = async <T>(
    baseUrl: string,
    method: Method,
    path: string,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const log = getLogger();

    if (!isAuthenticated()) {
      throw new Error(
        'Not authenticated. Call authenticate() before making API requests.',
      );
    }

    try {
      log.debug('NexHealth API request', { config, method, path });

      const response = await axios.request<T>({
        ...config,
        headers: {
          ...getHeaders(),
          ...config?.headers,
        },
        method,
        url: `${baseUrl}/${path.replace(/^\//u, '')}`,
      });

      log.debug('NexHealth API response', {
        data: response.data,
        status: response.status,
      });

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        delete error.config;
        delete error.request;
        delete error.response?.request;

        throw new Error(
          `Request to NexHealth API failed: ${
            error.response?.data?.description ||
            error.response?.data?.error?.[0] ||
            error.message ||
            'Unknown error'
          }`,
          { cause: error },
        );
      } else {
        throw error;
      }
    }
  };

  return {
    authenticate,
    clearAuth,
    getToken,
    isAuthenticated,
    request,
  };
};

export type NexHealthCoreClient = ReturnType<typeof nexhealthClient>;
