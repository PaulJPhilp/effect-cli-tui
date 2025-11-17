/**
 * Prompt Builder - Interactive LLM Prompt Engineering CLI
 *
 * A comprehensive example demonstrating:
 * - Template-based prompt generation system
 * - Interactive TUIHandler for guided workflows
 * - Display utilities (panels, boxes, tables) for rich output
 * - Effect.Service pattern with dependency injection
 * - Effect Schema validation
 * - Error handling with catchTag
 * - Clipboard integration for result copying
 * - Edit/regenerate workflow for iterative refinement
 *
 * Features:
 * 1. Welcome screen with application overview
 * 2. Template selection (Zero-shot, One-shot, Instruction-first, Contract-first, Chain-of-thought)
 * 3. Guided interview to collect template parameters
 * 4. Generated prompt display in formatted panel
 * 5. Review table summarizing user responses
 * 6. Accept (copy to clipboard) or Edit (refine answers) workflow
 * 7. Error handling for cancellations and failures
 *
 * Usage:
 * ```bash
 * bun run examples/prompt-builder.ts
 * ```
 */

import { Effect } from "effect";
import {
  Confirm,
  display,
  displayError,
  displayPanel,
  displaySuccess,
  displayTable,
  EffectCLI,
  Input,
  renderInkWithResult,
  Select,
} from "../src/index.js";
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
    yield* displayPanel(
      [
        "Interactive CLI tool for crafting effective LLM prompts",
        "",
        "Choose from 5 proven prompting strategies:",
        "  • Zero-shot: Direct instruction",
        "  • One-shot: With example",
        "  • Instruction-first: Goal & constraints",
        "  • Contract-first: Input/output specs",
        "  • Chain-of-thought: Step-by-step reasoning",
        "",
        "Build, review, and copy your prompts to clipboard!",
      ].join("\n"),
      "Welcome to Prompt Builder",
      { type: "info" }
    );
  });

/**
 * Interactive template selection using Ink Select component
 */
const selectTemplate = (): Effect.Effect<PromptTemplate> =>
  Effect.gen(function* () {
    const templateNames = templates.map((t) => t.name);
    const selectedName = yield* renderInkWithResult<string>((onComplete) => (
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
  });

/**
 * Interactively collect user responses for template fields
 * Supports text, choice, and boolean field types with validation
 */
const collectResponses = (
  template: PromptTemplate
): Effect.Effect<UserResponses> =>
  Effect.gen(function* () {
    const responses: UserResponses = {};

    for (const field of template.fields) {
      const prefix = field.required ? "[Required]" : "[Optional]";

      let value: string | boolean;

      if (field.type === "choice" && field.choices) {
        // Choice field using Select component
        value = yield* renderInkWithResult<string>((onComplete) => (
          <Select
            choices={field.choices}
            message={`${prefix} ${field.label}`}
            onSubmit={onComplete}
          />
        ));
      } else if (field.type === "boolean") {
        // Boolean field using Confirm component
        value = yield* renderInkWithResult<boolean>((onComplete) => (
          <Confirm
            message={`${prefix} ${field.label}?`}
            onSubmit={onComplete}
          />
        ));
      } else {
        // Text or multiline field using Input component
        value = yield* renderInkWithResult<string>((onComplete) => (
          <Input
            message={`${prefix} ${field.label}`}
            onSubmit={onComplete}
            placeholder={field.placeholder || ""}
            validate={createInputValidator(field)}
          />
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
 * - renderInkWithResult() for interactive components
 * - Effect composition with Ink components
 * - Schema validation
 * - Display utilities
 */
const promptBuilderApp = (): Effect.Effect<void> =>
  Effect.gen(function* () {
    yield* showWelcome();

    const template = yield* selectTemplate();

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

    // Attempt clipboard copy
    yield* copyPromptToClipboard(promptText);
    yield* displaySuccess("Ready to use! Prompt copied to clipboard.");
  });

/**
 * Run the application with EffectCLI service provided for clipboard access
 */
const main = promptBuilderApp().pipe(Effect.provide(EffectCLI.Default));

/**
 * Execute the effect
 */
export default Effect.runPromise(main).catch((err) => {
  console.error("Application error:", err);
  process.exit(1);
});
