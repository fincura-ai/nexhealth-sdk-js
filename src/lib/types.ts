/**
 * Standard NexHealth API response wrapper
 */
export type NexHealthApiResponse<T> = {
  code: boolean;
  count?: number;
  data: T;
  description: string[] | string;
  error: string[];
};

// Authentication Types

/**
 * Response from the /authenticates endpoint
 */
export type NexHealthAuthResponse = NexHealthApiResponse<{
  token: string;
}>;

/**
 * Decoded JWT token payload (for reference)
 */
export type NexHealthTokenPayload = {
  exp: number; // Expiration timestamp
  iat: number; // Issued at timestamp
  jti: string; // JWT ID
  scp: string; // Scope
  sub: string; // Subject (user ID)
};

// Shared Types

/**
 * NexHealth money amount object
 */
export type NexHealthMoneyAmount = {
  amount: string;
  currency: string;
};
