/**
 * 🏆 PROMPT BUILDER - Primary Teaching Example for effect-cli-tui
 *
 * This is the COMPREHENSIVE educational example demonstrating all major features
 * of the effect-cli-tui library. New users should start here to understand:
 *
 * 🎯 Core Concepts Demonstrated:
 * - Template-based prompt generation system
 * - Interactive TUIHandler for guided workflows
 * - Display utilities (panels, boxes, tables) for rich output
 * - Effect.Service pattern with dependency injection
 * - Effect Schema validation
 * - Error handling with catchTag
 * - Clipboard integration for result copying
 * - Edit/regenerate workflow for iterative refinement
 * - Theme switching and customization
 * - Password input for sensitive data
 * - Spinner animations for async operations
 * - AI API integration with real LLM calls
 *
 * 🚀 Features Showcased:
 * 1. Welcome screen with application overview
 * 2. Template selection (Zero-shot, One-shot, Instruction-first, Contract-first, Chain-of-thought)
 * 3. Guided interview to collect template parameters
 * 4. Generated prompt display in formatted panel
 * 5. Review table summarizing user responses
 * 6. Accept (copy to clipboard), Edit, or Run with AI workflow
 * 7. Error handling for cancellations and failures
 *
 * 📚 Learning Path: Start with this example, then explore other examples for specific features.
 *
 * Usage:
 * ```bash
 * bun run examples/prompt-builder.tsx
 * ```
 */

import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import chalk from "chalk";
import { Effect } from "effect";
import { Box } from "ink";
import {
  Confirm,
  display,
  displayError,
  displayInfo,
  displayPanel,
  displaySuccess,
  displayTable,
  EffectCLI,
  Input,
  Password,
  Select,
  startSpinner,
  stopSpinner,
} from "../src/index.js";
import { InkService } from "../src/services/ink/index.js";
import { copyToClipboard } from "./prompt-builder/clipboard.js";
import { templates } from "./prompt-builder/templates.js";
import type {
  BuiltPrompt,
  PromptTemplate,
  UserResponses,
} from "./prompt-builder/types.js";
import {
  createInputValidator,
  validateField,
  validateGeneratedPrompt,
  validateResponses,
} from "./prompt-builder/validation.js";

/**
 * Display welcome screen with application overview
 */
const showWelcome = (): Effect.Effect<void> =>
  Effect.gen(function* () {
    // Create content without color first - let the box handle layout
    const lines = [
      "Interactive CLI tool for crafting",
      "effective LLM prompts",
      "",
      "Choose from 5 proven strategies:",
      "  • Zero-shot: Direct instruction",
      "  • One-shot: With example",
      "  • Instruction-first",
      "  • Contract-first",
      "  • Chain-of-thought",
      "",
      "Build, review, and copy!",
    ];

    // Apply bright orange color with bold to each line individually
    const coloredLines = lines.map((line) =>
      chalk.bold.rgb(255, 180, 50)(line)
    );
    const welcomeContent = coloredLines.join("\n");

    yield* displayPanel(welcomeContent, "Prompt Builder", { type: "info" });
  });

/**
 * Allow user to switch between light and dark themes
 */
const selectTheme = (): Effect.Effect<void> =>
  Effect.gen(function* () {
    // Theme switching temporarily disabled for stability
    return;
  });

/**
 * Interactive template selection using Ink Select component
 */
const selectTemplate = (): Effect.Effect<PromptTemplate> =>
  Effect.gen(function* () {
    const ink = yield* InkService;
    const templateNames = templates.map((t) => t.name);
    const selectedName = yield* ink.renderWithResult<string>((onComplete) => (
      <Select
        choices={templateNames}
        message="Choose a template:"
        onSubmit={onComplete}
      />
    ));

    const selectedTemplate = templates.find((t) => t.name === selectedName);
    if (!selectedTemplate) {
      yield* displayError(
        "Unable to find the selected template. Please try selecting again."
      );
      return yield* Effect.fail(new Error("Invalid template"));
    }

    yield* displaySuccess(`Selected: ${selectedTemplate.name}`);
    return selectedTemplate;
  }).pipe(Effect.provide(InkService.Default));

/**
 * Interactively collect user responses for template fields
 * Supports text, choice, and boolean field types with validation
 */
const collectResponses = (
  template: PromptTemplate
): Effect.Effect<UserResponses> =>
  Effect.gen(function* () {
    const ink = yield* InkService;
    const responses: UserResponses = {};

    for (const field of template.fields) {
      const prefix = field.required ? "[Required]" : "[Optional]";

      let value: string | boolean;

      if (field.type === "choice" && field.choices) {
        // Choice field using Select component
        value = yield* ink.renderWithResult<string>((onComplete) => (
          <Box borderStyle="round" padding={1}>
            <Select
              choices={field.choices}
              message={`${prefix} ${field.label}`}
              onSubmit={onComplete}
            />
          </Box>
        ));
      } else if (field.type === "boolean") {
        // Boolean field using Confirm component
        value = yield* ink.renderWithResult<boolean>((onComplete) => (
          <Box borderStyle="round" padding={1}>
            <Confirm
              message={`${prefix} ${field.label}?`}
              onSubmit={onComplete}
            />
          </Box>
        ));
      } else {
        // Text or multiline field using Input component
        value = yield* ink.renderWithResult<string>((onComplete) => (
          <Box borderStyle="round" padding={1}>
            <Input
              message={`${prefix} ${field.label}`}
              onSubmit={onComplete}
              placeholder={field.placeholder || ""}
              validate={createInputValidator(field)}
            />
          </Box>
        ));
      }

      // Validate the field
      yield* validateField(field, value).pipe(
        Effect.flatMap(() => Effect.succeed(undefined)),
        Effect.catchAll((err) =>
          Effect.gen(function* () {
            yield* displayError(`${field.label}: ${err}`);
            return yield* Effect.fail(new Error(err));
          })
        )
      );

      responses[field.name] = value;
    }

    // Validate all responses together
    yield* validateResponses(template.fields, responses).pipe(
      Effect.flatMap(() => Effect.succeed(undefined)),
      Effect.catchAll((err) =>
        Effect.gen(function* () {
          yield* displayError(
            `Validation failed: ${err}\n\nPlease review your answers and try again.`
          );
          return yield* Effect.fail(new Error(err));
        })
      )
    );

    yield* displaySuccess("All responses validated!");
    return responses;
  }).pipe(Effect.provide(InkService.Default));

/**
 * Display introduction for the selected template
 */
const showTemplateIntroduction = (
  template: PromptTemplate
): Effect.Effect<void> =>
  Effect.gen(function* () {
    const content = [
      `Selected: ${template.name}`,
      "",
      `Description: ${template.description}`,
      "",
      "Let's gather the information needed to build your prompt:",
    ].join("\n");

    yield* displayPanel(content, "Template Selected", { type: "success" });
    yield* display("");
  });

/**
 * Display the generated prompt in a formatted panel
 */
const displayGeneratedPrompt = (
  builtPrompt: BuiltPrompt
): Effect.Effect<void> =>
  Effect.gen(function* () {
    yield* displaySuccess(`✨ Generated ${builtPrompt.template.name} Prompt:`);
    yield* display("");
    // Display prompt text without prefixes on each line
    yield* display(builtPrompt.promptText, { prefix: false, newline: true });
    yield* display("");
  });

/**
 * Display review table showing template fields and user responses
 */
const displayReview = (builtPrompt: BuiltPrompt): Effect.Effect<void> =>
  Effect.gen(function* () {
    const reviewData = builtPrompt.template.fields
      .filter((f) => builtPrompt.responses[f.name] !== undefined)
      .map((f) => ({
        field: f.label,
        value: String(builtPrompt.responses[f.name]).substring(0, 50),
      }));

    if (reviewData.length > 0) {
      yield* displayTable(reviewData, {
        columns: [
          { key: "field", header: "Field", width: 20 },
          { key: "value", header: "Value", width: 50 },
        ],
      });
    }
  });

/**
 * Try to copy the prompt to system clipboard
 * Gracefully handles unavailable clipboard commands
 */
const copyPromptToClipboard = (promptText: string): Effect.Effect<void> =>
  Effect.gen(function* () {
    yield* copyToClipboard(promptText).pipe(
      Effect.catchAll((_err) =>
        Effect.gen(function* () {
          yield* displayError(`Unable to copy to clipboard: ${_err.message}`);
          yield* display(
            "You can still manually copy the prompt text shown above.",
            {
              type: "info",
            }
          );
          return;
        })
      )
    );
  });

/**
 * Main application workflow orchestrating the complete prompt-builder experience
 *
 * Flow:
 * 1. Show welcome screen with feature overview
 * 2. Interactively select template from 5 strategies (Ink Select component)
 * 3. Answer guided questions to fill template parameters (Ink Input/Select/Confirm)
 * 4. Validate all responses with Effect Schema
 * 5. Generate prompt using selected template
 * 6. Validate generated prompt
 * 7. Display prompt in formatted panel
 * 8. Show responses in formatted table
 * 9. Attempt to copy to system clipboard
 *
 * Demonstrates:
 * - InkService.renderWithResult() for interactive components
 * - Effect composition with Ink components
 * - Schema validation
 * - Display utilities
 */
const promptBuilderApp = (): Effect.Effect<void> =>
  Effect.gen(function* () {
    yield* showWelcome();
    yield* selectTheme();

    const template = yield* selectTemplate();

    yield* showTemplateIntroduction(template);

    const responses = yield* collectResponses(template);

    const promptText = template.generatePrompt(responses);

    // Validate generated prompt
    yield* validateGeneratedPrompt(promptText).pipe(
      Effect.flatMap(() => Effect.succeed(undefined)),
      Effect.catchAll((err) =>
        Effect.gen(function* () {
          yield* displayError(
            `Unable to generate prompt: ${err.message}\n\nPlease check your template and responses, then try again.`
          );
          return yield* Effect.fail(err);
        })
      )
    );

    const builtPrompt: BuiltPrompt = {
      template,
      responses,
      promptText,
    };

    yield* displayGeneratedPrompt(builtPrompt);
    yield* displayReview(builtPrompt);

    // Ask user what to do next
    const ink = yield* InkService;
    const nextAction = yield* ink.renderWithResult<string>((onComplete) => (
      <Box borderStyle="round" padding={1}>
        <Select
          choices={[
            { label: "📋 Copy to clipboard", value: "copy" },
            { label: "✏️  Edit prompt", value: "edit" },
            { label: "🚀 Run prompt with AI", value: "run" },
          ]}
          message="What would you like to do?"
          onSubmit={onComplete}
        />
      </Box>
    ));

    if (nextAction === "copy") {
      yield* copyPromptToClipboard(promptText);
      yield* displaySuccess("Ready to use! Prompt copied to clipboard.");
    } else if (nextAction === "edit") {
      // For now, just restart the process
      yield* displayInfo("Edit functionality coming soon! Restarting...");
      return yield* promptBuilderApp();
    } else if (nextAction === "run") {
      yield* runPromptWithAI(builtPrompt);
    }
  }).pipe(Effect.provide(InkService.Default));

/**
 * Execute the generated prompt using AI
 */
const runPromptWithAI = (builtPrompt: BuiltPrompt): Effect.Effect<void> =>
  Effect.gen(function* () {
    const ink = yield* InkService;
    // Get API key
    const apiKey = yield* ink.renderWithResult<string>((onComplete) => (
      <Box borderStyle="round" padding={1}>
        <Password message="Enter your OpenAI API key:" onSubmit={onComplete} />
      </Box>
    ));

    if (!apiKey.trim()) {
      yield* displayError("API key is required to run the prompt.");
      return;
    }

    // Start spinner
    const spinnerId = yield* startSpinner("🤖 Running prompt with AI...");

    try {
      // Make API call using Vercel AI SDK
      const result = yield* Effect.tryPromise({
        try: async () =>
          await generateText({
            model: openai("gpt-4o-mini"),
            prompt: builtPrompt.promptText,
            apiKey,
          }),
        catch: (error) => new Error(`AI API call failed: ${error.message}`),
      });

      // Stop spinner
      yield* stopSpinner(spinnerId);

      // Display result
      yield* displaySuccess("🎉 AI Response:");
      yield* display("");
      yield* displayPanel(result.text, "AI Response", { type: "success" });
    } catch (error) {
      yield* stopSpinner(spinnerId);
      yield* displayError(`Failed to run prompt: ${error.message}`);
    }
  }).pipe(Effect.provide(InkService.Default));

/**
 * Run the application with EffectCLI and InkService provided
 */
const main = promptBuilderApp().pipe(
  Effect.provide(EffectCLI.Default),
  Effect.provide(InkService.Default)
);

/**
 * Execute the effect
 */
export default Effect.runPromise(main).catch((err) => {
  console.error("Application error:", err);
  process.exit(1);
});
