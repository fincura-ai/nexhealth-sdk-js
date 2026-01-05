import { claims } from '../../src/endpoints/claims.js';
import { type NexHealthCoreClient } from '../../src/lib/client.js';

const createMockClient = (): jest.Mocked<NexHealthCoreClient> => ({
  authenticate: jest.fn(),
  clearAuth: jest.fn(),
  getToken: jest.fn(),
  isAuthenticated: jest.fn().mockReturnValue(true),
  request: jest.fn(),
});

describe('claims endpoint', () => {
  const testBaseUrl = 'https://nexhealth.info';
  let mockClient: jest.Mocked<NexHealthCoreClient>;
  let claimsEndpoint: ReturnType<typeof claims>;

  beforeEach(() => {
    mockClient = createMockClient();
    claimsEndpoint = claims(mockClient, testBaseUrl);
  });

  describe('list', () => {
    it('should return claims from wrapped response', async () => {
      const mockClaims = [{ id: 1 }, { id: 2 }];
      mockClient.request.mockResolvedValue({
        code: true,
        data: { claims: mockClaims },
        error: [],
      });

      const result = await claimsEndpoint.list({
        location_id: 123,
        patient_id: 456,
        subdomain: 'test-practice',
      });

      expect(mockClient.request).toHaveBeenCalledWith(
        testBaseUrl,
        'GET',
        '/claims',
        {
          params: {
            location_id: 123,
            patient_id: 456,
            subdomain: 'test-practice',
          },
        },
      );
      expect(result).toEqual(mockClaims);
    });

    it('should return claims from array response', async () => {
      const mockClaims = [{ id: 1 }];
      mockClient.request.mockResolvedValue({
        code: true,
        data: mockClaims,
        error: [],
      });

      const result = await claimsEndpoint.list({
        location_id: 123,
        patient_id: 456,
        subdomain: 'test-practice',
      });

      expect(result).toEqual(mockClaims);
    });

    it('should return empty array for unexpected response', async () => {
      mockClient.request.mockResolvedValue({
        code: true,
        data: null,
        error: [],
      });

      const result = await claimsEndpoint.list({
        location_id: 123,
        patient_id: 456,
        subdomain: 'test-practice',
      });

      expect(result).toEqual([]);
    });
  });
});
