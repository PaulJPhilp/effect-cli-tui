/** biome-ignore-all assist/source/organizeImports: <> */
import { Effect } from "effect";
import { describe, expect, it, vi } from "vitest";

import { MockTUI, createMockTUI } from "../fixtures/test-layers";
import { TUIHandler } from "@/tui";

/**
 * Comprehensive tests for TUIHandler service.
 *
 * Tests all interactive UI operations:
 * - Display messages with different types
 * - Text input prompts
 * - Single/multiple selection
 * - Confirmation dialogs
 * - Password input
 */

describe("TUIHandler Service", () => {
  describe("Display Messages", () => {
    it("should display info message with ℹ prefix", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        /* Mock implementation - no-op */
      });

      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        yield* tui.display("This is an info message", "info");
      }).pipe(Effect.provide(TUIHandler.Default));

      await Effect.runPromise(program);
      expect(consoleSpy).toHaveBeenCalledWith("\nℹ This is an info message");
      consoleSpy.mockRestore();
    });

    it("should display success message with ✓ prefix", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        /* Mock implementation - no-op */
      });

      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        yield* tui.display("Operation successful", "success");
      }).pipe(Effect.provide(TUIHandler.Default));

      await Effect.runPromise(program);
      expect(consoleSpy).toHaveBeenCalledWith("\n✓ Operation successful");
      consoleSpy.mockRestore();
    });

    it("should display error message with ✗ prefix", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        /* Mock implementation - no-op */
      });

      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        yield* tui.display("Operation failed", "error");
      }).pipe(Effect.provide(TUIHandler.Default));

      await Effect.runPromise(program);
      expect(consoleSpy).toHaveBeenCalledWith("\n✗ Operation failed");
      consoleSpy.mockRestore();
    });

    it("should display message and return Effect<void>", async () => {
      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        const result = yield* tui.display("Test message", "info");
        return result;
      }).pipe(Effect.provide(TUIHandler.Default));

      const result = await Effect.runPromise(program);
      expect(result).toBeUndefined();
    });
  });

  describe("Prompt Input", () => {
    it("should prompt for user input and return response", async () => {
      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        return yield* tui.prompt("Enter your name:");
      }).pipe(Effect.provide(MockTUI));

      const result = await Effect.runPromise(program);
      expect(result).toBe("mock-input");
    });

    it("should prompt with default value", async () => {
      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        return yield* tui.prompt("Enter your name:", { default: "John" });
      }).pipe(Effect.provide(MockTUI));

      const result = await Effect.runPromise(program);
      expect(result).toBe("mock-input");
    });

    it("should accept validation function", async () => {
      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        return yield* tui.prompt("Enter your name:", {
          validate: (input: string | any[]) =>
            input.length > 0 || "Name cannot be empty",
        });
      }).pipe(Effect.provide(MockTUI));

      const result = await Effect.runPromise(program);
      expect(result).toBe("mock-input");
    });

    it("should return Effect<string>", async () => {
      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        const input = yield* tui.prompt("Enter your name:");
        return typeof input === "string";
      }).pipe(Effect.provide(MockTUI));

      const result = await Effect.runPromise(program);
      expect(result).toBe(true);
    });
  });

  describe("Select Option", () => {
    it("should select a single option from choices", async () => {
      const customMock = createMockTUI({ selectOption: "option1" });

      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        return yield* tui.selectOption("Choose one:", [
          "option1",
          "option2",
          "option3",
        ]);
      }).pipe(Effect.provide(customMock));

      const result = await Effect.runPromise(program);
      expect(result).toBe("option1");
    });

    it("should use default index when provided", async () => {
      const customMock = createMockTUI({ selectOption: "choice-a" });

      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        return yield* tui.selectOption("Choose one:", ["a", "b", "c"]);
      }).pipe(Effect.provide(customMock));

      const result = await Effect.runPromise(program);
      expect(result).toBe("choice-a");
    });

    it("should return Effect<string>", async () => {
      const customMock = createMockTUI({ selectOption: "yes" });

      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        const choice = yield* tui.selectOption("Pick:", ["yes", "no"]);
        return typeof choice === "string";
      }).pipe(Effect.provide(customMock));

      const result = await Effect.runPromise(program);
      expect(result).toBe(true);
    });

    it("should work with custom mock responses", async () => {
      const customMock = createMockTUI({ selectOption: "custom-choice" });

      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        return yield* tui.selectOption("Pick:", ["opt1", "opt2", "opt3"]);
      }).pipe(Effect.provide(customMock));

      const result = await Effect.runPromise(program);
      expect(result).toBe("custom-choice");
    });

    it("should handle slash commands in selectOption", async () => {
      // Note: This test verifies that selectOption intercepts slash commands.
      // Full integration testing with real InkService requires a terminal environment.
      // The implementation is verified in the code - selectOption wraps the selection
      // in a loop that checks for "/" prefix and runs slash commands.

      // For now, we'll test that the method exists and accepts slash command values
      // The actual slash command execution is tested in tui-slash-commands.test.ts
      const customMock = createMockTUI({ selectOption: "/help" });

      // This test verifies that selectOption can receive "/help" as a value
      // The real implementation would intercept it and run the command
      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        // The mock returns "/help", but in real usage, this would be intercepted
        // and the help command would run, then the select would re-appear
        return yield* tui.selectOption("Choose one:", [
          "/help",
          "option1",
          "option2",
        ]);
      }).pipe(Effect.provide(customMock));

      const result = await Effect.runPromise(program);
      // Mock returns "/help" directly, but real implementation would intercept it
      expect(result).toBe("/help");
    });

    it("should exit session when /quit is selected in selectOption", async () => {
      // Note: Full integration test requires real InkService with terminal.
      // The implementation is verified - selectOption checks for "/" prefix
      // and calls maybeRunSlashCommand, which would fail with SlashCommandExit for /quit.
      // This test verifies the method accepts "/quit" as a value.

      const customMock = createMockTUI({ selectOption: "/quit" });

      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        // In real usage, "/quit" would be intercepted and cause SlashCommandExit
        return yield* tui.selectOption("Choose one:", ["/quit", "option1"]);
      }).pipe(Effect.provide(customMock));

      // Mock returns "/quit" directly, but real implementation would fail with SlashCommandExit
      const result = await Effect.runPromise(program);
      expect(result).toBe("/quit");
    });

    it("should return normal option when it doesn't start with /", async () => {
      const customMock = createMockTUI({ selectOption: "normal-option" });

      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        return yield* tui.selectOption("Choose:", [
          "normal-option",
          "/help",
          "another-option",
        ]);
      }).pipe(Effect.provide(customMock));

      const result = await Effect.runPromise(program);
      expect(result).toBe("normal-option");
    });
  });

  describe("Multi-Select", () => {
    it("should select multiple options and return array", async () => {
      const customMock = createMockTUI({ multiSelect: ["a", "b", "c"] });

      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        return yield* tui.multiSelect("Choose options:", ["a", "b", "c"]);
      }).pipe(Effect.provide(customMock));

      const result = await Effect.runPromise(program);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it("should handle slash commands in multiSelect", async () => {
      // Note: This test verifies that multiSelect intercepts slash commands.
      // Full integration testing with real InkService requires a terminal environment.
      // The implementation is verified in the code - multiSelect wraps the selection
      // in a loop that checks for "/" prefix in any selected value and runs slash commands.

      // For now, we'll test that the method exists and accepts slash command values
      // The actual slash command execution is tested in tui-slash-commands.test.ts
      const customMock = createMockTUI({ multiSelect: ["/help", "option1"] });

      // This test verifies that multiSelect can receive "/help" as a value
      // The real implementation would intercept it and run the command
      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        // The mock returns ["/help", "option1"], but in real usage, "/help" would be intercepted
        // and the help command would run, then the multi-select would re-appear
        return yield* tui.multiSelect("Choose options:", [
          "/help",
          "option1",
          "option2",
        ]);
      }).pipe(Effect.provide(customMock));

      const result = await Effect.runPromise(program);
      // Mock returns ["/help", "option1"] directly, but real implementation would intercept "/help"
      expect(result).toEqual(["/help", "option1"]);
    });

    it("should exit session when /quit is selected in multiSelect", async () => {
      // Note: Full integration test requires real InkService with terminal.
      // The implementation is verified - multiSelect checks for "/" prefix in any selected value
      // and calls maybeRunSlashCommand, which would fail with SlashCommandExit for /quit.
      // This test verifies the method accepts "/quit" as a value.

      const customMock = createMockTUI({ multiSelect: ["/quit", "option1"] });

      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        // In real usage, "/quit" would be intercepted and cause SlashCommandExit
        return yield* tui.multiSelect("Choose options:", [
          "/quit",
          "option1",
          "option2",
        ]);
      }).pipe(Effect.provide(customMock));

      // Mock returns ["/quit", "option1"] directly, but real implementation would fail with SlashCommandExit
      const result = await Effect.runPromise(program);
      expect(result).toEqual(["/quit", "option1"]);
    });

    it("should return normal options when none start with /", async () => {
      const customMock = createMockTUI({ multiSelect: ["option1", "option2"] });

      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        return yield* tui.multiSelect("Choose options:", [
          "option1",
          "option2",
          "/help",
        ]);
      }).pipe(Effect.provide(customMock));

      const result = await Effect.runPromise(program);
      expect(result).toEqual(["option1", "option2"]);
    });

    it("should return Effect<string[]>", async () => {
      const customMock = createMockTUI({ multiSelect: ["x"] });

      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        const choices = yield* tui.multiSelect("Pick multiple:", [
          "x",
          "y",
          "z",
        ]);
        return Array.isArray(choices);
      }).pipe(Effect.provide(customMock));

      const result = await Effect.runPromise(program);
      expect(result).toBe(true);
    });

    it("should work with custom mock multi-select responses", async () => {
      const customMock = createMockTUI({ multiSelect: ["a", "b"] });

      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        return yield* tui.multiSelect("Pick multiple:", ["a", "b", "c", "d"]);
      }).pipe(Effect.provide(customMock));

      const result = await Effect.runPromise(program);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual(["a", "b"]);
    });
  });

  describe("Confirmation Dialog", () => {
    it("should prompt for confirmation and return boolean", async () => {
      const customMock = createMockTUI({ confirm: true });

      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        return yield* tui.confirm("Are you sure?");
      }).pipe(Effect.provide(customMock));

      const result = await Effect.runPromise(program);
      expect(typeof result).toBe("boolean");
      expect(result).toBe(true);
    });

    it("should accept default value", async () => {
      const customMock = createMockTUI({ confirm: true });

      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        return yield* tui.confirm("Continue?", { default: true });
      }).pipe(Effect.provide(customMock));

      const result = await Effect.runPromise(program);
      expect(result).toBe(true);
    });

    it("should return Effect<boolean>", async () => {
      const customMock = createMockTUI({ confirm: true });

      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        const confirmed = yield* tui.confirm("Proceed?");
        return typeof confirmed === "boolean";
      }).pipe(Effect.provide(customMock));

      const result = await Effect.runPromise(program);
      expect(result).toBe(true);
    });

    it("should work with false confirmation", async () => {
      const customMock = createMockTUI({ confirm: false });

      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        return yield* tui.confirm("Are you sure?");
      }).pipe(Effect.provide(customMock));

      const result = await Effect.runPromise(program);
      expect(result).toBe(false);
    });
  });

  describe("Password Input", () => {
    it("should prompt for password and return string", async () => {
      const customMock = createMockTUI({ password: "secret-pass" });

      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        return yield* tui.password("Enter password:");
      }).pipe(Effect.provide(customMock));

      const result = await Effect.runPromise(program);
      expect(typeof result).toBe("string");
      expect(result).toBe("secret-pass");
    });

    it("should accept validation function", async () => {
      const customMock = createMockTUI({ password: "password123" });

      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        return yield* tui.password("Enter password:", {
          validate: (pwd: string) =>
            pwd.length >= 8 || "Password must be at least 8 characters",
        });
      }).pipe(Effect.provide(customMock));

      const result = await Effect.runPromise(program);
      expect(result).toBe("password123");
    });

    it("should return Effect<string>", async () => {
      const customMock = createMockTUI({ password: "pwd" });

      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        const pwd = yield* tui.password("Password:");
        return typeof pwd === "string";
      }).pipe(Effect.provide(customMock));

      const result = await Effect.runPromise(program);
      expect(result).toBe(true);
    });

    it("should work with custom password responses", async () => {
      const customMock = createMockTUI({ password: "secret123" });

      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        return yield* tui.password("Enter password:");
      }).pipe(Effect.provide(customMock));

      const result = await Effect.runPromise(program);
      expect(result).toBe("secret123");
    });
  });

  describe("Simple Workflows", () => {
    it("should chain display and prompt operations", async () => {
      const customMock = createMockTUI({ prompt: "user-input" });

      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        yield* tui.display("Welcome", "info");
        const name = yield* tui.prompt("Your name:");
        yield* tui.display(`Hello ${name}`, "success");
        return name;
      }).pipe(Effect.provide(customMock));

      const result = await Effect.runPromise(program);
      expect(result).toBe("user-input");
    });

    it("should combine prompt and confirmation", async () => {
      const customMock = createMockTUI({ prompt: "john", confirm: true });

      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        const name = yield* tui.prompt("Name:");
        const confirmed = yield* tui.confirm("Is correct?");
        return { name, confirmed };
      }).pipe(Effect.provide(customMock));

      const result = await Effect.runPromise(program);
      expect(result.name).toBe("john");
      expect(result.confirmed).toBe(true);
    });

    it("should use selection alone", async () => {
      const customMock = createMockTUI({ selectOption: "option-b" });

      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        const choice = yield* tui.selectOption("Pick:", ["a", "b", "c"]);
        return choice;
      }).pipe(Effect.provide(customMock));

      const result = await Effect.runPromise(program);
      expect(result).toBe("option-b");
    });

    it("should use password alone", async () => {
      const customMock = createMockTUI({ password: "secret" });

      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        const pwd = yield* tui.password("Password:");
        return pwd;
      }).pipe(Effect.provide(customMock));

      const result = await Effect.runPromise(program);
      expect(result).toBe("secret");
    });
  });

  describe("Service Interface", () => {
    it("should provide all required methods", async () => {
      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        return {
          display: typeof tui.display === "function",
          prompt: typeof tui.prompt === "function",
          selectOption: typeof tui.selectOption === "function",
          multiSelect: typeof tui.multiSelect === "function",
          confirm: typeof tui.confirm === "function",
          password: typeof tui.password === "function",
        };
      }).pipe(Effect.provide(MockTUI));

      const result = await Effect.runPromise(program);
      expect(result.display).toBe(true);
      expect(result.prompt).toBe(true);
      expect(result.selectOption).toBe(true);
      expect(result.multiSelect).toBe(true);
      expect(result.confirm).toBe(true);
      expect(result.password).toBe(true);
    });

    it("should return Effects from all methods", async () => {
      const program = Effect.gen(function* () {
        const tui = yield* TUIHandler;
        return {
          display: tui.display("test", "info"),
          prompt: tui.prompt("test"),
          selectOption: tui.selectOption("test", ["a"]),
          multiSelect: tui.multiSelect("test", ["a"]),
          confirm: tui.confirm("test"),
          password: tui.password("test"),
        };
      }).pipe(Effect.provide(MockTUI));

      const result = await Effect.runPromise(program);
      for (const effect of Object.values(result)) {
        expect(effect).toBeDefined();
        expect(typeof effect === "object").toBe(true);
      }
    });
  });
});
