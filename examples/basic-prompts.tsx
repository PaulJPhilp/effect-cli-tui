/**
 * Basic prompts example
 *
 * Demonstrates how to use Input, Select, Confirm, and Password components
 * with the renderInkWithResult Effect wrapper.
 *
 * Run with: bun run examples/basic-prompts.tsx
 */

import * as Effect from "effect/Effect";
import { Confirm, Input, Password, Select } from "../src/components";
import { renderInkWithResult } from "../src/effects/ink-wrapper";

/**
 * Example workflow: Collect user information
 */
const userWorkflow = Effect.gen(function* () {
  console.log("\n📝 User Registration\n");

  // Prompt for name
  const name = yield* renderInkWithResult<string>((onComplete) => (
    <Input
      message="What is your name?"
      onSubmit={onComplete}
      validate={(v) => (v.length > 0 ? true : "Name is required")}
    />
  ));
  console.log(`\n✓ Hello, ${name}!\n`);

  // Select a role
  const role = yield* renderInkWithResult<string>((onComplete) => (
    <Select
      choices={["Admin", "User", "Guest"]}
      message="Choose your role:"
      onSubmit={onComplete}
    />
  ));
  console.log(`✓ Role selected: ${role}\n`);

  // Confirm action
  const confirmed = yield* renderInkWithResult<boolean>((onComplete) => (
    <Confirm
      default={true}
      message="Create account with these details?"
      onSubmit={onComplete}
    />
  ));

  if (!confirmed) {
    console.log("\n✗ Account creation cancelled.\n");
    return;
  }

  // Password prompt
  const password = yield* renderInkWithResult<string>((onComplete) => (
    <Password
      message="Enter a password:"
      onSubmit={onComplete}
      validate={(v) => (v.length >= 8 ? true : "Password must be 8+ chars")}
    />
  ));

  console.log("\n✓ Account created successfully!");
  console.log(`  Name: ${name}`);
  console.log(`  Role: ${role}`);
  console.log(`  Password: ${"*".repeat(password.length)}\n`);
});

/**
 * Run the workflow
 */
export const main = () => Effect.runPromise(userWorkflow);

// Run if executed directly
if (import.meta.main) {
  main().catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
}
