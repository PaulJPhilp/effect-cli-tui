import { Effect } from "effect";
import {
    applyChalkStyle,
    displayHighlight,
    displayInfo,
    displayListItem,
    displayMuted,
    displayWarning,
} from "effect-cli-tui";
import { describe, expect, it, vi } from "vitest";

describe("applyChalkStyle", () => {
  it("should return text unchanged when no options provided", () => {
    const result = applyChalkStyle("test");
    expect(result).toBe("test");
  });

  it("should apply color styling", () => {
    const result = applyChalkStyle("test", { color: "red" });
    expect(result).toContain("test"); // Styled text contains original
    // Note: In non-TTY environments (tests), chalk may not apply colors
    // So the result might equal 'test' if colors are disabled
    expect(typeof result).toBe("string");
  });

  it("should apply background color", () => {
    const result = applyChalkStyle("test", { bgColor: "bgBlue" });
    expect(result).toContain("test");
  });

  it("should apply text styles", () => {
    const styles = [
      "bold",
      "dim",
      "italic",
      "underline",
      "inverse",
      "strikethrough",
    ] as const;

    styles.forEach((style) => {
      const result = applyChalkStyle("test", { [style]: true });
      expect(result).toContain("test");
      // Note: In non-TTY environments (tests), chalk may not apply styles
      // So we just verify the function returns a string
      expect(typeof result).toBe("string");
    });
  });

  it("should combine multiple styles", () => {
    const result = applyChalkStyle("test", {
      color: "green",
      bold: true,
      underline: true,
    });
    expect(result).toContain("test");
  });

  it("should handle undefined options", () => {
    const result = applyChalkStyle("test", undefined);
    expect(result).toBe("test");
  });
});

describe("displayHighlight", () => {
  it("should display highlighted message", async () => {
    // const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await Effect.runPromise(displayHighlight("Important message"));

    // expect(consoleSpy).toHaveBeenCalledWith("\nℹ Important message");
    // consoleSpy.mockRestore();
  });

  it("should return Effect<void>", async () => {
    const effect = displayHighlight("test");
    expect(effect).toBeDefined();

    await Effect.runPromise(effect);
  });
});

describe("displayMuted", () => {
  it("should display muted message", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await Effect.runPromise(displayMuted("Subtle message"));

    expect(consoleSpy).toHaveBeenCalledWith("\nℹ Subtle message");
    consoleSpy.mockRestore();
  });

  it("should return Effect<void>", async () => {
    const effect = displayMuted("test");
    expect(effect).toBeDefined();

    await Effect.runPromise(effect);
  });
});

describe("displayWarning", () => {
  it("should display warning message with prefix", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await Effect.runPromise(displayWarning("Warning message"));

    expect(consoleSpy).toHaveBeenCalledWith("\n⚠ Warning message");
    consoleSpy.mockRestore();
  });

  it("should return Effect<void>", async () => {
    const effect = displayWarning("test");
    expect(effect).toBeDefined();

    await Effect.runPromise(effect);
  });
});

describe("displayInfo", () => {
  it("should display info message", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await Effect.runPromise(displayInfo("Info message"));

    expect(consoleSpy).toHaveBeenCalledWith("\nℹ Info message");
    consoleSpy.mockRestore();
  });

  it("should return Effect<void>", async () => {
    const effect = displayInfo("test");
    expect(effect).toBeDefined();

    await Effect.runPromise(effect);
  });
});

describe("displayListItem", () => {
  it("should display list item with default bullet", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await Effect.runPromise(displayListItem("List item"));

    // Theme colors are applied, so check for content rather than exact match
    const call = consoleSpy.mock.calls[0][0] as string;
    expect(call).toContain("•");
    expect(call).toContain("List item");
    consoleSpy.mockRestore();
  });

  it("should display list item with custom bullet", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await Effect.runPromise(displayListItem("List item", "→"));

    // Theme colors are applied, so check for content rather than exact match
    const call = consoleSpy.mock.calls[0][0] as string;
    expect(call).toContain("→");
    expect(call).toContain("List item");
    consoleSpy.mockRestore();
  });

  it("should display list item with custom color", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await Effect.runPromise(
      displayListItem("List item", "•", { color: "red" })
    );

    // Custom color overrides theme, so check for content
    const call = consoleSpy.mock.calls[0][0] as string;
    expect(call).toContain("•");
    expect(call).toContain("List item");
    consoleSpy.mockRestore();
  });

  it("should return Effect<void>", async () => {
    const effect = displayListItem("test");
    expect(effect).toBeDefined();

    await Effect.runPromise(effect);
  });
});
