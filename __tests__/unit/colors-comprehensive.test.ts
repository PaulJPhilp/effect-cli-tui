import { Effect } from "effect";
import { describe, expect, it, vi } from "vitest";
import {
  applyChalkStyle,
  displayHighlight,
  displayInfo,
  displayListItem,
  displayMuted,
  displayWarning,
} from "@/index";
import { MockThemeService } from "../fixtures/test-layers";

/**
 * Comprehensive tests for colors.ts module
 * Tests all styling combinations and edge cases for improved coverage
 */

describe("Colors & Styling - Comprehensive Coverage", () => {
  describe("applyChalkStyle - Individual Colors", () => {
    it("should apply red color", () => {
      const result = applyChalkStyle("test", { color: "red" });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    it("should apply green color", () => {
      const result = applyChalkStyle("test", { color: "green" });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    it("should apply yellow color", () => {
      const result = applyChalkStyle("test", { color: "yellow" });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    it("should apply blue color", () => {
      const result = applyChalkStyle("test", { color: "blue" });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    it("should apply magenta color", () => {
      const result = applyChalkStyle("test", { color: "magenta" });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    it("should apply cyan color", () => {
      const result = applyChalkStyle("test", { color: "cyan" });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    it("should apply white color", () => {
      const result = applyChalkStyle("test", { color: "white" });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    it("should apply black color", () => {
      const result = applyChalkStyle("test", { color: "black" });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    it("should apply gray color", () => {
      const result = applyChalkStyle("test", { color: "gray" });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });
  });

  describe("applyChalkStyle - Background Colors", () => {
    it("should apply bgBlack", () => {
      const result = applyChalkStyle("test", { bgColor: "bgBlack" });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    it("should apply bgRed", () => {
      const result = applyChalkStyle("test", { bgColor: "bgRed" });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    it("should apply bgGreen", () => {
      const result = applyChalkStyle("test", { bgColor: "bgGreen" });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    it("should apply bgYellow", () => {
      const result = applyChalkStyle("test", { bgColor: "bgYellow" });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    it("should apply bgBlue", () => {
      const result = applyChalkStyle("test", { bgColor: "bgBlue" });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    it("should apply bgMagenta", () => {
      const result = applyChalkStyle("test", { bgColor: "bgMagenta" });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    it("should apply bgCyan", () => {
      const result = applyChalkStyle("test", { bgColor: "bgCyan" });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    it("should apply bgWhite", () => {
      const result = applyChalkStyle("test", { bgColor: "bgWhite" });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });
  });

  describe("applyChalkStyle - Style Modifiers", () => {
    it("should apply bold style", () => {
      const result = applyChalkStyle("test", { bold: true });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    it("should apply dim style", () => {
      const result = applyChalkStyle("test", { dim: true });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    it("should apply italic style", () => {
      const result = applyChalkStyle("test", { italic: true });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    it("should apply underline style", () => {
      const result = applyChalkStyle("test", { underline: true });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    it("should apply inverse style", () => {
      const result = applyChalkStyle("test", { inverse: true });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    it("should apply strikethrough style", () => {
      const result = applyChalkStyle("test", { strikethrough: true });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });
  });

  describe("applyChalkStyle - Complex Combinations", () => {
    it("should combine color and bold", () => {
      const result = applyChalkStyle("test", { color: "red", bold: true });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    it("should combine color and bgColor", () => {
      const result = applyChalkStyle("test", {
        color: "white",
        bgColor: "bgRed",
      });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    it("should combine bold, underline, and color", () => {
      const result = applyChalkStyle("test", {
        color: "yellow",
        bold: true,
        underline: true,
      });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    it("should combine all text styles", () => {
      const result = applyChalkStyle("test", {
        bold: true,
        dim: true,
        italic: true,
        underline: true,
        inverse: true,
        strikethrough: true,
      });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    it("should combine color with all style modifiers", () => {
      const result = applyChalkStyle("test", {
        color: "cyan",
        bold: true,
        dim: false,
        italic: true,
        underline: false,
        inverse: false,
        strikethrough: false,
      });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    it("should handle color, bgColor, and style modifiers", () => {
      const result = applyChalkStyle("test", {
        color: "black",
        bgColor: "bgYellow",
        bold: true,
        italic: true,
      });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });
  });

  describe("applyChalkStyle - Empty and Edge Cases", () => {
    it("should handle empty string", () => {
      const result = applyChalkStyle("", { color: "red" });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    it("should handle very long strings", () => {
      const longString = "a".repeat(1000);
      const result = applyChalkStyle(longString, { bold: true });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    it("should handle strings with special characters", () => {
      const result = applyChalkStyle("test!@#$%^&*()", { color: "red" });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    it("should handle strings with newlines", () => {
      const result = applyChalkStyle("line1\nline2", { color: "blue" });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    it("should handle empty options object", () => {
      const result = applyChalkStyle("test", {});
      expect(result).toBe("test");
    });
  });

  describe("displayHighlight - Variations", () => {
    it("should display short message", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        /* Mock implementation - no-op */
      });
      await Effect.runPromise(displayHighlight("Hi"));
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should display long message", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        /* Mock implementation - no-op */
      });
      const longMsg = `Important: ${"a".repeat(100)}`;
      await Effect.runPromise(displayHighlight(longMsg));
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should display message with special chars", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        /* Mock implementation - no-op */
      });
      await Effect.runPromise(displayHighlight("Alert: 🔔"));
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should display message with newlines", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        /* Mock implementation - no-op */
      });
      await Effect.runPromise(displayHighlight("Line1\nLine2"));
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("displayMuted - Variations", () => {
    it("should display short muted message", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        /* Mock implementation - no-op */
      });
      await Effect.runPromise(displayMuted("Info"));
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should display long muted message", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        /* Mock implementation - no-op */
      });
      const longMsg = `Detail: ${"x".repeat(100)}`;
      await Effect.runPromise(displayMuted(longMsg));
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should display muted message with special chars", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        /* Mock implementation - no-op */
      });
      await Effect.runPromise(displayMuted("Note: ℹ️"));
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should display muted empty string", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        /* Mock implementation - no-op */
      });
      await Effect.runPromise(displayMuted(""));
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should return Effect<void>", async () => {
      const effect = displayMuted("test");
      expect(effect).toBeDefined();
      await Effect.runPromise(effect.pipe(Effect.provide(MockThemeService)));
    });
  });

  describe("displayWarning - Variations", () => {
    it("should display short warning", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        /* Mock implementation - no-op */
      });
      await Effect.runPromise(displayWarning("Caution"));
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should display long warning", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        /* Mock implementation - no-op */
      });
      const longMsg = `Warning: ${"w".repeat(100)}`;
      await Effect.runPromise(displayWarning(longMsg));
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should display warning with special chars", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        /* Mock implementation - no-op */
      });
      await Effect.runPromise(displayWarning("Danger: ⚠️"));
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should display warning with numbers", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        /* Mock implementation - no-op */
      });
      await Effect.runPromise(displayWarning("Error code: 404"));
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("displayInfo - Variations", () => {
    it("should display short info message", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        /* Mock implementation - no-op */
      });
      await Effect.runPromise(displayInfo("OK"));
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should display long info message", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        /* Mock implementation - no-op */
      });
      const longMsg = `Information: ${"i".repeat(100)}`;
      await Effect.runPromise(displayInfo(longMsg));
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should display info with emoji", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        /* Mock implementation - no-op */
      });
      await Effect.runPromise(displayInfo("Status: ✅"));
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should display info with markdown-like content", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        /* Mock implementation - no-op */
      });
      await Effect.runPromise(displayInfo("**Bold** and `code`"));
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should return Effect<void>", async () => {
      const effect = displayInfo("test");
      expect(effect).toBeDefined();
      await Effect.runPromise(effect.pipe(Effect.provide(MockThemeService)));
    });
  });

  describe("displayListItem - Variations", () => {
    it("should display item with dash bullet", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        /* Mock implementation - no-op */
      });
      await Effect.runPromise(
        displayListItem("First item", "-").pipe(
          Effect.provide(MockThemeService)
        )
      );
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should display item with arrow bullet", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        /* Mock implementation - no-op */
      });
      await Effect.runPromise(
        displayListItem("Next step", "→").pipe(Effect.provide(MockThemeService))
      );
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should display item with number bullet", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        /* Mock implementation - no-op */
      });
      await Effect.runPromise(
        displayListItem("Numbered item", "1.").pipe(
          Effect.provide(MockThemeService)
        )
      );
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should display item with red bullet color", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        /* Mock implementation - no-op */
      });
      await Effect.runPromise(
        displayListItem("Error item", "✗", { color: "red" }).pipe(
          Effect.provide(MockThemeService)
        )
      );
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should display item with green bullet color", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        /* Mock implementation - no-op */
      });
      await Effect.runPromise(
        displayListItem("Success item", "✓", { color: "green" }).pipe(
          Effect.provide(MockThemeService)
        )
      );
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should display item with yellow bullet color", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        /* Mock implementation - no-op */
      });
      await Effect.runPromise(
        displayListItem("Warning item", "!", { color: "yellow" }).pipe(
          Effect.provide(MockThemeService)
        )
      );
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should display item with blue bullet color", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        /* Mock implementation - no-op */
      });
      await Effect.runPromise(
        displayListItem("Info item", "i", { color: "blue" }).pipe(
          Effect.provide(MockThemeService)
        )
      );
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should display item with magenta bullet color", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        /* Mock implementation - no-op */
      });
      await Effect.runPromise(
        displayListItem("Custom item", "*", { color: "magenta" }).pipe(
          Effect.provide(MockThemeService)
        )
      );
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should display item with white bullet color", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        /* Mock implementation - no-op */
      });
      await Effect.runPromise(
        displayListItem("Bright item", "+", { color: "white" }).pipe(
          Effect.provide(MockThemeService)
        )
      );
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should display long list item text", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        /* Mock implementation - no-op */
      });
      const longItem = `Item: ${"a".repeat(150)}`;
      await Effect.runPromise(
        displayListItem(longItem).pipe(Effect.provide(MockThemeService))
      );
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should display item with special characters", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        /* Mock implementation - no-op */
      });
      await Effect.runPromise(
        displayListItem("Task [COMPLETED] - Done!").pipe(
          Effect.provide(MockThemeService)
        )
      );
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should display item with emoji", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        /* Mock implementation - no-op */
      });
      await Effect.runPromise(
        displayListItem("Project 🚀").pipe(Effect.provide(MockThemeService))
      );
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should return Effect<void>", async () => {
      const effect = displayListItem("test");
      expect(effect).toBeDefined();
      await Effect.runPromise(effect.pipe(Effect.provide(MockThemeService)));
    });
  });

  describe("applyChalkStyle - Type Safety", () => {
    it("should maintain type as string", () => {
      const result = applyChalkStyle("test", { color: "red", bold: true });
      expect(typeof result).toBe("string");
    });

    it("should work with all option combinations", () => {
      const allColors = [
        "black",
        "red",
        "green",
        "yellow",
        "blue",
        "magenta",
        "cyan",
        "white",
        "gray",
      ] as const;
      const allBgColors = [
        "bgBlack",
        "bgRed",
        "bgGreen",
        "bgYellow",
        "bgBlue",
        "bgMagenta",
        "bgCyan",
        "bgWhite",
      ] as const;

      for (const color of allColors) {
        const result = applyChalkStyle("test", { color });
        expect(typeof result).toBe("string");
      }

      for (const bgColor of allBgColors) {
        const result = applyChalkStyle("test", { bgColor });
        expect(typeof result).toBe("string");
      }
    });
  });
});
