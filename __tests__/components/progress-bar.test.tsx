/**
 * Tests for ProgressBar component
 */

import { ProgressBar } from "@components/ProgressBar";
import { render } from "ink-testing-library";
import { describe, expect, it } from "vitest";

describe("ProgressBar component", () => {
  it("should render progress bar with percentage", () => {
    const { lastFrame } = render(
      <ProgressBar max={100} showPercentage value={50} />
    );
    const output = lastFrame();
    expect(output).toContain("50%");
  });

  it("should render progress bar with label", () => {
    const { lastFrame } = render(
      <ProgressBar label="Downloading" max={100} value={75} />
    );
    const output = lastFrame();
    expect(output).toContain("Downloading");
    expect(output).toContain("75%");
  });

  it("should calculate percentage correctly", () => {
    const { lastFrame } = render(
      <ProgressBar max={50} showPercentage value={25} />
    );
    const output = lastFrame();
    // 25/50 = 50%
    expect(output).toContain("50%");
  });

  it("should cap percentage at 100", () => {
    const { lastFrame } = render(
      <ProgressBar max={100} showPercentage value={150} />
    );
    const output = lastFrame();
    expect(output).toContain("100%");
  });

  it("should hide percentage when showPercentage is false", () => {
    const { lastFrame } = render(
      <ProgressBar max={100} showPercentage={false} value={50} />
    );
    const output = lastFrame();
    expect(output).not.toContain("50%");
  });
});
