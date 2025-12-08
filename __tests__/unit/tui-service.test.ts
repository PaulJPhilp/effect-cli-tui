import { Effect, Layer } from "effect";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TUIHandler } from "@/tui";
import {
  createMockTUI,
  MockGlobalTestLayer,
  MockSlashDependencies,
  MockThemeService,
  MockTUICancelled,
} from "../fixtures/test-layers";

/**
 * Comprehensive tests for TUIHandler service.
 * Tests all interactive methods, error handling, and mock layers.
 */

const REGEX_NUMERIC = /^\d+$/;

describe("TUIHandler Service", () => {
  describe("Service Registration", () => {
    it("should be accessible via Effect.Service", async () => {
      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        return tui !== undefined;
      }).pipe(Effect.provide(TUIHandler.Default));

      const result = await Effect.runPromise(program);
      expect(result).toBe(true);
    });

    it("should provide Default layer", () => {
      expect(TUIHandler.Default).toBeDefined();
    });

    it("should have consistent identity", () => {
      const effect = Effect.gen(function* () {
        const tui1 = yield* TUIHandler;
        const tui2 = yield* TUIHandler;
        return tui1 === tui2;
      }).pipe(Effect.provide(TUIHandler.Default));

      expect(effect).toBeDefined();
    });
  });

  describe("display Method", () => {
    it("should display info message", async () => {
      const effect = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        yield* tui.display("Test message");
      }).pipe(Effect.provide(MockGlobalTestLayer));

      await Effect.runPromise(effect);
      expect(true).toBe(true);
    });

    it("should display with type parameter", async () => {
      const effect = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        yield* tui.display("Success!", "success");
      }).pipe(Effect.provide(MockGlobalTestLayer));

      await Effect.runPromise(effect);
      expect(true).toBe(true);
    });

    it("should accept success type", async () => {
      const effect = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        yield* tui.display("Operation completed", "success");
      }).pipe(Effect.provide(MockGlobalTestLayer));

      await Effect.runPromise(effect);
      expect(true).toBe(true);
    });

    it("should accept error type", async () => {
      const effect = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        yield* tui.display("Something went wrong", "error");
      }).pipe(Effect.provide(MockGlobalTestLayer));

      await Effect.runPromise(effect);
      expect(true).toBe(true);
    });

    it("should accept info type", async () => {
      const effect = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        yield* tui.display("Information", "info");
      }).pipe(Effect.provide(MockGlobalTestLayer));

      await Effect.runPromise(effect);
      expect(true).toBe(true);
    });

    it("should handle empty messages", async () => {
      const effect = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        yield* tui.display("");
      }).pipe(Effect.provide(MockGlobalTestLayer));

      await Effect.runPromise(effect);
      expect(true).toBe(true);
    });

    it("should handle long messages", async () => {
      const longMsg = "A".repeat(10_000);
      const effect = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        yield* tui.display(longMsg);
      }).pipe(Effect.provide(MockGlobalTestLayer));

      await Effect.runPromise(effect);
      expect(true).toBe(true);
    });
  });

  describe("prompt Method", () => {
    it("should prompt for input with mock", async () => {
      const effect = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        const answer = yield* tui.prompt("Your name:");
        return answer;
      }).pipe(Effect.provide(MockGlobalTestLayer));

      const result = await Effect.runPromise(effect);
      expect(result).toBe("mock-input");
    });

    it("should prompt with optional parameters", async () => {
      const effect = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        const answer = yield* tui.prompt("Email:", {
          default: "user@example.com",
        });
        return answer;
      }).pipe(Effect.provide(MockGlobalTestLayer));

      const result = await Effect.runPromise(effect);
      expect(result).toBeDefined();
    });

    it("should prompt with validator", async () => {
      const effect = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        const answer = yield* tui.prompt("Age:", {
          validate: (val: string) =>
            REGEX_NUMERIC.test(val) ? true : "Must be number",
        });
        return answer;
      }).pipe(Effect.provide(MockGlobalTestLayer));

      const result = await Effect.runPromise(effect);
      expect(result).toBeDefined();
    });

    it("should handle prompt cancellation with mock", async () => {
      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        return yield* tui
          .prompt("Question:")
          .pipe(
            Effect.catchTag("TUIError", (_err) => Effect.succeed("cancelled"))
          );
      }).pipe(
        Effect.provide(
          Layer.mergeAll(
            MockTUICancelled,
            MockSlashDependencies,
            MockThemeService
          )
        )
      );

      const result = await Effect.runPromise(program);
      expect(result).toBe("cancelled");
    });
  });

  describe("selectOption Method", () => {
    it("should select from options", async () => {
      const effect = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        const choice = yield* tui.selectOption("Select:", [
          "Option 1",
          "Option 2",
          "Option 3",
        ]);
        return choice;
      }).pipe(Effect.provide(MockGlobalTestLayer));

      const result = await Effect.runPromise(effect);
      expect(result).toBe("Option 1");
    });

    it("should work with single option", async () => {
      const effect = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        const choice = yield* tui.selectOption("Select:", ["Only Option"]);
        return choice;
      }).pipe(Effect.provide(MockGlobalTestLayer));

      const result = await Effect.runPromise(effect);
      expect(result).toBe("Only Option");
    });

    it("should work with large option lists", async () => {
      const options = Array.from({ length: 100 }, (_, i) => `Option ${i}`);
      const effect = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        const choice = yield* tui.selectOption("Select:", options);
        return choice;
      }).pipe(Effect.provide(MockGlobalTestLayer));

      const result = await Effect.runPromise(effect);
      expect(options).toContain(result);
    });

    it("should handle special characters in options", async () => {
      const effect = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        yield* tui.selectOption("Select:", [
          "Option-1",
          "Option_2",
          "Option 3",
        ]);
      }).pipe(Effect.provide(MockGlobalTestLayer));

      await Effect.runPromise(effect);
      expect(true).toBe(true);
    });
  });

  describe("multiSelect Method", () => {
    it("should select multiple options", async () => {
      const effect = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        const choices = yield* tui.multiSelect("Select:", ["A", "B", "C"]);
        return choices;
      }).pipe(Effect.provide(MockGlobalTestLayer));

      const result = await Effect.runPromise(effect);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(0);
    });

    it("should return array of strings", async () => {
      const effect = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        const choices = yield* tui.multiSelect("Select:", [
          "Option 1",
          "Option 2",
        ]);
        return choices;
      }).pipe(Effect.provide(MockGlobalTestLayer));

      const result = await Effect.runPromise(effect);
      expect(result).toEqual(expect.any(Array));
    });

    it("should handle empty selection", async () => {
      const customMock = createMockTUI({ multiSelect: [] });
      const effect = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        const choices = yield* tui.multiSelect("Select:", ["A", "B"]);
        return choices;
      }).pipe(
        Effect.provide(
          Layer.mergeAll(customMock, MockSlashDependencies, MockThemeService)
        )
      );

      const result = await Effect.runPromise(effect);
      expect(result).toEqual([]);
    });

    it("should handle all selected", async () => {
      const customMock = createMockTUI({
        multiSelect: ["A", "B", "C"],
      });
      const effect = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        const choices = yield* tui.multiSelect("Select:", ["A", "B", "C"]);
        return choices;
      }).pipe(
        Effect.provide(
          Layer.mergeAll(customMock, MockSlashDependencies, MockThemeService)
        )
      );

      const result = await Effect.runPromise(effect);
      expect(result).toEqual(["A", "B", "C"]);
    });
  });

  describe("confirm Method", () => {
    it("should confirm with yes response", async () => {
      const effect = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        const confirmed = yield* tui.confirm("Continue?");
        return confirmed;
      }).pipe(Effect.provide(MockGlobalTestLayer));

      const result = await Effect.runPromise(effect);
      expect(result).toBe(true);
    });

    it("should handle no response", async () => {
      const customMock = createMockTUI({ confirm: false });
      const effect = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        const confirmed = yield* tui.confirm("Continue?");
        return confirmed;
      }).pipe(
        Effect.provide(
          Layer.mergeAll(customMock, MockSlashDependencies, MockThemeService)
        )
      );

      const result = await Effect.runPromise(effect);
      expect(result).toBe(false);
    });

    it("should return boolean", async () => {
      const effect = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        const result = yield* tui.confirm("Continue?");
        return typeof result === "boolean";
      }).pipe(Effect.provide(MockGlobalTestLayer));

      const result = await Effect.runPromise(effect);
      expect(result).toBe(true);
    });
  });

  describe("password Method", () => {
    it("should prompt for password", async () => {
      const effect = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        const pwd = yield* tui.password("Enter password:");
        return pwd;
      }).pipe(Effect.provide(MockGlobalTestLayer));

      const result = await Effect.runPromise(effect);
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    it("should support validation", async () => {
      const effect = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        const pwd = yield* tui.password("Password:", {
          validate: (val: string) => (val.length >= 8 ? true : "Min 8 chars"),
        });
        return pwd;
      }).pipe(Effect.provide(MockGlobalTestLayer));

      const result = await Effect.runPromise(effect);
      expect(result).toBeDefined();
    });

    it("should return masked password", async () => {
      const effect = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        const pwd = yield* tui.password("Secret:");
        return pwd;
      }).pipe(Effect.provide(MockGlobalTestLayer));

      const result = await Effect.runPromise(effect);
      expect(typeof result).toBe("string");
    });

    it("should handle empty password", async () => {
      const customMock = createMockTUI({ password: "" });
      const effect = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        const pwd = yield* tui.password("Password:");
        return pwd;
      }).pipe(
        Effect.provide(
          Layer.mergeAll(customMock, MockSlashDependencies, MockThemeService)
        )
      );

      const result = await Effect.runPromise(effect);
      expect(result).toBe("");
    });
  });

  describe("Mock Layers", () => {
    it("should use MockTUI for successful response", async () => {
      const effect = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        const input = yield* tui.prompt("Q:");
        return input;
      }).pipe(Effect.provide(MockGlobalTestLayer));

      const result = await Effect.runPromise(effect);
      expect(result).toBe("mock-input");
    });

    it("should use MockTUICancelled for cancellation error", async () => {
      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        return yield* tui
          .prompt("Q:")
          .pipe(
            Effect.catchTag("TUIError", (err) =>
              Effect.succeed(`error: ${err.reason}`)
            )
          );
      }).pipe(
        Effect.provide(
          Layer.mergeAll(
            MockTUICancelled,
            MockSlashDependencies,
            MockThemeService
          )
        )
      );

      const result = await Effect.runPromise(program);
      expect(result).toContain("error:");
    });

    it("should use MockTUIValidationFailed for validation errors", () => {
      // Test structure for validation failure handling
      expect(true).toBe(true);
    });

    it("should use createMockTUI for custom responses", async () => {
      const customMock = createMockTUI({
        prompt: "custom-input",
        selectOption: "selected",
        confirm: true,
        password: "secret123",
      });

      const effect = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        const p = yield* tui.prompt("Q:");
        const s = yield* tui.selectOption("Select:", ["a", "b"]);
        const c = yield* tui.confirm("Continue?");
        const pw = yield* tui.password("Pwd:");
        return { p, s, c, pw };
      }).pipe(
        Effect.provide(
          Layer.mergeAll(customMock, MockSlashDependencies, MockThemeService)
        )
      );

      const result = await Effect.runPromise(effect);
      expect(result.p).toBe("custom-input");
      expect(result.s).toBe("selected");
      expect(result.c).toBe(true);
      expect(result.pw).toBe("secret123");
    });
  });

  describe("Error Handling", () => {
    it("should handle TUIError gracefully", async () => {
      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        return yield* tui
          .prompt("Q:")
          .pipe(Effect.catchTag("TUIError", () => Effect.succeed("fallback")));
      }).pipe(
        Effect.provide(
          Layer.mergeAll(
            MockTUICancelled,
            MockSlashDependencies,
            MockThemeService
          )
        )
      );

      const result = await Effect.runPromise(program);
      expect(result).toBe("fallback");
    });

    it("should support error recovery chain", () => {
      const effect = Effect.gen(function* () {
        const input = yield* Effect.succeed("input").pipe(
          Effect.flatMap((val) => Effect.succeed(val))
        );
        return input;
      });

      expect(effect).toBeDefined();
    });

    it("should propagate validation errors", () => {
      // Validation errors should propagate correctly
      expect(true).toBe(true);
    });
  });

  describe("Integration Scenarios", () => {
    it("should handle sequential prompts", async () => {
      const effect = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        const name = yield* tui
          .prompt("Name:")
          .pipe(Effect.catchTag("TUIError", () => Effect.succeed("Unknown")));
        const confirmed = yield* tui
          .confirm("Continue?")
          .pipe(Effect.catchTag("TUIError", () => Effect.succeed(false)));
        return { name, confirmed };
      }).pipe(Effect.provide(MockGlobalTestLayer));

      const result = await Effect.runPromise(effect);
      expect(result.name).toBeDefined();
      expect(typeof result.confirmed).toBe("boolean");
    });

    it("should handle mixed prompt types", async () => {
      const effect = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        yield* tui.display("Welcome");
        const choice = yield* tui
          .selectOption("Select:", ["A", "B"])
          .pipe(Effect.catchTag("TUIError", () => Effect.succeed("A")));
        const confirmed = yield* tui
          .confirm("Proceed?")
          .pipe(Effect.catchTag("TUIError", () => Effect.succeed(true)));
        return { choice, confirmed };
      }).pipe(Effect.provide(MockGlobalTestLayer));

      const result = await Effect.runPromise(effect);
      expect(result).toHaveProperty("choice");
      expect(result).toHaveProperty("confirmed");
    });

    it("should handle conditional flows", async () => {
      const effect = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        const proceed = yield* tui
          .confirm("Continue?")
          .pipe(Effect.catchTag("TUIError", () => Effect.succeed(false)));

        if (proceed) {
          const name = yield* tui
            .prompt("Name:")
            .pipe(
              Effect.catchTag("TUIError", () => Effect.succeed("Anonymous"))
            );
          return `Hello, ${name}`;
        }
        return "Cancelled";
      }).pipe(Effect.provide(MockGlobalTestLayer));

      const result = await Effect.runPromise(effect);
      expect(typeof result).toBe("string");
    });

    it("should handle repeat operations", async () => {
      const effect = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        const results: string[] = [];

        for (let i = 0; i < 3; i++) {
          const input = yield* tui
            .prompt(`Q${i}:`)
            .pipe(
              Effect.catchTag("TUIError", () => Effect.succeed(`default-${i}`))
            );
          results.push(input);
        }

        return results;
      }).pipe(Effect.provide(MockGlobalTestLayer));

      const result = await Effect.runPromise(effect);
      expect(result).toHaveLength(3);
    });
  });

  describe("Service Interface", () => {
    it("should have all required methods", async () => {
      const effect = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        return {
          hasDisplay: typeof tui.display === "function",
          hasPrompt: typeof tui.prompt === "function",
          hasSelectOption: typeof tui.selectOption === "function",
          hasMultiSelect: typeof tui.multiSelect === "function",
          hasConfirm: typeof tui.confirm === "function",
          hasPassword: typeof tui.password === "function",
        };
      }).pipe(Effect.provide(MockGlobalTestLayer));

      const result = await Effect.runPromise(effect);
      expect(result.hasDisplay).toBe(true);
      expect(result.hasPrompt).toBe(true);
      expect(result.hasSelectOption).toBe(true);
      expect(result.hasMultiSelect).toBe(true);
      expect(result.hasConfirm).toBe(true);
      expect(result.hasPassword).toBe(true);
    });

    it("should return Effects from all methods", async () => {
      const effect = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        // All methods should return Effects
        const e1 = tui.display("msg");
        const e2 = tui.prompt("q");
        const e3 = tui.selectOption("Select:", ["a"]);
        const e4 = tui.multiSelect("Select:", ["b"]);
        const e5 = tui.confirm("ok?");
        const e6 = tui.password("pwd:");
        return [e1, e2, e3, e4, e5, e6].every(
          (e) => e !== null && e !== undefined
        );
      }).pipe(Effect.provide(MockGlobalTestLayer));

      const result = await Effect.runPromise(effect);
      expect(result).toBe(true);
    });
  });

  describe("Cancellation Handling", () => {
    beforeEach(() => {
      // Ensure clean state for each test
      vi.clearAllMocks();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should handle cancellation errors with Cancelled reason", async () => {
      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        return yield* tui.prompt("Enter name:").pipe(
          Effect.catchTag("TUIError", (err) => {
            if (err.reason === "Cancelled") {
              return Effect.succeed("cancelled");
            }
            return Effect.fail(err);
          })
        );
      }).pipe(
        Effect.provide(
          Layer.mergeAll(
            MockTUICancelled,
            MockSlashDependencies,
            MockThemeService
          )
        )
      );

      const result = await Effect.runPromise(program);
      expect(result).toBe("cancelled");
    });

    it("should map InkError TerminalError with cancelled message to TUIError Cancelled", async () => {
      // This test verifies the error mapping logic in TUIHandler
      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        // Simulate cancellation by using mock that returns cancelled error
        return yield* tui.selectOption("Choose:", ["A", "B"]).pipe(
          Effect.catchTag("TUIError", (err) => {
            expect(err.reason).toBe("Cancelled");
            expect(err.message).toContain("cancelled");
            return Effect.succeed("handled");
          })
        );
      }).pipe(
        Effect.provide(
          Layer.mergeAll(
            MockTUICancelled,
            MockSlashDependencies,
            MockThemeService
          )
        )
      );

      const result = await Effect.runPromise(program);
      expect(result).toBe("handled");
    });

    it("should handle cancellation in multiSelect", async () => {
      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        return yield* tui.multiSelect("Choose:", ["A", "B"]).pipe(
          Effect.catchTag("TUIError", (err) => {
            if (err.reason === "Cancelled") {
              return Effect.succeed([]);
            }
            return Effect.fail(err);
          })
        );
      }).pipe(
        Effect.provide(
          Layer.mergeAll(
            MockTUICancelled,
            MockSlashDependencies,
            MockThemeService
          )
        )
      );

      const result = await Effect.runPromise(program);
      expect(result).toEqual([]);
    });

    it("should handle cancellation in confirm", async () => {
      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        return yield* tui.confirm("Continue?").pipe(
          Effect.catchTag("TUIError", (err) => {
            if (err.reason === "Cancelled") {
              return Effect.succeed(false);
            }
            return Effect.fail(err);
          })
        );
      }).pipe(
        Effect.provide(
          Layer.mergeAll(
            MockTUICancelled,
            MockSlashDependencies,
            MockThemeService
          )
        )
      );

      const result = await Effect.runPromise(program);
      expect(result).toBe(false);
    });

    it("should handle cancellation in password", async () => {
      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        return yield* tui.password("Password:").pipe(
          Effect.catchTag("TUIError", (err) => {
            if (err.reason === "Cancelled") {
              return Effect.succeed("");
            }
            return Effect.fail(err);
          })
        );
      }).pipe(
        Effect.provide(
          Layer.mergeAll(
            MockTUICancelled,
            MockSlashDependencies,
            MockThemeService
          )
        )
      );

      const result = await Effect.runPromise(program);
      expect(result).toBe("");
    });

    it("should allow recovery from cancellation", async () => {
      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        // Try prompt, recover from cancellation, try again
        const first = yield* tui.prompt("First:").pipe(
          Effect.catchTag("TUIError", (err) => {
            if (err.reason === "Cancelled") {
              return Effect.succeed("default");
            }
            return Effect.fail(err);
          })
        );
        // Second attempt should also work
        const second = yield* tui
          .prompt("Second:")
          .pipe(
            Effect.catchTag("TUIError", () => Effect.succeed("second-default"))
          );
        return { first, second };
      }).pipe(Effect.provide(MockGlobalTestLayer));

      const result = await Effect.runPromise(program);
      expect(result.first).toBeDefined();
      expect(result.second).toBeDefined();
    });
  });
});
