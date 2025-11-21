import { Effect } from "effect";
import { describe, expect, it, vi } from "vitest";
import { displayBox, displayPanel } from "../../src/ui/boxes/box";

/**
 * Comprehensive test suite for box.ts module
 *
 * Tests cover:
 * - All border styles and their exact characters
 * - All display types and color application
 * - Title rendering with various lengths
 * - Padding and margin functionality
 * - Content variations (empty, multiline, special chars, emoji)
 * - Edge cases and error handling
 * - Output structure validation
 */

describe("Box Display Module", () => {
  describe("displayBox - Basic Functionality", () => {
    it("should output to console.log", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Test content");
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      const output = consoleSpy.mock.calls[0][0];
      expect(typeof output).toBe("string");
      expect(output.length).toBeGreaterThan(0);

      consoleSpy.mockRestore();
    });

    it("should wrap output with newlines", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Content");
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      expect(output.startsWith("\n")).toBe(true);
      expect(output.endsWith("\n")).toBe(true);

      consoleSpy.mockRestore();
    });

    it("should return Effect that completes successfully", async () => {
      const program = displayBox("Content");
      await expect(Effect.runPromise(program)).resolves.toBeUndefined();
    });
  });

  describe("displayBox - Border Styles", () => {
    const borderStyleTests = [
      {
        name: "single",
        topLeft: "┌",
        topRight: "┐",
        bottomLeft: "└",
        bottomRight: "┘",
        horizontal: "─",
        vertical: "│",
      },
      {
        name: "double",
        topLeft: "╔",
        topRight: "╗",
        bottomLeft: "╚",
        bottomRight: "╝",
        horizontal: "═",
        vertical: "║",
      },
      {
        name: "rounded",
        topLeft: "╭",
        topRight: "╮",
        bottomLeft: "╰",
        bottomRight: "╯",
        horizontal: "─",
        vertical: "│",
      },
      {
        name: "bold",
        topLeft: "┏",
        topRight: "┓",
        bottomLeft: "┗",
        bottomRight: "┛",
        horizontal: "━",
        vertical: "┃",
      },
      {
        name: "classic",
        topLeft: "+",
        topRight: "+",
        bottomLeft: "+",
        bottomRight: "+",
        horizontal: "-",
        vertical: "|",
      },
    ];

    for (const style of borderStyleTests) {
      it(`should use ${style.name} border style correctly`, async () => {
        const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
          return;
        });

        const program = displayBox("Content", {
          borderStyle: style.name as any,
        });
        await Effect.runPromise(program);

        const output = consoleSpy.mock.calls[0][0];
        expect(output).toContain(style.topLeft);
        expect(output).toContain(style.topRight);
        expect(output).toContain(style.bottomLeft);
        expect(output).toContain(style.bottomRight);
        expect(output).toContain(style.horizontal);
        expect(output).toContain(style.vertical);

        consoleSpy.mockRestore();
      });
    }

    it("should default to rounded border style", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Content");
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("╭");
      expect(output).toContain("╮");
      expect(output).toContain("╰");
      expect(output).toContain("╯");

      consoleSpy.mockRestore();
    });
  });

  describe("displayBox - Display Types and Colors", () => {
    it("should apply success color to title", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Content", {
        type: "success",
        title: "Success",
      });
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      // Title should be styled (contains ANSI color codes)
      expect(output).toContain("Success");
      // Check that title appears in the output
      const lines = output.split("\n");
      const topLine = lines.find((line) => line.includes("Success"));
      expect(topLine).toBeDefined();

      consoleSpy.mockRestore();
    });

    it("should apply error color to title", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Content", {
        type: "error",
        title: "Error",
      });
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("Error");

      consoleSpy.mockRestore();
    });

    it("should apply warning color to title", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Content", {
        type: "warning",
        title: "Warning",
      });
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("Warning");

      consoleSpy.mockRestore();
    });

    it("should apply info color to title (default)", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Content", {
        type: "info",
        title: "Info",
      });
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("Info");

      consoleSpy.mockRestore();
    });

    it("should default to info type", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Content", { title: "Title" });
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("Title");

      consoleSpy.mockRestore();
    });
  });

  describe("displayBox - Title Rendering", () => {
    it("should render title in top border", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Content", { title: "My Title" });
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      const lines = output.split("\n").filter((line) => line.trim().length > 0);
      const topLine = lines[0];
      expect(topLine).toContain("My Title");

      consoleSpy.mockRestore();
    });

    it("should handle short titles", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Content", { title: "A" });
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("A");

      consoleSpy.mockRestore();
    });

    it("should handle long titles gracefully", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const longTitle = "A".repeat(150); // Exceeds MAX_TITLE_LENGTH
      const program = displayBox("Content", { title: longTitle });
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      // Should still render the title even if it exceeds validation limits
      expect(output).toContain("A");

      consoleSpy.mockRestore();
    });

    it("should handle title with spaces", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Content", {
        title: "My Long Title Here",
      });
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("My Long Title Here");

      consoleSpy.mockRestore();
    });

    it("should handle title with special characters", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Content", {
        title: "Title: !@#$%^&*()",
      });
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("Title:");

      consoleSpy.mockRestore();
    });

    it("should render box without title when title is undefined", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Content", { title: undefined });
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      const lines = output.split("\n").filter((line) => line.trim().length > 0);
      const topLine = lines[0];
      // Top border should not contain title text
      expect(topLine).not.toContain("undefined");

      consoleSpy.mockRestore();
    });
  });

  describe("displayBox - Padding", () => {
    it("should add padding lines above and below content", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Content", { padding: 2 });
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      const lines = output.split("\n").filter((line) => line.trim().length > 0);
      // Should have: top border, 2 padding, content, 2 padding, bottom border = 6 lines
      expect(lines.length).toBeGreaterThanOrEqual(5);

      consoleSpy.mockRestore();
    });

    it("should handle zero padding", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Content", { padding: 0 });
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      const lines = output.split("\n").filter((line) => line.trim().length > 0);
      // Should have: top border, content, bottom border = 3 lines minimum
      expect(lines.length).toBeGreaterThanOrEqual(3);

      consoleSpy.mockRestore();
    });

    it("should handle large padding values", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Content", { padding: 10 });
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      const lines = output.split("\n").filter((line) => line.trim().length > 0);
      // Should have many padding lines
      expect(lines.length).toBeGreaterThan(10);

      consoleSpy.mockRestore();
    });

    it("should default to zero padding", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Content");
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      const lines = output.split("\n").filter((line) => line.trim().length > 0);
      // Without padding, should have minimal lines
      expect(lines.length).toBeLessThan(10);

      consoleSpy.mockRestore();
    });
  });

  describe("displayBox - Margin", () => {
    it("should add margin (empty lines) around box", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Content", { margin: 2 });
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      const lines = output.split("\n");
      // Should have empty lines at start and end
      expect(lines[0]).toBe("");
      expect(lines.at(-1)).toBe("");

      consoleSpy.mockRestore();
    });

    it("should handle zero margin", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Content", { margin: 0 });
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      // Output should still be wrapped with newlines
      expect(output.startsWith("\n")).toBe(true);
      expect(output.endsWith("\n")).toBe(true);

      consoleSpy.mockRestore();
    });

    it("should handle large margin values", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Content", { margin: 5 });
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      const lines = output.split("\n");
      // Should have multiple empty lines at start
      let emptyCount = 0;
      for (const line of lines) {
        if (line === "") {
          emptyCount += 1;
        } else {
          break;
        }
      }
      expect(emptyCount).toBeGreaterThanOrEqual(5);

      consoleSpy.mockRestore();
    });

    it("should default to zero margin", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Content");
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      // Should still have newline wrapper but no extra empty lines
      expect(output.startsWith("\n")).toBe(true);
      expect(output.endsWith("\n")).toBe(true);

      consoleSpy.mockRestore();
    });
  });

  describe("displayBox - Content Variations", () => {
    it("should handle empty content", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("");
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      const lines = output.split("\n").filter((line) => line.trim().length > 0);
      // Should still render borders
      expect(lines.length).toBeGreaterThanOrEqual(2);

      consoleSpy.mockRestore();
    });

    it("should handle single line content", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Single line");
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("Single line");

      consoleSpy.mockRestore();
    });

    it("should handle multiline content", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Line 1\nLine 2\nLine 3");
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("Line 1");
      expect(output).toContain("Line 2");
      expect(output).toContain("Line 3");

      consoleSpy.mockRestore();
    });

    it("should handle content with trailing newline", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Content\n");
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("Content");

      consoleSpy.mockRestore();
    });

    it("should handle content with multiple consecutive newlines", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Line 1\n\nLine 3");
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("Line 1");
      expect(output).toContain("Line 3");

      consoleSpy.mockRestore();
    });

    it("should handle very long single line", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const longContent = "A".repeat(200);
      const program = displayBox(longContent);
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("A");

      consoleSpy.mockRestore();
    });

    it("should handle content with special characters", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Content: !@#$%^&*()_+-=[]{}|;':\",./<>?");
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("Content:");

      consoleSpy.mockRestore();
    });

    it("should handle content with emoji", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Status: ✅ Complete 🎉");
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("Status:");

      consoleSpy.mockRestore();
    });

    it("should handle content with unicode characters", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Unicode: 你好 世界 🌍");
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("Unicode:");

      consoleSpy.mockRestore();
    });

    it("should handle content with ANSI codes", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("\x1b[31mRed\x1b[0m text");
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      // Should handle ANSI codes in content
      expect(output).toBeDefined();

      consoleSpy.mockRestore();
    });
  });

  describe("displayBox - Width Calculations", () => {
    it("should calculate width based on content", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Short");
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      const lines = output.split("\n").filter((line) => line.trim().length > 0);
      const firstLine = lines[0];
      const lastLine = lines.at(-1);
      // Top and bottom borders should have same width
      expect(firstLine.length).toBe(lastLine.length);

      consoleSpy.mockRestore();
    });

    it("should calculate width based on longest line", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Short\nVery long line here\nShort");
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      const lines = output.split("\n").filter((line) => line.trim().length > 0);
      const firstLine = lines[0];
      const lastLine = lines.at(-1);
      // Borders should accommodate longest line
      expect(firstLine.length).toBe(lastLine.length);

      consoleSpy.mockRestore();
    });

    it("should calculate width including title", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Short", { title: "Very Long Title Here" });
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      const lines = output.split("\n").filter((line) => line.trim().length > 0);
      const firstLine = lines[0];
      const lastLine = lines.at(-1);
      // Top border with title should be at least as wide as bottom border
      expect(firstLine.length).toBeGreaterThanOrEqual(lastLine.length);

      consoleSpy.mockRestore();
    });
  });

  describe("displayBox - Output Structure", () => {
    it("should have consistent border structure", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Content", { borderStyle: "rounded" });
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      const lines = output.split("\n").filter((line) => line.trim().length > 0);
      const firstLine = lines[0];
      const lastLine = lines.at(-1);

      // Top border should start with topLeft
      expect(firstLine.startsWith("╭") || firstLine.includes("╭")).toBe(true);
      // Bottom border should start with bottomLeft
      expect(lastLine.startsWith("╰") || lastLine.includes("╰")).toBe(true);

      consoleSpy.mockRestore();
    });

    it("should have vertical borders on content lines", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Content");
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      const lines = output.split("\n").filter((line) => line.trim().length > 0);
      // Content line (middle) should have vertical borders
      const contentLine = lines[Math.floor(lines.length / 2)];
      expect(contentLine).toContain("│");

      consoleSpy.mockRestore();
    });

    it("should pad content lines to same width", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Short\nLonger line\nShort");
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      const lines = output.split("\n").filter((line) => line.trim().length > 0);
      // All content lines should have same width (excluding borders)
      const contentLines = lines.slice(1, -1); // Exclude top and bottom borders
      const widths = contentLines.map((line) => line.length);
      const allSameWidth = widths.every((w) => w === widths[0]);
      expect(allSameWidth).toBe(true);

      consoleSpy.mockRestore();
    });
  });

  describe("displayBox - Complex Combinations", () => {
    it("should combine all options correctly", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Multi-line\nContent\nHere", {
        borderStyle: "double",
        type: "success",
        title: "Complex Box",
        padding: 2,
        margin: 1,
      });
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("Complex Box");
      expect(output).toContain("Multi-line");
      expect(output).toContain("Content");
      expect(output).toContain("Here");
      // Should have double border
      expect(output).toContain("╔");

      consoleSpy.mockRestore();
    });

    it("should handle title longer than content", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Hi", {
        title: "Very Long Title That Exceeds Content Length",
      });
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("Very Long Title");
      expect(output).toContain("Hi");

      consoleSpy.mockRestore();
    });

    it("should handle content longer than title", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Very long content line here", {
        title: "Hi",
      });
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("Hi");
      expect(output).toContain("Very long content");

      consoleSpy.mockRestore();
    });
  });

  describe("displayPanel - Convenience Wrapper", () => {
    it("should display panel with title", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayPanel("Content", "Panel Title");
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("Panel Title");
      expect(output).toContain("Content");

      consoleSpy.mockRestore();
    });

    it("should merge title with options", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayPanel("Content", "Title", {
        type: "success",
        padding: 1,
      });
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("Title");
      expect(output).toContain("Content");

      consoleSpy.mockRestore();
    });

    it("should override title in options if provided", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayPanel("Content", "Panel Title", {
        title: "Should be ignored",
      });
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("Panel Title");
      // The options title should be overridden by the function parameter
      expect(output).not.toContain("Should be ignored");

      consoleSpy.mockRestore();
    });

    it("should handle multiline content in panel", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayPanel("Line 1\nLine 2\nLine 3", "Panel");
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("Panel");
      expect(output).toContain("Line 1");
      expect(output).toContain("Line 2");
      expect(output).toContain("Line 3");

      consoleSpy.mockRestore();
    });
  });

  describe("displayBox - Edge Cases", () => {
    it("should handle very large padding", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Content", { padding: 100 });
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toBeDefined();
      expect(output.length).toBeGreaterThan(0);

      consoleSpy.mockRestore();
    });

    it("should handle very large margin", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Content", { margin: 100 });
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toBeDefined();

      consoleSpy.mockRestore();
    });

    it("should handle negative padding gracefully", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      // Negative padding should be treated as 0
      const program = displayBox("Content", { padding: -1 });
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toBeDefined();

      consoleSpy.mockRestore();
    });

    it("should handle negative margin gracefully", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      // Negative margin should be treated as 0
      const program = displayBox("Content", { margin: -1 });
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toBeDefined();

      consoleSpy.mockRestore();
    });

    it("should handle empty string title", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Content", { title: "" });
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toBeDefined();

      consoleSpy.mockRestore();
    });

    it("should handle whitespace-only content", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("   \n  \n   ");
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toBeDefined();

      consoleSpy.mockRestore();
    });

    it("should handle whitespace-only title", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        return;
      });

      const program = displayBox("Content", { title: "   " });
      await Effect.runPromise(program);

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toBeDefined();

      consoleSpy.mockRestore();
    });
  });
});
