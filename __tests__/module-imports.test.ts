import { describe, expect, it } from "vitest";

// Test ESM imports
describe("ESM Module Imports", () => {
  it("should import display functions from ESM build", async () => {
    // This test verifies that the ESM build exports work for display functions
    const { display, displayLines, displayJson, displaySuccess, displayError } =
      await import("../dist/index.js");

    expect(display).toBeDefined();
    expect(displayLines).toBeDefined();
    expect(displayJson).toBeDefined();
    expect(displaySuccess).toBeDefined();
    expect(displayError).toBeDefined();

    expect(typeof display).toBe("function");
    expect(typeof displayLines).toBe("function");
    expect(typeof displayJson).toBe("function");
    expect(typeof displaySuccess).toBe("function");
    expect(typeof displayError).toBe("function");
  });

  it("should import types from ESM build", async () => {
    // TypeScript types are erased at runtime, so we can't check for them
    // Instead, verify that the module exports exist and can be imported
    const module = await import("../dist/index.js");
    expect(module).toBeDefined();
    // Types are compile-time only, so we skip runtime checks
  });

  it("should import new table functions from ESM build", async () => {
    const { displayTable } = await import("../dist/index.js");

    expect(displayTable).toBeDefined();
    expect(typeof displayTable).toBe("function");
    // TableColumn and TableOptions are TypeScript types, not runtime values
  });

  it("should import new box functions from ESM build", async () => {
    const { displayBox, displayPanel } = await import("../dist/index.js");

    expect(displayBox).toBeDefined();
    expect(displayPanel).toBeDefined();

    expect(typeof displayBox).toBe("function");
    expect(typeof displayPanel).toBe("function");
    // BoxStyle is a TypeScript type, not a runtime value
  });

  it("should import new spinner functions from ESM build", async () => {
    const { spinnerEffect, startSpinner, stopSpinner } = await import(
      "../dist/index.js"
    );

    expect(spinnerEffect).toBeDefined();
    expect(startSpinner).toBeDefined();
    expect(stopSpinner).toBeDefined();

    expect(typeof spinnerEffect).toBe("function");
    expect(typeof startSpinner).toBe("function");
    expect(typeof stopSpinner).toBe("function");
    // SpinnerOptions is a TypeScript type, not a runtime value
  });

  it("should import color functions from ESM build", async () => {
    const {
      applyChalkStyle,
      displayHighlight,
      displayMuted,
      displayWarning,
      displayInfo,
      displayListItem,
    } = await import("../dist/index.js");

    expect(applyChalkStyle).toBeDefined();
    expect(displayHighlight).toBeDefined();
    expect(displayMuted).toBeDefined();
    expect(displayWarning).toBeDefined();
    expect(displayInfo).toBeDefined();
    expect(displayListItem).toBeDefined();

    expect(typeof applyChalkStyle).toBe("function");
    expect(typeof displayHighlight).toBe("function");
    expect(typeof displayMuted).toBe("function");
    expect(typeof displayWarning).toBe("function");
    expect(typeof displayInfo).toBe("function");
    expect(typeof displayListItem).toBe("function");
  });
});
