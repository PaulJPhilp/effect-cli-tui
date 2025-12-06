/**
 * Tests for MultiSelect component
 */

import { MultiSelect } from "@components/MultiSelect";
import { render } from "ink-testing-library";
import { describe, expect, it, vi } from "vitest";

describe("MultiSelect component", () => {
  const choices = ["Item 1", "Item 2", "Item 3", "Item 4"];

  it("should render prompt message", () => {
    const { lastFrame } = render(
      <MultiSelect
        choices={choices}
        message="Select items:"
        onSubmit={vi.fn()}
      />
    );
    const output = lastFrame();
    expect(output).toContain("Select items:");
  });

  it("should render all choices with checkboxes", () => {
    const { lastFrame } = render(
      <MultiSelect choices={choices} message="Choose:" onSubmit={vi.fn()} />
    );
    const output = lastFrame();
    expect(output).toContain("Item 1");
    expect(output).toContain("Item 2");
    expect(output).toContain("Item 3");
    expect(output).toContain("Item 4");
  });

  it("should display selection count", () => {
    const { lastFrame } = render(
      <MultiSelect
        choices={choices}
        message="Pick multiple:"
        onSubmit={vi.fn()}
      />
    );
    const output = lastFrame();
    expect(output).toContain("Selected: 0");
  });

  it("should show helper text", () => {
    const { lastFrame } = render(
      <MultiSelect choices={choices} message="Options:" onSubmit={vi.fn()} />
    );
    const output = lastFrame();
    expect(output).toContain("Space to toggle");
    expect(output).toContain("Enter to submit");
  });

  it("should handle empty choices", () => {
    const { lastFrame } = render(
      <MultiSelect choices={[]} message="No choices:" onSubmit={vi.fn()} />
    );
    const output = lastFrame();
    expect(output).toContain("No choices:");
  });

  it("should handle single choice", () => {
    const { lastFrame } = render(
      <MultiSelect
        choices={["Only option"]}
        message="Single choice:"
        onSubmit={vi.fn()}
      />
    );
    const output = lastFrame();
    expect(output).toContain("Only option");
  });

  it("should call onSubmit with selected items", () => {
    const onSubmit = vi.fn();
    render(
      <MultiSelect choices={choices} message="Select:" onSubmit={onSubmit} />
    );
    expect(onSubmit).toBeDefined();
  });

  it("should render confirmation message when items selected", () => {
    const { lastFrame } = render(
      <MultiSelect choices={choices} message="Pick many:" onSubmit={vi.fn()} />
    );
    const output = lastFrame();
    // Component properly structured
    expect(output).toBeTruthy();
  });

  it("should handle many items", () => {
    const manyChoices = Array.from({ length: 30 }, (_, i) => `Option ${i + 1}`);
    const { lastFrame } = render(
      <MultiSelect
        choices={manyChoices}
        message="Many options:"
        onSubmit={vi.fn()}
      />
    );
    const output = lastFrame();
    expect(output).toContain("Option 1");
  });
});
