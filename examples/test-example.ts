/**
 * Simple test - verify examples work
 * Run: bun run examples/test-example.ts
 */

import {
  EffectCLIRuntime,
  display,
  displayError,
  displaySuccess,
} from "../src";

const test = async () => {
  await EffectCLIRuntime.runPromise(display("Testing..."));
  await EffectCLIRuntime.runPromise(displaySuccess("Success works!"));
  await EffectCLIRuntime.runPromise(displayError("Error works!"));
  console.log("\n✅ All examples working!");
  await EffectCLIRuntime.dispose();
};

test().catch(console.error);
