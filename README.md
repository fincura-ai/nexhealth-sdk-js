# NexHealth SDK for JavaScript/TypeScript

TypeScript SDK for [NexHealth APIs](https://docs.nexhealth.com/reference/introduction). This library provides type-safe wrappers for NexHealth's REST APIs, enabling integration with dozens of health record systems using a single universal API.

> [!NOTE]
> This is an unofficial third-party SDK for integrating with NexHealth APIs. It is not affiliated with or endorsed by NexHealth. Learn more [about us](#about-us).

[![npm version](https://img.shields.io/npm/v/@fincuratech/nexhealth-sdk-js.svg)](https://www.npmjs.com/package/@fincuratech/nexhealth-sdk-js)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Features

- Complete TypeScript definitions for API methods and responses
- Type-safe client for NexHealth REST APIs
- Flexible logging with support for custom loggers (Winston, Pino, etc.)

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [Authentication](#authentication)
  - [Patients](#patients)
  - [Charges](#charges)
  - [Claims](#claims)
  - [Payments](#payments)
  - [Payment Types](#payment-types)
- [TypeScript Support](#typescript-support)
- [Logging](#logging)
- [Contributing](#contributing)
- [License](#license)
- [Resources](#resources)
- [Support](#support)
- [About Us](#about-us)

## Requirements

- Node.js >= 20.x
- TypeScript >= 5.0 (for development)

## Installation

```bash
npm install @fincuratech/nexhealth-sdk-js
```

or with yarn:

```bash
yarn add @fincuratech/nexhealth-sdk-js
```

or with pnpm:

```bash
pnpm add @fincuratech/nexhealth-sdk-js
```

## Quick Start

```typescript
import { createNexHealthClient } from '@fincuratech/nexhealth-sdk-js';

// Initialize the client with your NexHealth API key
const nexhealth = createNexHealthClient('your-nexhealth-api-key');

// Authenticate first (required before making other API calls)
await nexhealth.authenticate();

// Example: List patients for a location
const patients = await nexhealth.patients.list({
  location_id: 123,
  subdomain: 'my-practice',
});
```

## API Reference

### Authentication

#### `authenticate()`

Authenticate with the NexHealth API. Must be called before making any other API requests. The bearer token is valid for 1 hour.

```typescript
await nexhealth.authenticate();
```

**Additional methods:**

- `isAuthenticated()` - Check if authenticated
- `getToken()` - Get current token (or null)
- `clearAuth()` - Clear authentication

📖 [Authentication Documentation](https://docs.nexhealth.com/reference/authentication-1)

---

### Patients

#### `patients.list(params)`

Retrieve patients for a location.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `location_id` | number | ✓ | Location ID |
| `subdomain` | string | ✓ | Institution subdomain |
| `id` | number | | Filter by patient ID |
| `name` | string | | Fuzzy search across first and last name |
| `first_name` | string | | Filter by first name |
| `last_name` | string | | Filter by last name |
| `email` | string | | Filter by email |
| `phone_number` | string | | Filter by phone |
| `date_of_birth` | string | | Filter by DOB (YYYY-MM-DD) |
| `provider_id` | number | | Filter by patient foreign_id from EHR |
| `new_patient` | boolean | | Filter new patients |
| `inactive` | boolean | | Filter inactive patients |
| `since` | string | | Updated since timestamp |
| `page` | number | | Page number |
| `per_page` | number | | Results per page |

**Returns:** `Promise<NexHealthPatient[]>`

```typescript
const patients = await nexhealth.patients.list({
  location_id: 123,
  subdomain: 'my-practice',
});

// With filters
const filtered = await nexhealth.patients.list({
  location_id: 123,
  subdomain: 'my-practice',
  first_name: 'John',
  last_name: 'Doe',
});
```

📖 [Patients API Documentation](https://docs.nexhealth.com/reference/getpatients)

---

### Charges

> [!NOTE]
> Only supported for Dentrix, Dentrix Enterprise, Eaglesoft, and Open Dental.

#### `charges.list(params)`

Retrieve charges for a location.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `location_id` | number | ✓ | Location ID |
| `subdomain` | string | ✓ | Institution subdomain |
| `patient_id` | number | | Filter by patient ID |
| `provider_id` | number | | Filter by provider ID |
| `guarantor_id` | number | | Filter by guarantor ID |
| `procedure` | string | | Filter by procedure code |
| `updated_since` | string | | Updated since timestamp |
| `page` | number | | Page number |
| `per_page` | number | | Results per page |

**Returns:** `Promise<NexHealthCharge[]>`

```typescript
const charges = await nexhealth.charges.list({
  location_id: 123,
  subdomain: 'my-practice',
  patient_id: 456,
});
```

📖 [Charges API Documentation](https://docs.nexhealth.com/v20240412/reference/getcharges)

---

### Claims

> [!NOTE]
> Only supported for Dentrix, Dentrix Enterprise, Eaglesoft, and Open Dental.

#### `claims.list(params)`

Retrieve insurance claims for a location.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `location_id` | number | ✓ | Location ID |
| `subdomain` | string | ✓ | Institution subdomain |
| `patient_id` | number | | Filter by patient ID |
| `provider_id` | number | | Filter by provider ID |
| `guarantor_id` | number | | Filter by guarantor ID |
| `updated_since` | string | | Updated since timestamp |
| `page` | number | | Page number |
| `per_page` | number | | Results per page |

**Returns:** `Promise<NexHealthClaim[]>`

```typescript
const claims = await nexhealth.claims.list({
  location_id: 123,
  subdomain: 'my-practice',
  patient_id: 456,
});
```

📖 [Claims API Documentation](https://docs.nexhealth.com/v20240412/reference/getclaims)

---

### Payments

> [!NOTE]
> Only supported for Dentrix, Dentrix Enterprise, Eaglesoft, and Open Dental.

#### `payments.create(params, body)`

Create a payment in the EHR.

**Query Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `location_id` | number | ✓ | Location ID |
| `subdomain` | string | ✓ | Institution subdomain |

**Body Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `patient_id` | number | ✓ | Patient ID |
| `amount` | number | ✓ | Amount (negative for received) |
| `payment_type_id` | number | * | Payment type ID |
| `type_name` | string | * | Payment type name |
| `transaction_id` | string | | Unique ID for idempotency |
| `paid_at` | string | | ISO 8601 payment timestamp |
| `charge_splits` | object | | Split across charges |
| `provider_splits` | object | | Split across providers |
| `notes` | string | | Payment notes |
| `currency` | string | | Currency (default: USD) |

\* Either `payment_type_id` or `type_name` must be provided.

**Returns:** `Promise<NexHealthPayment>`

```typescript
const payment = await nexhealth.payments.create(
  { location_id: 123, subdomain: 'my-practice' },
  {
    patient_id: 456,
    amount: -100,
    payment_type_id: 10,
    transaction_id: 'API:payment-001',
  }
);

// With charge splits
const payment = await nexhealth.payments.create(
  { location_id: 123, subdomain: 'my-practice' },
  {
    patient_id: 456,
    amount: -138,
    payment_type_id: 10,
    charge_splits: { '789': -100, '790': -38 },
  }
);
```

📖 [Payments API Documentation](https://docs.nexhealth.com/v20240412/reference/postpayments)

---

### Payment Types

> [!NOTE]
> Only supported for Dentrix, Dentrix Enterprise, Eaglesoft, and Open Dental.

#### `paymentTypes.list(params)`

List payment types for a location.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `location_id` | number | ✓ | Location ID |
| `subdomain` | string | ✓ | Institution subdomain |

**Returns:** `Promise<NexHealthPaymentType[]>`

```typescript
const types = await nexhealth.paymentTypes.list({
  location_id: 123,
  subdomain: 'my-practice',
});

const creditCard = types.find((t) => t.name === 'Credit Card');
```

📖 [Payment Types API Documentation](https://docs.nexhealth.com/v20240412/reference/getpaymenttypes)

## TypeScript Support

This SDK is written in TypeScript and provides full type definitions.

### Available Types

```typescript
import type {
  // Client
  NexHealthClient,
  
  // Patients
  NexHealthPatient,
  NexHealthPatientBio,
  NexHealthPatientsQueryParams,
  
  // Charges
  NexHealthCharge,
  NexHealthChargesQueryParams,
  
  // Claims
  NexHealthClaim,
  NexHealthClaimTotals,
  NexHealthClaimsQueryParams,
  
  // Payments
  NexHealthPayment,
  NexHealthPaymentCreateBody,
  NexHealthPaymentCreateParams,
  NexHealthChargeSplits,
  NexHealthProviderSplits,
  
  // Payment Types
  NexHealthPaymentType,
  NexHealthPaymentTypesQueryParams,
  
  // Common
  NexHealthMoneyAmount,
  NexHealthApiResponse,
} from '@fincuratech/nexhealth-sdk-js';
```

## Logging

The SDK is **silent by default**. Enable logging for debugging:

```typescript
import { createNexHealthClient, setLogger, createConsoleLogger } from '@fincuratech/nexhealth-sdk-js';

setLogger(createConsoleLogger('debug'));

const nexhealth = createNexHealthClient('your-api-key');
```

Available log levels: `'debug'` | `'info'` | `'warn'` | `'error'`

### Custom Logger

Integrate any logging framework by implementing the `Logger` interface:

```typescript
import { setLogger, type Logger } from '@fincuratech/nexhealth-sdk-js';

const customLogger: Logger = {
  debug: (message, meta) => { /* ... */ },
  info: (message, meta) => { /* ... */ },
  warn: (message, meta) => { /* ... */ },
  error: (message, meta) => { /* ... */ },
};

setLogger(customLogger);
```

## Contributing

Contributions are welcome. Please follow these guidelines:

### Development Setup

**Use pnpm** - npm has issues with platform-specific native bindings (especially on macOS).

```bash
pnpm install
pnpm test
pnpm run lint
pnpm run build
```

### Guidelines

- Write tests for new features
- Follow the existing code style
- Update documentation for API changes
- Ensure all tests pass before submitting PRs
- Use conventional commit messages

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for full details.

Copyright (c) 2024 Fincura Technologies, Inc.

## Resources

- [NexHealth API Documentation](https://docs.nexhealth.com/reference/introduction)
- [NexHealth Developer Portal](https://nexhealth.com)

## Support

For issues and questions:

- Open an issue on [GitHub](https://github.com/fincura-ai/nexhealth-sdk-js/issues)
- Contact Us at [tech@fincura.ai](mailto:tech@fincura.ai)

## About Us

Developed by [Fincura Technologies, Inc.](https://fincura.ai)

We provide healthcare practices and providers with automated insurance payment reconciliation and posting software, enabling provider staff to get paid 2.5x faster by payers and automate 40 hours per month in payment reconciliations.

Our platform leverages multiple sources to access ERA 835 payment remittance details of health insurance claims, including direct payer integrations and clearinghouse partners. This SDK powers integrations with NexHealth's APIs for patient management, scheduling, and practice data synchronization.
