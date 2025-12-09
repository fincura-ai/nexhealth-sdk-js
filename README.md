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

// Use the client to interact with NexHealth APIs
// Endpoints will be documented as they are implemented
```

## API Reference

API endpoints are being implemented. See the [NexHealth API Documentation](https://docs.nexhealth.com/reference/introduction) for available endpoints.

## TypeScript Support

This SDK is written in TypeScript and provides full type definitions.

### Type-Safe Usage

```typescript
import { createNexHealthClient } from '@fincuratech/nexhealth-sdk-js';

const nexhealth = createNexHealthClient(process.env.NEXHEALTH_API_KEY!);

// TypeScript provides full intellisense and type checking
```

## Logging

The SDK is **silent by default** in production to avoid cluttering your application logs. However, you can enable logging for debugging or integrate your own logging solution.

### Default Behavior

By default, the SDK uses a no-op logger that doesn't output anything:

```typescript
import { createNexHealthClient } from '@fincuratech/nexhealth-sdk-js';

const nexhealth = createNexHealthClient('your-api-key');
// No logging output - silent by default
```

### Enable Console Logging

For development and debugging, you can enable console logging:

```typescript
import { createNexHealthClient, setLogger, createConsoleLogger } from '@fincuratech/nexhealth-sdk-js';

// Enable console logging at 'debug' level
setLogger(createConsoleLogger('debug'));

const nexhealth = createNexHealthClient('your-api-key');

// Now you'll see debug logs in the console:
// [nexhealth-sdk] DEBUG: NexHealth API request { method: 'GET', path: '/patients', ... }
// [nexhealth-sdk] DEBUG: NexHealth API response { status: 200, ... }
```

Available log levels (from most to least verbose):
- `'debug'` - Shows all logs including request/response details
- `'info'` - Shows informational messages
- `'warn'` - Shows warnings only
- `'error'` - Shows errors only

### Custom Logger Integration

You can integrate any logging framework (Winston, Pino, Bunyan, etc.) by implementing the `Logger` interface:

#### Winston Example

```typescript
import { createNexHealthClient, setLogger, type Logger } from '@fincuratech/nexhealth-sdk-js';
import winston from 'winston';

// Create your Winston logger
const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'nexhealth-sdk.log' }),
  ],
});

// Adapt Winston to the Logger interface
const nexhealthLogger: Logger = {
  debug: (message, meta) => winstonLogger.debug(message, meta),
  info: (message, meta) => winstonLogger.info(message, meta),
  warn: (message, meta) => winstonLogger.warn(message, meta),
  error: (message, meta) => winstonLogger.error(message, meta),
};

// Set the custom logger
setLogger(nexhealthLogger);

const nexhealth = createNexHealthClient('your-api-key');
// All SDK logs now go through Winston
```

#### Pino Example

```typescript
import { createNexHealthClient, setLogger, type Logger } from '@fincuratech/nexhealth-sdk-js';
import pino from 'pino';

const pinoLogger = pino({
  level: 'debug',
  transport: {
    target: 'pino-pretty',
  },
});

const nexhealthLogger: Logger = {
  debug: (message, meta) => pinoLogger.debug(meta, message),
  info: (message, meta) => pinoLogger.info(meta, message),
  warn: (message, meta) => pinoLogger.warn(meta, message),
  error: (message, meta) => pinoLogger.error(meta, message),
};

setLogger(nexhealthLogger);

const nexhealth = createNexHealthClient('your-api-key');
```

### Logger Interface

The SDK defines a simple logger interface that any logging solution can implement:

```typescript
interface Logger {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
}
```

## Contributing

Contributions are welcome. Please follow these guidelines:

### Development Setup

**Use pnpm** - npm has issues with platform-specific native bindings (especially on macOS). Install pnpm globally:

```bash
npm install -g pnpm
# or with Corepack (Node.js 16.9+)
corepack enable
```

Then:

```bash
# Clone
git clone https://github.com/fincura-ai/nexhealth-sdk-js.git
cd nexhealth-sdk-js

# Install dependencies
pnpm install

# Run tests
pnpm test

# Run linter
pnpm run lint

# Build
pnpm run build
```

### Guidelines

- Write tests for new features
- Follow the existing code style
- Update documentation for API changes
- Ensure all tests pass before submitting PRs
- Use conventional commit messages

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test -- --watch

# Run tests with coverage
pnpm test -- --coverage
```

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
