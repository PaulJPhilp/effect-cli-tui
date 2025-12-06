import { displayBox, displayPanel } from "@ui/boxes/box";
import { Effect } from "effect";
import { describe, expect, it, vi } from "vitest";

/**
 * Comprehensive tests for box.ts module
 * Tests all box styles, options, and content variations
 */

describe("Box Display - Comprehensive Coverage", () => {
  describe("displayBox - Border Styles", () => {
    it("should display box with single border style", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        // Mock implementation - no-op
      });

      const program = displayBox("Content", { borderStyle: "single" });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();
      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("┌");
      expect(output).toContain("┐");
      expect(output).toContain("└");
      expect(output).toContain("┘");

      consoleSpy.mockRestore();
    });

    it("should display box with double border style", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        // Mock implementation - no-op
      });

      const program = displayBox("Content", { borderStyle: "double" });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();
      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("╔");
      expect(output).toContain("╗");
      expect(output).toContain("╚");
      expect(output).toContain("╝");

      consoleSpy.mockRestore();
    });

    it("should display box with rounded border style", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        // Mock implementation - no-op
      });

      const program = displayBox("Content", { borderStyle: "rounded" });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();
      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("╭");
      expect(output).toContain("╮");
      expect(output).toContain("╰");
      expect(output).toContain("╯");

      consoleSpy.mockRestore();
    });

    it("should display box with bold border style", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        // Mock implementation - no-op
      });

      const program = displayBox("Content", { borderStyle: "bold" });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();
      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("┏");
      expect(output).toContain("┓");
      expect(output).toContain("┗");
      expect(output).toContain("┛");

      consoleSpy.mockRestore();
    });

    it("should display box with classic border style", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        // Mock implementation - no-op
      });

      const program = displayBox("Content", { borderStyle: "classic" });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();
      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("+");
      expect(output).toContain("-");
      expect(output).toContain("|");

      consoleSpy.mockRestore();
    });

    it("should use rounded border as default", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        // Mock implementation - no-op
      });

      const program = displayBox("Content");
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();
      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("╭");

      consoleSpy.mockRestore();
    });
  });

  describe("displayBox - Box Types", () => {
    it("should display info type box", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        // Mock implementation - no-op
      });

      const program = displayBox("Info content", { type: "info" });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should display success type box", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        // Mock implementation - no-op
      });

      const program = displayBox("Success!", { type: "success" });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should display error type box", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        // Mock implementation - no-op
      });

      const program = displayBox("Error!", { type: "error" });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should display warning type box", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        // Mock implementation - no-op
      });

      const program = displayBox("Warning!", { type: "warning" });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should use info as default type", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        // Mock implementation - no-op
      });

      const program = displayBox("Content");
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("displayBox - Titles", () => {
    it("should display box with title", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        // Mock implementation - no-op
      });

      const program = displayBox("Content", { title: "Header" });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();
      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("Header");

      consoleSpy.mockRestore();
    });

    it("should display box with long title", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        // Mock implementation - no-op
      });

      const longTitle = `Important: ${"Title".repeat(20)}`;
      const program = displayBox("Content", { title: longTitle });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should display box without title", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        // Mock implementation - no-op
      });

      const program = displayBox("Content", { title: undefined });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("displayBox - Padding", () => {
    it("should display box with padding", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        // Mock implementation - no-op
      });

      const program = displayBox("Content", { padding: 2 });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should display box with zero padding", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        // Mock implementation - no-op
      });

      const program = displayBox("Content", { padding: 0 });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should display box with large padding", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        // Mock implementation - no-op
      });

      const program = displayBox("Content", { padding: 5 });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("displayBox - Content Variations", () => {
    it("should display empty content", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        // Mock implementation - no-op
      });

      const program = displayBox("");
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should display multiline content", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        // Mock implementation - no-op
      });

      const program = displayBox("Line 1\nLine 2\nLine 3");
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should display long single line", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        // Mock implementation - no-op
      });

      const longContent = "a".repeat(100);
      const program = displayBox(longContent);
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should display content with special characters", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        // Mock implementation - no-op
      });

      const program = displayBox("Content with !@#$%^&*()");
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should display content with emoji", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        // Mock implementation - no-op
      });

      const program = displayBox("Status: ✅ Complete 🎉");
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("displayBox - Complex Options", () => {
    it("should combine border style and type", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        // Mock implementation - no-op
      });

      const program = displayBox("Content", {
        borderStyle: "double",
        type: "success",
      });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should combine title and padding", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        // Mock implementation - no-op
      });

      const program = displayBox("Content", {
        title: "Section",
        padding: 2,
      });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should combine all options", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        // Mock implementation - no-op
      });

      const program = displayBox("Multi-line\nContent", {
        borderStyle: "rounded",
        type: "info",
        title: "Header",
        padding: 1,
        margin: 1,
      });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("displayPanel - Convenience Wrapper", () => {
    it("should display panel with title", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        // Mock implementation - no-op
      });

      const program = displayPanel("Content", "Title");
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();
      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("Title");

      consoleSpy.mockRestore();
    });

    it("should display panel with options", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        // Mock implementation - no-op
      });

      const program = displayPanel("Content", "Panel Title", {
        type: "success",
      });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should display panel with border style option", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        // Mock implementation - no-op
      });

      const program = displayPanel("Content", "Title", {
        borderStyle: "double",
      });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should display panel with padding option", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        // Mock implementation - no-op
      });

      const program = displayPanel("Content", "Title", { padding: 2 });
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should display panel with multiline content", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        // Mock implementation - no-op
      });

      const program = displayPanel(
        "Line 1\nLine 2\nLine 3",
        "Multi-line Panel"
      );
      await Effect.runPromise(program);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
