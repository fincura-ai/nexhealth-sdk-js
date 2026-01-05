import { paymentTypes } from '../../src/endpoints/paymentTypes.js';
import { type NexHealthCoreClient } from '../../src/lib/client.js';

const createMockClient = (): jest.Mocked<NexHealthCoreClient> => ({
  authenticate: jest.fn(),
  clearAuth: jest.fn(),
  getToken: jest.fn(),
  isAuthenticated: jest.fn().mockReturnValue(true),
  request: jest.fn(),
});

describe('paymentTypes endpoint', () => {
  const testBaseUrl = 'https://nexhealth.info';
  let mockClient: jest.Mocked<NexHealthCoreClient>;
  let paymentTypesEndpoint: ReturnType<typeof paymentTypes>;

  beforeEach(() => {
    mockClient = createMockClient();
    paymentTypesEndpoint = paymentTypes(mockClient, testBaseUrl);
  });

  describe('list', () => {
    it('should return payment types from API', async () => {
      const mockTypes = [{ active: true, id: 1, name: 'Cash' }];
      mockClient.request.mockResolvedValue({
        code: true,
        data: mockTypes,
        error: [],
      });

      const result = await paymentTypesEndpoint.list({
        location_id: 123,
        subdomain: 'test-practice',
      });

      expect(mockClient.request).toHaveBeenCalledWith(
        testBaseUrl,
        'GET',
        '/payment_types',
        { params: { location_id: 123, subdomain: 'test-practice' } },
      );
      expect(result).toEqual(mockTypes);
    });

    it('should return empty array for non-array response', async () => {
      mockClient.request.mockResolvedValue({
        code: true,
        data: null,
        error: [],
      });

      const result = await paymentTypesEndpoint.list({
        location_id: 123,
        subdomain: 'test-practice',
      });

      expect(result).toEqual([]);
    });
  });
});
