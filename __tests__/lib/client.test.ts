import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { nexhealthClient } from '../../src/lib/client.js';

jest.mock('axios');
jest.mock('../../src/lib/logger', () => ({
  getLogger: jest.fn().mockReturnValue({
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  }),
}));

const testBaseUrl = 'https://nexhealth.info';

/**
 * Create a valid mock JWT token with configurable expiration.
 */
const createMockToken = (expiresInSeconds = 3_600) => {
  const now = Math.floor(Date.now() / 1_000);
  const payload = {
    exp: now + expiresInSeconds,
    iat: now,
    jti: 'test-jwt-id',
    scp: 'api_user',
    sub: '1',
  };
  const header = Buffer.from(JSON.stringify({ alg: 'HS256' })).toString(
    'base64url',
  );
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString(
    'base64url',
  );
  return `${header}.${payloadBase64}.fake-signature`;
};

/**
 * Helper to create a successful auth response.
 */
const createAuthResponse = (token: string) => ({
  data: {
    code: true,
    data: { token },
    description: 'Authenticated',
    error: [],
  },
});

/**
 * Helper to create a mock Axios error with API response data.
 */
const createAxiosError = (
  status: number,
  data: { description?: string; error?: string[] },
): AxiosError => {
  const config = { headers: {} } as unknown as InternalAxiosRequestConfig;
  const error = new AxiosError(
    'Request failed',
    'ERR_BAD_REQUEST',
    config,
    {},
    {
      config,
      data,
      headers: {},
      status,
      statusText: 'Error',
    },
  );
  error.response = {
    config,
    data,
    headers: {},
    status,
    statusText: 'Error',
  };
  return error;
};

describe('nexhealthClient', () => {
  const mockApiKey = 'test-api-key';
  let client: ReturnType<typeof nexhealthClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    client = nexhealthClient(mockApiKey);
  });

  describe('authenticate', () => {
    it('should store token and mark client as authenticated on success', async () => {
      const mockToken = createMockToken();
      (axios.request as jest.Mock).mockResolvedValue(
        createAuthResponse(mockToken),
      );

      const result = await client.authenticate(testBaseUrl);

      expect(result).toBe(mockToken);
      expect(client.isAuthenticated()).toBe(true);
      expect(client.getToken()).toBe(mockToken);
    });

    it('should use API key in Authorization header for auth request', async () => {
      const mockToken = createMockToken();
      (axios.request as jest.Mock).mockResolvedValue(
        createAuthResponse(mockToken),
      );

      await client.authenticate(testBaseUrl);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: mockApiKey,
          }),
          method: 'POST',
          url: `${testBaseUrl}/authenticates`,
        }),
      );
    });

    it('should throw when API returns code: false', async () => {
      (axios.request as jest.Mock).mockResolvedValue({
        data: { code: false, data: null, error: ['Invalid API key'] },
      });

      await expect(client.authenticate(testBaseUrl)).rejects.toThrow(
        'Authentication failed: No token received',
      );
      expect(client.isAuthenticated()).toBe(false);
    });

    it('should throw when API returns no token', async () => {
      (axios.request as jest.Mock).mockResolvedValue({
        data: { code: true, data: { token: null } },
      });

      await expect(client.authenticate(testBaseUrl)).rejects.toThrow(
        'Authentication failed: No token received',
      );
    });

    it('should extract error message from API response description', async () => {
      const mockError = createAxiosError(401, {
        description: 'Invalid credentials',
      });
      (axios.request as jest.Mock).mockRejectedValue(mockError);

      await expect(client.authenticate(testBaseUrl)).rejects.toThrow(
        'NexHealth authentication failed: Invalid credentials',
      );
    });

    it('should extract error message from API response error array', async () => {
      const mockError = createAxiosError(401, {
        error: ['API key expired'],
      });
      (axios.request as jest.Mock).mockRejectedValue(mockError);

      await expect(client.authenticate(testBaseUrl)).rejects.toThrow(
        'NexHealth authentication failed: API key expired',
      );
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when never authenticated', () => {
      expect(client.isAuthenticated()).toBe(false);
    });

    it('should return false when token is expired', async () => {
      // Token that expired 60 seconds ago
      const expiredToken = createMockToken(-60);
      (axios.request as jest.Mock).mockResolvedValue(
        createAuthResponse(expiredToken),
      );

      await client.authenticate(testBaseUrl);

      expect(client.isAuthenticated()).toBe(false);
    });

    it('should return false when token expires within 1-minute buffer', async () => {
      // Token expires in 30 seconds (within 1-minute safety buffer)
      const soonExpiringToken = createMockToken(30);
      (axios.request as jest.Mock).mockResolvedValue(
        createAuthResponse(soonExpiringToken),
      );

      await client.authenticate(testBaseUrl);

      expect(client.isAuthenticated()).toBe(false);
    });

    it('should return true when token is valid', async () => {
      const validToken = createMockToken(3_600);
      (axios.request as jest.Mock).mockResolvedValue(
        createAuthResponse(validToken),
      );

      await client.authenticate(testBaseUrl);

      expect(client.isAuthenticated()).toBe(true);
    });
  });

  describe('clearAuth', () => {
    it('should clear token and authentication state', async () => {
      const mockToken = createMockToken();
      (axios.request as jest.Mock).mockResolvedValue(
        createAuthResponse(mockToken),
      );

      await client.authenticate(testBaseUrl);
      expect(client.isAuthenticated()).toBe(true);

      client.clearAuth();

      expect(client.getToken()).toBeNull();
      expect(client.isAuthenticated()).toBe(false);
    });
  });

  describe('request', () => {
    beforeEach(async () => {
      const mockToken = createMockToken();
      (axios.request as jest.Mock).mockResolvedValueOnce(
        createAuthResponse(mockToken),
      );
      await client.authenticate(testBaseUrl);
    });

    it('should throw when not authenticated', async () => {
      // Create a fresh unauthenticated client for this test
      const unauthClient = nexhealthClient(mockApiKey);
      await expect(
        unauthClient.request(testBaseUrl, 'GET', '/patients'),
      ).rejects.toThrow(
        'Not authenticated. Call authenticate() before making API requests.',
      );
    });

    it('should use Bearer token in Authorization header', async () => {
      (axios.request as jest.Mock).mockResolvedValueOnce({ data: {} });

      await client.request(testBaseUrl, 'GET', '/patients');

      expect(axios.request).toHaveBeenLastCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.stringMatching(/^Bearer /u),
          }),
        }),
      );
    });

    it('should return response data directly', async () => {
      const responseData = { code: true, data: { patients: [] } };
      (axios.request as jest.Mock).mockResolvedValueOnce({
        data: responseData,
      });

      const result = await client.request(testBaseUrl, 'GET', '/patients');

      expect(result).toEqual(responseData);
    });

    it('should pass params to the request', async () => {
      (axios.request as jest.Mock).mockResolvedValueOnce({ data: {} });

      await client.request(testBaseUrl, 'GET', '/patients', {
        params: { location_id: 123 },
      });

      expect(axios.request).toHaveBeenLastCalledWith(
        expect.objectContaining({
          params: { location_id: 123 },
        }),
      );
    });

    it('should normalize path with leading slash', async () => {
      (axios.request as jest.Mock).mockResolvedValueOnce({ data: {} });

      await client.request(testBaseUrl, 'GET', '/patients');

      expect(axios.request).toHaveBeenLastCalledWith(
        expect.objectContaining({
          url: `${testBaseUrl}/patients`,
        }),
      );
    });

    it('should extract error message from API response', async () => {
      const mockError = createAxiosError(400, {
        description: 'Invalid location_id',
      });
      (axios.request as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(
        client.request(testBaseUrl, 'GET', '/patients'),
      ).rejects.toThrow('Request to NexHealth API failed: Invalid location_id');
    });
  });

  describe('client isolation', () => {
    it('should maintain separate state per client instance', async () => {
      const client1 = nexhealthClient('api-key-1');
      const client2 = nexhealthClient('api-key-2');

      const token1 = createMockToken();
      const token2 = createMockToken();

      (axios.request as jest.Mock)
        .mockResolvedValueOnce(createAuthResponse(token1))
        .mockResolvedValueOnce(createAuthResponse(token2));

      await client1.authenticate(testBaseUrl);
      await client2.authenticate(testBaseUrl);

      client1.clearAuth();

      expect(client1.isAuthenticated()).toBe(false);
      expect(client2.isAuthenticated()).toBe(true);
    });
  });
});
