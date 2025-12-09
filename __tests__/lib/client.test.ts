import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { nexhealthClient } from '../../src/lib/client.js';

// Mock dependencies
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

// Create a valid mock JWT token (expires in 1 hour)
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
    'base64',
  );
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');
  return `${header}.${payloadBase64}.fake-signature`;
};

describe('nexhealthClient', () => {
  const mockApiKey = 'test-api-key';
  let client: ReturnType<typeof nexhealthClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    client = nexhealthClient(mockApiKey);
  });

  describe('authenticate', () => {
    it('should authenticate and store the bearer token', async () => {
      const mockToken = createMockToken();
      const mockResponse = {
        data: {
          code: true,
          data: { token: mockToken },
          description: 'Authenticated',
          error: [],
        },
      };
      (axios.request as jest.Mock).mockResolvedValue(mockResponse);

      const result = await client.authenticate(testBaseUrl);

      expect(axios.request).toHaveBeenCalledWith({
        headers: {
          Accept: 'application/vnd.Nexhealth+json;version=2',
          Authorization: mockApiKey,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        url: `${testBaseUrl}/authenticates`,
      });
      expect(result).toBe(mockToken);
      expect(client.isAuthenticated()).toBe(true);
      expect(client.getToken()).toBe(mockToken);
    });

    it('should throw error when authentication fails', async () => {
      const mockResponse = {
        data: {
          code: false,
          data: null,
          description: 'Invalid API key',
          error: ['Unauthorized'],
        },
      };
      (axios.request as jest.Mock).mockResolvedValue(mockResponse);

      await expect(client.authenticate(testBaseUrl)).rejects.toThrow(
        'Authentication failed: No token received',
      );
    });

    it('should handle axios errors during authentication', async () => {
      const mockError = new AxiosError(
        'Request failed',
        'ERR_BAD_REQUEST',
        { headers: {} } as unknown as InternalAxiosRequestConfig,
        {},
        {
          config: { headers: {} } as unknown as InternalAxiosRequestConfig,
          data: {
            description: 'Invalid credentials',
            error: ['Unauthorized'],
          },
          headers: {},
          status: 401,
          statusText: 'Unauthorized',
        },
      );
      mockError.isAxiosError = true;
      mockError.response = {
        config: { headers: {} } as unknown as InternalAxiosRequestConfig,
        data: {
          description: 'Invalid credentials',
          error: ['Unauthorized'],
        },
        headers: {},
        status: 401,
        statusText: 'Unauthorized',
      };

      (axios.request as jest.Mock).mockRejectedValue(mockError);

      await expect(client.authenticate(testBaseUrl)).rejects.toThrow(
        'NexHealth authentication failed: Invalid credentials',
      );
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when not authenticated', () => {
      expect(client.isAuthenticated()).toBe(false);
    });

    it('should return true after successful authentication', async () => {
      const mockToken = createMockToken();
      const mockResponse = {
        data: {
          code: true,
          data: { token: mockToken },
          description: 'Authenticated',
          error: [],
        },
      };
      (axios.request as jest.Mock).mockResolvedValue(mockResponse);

      await client.authenticate(testBaseUrl);

      expect(client.isAuthenticated()).toBe(true);
    });

    it('should return false after clearAuth is called', async () => {
      const mockToken = createMockToken();
      const mockResponse = {
        data: {
          code: true,
          data: { token: mockToken },
          description: 'Authenticated',
          error: [],
        },
      };
      (axios.request as jest.Mock).mockResolvedValue(mockResponse);

      await client.authenticate(testBaseUrl);
      expect(client.isAuthenticated()).toBe(true);

      client.clearAuth();
      expect(client.isAuthenticated()).toBe(false);
      expect(client.getToken()).toBeNull();
    });
  });

  describe('request', () => {
    it('should throw error when not authenticated', async () => {
      await expect(
        client.request(testBaseUrl, 'GET', 'test-path'),
      ).rejects.toThrow(
        'Not authenticated. Call authenticate() before making API requests.',
      );
    });

    it('should make a request with bearer token after authentication', async () => {
      // First authenticate
      const mockToken = createMockToken();
      const authResponse = {
        data: {
          code: true,
          data: { token: mockToken },
          description: 'Authenticated',
          error: [],
        },
      };
      (axios.request as jest.Mock).mockResolvedValueOnce(authResponse);
      await client.authenticate(testBaseUrl);

      // Then make a request
      const mockResponse = { data: { result: 'success' } };
      (axios.request as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await client.request(testBaseUrl, 'GET', 'test-path', {
        data: { key: 'value' },
      });

      expect(axios.request).toHaveBeenLastCalledWith({
        data: { key: 'value' },
        headers: {
          Accept: 'application/vnd.Nexhealth+json;version=2',
          Authorization: `Bearer ${mockToken}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
        url: `${testBaseUrl}/test-path`,
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle axios errors correctly', async () => {
      // First authenticate
      const mockToken = createMockToken();
      const authResponse = {
        data: {
          code: true,
          data: { token: mockToken },
          description: 'Authenticated',
          error: [],
        },
      };
      (axios.request as jest.Mock).mockResolvedValueOnce(authResponse);
      await client.authenticate(testBaseUrl);

      // Then make a request that fails
      const mockError = new AxiosError(
        'Request failed',
        'ERR_BAD_REQUEST',
        { headers: {} } as unknown as InternalAxiosRequestConfig,
        {},
        {
          config: { headers: {} } as unknown as InternalAxiosRequestConfig,
          data: {
            description: 'API error message',
            error: [],
          },
          headers: {},
          status: 400,
          statusText: 'Bad Request',
        },
      );
      mockError.isAxiosError = true;
      mockError.response = {
        config: { headers: {} } as unknown as InternalAxiosRequestConfig,
        data: {
          description: 'API error message',
          error: [],
        },
        headers: {},
        status: 400,
        statusText: 'Bad Request',
      };

      (axios.request as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(
        client.request(testBaseUrl, 'GET', 'test-path'),
      ).rejects.toThrow('Request to NexHealth API failed: API error message');
    });

    it('should handle non-axios errors by rethrowing them', async () => {
      // First authenticate
      const mockToken = createMockToken();
      const authResponse = {
        data: {
          code: true,
          data: { token: mockToken },
          description: 'Authenticated',
          error: [],
        },
      };
      (axios.request as jest.Mock).mockResolvedValueOnce(authResponse);
      await client.authenticate(testBaseUrl);

      // Then make a request that throws a generic error
      const mockError = new Error('Generic error');
      (axios.request as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(
        client.request(testBaseUrl, 'GET', 'test-path'),
      ).rejects.toThrow(mockError);
    });
  });
});
