/**
 * Multi-step wizard example
 *
 * Demonstrates building a complex workflow with multiple steps,
 * validation, and conditional flow using Effect composition.
 *
 * Run with: bun run examples/multi-step-wizard.tsx
 */

import * as Effect from "effect/Effect";
import { Confirm, Input, MultiSelect, Select } from "../src/components";
import { renderInkWithResult } from "../src/effects/ink-wrapper";

interface SetupConfig {
  projectName: string;
  language: string;
  features: string[];
  installDeps: boolean;
}

/**
 * Step 1: Collect project name
 */
const step1ProjectName = Effect.gen(function* () {
  return yield* renderInkWithResult<string>((onComplete) => (
    <Input
      defaultValue="my-app"
      message="Project name:"
      onSubmit={onComplete}
      validate={(v) => {
        if (!v.match(/^[a-z0-9-]+$/)) {
          return "Use lowercase letters, numbers, and dashes";
        }
        if (v.length < 3) {
          return "Must be at least 3 characters";
        }
        return true;
      }}
    />
  ));
});

/**
 * Step 2: Choose programming language
 */
const step2Language = Effect.gen(function* () {
  return yield* renderInkWithResult<string>((onComplete) => (
    <Select
      choices={["TypeScript", "JavaScript", "Python", "Go"]}
      message="Choose a language:"
      onSubmit={onComplete}
    />
  ));
});

/**
 * Step 3: Select features
 */
const step3Features = Effect.gen(function* () {
  return yield* renderInkWithResult<string[]>((onComplete) => (
    <MultiSelect
      choices={["ESLint", "Prettier", "Testing", "Docker", "CI/CD"]}
      message="Select features:"
      onSubmit={onComplete}
    />
  ));
});

/**
 * Step 4: Confirm setup
 */
const step4Confirm = (config: Partial<SetupConfig>) =>
  Effect.gen(function* () {
    const confirmed = yield* renderInkWithResult<boolean>((onComplete) => (
      <Confirm
        default={true}
        message={`Create project '${config.projectName}'?`}
        onSubmit={onComplete}
      />
    ));
    return confirmed;
  });

/**
 * Step 5: Install dependencies
 */
const step5InstallDeps = Effect.gen(function* () {
  return yield* renderInkWithResult<boolean>((onComplete) => (
    <Confirm
      default={true}
      message="Install dependencies now?"
      onSubmit={onComplete}
    />
  ));
});

/**
 * Main wizard workflow
 */
const setupWizard = Effect.gen(function* () {
  console.log("\n🚀 Project Setup Wizard\n");

  // Step 1
  const projectName = yield* step1ProjectName;
  console.log(`✓ Project name: ${projectName}\n`);

  // Step 2
  const language = yield* step2Language;
  console.log(`✓ Language: ${language}\n`);

  // Step 3
  const features = yield* step3Features;
  console.log(`✓ Features: ${features.join(", ")}\n`);

  // Step 4: Confirm
  const confirmed = yield* step4Confirm({ projectName, language, features });

  if (!confirmed) {
    console.log("\n✗ Setup cancelled.\n");
    return;
  }

  // Step 5: Install deps
  const installDeps = yield* step5InstallDeps;

  // Final summary
  const config: SetupConfig = {
    projectName,
    language,
    features,
    installDeps,
  };

  console.log("\n📋 Configuration Summary:");
  console.log(`  Project: ${config.projectName}`);
  console.log(`  Language: ${config.language}`);
  console.log(`  Features: ${config.features.join(", ")}`);
  console.log(`  Install deps: ${config.installDeps ? "Yes" : "No"}\n`);

  if (config.installDeps) {
    console.log("📦 Installing dependencies...\n");
    // Simulate installation
    yield* Effect.sleep("2 seconds");
  }

  console.log("✓ Setup complete! Happy coding! 🎉\n");
});

/**
 * Run the wizard
 */
export const main = () => Effect.runPromise(setupWizard);

// Run if executed directly
if (import.meta.main) {
  main().catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
}
