import { patients } from '../../src/endpoints/patients.js';
import { type NexHealthCoreClient } from '../../src/lib/client.js';
import { type NexHealthPatientsResponse } from '../../src/lib/types.js';

describe('patients endpoint', () => {
  const testBaseUrl = 'https://nexhealth.info';
  let mockClient: jest.Mocked<NexHealthCoreClient>;
  let patientsEndpoint: ReturnType<typeof patients>;

  beforeEach(() => {
    mockClient = {
      authenticate: jest.fn(),
      clearAuth: jest.fn(),
      getToken: jest.fn(),
      isAuthenticated: jest.fn(),
      request: jest.fn(),
    };
    patientsEndpoint = patients(mockClient, testBaseUrl);
  });

  describe('list', () => {
    it('should fetch patients with required location_id', async () => {
      const mockResponse: NexHealthPatientsResponse = {
        code: true,
        count: 2,
        data: [
          {
            bio: {
              date_of_birth: '1990-01-15',
              email: 'john.doe@example.com',
              first_name: 'John',
              last_name: 'Doe',
              phone_number: '555-123-4567',
            },
            created_at: '2024-01-01T00:00:00Z',
            id: 1,
            inactive: false,
            institution_id: 100,
            location_ids: [123],
          },
          {
            bio: {
              date_of_birth: '1985-06-20',
              email: 'jane.smith@example.com',
              first_name: 'Jane',
              last_name: 'Smith',
              phone_number: '555-987-6543',
            },
            created_at: '2024-01-02T00:00:00Z',
            id: 2,
            inactive: false,
            institution_id: 100,
            location_ids: [123],
          },
        ],
        description: 'Success',
        error: [],
      };

      mockClient.request.mockResolvedValue(mockResponse);

      const result = await patientsEndpoint.list({ location_id: 123 });

      expect(mockClient.request).toHaveBeenCalledWith(
        testBaseUrl,
        'GET',
        '/patients',
        {
          params: { location_id: 123 },
        },
      );
      expect(result).toEqual(mockResponse.data);
      expect(result).toHaveLength(2);
      expect(result[0].bio?.first_name).toBe('John');
    });

    it('should fetch patients with pagination parameters', async () => {
      const mockResponse: NexHealthPatientsResponse = {
        code: true,
        count: 100,
        data: [
          {
            bio: {
              first_name: 'Test',
              last_name: 'Patient',
            },
            id: 1,
            location_ids: [123],
          },
        ],
        description: 'Success',
        error: [],
      };

      mockClient.request.mockResolvedValue(mockResponse);

      const result = await patientsEndpoint.list({
        location_id: 123,
        page: 2,
        per_page: 50,
      });

      expect(mockClient.request).toHaveBeenCalledWith(
        testBaseUrl,
        'GET',
        '/patients',
        {
          params: {
            location_id: 123,
            page: 2,
            per_page: 50,
          },
        },
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should fetch patients with filter parameters', async () => {
      const mockResponse: NexHealthPatientsResponse = {
        code: true,
        count: 1,
        data: [
          {
            bio: {
              date_of_birth: '1990-01-15',
              email: 'john.doe@example.com',
              first_name: 'John',
              last_name: 'Doe',
            },
            id: 1,
            location_ids: [123],
          },
        ],
        description: 'Success',
        error: [],
      };

      mockClient.request.mockResolvedValue(mockResponse);

      const result = await patientsEndpoint.list({
        date_of_birth: '1990-01-15',
        email: 'john.doe@example.com',
        first_name: 'John',
        last_name: 'Doe',
        location_id: 123,
      });

      expect(mockClient.request).toHaveBeenCalledWith(
        testBaseUrl,
        'GET',
        '/patients',
        {
          params: {
            date_of_birth: '1990-01-15',
            email: 'john.doe@example.com',
            first_name: 'John',
            last_name: 'Doe',
            location_id: 123,
          },
        },
      );
      expect(result).toHaveLength(1);
      expect(result[0].bio?.first_name).toBe('John');
    });

    it('should return empty array when no patients found', async () => {
      const mockResponse: NexHealthPatientsResponse = {
        code: true,
        count: 0,
        data: [],
        description: 'Success',
        error: [],
      };

      mockClient.request.mockResolvedValue(mockResponse);

      const result = await patientsEndpoint.list({ location_id: 123 });

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });
});
