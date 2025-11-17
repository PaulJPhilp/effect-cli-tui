import { beforeEach } from "vitest";

// Track test count and add periodic delays to prevent resource contention
let testCount = 0;

beforeEach(async () => {
  testCount++;
  // Add a 1 second delay every 15 tests to allow processes to clean up
  // This helps prevent resource contention when running full test suite
  if (testCount % 15 === 0) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
});
