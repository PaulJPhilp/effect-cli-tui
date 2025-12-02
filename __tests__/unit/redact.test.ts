import { describe, expect, it } from "vitest";
import {
  redactArguments,
  redactEnvironment,
  redactSecrets,
  safeCommandLog,
  safeEnvironmentLog,
} from "../../src/core/redact";

const REGEX_NPM_WITH_SPACE = /^npm\s+/;

/**
 * Comprehensive tests for secret redaction utilities.
 * Ensures sensitive data is properly filtered from logs.
 */

describe("Secret Redaction Utilities", () => {
  describe("redactSecrets - Generic Pattern Matching", () => {
    it("should redact bearer tokens", () => {
      const text = "Authorization: Bearer abc123def456ghi789";
      const redacted = redactSecrets(text);
      expect(redacted).toContain("[REDACTED: Bearer Token]");
      expect(redacted).not.toContain("abc123def456ghi789");
    });

    it("should redact JWT tokens", () => {
      const jwt =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U";
      const redacted = redactSecrets(jwt);
      expect(redacted).toContain("[REDACTED: JWT Token]");
    });

    it("should redact API keys", () => {
      const text = "api_key=sk_live_abc123xyz789";
      const redacted = redactSecrets(text);
      expect(redacted).toContain("[REDACTED: API Key]");
      expect(redacted).not.toContain("sk_live_abc123xyz789");
    });

    it("should redact passwords", () => {
      const text = "password=MySecurePassword123!";
      const redacted = redactSecrets(text);
      expect(redacted).toContain("[REDACTED: Password]");
      expect(redacted).not.toContain("MySecurePassword123!");
    });

    it("should redact AWS access keys", () => {
      const text = "aws_access_key_id=AKIAIOSFODNN7EXAMPLE";
      const redacted = redactSecrets(text);
      expect(redacted).toContain("[REDACTED: AWS Access Key]");
    });

    it("should redact AWS secret keys", () => {
      const text =
        "aws_secret_access_key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";
      const redacted = redactSecrets(text);
      expect(redacted).toContain("[REDACTED: AWS Secret Key]");
    });

    it("should redact GitHub tokens", () => {
      const text = "github_token=ghp_1234567890abcdefghijklmnopqrstuvwxyz";
      const redacted = redactSecrets(text);
      expect(redacted).toContain("[REDACTED: GitHub Personal Token]");
    });

    it("should redact Stripe keys", () => {
      const text = "stripe_key=sk_live_abc123def456ghi789";
      const redacted = redactSecrets(text);
      expect(redacted).toContain("[REDACTED: Stripe Key]");
    });

    it("should redact connection strings with passwords", () => {
      const text = "mongodb://user:secret123@localhost:27017/db";
      const redacted = redactSecrets(text);
      expect(redacted).not.toContain("secret123");
    });

    it("should redact URL credentials", () => {
      const text = "https://admin:password123@api.example.com";
      const redacted = redactSecrets(text);
      expect(redacted).toContain("[REDACTED: URL Credentials]");
    });

    it("should redact SSH private keys", () => {
      const text = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA1234567890abcdef...
-----END RSA PRIVATE KEY-----`;
      const redacted = redactSecrets(text);
      expect(redacted).toContain("[REDACTED: Private SSH Key]");
    });

    it("should redact Social Security Numbers", () => {
      const text = "SSN: 123-45-6789";
      const redacted = redactSecrets(text);
      expect(redacted).toContain("[REDACTED: SSN]");
    });

    it("should redact credit card numbers", () => {
      const text = "Card: 4532-1234-5678-9010";
      const redacted = redactSecrets(text);
      expect(redacted).toContain("[REDACTED: Credit Card]");
    });

    it("should handle multiple secrets in same string", () => {
      const text = "token=secret123 and api_key=abc789 with password=xyz";
      const redacted = redactSecrets(text);
      expect(redacted).toContain("[REDACTED");
      expect(redacted).not.toContain("secret123");
      expect(redacted).not.toContain("abc789");
      expect(redacted).not.toContain("xyz");
    });

    it("should not redact non-secret text", () => {
      const text = "This is a normal log message with no secrets";
      const redacted = redactSecrets(text);
      expect(redacted).toBe(text);
    });

    it("should handle empty strings", () => {
      const redacted = redactSecrets("");
      expect(redacted).toBe("");
    });

    it("should handle null/non-string inputs gracefully", () => {
      expect(redactSecrets(null as any)).toBe(null);
      expect(redactSecrets(undefined as any)).toBe(undefined);
    });
  });

  describe("redactEnvironment - Environment Variable Filtering", () => {
    it("should redact PASSWORD variables", () => {
      const env = {
        DATABASE_PASSWORD: "secret123",
        NODE_ENV: "production",
      };
      const safe = redactEnvironment(env);
      expect(safe.DATABASE_PASSWORD).toBe("[REDACTED]");
      expect(safe.NODE_ENV).toBe("production");
    });

    it("should redact API_KEY variables", () => {
      const env = {
        API_KEY: "sk_live_xyz",
        APIKEY: "pk_test_abc",
      };
      const safe = redactEnvironment(env);
      expect(safe.API_KEY).toBe("[REDACTED]");
      expect(safe.APIKEY).toBe("[REDACTED]");
    });

    it("should redact TOKEN variables", () => {
      const env = {
        AUTH_TOKEN: "bearer_xyz",
        JWT_TOKEN: "eyJ...",
        OAUTH_TOKEN: "oauth_abc",
      };
      const safe = redactEnvironment(env);
      expect(safe.AUTH_TOKEN).toBe("[REDACTED]");
      expect(safe.JWT_TOKEN).toBe("[REDACTED]");
      expect(safe.OAUTH_TOKEN).toBe("[REDACTED]");
    });

    it("should redact AWS variables", () => {
      const env = {
        AWS_ACCESS_KEY_ID: "AKIA...",
        AWS_SECRET_ACCESS_KEY: "wJalr...",
        AWS_REGION: "us-east-1",
      };
      const safe = redactEnvironment(env);
      expect(safe.AWS_ACCESS_KEY_ID).toBe("[REDACTED]");
      expect(safe.AWS_SECRET_ACCESS_KEY).toBe("[REDACTED]");
      expect(safe.AWS_REGION).toBe("us-east-1");
    });

    it("should redact GITHUB variables", () => {
      const env = {
        GITHUB_TOKEN: "ghp_xyz",
        GITHUB_PASSWORD: "secret",
      };
      const safe = redactEnvironment(env);
      expect(safe.GITHUB_TOKEN).toBe("[REDACTED]");
      expect(safe.GITHUB_PASSWORD).toBe("[REDACTED]");
    });

    it("should be case-insensitive", () => {
      const env = {
        password: "secret1",
        PASSWORD: "secret2",
        PaSsWoRd: "secret3",
      };
      const safe = redactEnvironment(env);
      expect(safe.password).toBe("[REDACTED]");
      expect(safe.PASSWORD).toBe("[REDACTED]");
      expect(safe.PaSsWoRd).toBe("[REDACTED]");
    });

    it("should handle empty environment", () => {
      const safe = redactEnvironment({});
      expect(safe).toEqual({});
    });
  });

  describe("safeEnvironmentLog - Human-Readable Environment Logging", () => {
    it("should format safe variables with values", () => {
      const env = {
        NODE_ENV: "production",
        PORT: "3000",
      };
      const log = safeEnvironmentLog(env);
      expect(log).toContain("NODE_ENV=production");
      expect(log).toContain("PORT=3000");
    });

    it("should redact sensitive variables", () => {
      const env = {
        DATABASE_PASSWORD: "secret123",
        NODE_ENV: "production",
      };
      const log = safeEnvironmentLog(env);
      expect(log).toContain("DATABASE_PASSWORD=[REDACTED]");
      expect(log).toContain("NODE_ENV=production");
      expect(log).not.toContain("secret123");
    });

    it("should return comma-separated format", () => {
      const env = {
        VAR1: "value1",
        VAR2: "value2",
      };
      const log = safeEnvironmentLog(env);
      expect(log).toContain(", ");
    });

    it("should handle mixed safe and unsafe variables", () => {
      const env = {
        SAFE_VAR: "visible",
        API_KEY: "secret",
        DEBUG: "true",
      };
      const log = safeEnvironmentLog(env);
      expect(log).toContain("SAFE_VAR=visible");
      expect(log).toContain("API_KEY=[REDACTED]");
      expect(log).toContain("DEBUG=true");
    });
  });

  describe("redactArguments - Command Argument Filtering", () => {
    it("should redact password flag with space", () => {
      const args = ["-h", "localhost", "-W", "MyPassword"];
      const redacted = redactArguments("psql", args);
      expect(redacted[3]).toBe("[REDACTED]");
      expect(redacted).not.toContain("MyPassword");
    });

    it("should redact password flag with equals", () => {
      const args = ["--password=SecurePass123"];
      const redacted = redactArguments("psql", args);
      expect(redacted[0]).toBe("--password=[REDACTED]");
    });

    it("should redact api-key flag", () => {
      const args = ["--api-key", "sk_live_abc123"];
      const redacted = redactArguments("curl", args);
      expect(redacted[1]).toBe("[REDACTED]");
    });

    it("should redact auth flag", () => {
      const args = ["--auth", "Bearer xyz123"];
      const redacted = redactArguments("curl", args);
      expect(redacted[1]).toBe("[REDACTED]");
    });

    it("should preserve non-sensitive arguments", () => {
      const args = ["-h", "localhost", "-p", "5432", "-U", "admin"];
      const redacted = redactArguments("psql", args);
      expect(redacted[0]).toBe("-h");
      expect(redacted[1]).toBe("localhost");
      expect(redacted[2]).toBe("-p");
      expect(redacted[3]).toBe("5432");
    });

    it("should handle multiple sensitive arguments", () => {
      const args = [
        "--api-key",
        "key1",
        "--secret",
        "secret1",
        "--normal",
        "value",
      ];
      const redacted = redactArguments("cmd", args);
      expect(redacted[1]).toBe("[REDACTED]");
      expect(redacted[3]).toBe("[REDACTED]");
      expect(redacted[5]).toBe("value");
    });

    it("should be case-insensitive for flags", () => {
      const args = ["--PASSWORD=secret", "--password=secret"];
      const redacted = redactArguments("cmd", args);
      expect(redacted[0]).toBe("--PASSWORD=[REDACTED]");
      expect(redacted[1]).toBe("--password=[REDACTED]");
    });

    it("should handle empty arguments", () => {
      const redacted = redactArguments("cmd", []);
      expect(redacted).toEqual([]);
    });
  });

  describe("safeCommandLog - Command String Formatting", () => {
    it("should format command with safe arguments", () => {
      const log = safeCommandLog("psql", ["-h", "localhost", "-p", "5432"]);
      expect(log).toBe("psql -h localhost -p 5432");
    });

    it("should redact sensitive arguments in command string", () => {
      const log = safeCommandLog("psql", [
        "-h",
        "localhost",
        "-W",
        "secret123",
      ]);
      expect(log).toContain("psql -h localhost -W [REDACTED]");
      expect(log).not.toContain("secret123");
    });

    it("should handle equals format in command string", () => {
      const log = safeCommandLog("curl", ["--api-key=sk_live_xyz"]);
      expect(log).toContain("[REDACTED");
      expect(log).not.toContain("sk_live_xyz");
    });

    it("should produce valid command-like output", () => {
      const log = safeCommandLog("npm", ["install", "--save", "package"]);
      expect(log).toMatch(REGEX_NPM_WITH_SPACE);
    });

    it("should handle complex command with mixed args", () => {
      const log = safeCommandLog("docker", [
        "run",
        "--env",
        "API_KEY=secret123",
        "--name",
        "myapp",
        "image:latest",
      ]);
      expect(log).not.toContain("secret123");
      expect(log).toContain("myapp");
      expect(log).toContain("image:latest");
    });
  });

  describe("Integration Scenarios", () => {
    it("should handle real-world database command", () => {
      const command = "psql";
      const args = [
        "-h",
        "db.example.com",
        "-p",
        "5432",
        "-U",
        "admin",
        "-W",
        "MyPassword123!",
        "-d",
        "production",
      ];
      const safe = safeCommandLog(command, args);
      expect(safe).not.toContain("MyPassword123!");
      expect(safe).toContain("db.example.com");
      expect(safe).toContain("production");
    });

    it("should handle real-world API request with secrets", () => {
      const text = `curl -H "Authorization: Bearer sk_live_abc123" \
        -H "X-API-Key: pk_test_xyz789" \
        https://api.example.com/endpoint`;
      const redacted = redactSecrets(text);
      expect(redacted).not.toContain("sk_live_abc123");
      expect(redacted).not.toContain("pk_test_xyz789");
    });

    it("should handle environment with mixed secrets", () => {
      const env = {
        NODE_ENV: "production",
        DATABASE_PASSWORD: "pass123",
        API_KEY: "key456",
        DEBUG: "false",
        STRIPE_SECRET: "sk_live_789",
      };
      const safe = redactEnvironment(env);
      expect(Object.values(safe)).toHaveLength(5);
      expect(safe.NODE_ENV).toBe("production");
      expect(safe.DEBUG).toBe("false");
      expect(safe.DATABASE_PASSWORD).toBe("[REDACTED]");
      expect(safe.API_KEY).toBe("[REDACTED]");
      expect(safe.STRIPE_SECRET).toBe("[REDACTED]");
    });
  });
});
