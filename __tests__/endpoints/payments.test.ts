import { payments } from '../../src/endpoints/payments.js';
import { type NexHealthCoreClient } from '../../src/lib/client.js';

const createMockClient = (): jest.Mocked<NexHealthCoreClient> => ({
  authenticate: jest.fn(),
  clearAuth: jest.fn(),
  getToken: jest.fn(),
  isAuthenticated: jest.fn().mockReturnValue(true),
  request: jest.fn(),
});

describe('payments endpoint', () => {
  const testBaseUrl = 'https://nexhealth.info';
  let mockClient: jest.Mocked<NexHealthCoreClient>;
  let paymentsEndpoint: ReturnType<typeof payments>;

  beforeEach(() => {
    mockClient = createMockClient();
    paymentsEndpoint = payments(mockClient, testBaseUrl);
  });

  describe('create', () => {
    it('should create a payment and return the result', async () => {
      const mockPayment = {
        amount: { amount: '-138.00', currency: 'USD' },
        id: 1,
        patient_id: 456,
      };
      mockClient.request.mockResolvedValue({
        code: true,
        data: { payment: mockPayment },
        error: [],
      });

      const result = await paymentsEndpoint.create(
        { location_id: 123, subdomain: 'test-practice' },
        { amount: -138, patient_id: 456, payment_type_id: 10 },
      );

      expect(mockClient.request).toHaveBeenCalledWith(
        testBaseUrl,
        'POST',
        '/payments',
        {
          data: {
            payment: { amount: -138, patient_id: 456, payment_type_id: 10 },
          },
          params: { location_id: 123, subdomain: 'test-practice' },
        },
      );
      expect(result).toEqual(mockPayment);
    });
  });
});
