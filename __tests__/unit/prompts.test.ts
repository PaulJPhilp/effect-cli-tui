import { Effect } from "effect";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  PromptError,
  type PromptOptions,
  prompt,
  promptChoice,
  promptConfirm,
  promptInput,
  promptPassword,
} from "../../src/interactive/prompt";

// Mock @inquirer/prompts module
vi.mock("@inquirer/prompts", () => ({
  input: vi.fn(),
  confirm: vi.fn(),
  select: vi.fn(),
  password: vi.fn(),
}));

import * as inquirerModule from "@inquirer/prompts";

const inquirer = inquirerModule as any;

/**
 * Comprehensive tests for interactive prompt functions.
 * Tests validation, error handling, and user input flow with mocked prompts.
 */

describe("Interactive Prompt Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("promptInput - Text Input", () => {
    it("should return user input when prompt succeeds", async () => {
      (inquirer.input as any).mockResolvedValue("John Doe");

      const result = await Effect.runPromise(promptInput("Enter name:"));
      expect(result).toBe("John Doe");
      expect(inquirer.input).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Enter name:" })
      );
    });

    it("should pass default value to inquirer", async () => {
      (inquirer.input as any).mockResolvedValue("default-value");

      await Effect.runPromise(promptInput("Enter name:", "John"));
      expect(inquirer.input).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Enter name:",
          default: "John",
        })
      );
    });

    it("should handle validation function returning true", async () => {
      (inquirer.input as any).mockResolvedValue("valid-input");

      const validator = (input: string) =>
        input.length > 0 ? true : "Cannot be empty";
      const result = await Effect.runPromise(
        promptInput("Q:", undefined, validator)
      );
      expect(result).toBe("valid-input");
    });

    it("should pass validation function to inquirer", async () => {
      (inquirer.input as any).mockResolvedValue("test");

      const validator = (input: string) =>
        input.includes("@") ? true : "Must contain @";
      await Effect.runPromise(promptInput("Email:", undefined, validator));

      const call = (inquirer.input as any).mock.calls[0][0];
      expect(call.validate).toBeDefined();
      // Test that validator is properly wrapped
      expect(call.validate?.("test@example.com")).toBe(true);
      expect(call.validate?.("invalid")).toBe("Must contain @");
    });

    it("should fail with PromptError on inquirer error", async () => {
      (inquirer.input as any).mockRejectedValue(new Error("User cancelled"));

      const result = await Effect.runPromise(
        promptInput("Q:").pipe(
          Effect.catchTag("PromptError", (err) => Effect.succeed(err.message))
        )
      );
      expect(result).toContain("Prompt failed");
    });

    it("should handle empty input", async () => {
      (inquirer.input as any).mockResolvedValue("");
      const result = await Effect.runPromise(promptInput("Q:"));
      expect(result).toBe("");
    });
  });

  describe("promptConfirm - Yes/No Confirmation", () => {
    it("should return true when user confirms", async () => {
      (inquirer.confirm as any).mockResolvedValue(true);
      const result = await Effect.runPromise(promptConfirm("Continue?"));
      expect(result).toBe(true);
    });

    it("should return false when user declines", async () => {
      (inquirer.confirm as any).mockResolvedValue(false);
      const result = await Effect.runPromise(promptConfirm("Continue?"));
      expect(result).toBe(false);
    });

    it("should pass default value true", async () => {
      (inquirer.confirm as any).mockResolvedValue(true);
      await Effect.runPromise(promptConfirm("Continue?", true));
      expect(inquirer.confirm).toHaveBeenCalledWith(
        expect.objectContaining({ default: true })
      );
    });

    it("should pass default value false", async () => {
      (inquirer.confirm as any).mockResolvedValue(false);
      await Effect.runPromise(promptConfirm("Continue?", false));
      expect(inquirer.confirm).toHaveBeenCalledWith(
        expect.objectContaining({ default: false })
      );
    });

    it("should use true as fallback default when undefined", async () => {
      (inquirer.confirm as any).mockResolvedValue(true);
      await Effect.runPromise(promptConfirm("Continue?", undefined));
      expect(inquirer.confirm).toHaveBeenCalledWith(
        expect.objectContaining({ default: true })
      );
    });

    it("should fail with PromptError on error", async () => {
      (inquirer.confirm as any).mockRejectedValue(new Error("Prompt error"));
      const result = await Effect.runPromise(
        promptConfirm("Q:").pipe(
          Effect.catchTag("PromptError", (err) => Effect.succeed(err.message))
        )
      );
      expect(result).toContain("Confirmation prompt failed");
    });
  });

  describe("promptChoice - Single Selection", () => {
    it("should return selected choice", async () => {
      (inquirer.select as any).mockResolvedValue("Option 2");
      const result = await Effect.runPromise(
        promptChoice("Select:", ["Option 1", "Option 2", "Option 3"])
      );
      expect(result).toBe("Option 2");
    });

    it("should convert choices to inquirer format", async () => {
      (inquirer.select as any).mockResolvedValue("A");
      await Effect.runPromise(promptChoice("Pick:", ["A", "B", "C"]));

      const call = (inquirer.select as any).mock.calls[0][0];
      expect(call.choices).toEqual([
        { name: "A", value: "A" },
        { name: "B", value: "B" },
        { name: "C", value: "C" },
      ]);
    });

    it("should set default index", async () => {
      (inquirer.select as any).mockResolvedValue("B");
      await Effect.runPromise(promptChoice("Pick:", ["A", "B", "C"], 1));

      const call = (inquirer.select as any).mock.calls[0][0];
      expect(call.default).toBe("B");
    });

    it("should handle undefined default index", async () => {
      (inquirer.select as any).mockResolvedValue("A");
      await Effect.runPromise(promptChoice("Pick:", ["A", "B"], undefined));

      const call = (inquirer.select as any).mock.calls[0][0];
      expect(call.default).toBeUndefined();
    });

    it("should handle empty choices array", async () => {
      (inquirer.select as any).mockResolvedValue("");
      await Effect.runPromise(promptChoice("Pick:", []));

      const call = (inquirer.select as any).mock.calls[0][0];
      expect(call.choices).toEqual([]);
    });

    it("should fail with PromptError on error", async () => {
      (inquirer.select as any).mockRejectedValue(new Error("Selection failed"));
      const result = await Effect.runPromise(
        promptChoice("Q:", ["A", "B"]).pipe(
          Effect.catchTag("PromptError", (err) => Effect.succeed(err.message))
        )
      );
      expect(result).toContain("Choice prompt failed");
    });
  });

  describe("promptPassword - Hidden Input", () => {
    it("should return password input", async () => {
      (inquirer.password as any).mockResolvedValue("secret123");
      const result = await Effect.runPromise(promptPassword("Enter password:"));
      expect(result).toBe("secret123");
    });

    it("should set mask character", async () => {
      (inquirer.password as any).mockResolvedValue("pwd");
      await Effect.runPromise(promptPassword("Password:"));

      const call = (inquirer.password as any).mock.calls[0][0];
      expect(call.mask).toBe("*");
    });

    it("should pass validation function", async () => {
      (inquirer.password as any).mockResolvedValue("password123");

      const validator = (pwd: string) =>
        pwd.length >= 8 ? true : "Min 8 chars";
      await Effect.runPromise(promptPassword("Password:", validator));

      const call = (inquirer.password as any).mock.calls[0][0];
      expect(call.validate).toBeDefined();
      expect(call.validate?.("short")).toBe("Min 8 chars");
      expect(call.validate?.("longpassword")).toBe(true);
    });

    it("should work without validation", async () => {
      (inquirer.password as any).mockResolvedValue("any");
      const result = await Effect.runPromise(
        promptPassword("Password:", undefined)
      );
      expect(result).toBe("any");
    });

    it("should fail with PromptError on error", async () => {
      (inquirer.password as any).mockRejectedValue(
        new Error("Password prompt failed")
      );
      const result = await Effect.runPromise(
        promptPassword("Q:").pipe(
          Effect.catchTag("PromptError", (err) => Effect.succeed(err.message))
        )
      );
      expect(result).toContain("Password prompt failed");
    });
  });

  describe("prompt() - Generic Prompt Router", () => {
    it("should route to promptInput for text type", async () => {
      (inquirer.input as any).mockResolvedValue("John");
      const options: PromptOptions = {
        message: "Name:",
        type: "text",
      };
      const result = await Effect.runPromise(prompt(options));
      expect(result).toBe("John");
      expect(inquirer.input).toHaveBeenCalled();
    });

    it("should route to promptConfirm for confirm type", async () => {
      (inquirer.confirm as any).mockResolvedValue(true);
      const options: PromptOptions = {
        message: "Continue?",
        type: "confirm",
      };
      const result = await Effect.runPromise(prompt(options));
      expect(result).toBe("true");
      expect(inquirer.confirm).toHaveBeenCalled();
    });

    it("should route to promptChoice for choice type", async () => {
      (inquirer.select as any).mockResolvedValue("Option B");
      const options: PromptOptions = {
        message: "Pick:",
        type: "choice",
        choices: ["Option A", "Option B"],
      };
      const result = await Effect.runPromise(prompt(options));
      expect(result).toBe("Option B");
      expect(inquirer.select).toHaveBeenCalled();
    });

    it("should route to promptPassword for password type", async () => {
      (inquirer.password as any).mockResolvedValue("secret");
      const options: PromptOptions = {
        message: "Password:",
        type: "password",
      };
      const result = await Effect.runPromise(prompt(options));
      expect(result).toBe("secret");
      expect(inquirer.password).toHaveBeenCalled();
    });

    it("should default to text type when no type specified", async () => {
      (inquirer.input as any).mockResolvedValue("default");
      const options: PromptOptions = {
        message: "Input:",
      };
      const result = await Effect.runPromise(prompt(options));
      expect(result).toBe("default");
      expect(inquirer.input).toHaveBeenCalled();
    });

    it("should fail when choice type has no choices", async () => {
      const options: PromptOptions = {
        message: "Pick:",
        type: "choice",
      };
      const result = await Effect.runPromise(
        prompt(options).pipe(
          Effect.catchTag("PromptError", (err) => Effect.succeed(err.message))
        )
      );
      expect(result).toContain("Choices required");
    });

    it("should pass validation for text type", async () => {
      (inquirer.input as any).mockResolvedValue("valid@email.com");
      const options: PromptOptions = {
        message: "Email:",
        type: "text",
        validate: (input) => (input.includes("@") ? true : "Invalid email"),
      };
      const result = await Effect.runPromise(prompt(options));
      expect(result).toBe("valid@email.com");
    });

    it("should pass validation for password type", async () => {
      (inquirer.password as any).mockResolvedValue("ValidPass123");
      const options: PromptOptions = {
        message: "Password:",
        type: "password",
        validate: (pwd) => (pwd.length >= 8 ? true : "Too short"),
      };
      const result = await Effect.runPromise(prompt(options));
      expect(result).toBe("ValidPass123");
    });

    it("should convert boolean confirm default to string", async () => {
      (inquirer.confirm as any).mockResolvedValue(true);
      const options: PromptOptions = {
        message: "Continue?",
        type: "confirm",
        default: "true",
      };
      const result = await Effect.runPromise(prompt(options));
      expect(result).toBe("true");
    });
  });

  describe("PromptError Class", () => {
    it("should be instanceof Error", () => {
      const error = new PromptError({ message: "Test error" });
      expect(error).toBeInstanceOf(Error);
    });

    it("should have message property", () => {
      const error = new PromptError({ message: "Test message" });
      expect(error.message).toBe("Test message");
    });

    it("should have correct tag", () => {
      const error = new PromptError({ message: "Test" });
      expect(error._tag).toBe("PromptError");
    });

    it("should support effect error handling", async () => {
      const effect = Effect.fail(
        new PromptError({ message: "User cancelled" })
      ).pipe(
        Effect.catchTag("PromptError", (err) => Effect.succeed(err.message))
      );
      const result = await Effect.runPromise(effect);
      expect(result).toBe("User cancelled");
    });

    it("should work with Effect.catchAll", async () => {
      const effect = Effect.fail(new PromptError({ message: "Test" })).pipe(
        Effect.catchAll(() => Effect.succeed("caught"))
      );
      const result = await Effect.runPromise(effect);
      expect(result).toBe("caught");
    });
  });

  describe("Composition Patterns", () => {
    it("should support chaining multiple prompts", async () => {
      const responses = ["John", "30"];
      let callIdx = 0;
      (inquirer.input as any).mockImplementation(
        async () => responses[callIdx++]
      );

      const effect = Effect.gen(function* () {
        const name = yield* promptInput("Name:");
        const age = yield* promptInput("Age:");
        return { name, age };
      });

      const result = await Effect.runPromise(effect);
      expect(result).toEqual({ name: "John", age: "30" });
    });

    it("should support mixing different prompt types", async () => {
      vi.clearAllMocks();
      (inquirer.input as any).mockResolvedValue("John");
      (inquirer.confirm as any).mockResolvedValue(true);
      (inquirer.select as any).mockResolvedValue("Python");

      const effect = Effect.gen(function* () {
        const name = yield* promptInput("Name:");
        const confirmed = yield* promptConfirm("Continue?");
        const language = yield* promptChoice("Language:", ["Python", "JS"]);
        return { name, confirmed, language };
      });

      const result = await Effect.runPromise(effect);
      expect(result).toEqual({
        name: "John",
        confirmed: true,
        language: "Python",
      });
    });

    it("should support error recovery in chains", async () => {
      (inquirer.input as any).mockRejectedValue(new Error("Cancelled"));

      const effect = Effect.gen(function* () {
        const name = yield* promptInput("Name:").pipe(
          Effect.catchTag("PromptError", () => Effect.succeed("Anonymous"))
        );
        return name;
      });

      const result = await Effect.runPromise(effect);
      expect(result).toBe("Anonymous");
    });

    it("should support conditional prompting", async () => {
      vi.clearAllMocks();
      const inputResponses = ["John", "john@example.com"];
      let inputIdx = 0;
      (inquirer.input as any).mockImplementation(
        async () => inputResponses[inputIdx++]
      );
      (inquirer.confirm as any).mockResolvedValue(true);

      const effect = Effect.gen(function* () {
        const name = yield* promptInput("Name:");
        const wantEmail = yield* promptConfirm("Add email?");

        if (wantEmail) {
          const email = yield* promptInput("Email:");
          return { name, email };
        }
        return { name };
      });

      const result = await Effect.runPromise(effect);
      expect(result).toEqual({ name: "John", email: "john@example.com" });
    });
  });

  describe("Validation Edge Cases", () => {
    it("should handle validator returning true for valid input", async () => {
      (inquirer.input as any).mockResolvedValue("test@example.com");

      const validator = (email: string) =>
        email.includes("@") ? true : "Invalid";
      const result = await Effect.runPromise(
        promptInput("Email:", undefined, validator)
      );
      expect(result).toBe("test@example.com");
    });

    it("should handle validator returning error message string", async () => {
      (inquirer.input as any).mockResolvedValue("invalid");

      const validator = (email: string) =>
        email.includes("@") ? true : "Must contain @";
      await Effect.runPromise(promptInput("Email:", undefined, validator));

      const call = (inquirer.input as any).mock.calls[0][0];
      const validatorFn = call.validate!;
      expect(validatorFn("test")).toBe("Must contain @");
      expect(validatorFn("test@example.com")).toBe(true);
    });

    it("should handle complex validation logic", async () => {
      (inquirer.password as any).mockResolvedValue("SecurePass123!");

      const validator = (pwd: string) => {
        const hasNumber = /\d/.test(pwd);
        const hasUpperCase = /[A-Z]/.test(pwd);
        const isLongEnough = pwd.length >= 8;
        return hasNumber && hasUpperCase && isLongEnough
          ? true
          : "Invalid password";
      };

      await Effect.runPromise(promptPassword("Password:", validator));
      const call = (inquirer.password as any).mock.calls[0][0];
      expect(call.validate?.("SecurePass123!")).toBe(true);
      expect(call.validate?.("weak")).toBe("Invalid password");
    });
  });

  describe("Error Message Formatting", () => {
    it("should format input error messages consistently", async () => {
      (inquirer.input as any).mockRejectedValue(new Error("User aborted"));

      const result = await Effect.runPromise(
        promptInput("Q:").pipe(
          Effect.catchTag("PromptError", (err) => Effect.succeed(err.message))
        )
      );
      expect(result).toContain("Prompt failed");
      expect(result).toContain("User aborted");
    });

    it("should format confirm error messages consistently", async () => {
      (inquirer.confirm as any).mockRejectedValue(new Error("Display error"));

      const result = await Effect.runPromise(
        promptConfirm("Q:").pipe(
          Effect.catchTag("PromptError", (err) => Effect.succeed(err.message))
        )
      );
      expect(result).toContain("Confirmation prompt failed");
    });

    it("should format choice error messages consistently", async () => {
      (inquirer.select as any).mockRejectedValue(new Error("Selection error"));

      const result = await Effect.runPromise(
        promptChoice("Q:", ["A"]).pipe(
          Effect.catchTag("PromptError", (err) => Effect.succeed(err.message))
        )
      );
      expect(result).toContain("Choice prompt failed");
    });

    it("should format password error messages consistently", async () => {
      (inquirer.password as any).mockRejectedValue(new Error("Password error"));

      const result = await Effect.runPromise(
        promptPassword("Q:").pipe(
          Effect.catchTag("PromptError", (err) => Effect.succeed(err.message))
        )
      );
      expect(result).toContain("Password prompt failed");
    });
  });
});
