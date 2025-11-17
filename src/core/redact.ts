/**
 * Secret redaction utilities for removing sensitive data from logs.
 *
 * This module provides functions to redact sensitive information from strings,
 * such as passwords, API keys, tokens, and other secrets, to prevent
 * accidental disclosure in logs and error messages.
 */

/**
 * Common patterns for sensitive data that should be redacted
 * NOTE: More specific patterns should come before generic patterns
 */
const REDACTION_PATTERNS = [
  // GitHub tokens (specific patterns first)
  // GitHub tokens are typically 36+ chars but can be shorter in test/staging
  { pattern: /ghp_[A-Za-z0-9_]{20,}/g, name: 'GitHub Personal Token' },
  { pattern: /ghu_[A-Za-z0-9_]{20,}/g, name: 'GitHub User Token' },
  { pattern: /ghs_[A-Za-z0-9_]{20,}/g, name: 'GitHub Server Token' },
  { pattern: /ghr_[A-Za-z0-9_]{20,}/g, name: 'GitHub Refresh Token' },
  // Generic pattern - excludes both specific prefixes AND already-redacted values
  {
    pattern: /github[_-]?token\s*[=:]\s*(?!ghp_|ghu_|ghs_|ghr_|\[REDACTED:)[^\s,;]+/gi,
    name: 'GitHub Token',
  },

  // JWT tokens (specific before generic)
  { pattern: /eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, name: 'JWT Token' },
  { pattern: /jwt\s*[=:]\s*[^\s,;]+/gi, name: 'JWT Token' },

  // AWS Keys (access key before secret key for better naming)
  {
    pattern: /aws[_-]?access[_-]?key[_-]?id\s*[=:]\s*[^\s,;]+/gi,
    name: 'AWS Access Key',
  },
  {
    pattern: /aws[_-]?secret[_-]?access[_-]?key\s*[=:]\s*[^\s,;]+/gi,
    name: 'AWS Secret Key',
  },

  // API Keys (generic)
  { pattern: /api[_-]?key\s*[=:]\s*[^\s,;]+/gi, name: 'API Key' },

  // Bearer tokens
  { pattern: /bearer\s+[^\s,;]+/gi, name: 'Bearer Token' },

  // Database passwords
  {
    pattern: /(?:password|passwd|pwd)\s*[=:]\s*[^\s,;]+/gi,
    name: 'Password',
  },

  // Connection strings (MongoDB and other databases with embedded credentials)
  {
    pattern: /(?:mongodb|postgres|mysql|oracle):\/\/[^@]+:[^@]+@/gi,
    name: 'Database Connection String',
  },
  {
    pattern: /(?:mongodb|postgres|mysql|oracle)[^\s]+password[=:][^\s,;]+/gi,
    name: 'Database Connection String',
  },

  // Passwords in URLs
  {
    pattern: /https?:\/\/[^:]+:[^\s@]+@/g,
    name: 'URL Credentials',
  },

  // SSH Keys (private key content)
  {
    pattern:
      /-----BEGIN (?:RSA |DSA |EC )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |DSA |EC )?PRIVATE KEY-----/g,
    name: 'Private SSH Key',
  },

  // OAuth tokens
  { pattern: /oauth[_-]?token\s*[=:]\s*[^\s,;]+/gi, name: 'OAuth Token' },

  // Stripe keys
  {
    pattern: /(?:sk_live|sk_test|pk_live|pk_test)_[A-Za-z0-9]+/g,
    name: 'Stripe Key',
  },

  // Social Security Numbers
  { pattern: /\b\d{3}-\d{2}-\d{4}\b/g, name: 'SSN' },

  // Credit card numbers
  { pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, name: 'Credit Card' },

  // Generic secret/token assignments - exclude already-redacted values and compound words
  { pattern: /(?<![a-z_])secret\s*[=:]\s*(?!\[REDACTED:)[^\s,;]+/gi, name: 'Secret' },
  { pattern: /(?<![a-z_])token\s*[=:]\s*(?!\[REDACTED:)[^\s,;]+/gi, name: 'Token' },
]

/**
 * Environment variable names that are commonly sensitive
 * These are matched by substring (case-insensitive)
 */
const SENSITIVE_ENV_VARS = [
  'PASSWORD',
  'PASSWD',
  'PWD',
  'SECRET',
  '_TOKEN', // Match *_TOKEN but not TOKEN alone (too broad)
  'API_KEY',
  'APIKEY',
  'PRIVATE_KEY',
  'PRIVATE_SECRET',
  '_AUTH', // Match *_AUTH (like AWS_AUTH, GITHUB_AUTH)
  'AUTHORIZATION',
  'BEARER',
  'CREDENTIALS',
  'CERTIFICATE',
  '_CERT', // Match *_CERT
  '_KEY_ID', // Match *_KEY_ID (like AWS_ACCESS_KEY_ID)
  '_SECRET_KEY', // Match *_SECRET_KEY (like AWS_SECRET_ACCESS_KEY)
  'OAUTH',
  'JWT',
  'SESSION',
  'COOKIE',
  'NONCE',
  'SIGNING_KEY',
  'SIGNATURE',
  'SK_LIVE',
  'SK_TEST',
  'PK_LIVE',
  'PK_TEST',
  'DATABASE_URL',
  'DB_PASSWORD',
  'MONGO_',
  'POSTGRES_PASSWORD',
  'MYSQL_PASSWORD',
]

/**
 * Redact sensitive information from a string.
 * Replaces matching patterns with [REDACTED: pattern_name]
 *
 * @param text The text to redact
 * @returns Text with sensitive information replaced
 *
 * @example
 * ```ts
 * const output = redactSecrets('Bearer token abc123def456')
 * console.log(output) // 'Bearer [REDACTED: Bearer Token]'
 * ```
 */
export function redactSecrets(text: string): string {
  if (!text || typeof text !== 'string') {
    return text
  }

  let redacted = text

  // Apply all redaction patterns
  for (const { pattern, name } of REDACTION_PATTERNS) {
    redacted = redacted.replace(pattern, `[REDACTED: ${name}]`)
  }

  return redacted
}

/**
 * Redact environment variables that might contain sensitive data.
 * Filters environment object to only include safe variables.
 *
 * @param env Environment variables object
 * @returns Environment object with sensitive values redacted
 *
 * @example
 * ```ts
 * const env = {
 *   NODE_ENV: 'production',
 *   DATABASE_PASSWORD: 'super_secret_123',
 *   API_KEY: 'sk_live_abc123'
 * }
 *
 * const safe = redactEnvironment(env)
 * // {
 * //   NODE_ENV: 'production',
 * //   DATABASE_PASSWORD: '[REDACTED]',
 * //   API_KEY: '[REDACTED]'
 * // }
 * ```
 */
export function redactEnvironment(env: Record<string, string>): Record<string, string> {
  const safe: Record<string, string> = {}

  for (const [key, value] of Object.entries(env)) {
    const isSensitive = SENSITIVE_ENV_VARS.some((sensitive) =>
      key.toUpperCase().includes(sensitive.toUpperCase()),
    )

    safe[key] = isSensitive ? '[REDACTED]' : value
  }

  return safe
}

/**
 * Create a safe representation of environment variables for logging.
 * Shows which variables are present but redacts their values.
 *
 * @param env Environment variables object
 * @returns Safe representation suitable for logging
 *
 * @example
 * ```ts
 * const env = {
 *   NODE_ENV: 'production',
 *   DATABASE_PASSWORD: 'super_secret_123'
 * }
 *
 * const safe = safeEnvironmentLog(env)
 * // 'NODE_ENV=production, DATABASE_PASSWORD=[REDACTED]'
 * ```
 */
export function safeEnvironmentLog(env: Record<string, string>): string {
  return Object.entries(env)
    .map(([key, value]) => {
      const isSensitive = SENSITIVE_ENV_VARS.some((sensitive) =>
        key.toUpperCase().includes(sensitive.toUpperCase()),
      )
      return `${key}=${isSensitive ? '[REDACTED]' : value}`
    })
    .join(', ')
}

/**
 * Redact command arguments that might contain sensitive data.
 * Filters arguments array to hide sensitive values.
 *
 * @param command The command name
 * @param args Command arguments
 * @returns Array with sensitive arguments redacted
 *
 * @example
 * ```ts
 * const args = redactArguments('psql', ['-h', 'localhost', '-p', '5432', '-U', 'admin', '-W', 'secret123'])
 * console.log(args) // ['-h', 'localhost', '-p', '5432', '-U', 'admin', '-W', '[REDACTED]']
 * ```
 */
export function redactArguments(command: string, args: string[]): string[] {
  const redacted = [...args]

  // Flags where the NEXT argument is the sensitive value
  const nextArgSensitiveFlags = [
    '-W', // psql password
    '--password',
    '--pwd',
    '--secret',
    '--token',
    '--api-key',
    '--apikey',
    '--auth',
    '--bearer',
  ]

  // Command-specific sensitive flags
  const commandSpecificFlags: Record<string, string[]> = {
    psql: ['-W', '--password'], // psql: -W is password, -p is port
    mysql: ['-p', '--password'], // mysql: -p is password
    postgres: ['-p', '--password'], // postgres: -p is password
    mongo: ['--password'],
    mongodb: ['--password'],
  }

  // Get sensitive flags for this specific command
  const commandName = command.toLowerCase()
  const commandSensitiveFlags = commandSpecificFlags[commandName] || nextArgSensitiveFlags

  for (let i = 0; i < redacted.length; i++) {
    const arg = redacted[i]

    // Check if this is a sensitive flag (for this command)
    if (arg && commandSensitiveFlags.some((f) => f.toLowerCase() === arg.toLowerCase())) {
      if (i + 1 < redacted.length) {
        redacted[i + 1] = '[REDACTED]'
      }
    }

    // Check for flag=value format
    if (arg?.includes('=')) {
      const [key, _value] = arg.split('=')
      const lowerKey = key?.toLowerCase() ?? ''
      if (
        nextArgSensitiveFlags.some((f) => f.toLowerCase() === lowerKey) ||
        commandSensitiveFlags.some((f) => f.toLowerCase() === lowerKey)
      ) {
        redacted[i] = `${key}=[REDACTED]`
      }
    }
  }

  return redacted
}

/**
 * Create a safe representation of command and arguments for logging.
 *
 * @param command The command name
 * @param args Command arguments
 * @returns Safe command representation for logging
 *
 * @example
 * ```ts
 * const safe = safeCommandLog('psql', ['-h', 'localhost', '-U', 'admin', '-W', 'secret123'])
 * console.log(safe) // 'psql -h localhost -U admin -W [REDACTED]'
 * ```
 */
export function safeCommandLog(command: string, args: string[]): string {
  const safe = redactArguments(command, args)
  // Also apply secret redaction to catch patterns like API_KEY=value
  const fullyRedacted = safe.map((arg) => redactSecrets(arg))
  return [command, ...fullyRedacted].join(' ')
}
