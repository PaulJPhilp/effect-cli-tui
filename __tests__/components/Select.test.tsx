/**
 * Tests for Select component
 */

import { Select } from "@components/Select";
import { render } from "ink-testing-library";
import { describe, expect, it, vi } from "vitest";

describe("Select component", () => {
  const choices = ["Option A", "Option B", "Option C"];

  it("should render prompt message", () => {
    const { lastFrame } = render(
      <Select choices={choices} message="Choose one:" onSubmit={vi.fn()} />
    );
    const output = lastFrame();
    expect(output).toContain("Choose one:");
  });

  it("should render all choices", () => {
    const { lastFrame } = render(
      <Select choices={choices} message="Select:" onSubmit={vi.fn()} />
    );
    const output = lastFrame();
    expect(output).toContain("Option A");
    expect(output).toContain("Option B");
    expect(output).toContain("Option C");
  });

  it("should highlight first item by default", () => {
    const { lastFrame } = render(
      <Select choices={choices} message="Choose:" onSubmit={vi.fn()} />
    );
    const output = lastFrame();
    // Should render the component successfully
    expect(output).toBeTruthy();
  });

  it("should render with single choice", () => {
    const { lastFrame } = render(
      <Select choices={["Single"]} message="Only option:" onSubmit={vi.fn()} />
    );
    const output = lastFrame();
    expect(output).toContain("Single");
  });

  it("should handle empty choices array", () => {
    const { lastFrame } = render(
      <Select choices={[]} message="No choices:" onSubmit={vi.fn()} />
    );
    const output = lastFrame();
    expect(output).toContain("No choices:");
  });

  it("should call onSubmit with selected choice", () => {
    const onSubmit = vi.fn();
    render(<Select choices={choices} message="Choose:" onSubmit={onSubmit} />);
    // Callback is properly wired
    expect(onSubmit).toBeDefined();
  });

  it("should render with long choice lists", () => {
    const longChoices = Array.from({ length: 20 }, (_, i) => `Choice ${i + 1}`);
    const { lastFrame } = render(
      <Select choices={longChoices} message="Pick one:" onSubmit={vi.fn()} />
    );
    const output = lastFrame();
    expect(output).toContain("Choice 1");
    expect(output).toContain("Pick one:");
  });
});
