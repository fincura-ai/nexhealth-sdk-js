import { charges } from '../../src/endpoints/charges.js';
import { type NexHealthCoreClient } from '../../src/lib/client.js';

const createMockClient = (): jest.Mocked<NexHealthCoreClient> => ({
  authenticate: jest.fn(),
  clearAuth: jest.fn(),
  getToken: jest.fn(),
  isAuthenticated: jest.fn().mockReturnValue(true),
  request: jest.fn(),
});

describe('charges endpoint', () => {
  const testBaseUrl = 'https://nexhealth.info';
  let mockClient: jest.Mocked<NexHealthCoreClient>;
  let chargesEndpoint: ReturnType<typeof charges>;

  beforeEach(() => {
    mockClient = createMockClient();
    chargesEndpoint = charges(mockClient, testBaseUrl);
  });

  describe('list', () => {
    it('should return charges from API', async () => {
      const mockCharges = [{ id: 1 }, { id: 2 }];
      mockClient.request.mockResolvedValue({
        code: true,
        data: mockCharges,
        error: [],
      });

      const result = await chargesEndpoint.list({
        location_id: 123,
        patient_id: 456,
        subdomain: 'test-practice',
      });

      expect(mockClient.request).toHaveBeenCalledWith(
        testBaseUrl,
        'GET',
        '/charges',
        {
          params: {
            location_id: 123,
            patient_id: 456,
            subdomain: 'test-practice',
          },
        },
      );
      expect(result).toEqual(mockCharges);
    });

    it('should return empty array for non-array response', async () => {
      mockClient.request.mockResolvedValue({
        code: true,
        data: null,
        error: [],
      });

      const result = await chargesEndpoint.list({
        location_id: 123,
        patient_id: 456,
        subdomain: 'test-practice',
      });

      expect(result).toEqual([]);
    });
  });
});
