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

import { Effect } from 'effect'
import {
  display,
  displaySuccess,
  displayError,
  displayPanel,
  displayTable,
  EffectCLI
} from '../src/index.js'
import {
  templates,
  getTemplate
} from './prompt-builder/templates.js'
import { PromptTemplate, UserResponses, BuiltPrompt, AppState } from './prompt-builder/types.js'
import { copyToClipboard } from './prompt-builder/clipboard.js'
import {
  validateField,
  validateResponses,
  validateGeneratedPrompt,
  createInputValidator
} from './prompt-builder/validation.js'

/**
 * Display welcome screen with application overview
 */
const showWelcome = (): Effect.Effect<void> =>
  Effect.gen(function* () {
    yield* display('')
    yield* displayPanel(
      'Welcome to Prompt Builder',
      [
        'Interactive CLI tool for crafting effective LLM prompts',
        '',
        'Choose from 5 proven prompting strategies:',
        '  • Zero-shot: Direct instruction',
        '  • One-shot: With example',
        '  • Instruction-first: Goal & constraints',
        '  • Contract-first: Input/output specs',
        '  • Chain-of-thought: Step-by-step reasoning',
        '',
        'Build, review, and copy your prompts to clipboard!'
      ],
      'info'
    )
    yield* display('')
  })

/**
 * Template selection screen with brief descriptions
 * Lists all available templates for user selection
 */
const selectTemplate = (): Effect.Effect<PromptTemplate> =>
  Effect.gen(function* () {
    yield* display('')
    yield* display('Available Prompt Engineering Strategies:', { type: 'info' })
    yield* display('')

    for (let i = 0; i < templates.length; i++) {
      const t = templates[i]
      yield* display(`${i + 1}. ${t.name}`)
      yield* display(`   ${t.description}`)
      yield* display('')
    }

    // For demo purposes, select the first template (zero-shot)
    const selectedTemplate = templates[0]

    yield* displaySuccess(`Using Template: ${selectedTemplate.name}`)
    yield* display(selectedTemplate.description)
    return selectedTemplate
  })

/**
 * Collect user responses for template fields with default values
 * Demonstrates validation with Effect Schema
 *
 * Note: Currently uses demo/default responses because interactive prompts
 * (prompt, selectOption, multiSelect, confirm) are not yet implemented in TUIHandler.
 * Once Ink integration is complete, this will be replaced with actual interactive prompts.
 */
const collectResponses = (
  template: PromptTemplate
): Effect.Effect<UserResponses> =>
  Effect.gen(function* () {
    const responses: UserResponses = {}

    yield* display('')
    yield* display(`Collecting responses for ${template.name} prompt:`, {
      type: 'info'
    })
    yield* display('')

    // Demo responses - in a real implementation, these would be collected interactively
    const demoResponses: Record<string, string> = {
      task: 'Summarize the key points of a technical article in 3-5 bullet points',
      format: 'Bullet points',
      style: 'Professional',
      exampleInput: 'Artificial intelligence is transforming how we work...',
      exampleOutput: 'AI improves productivity',
      goal: 'Translate English to Spanish accurately',
      constraints: 'Preserve cultural context and idioms',
      description: 'Extract named entities from text',
      inputSpec: 'Plain text strings containing entities',
      outputSpec: 'JSON with entities array [{type, value}]',
      problem: 'Design a data validation system',
      steps: '1. Analyze requirements 2. Design schema 3. Implement'
    }

    for (const field of template.fields) {
      const value = demoResponses[field.name] || field.placeholder || ''

      yield* display(`• ${field.label}`)
      yield* display(`  → ${value}`)

      // Validate the field
      yield* validateField(field, value).pipe(
        Effect.flatMap(() => Effect.succeed(undefined)),
        Effect.catchAll((err) =>
          Effect.gen(function* () {
            yield* displayError(`Validation error on ${field.label}: ${err}`)
            return yield* Effect.fail(new Error(err))
          })
        )
      )

      responses[field.name] = value
    }

    yield* display('')

    // Validate all responses together
    yield* validateResponses(template.fields, responses).pipe(
      Effect.flatMap(() => Effect.succeed(undefined)),
      Effect.catchAll((err) =>
        Effect.gen(function* () {
          yield* displayError(`Failed to validate responses: ${err}`)
          return yield* Effect.fail(new Error(err))
        })
      )
    )

    yield* displaySuccess('All responses validated successfully!')
    return responses
  })

/**
 * Display the generated prompt in a formatted panel
 */
const displayGeneratedPrompt = (builtPrompt: BuiltPrompt): Effect.Effect<void> =>
  Effect.gen(function* () {
    yield* display('')
    yield* displayPanel(
      `Generated ${builtPrompt.template.name} Prompt`,
      [builtPrompt.promptText],
      'success'
    )
    yield* display('')
  })

/**
 * Display review table showing template fields and user responses
 */
const displayReview = (builtPrompt: BuiltPrompt): Effect.Effect<void> =>
  Effect.gen(function* () {
    const reviewData = builtPrompt.template.fields
      .filter((f) => builtPrompt.responses[f.name] !== undefined)
      .map((f) => ({
        field: f.label,
        value: String(builtPrompt.responses[f.name]).substring(0, 50)
      }))

    if (reviewData.length > 0) {
      yield* display('Your Responses:', { type: 'info' })
      yield* displayTable(reviewData, {
        columns: [
          { key: 'field', header: 'Field', width: 20 },
          { key: 'value', header: 'Value', width: 50 }
        ]
      })
      yield* display('')
    }
  })

/**
 * Try to copy the prompt to system clipboard
 * Gracefully handles unavailable clipboard commands
 */
const copyPromptToClipboard = (promptText: string): Effect.Effect<void> =>
  Effect.gen(function* () {
    yield* copyToClipboard(promptText).pipe(
      Effect.catchAll((_err) =>
        Effect.gen(function* () {
          yield* displayError(
            `Clipboard unavailable: ${_err.message}`
          )
          yield* display('You can still manually copy the prompt text above.', {
            type: 'info'
          })
          return undefined
        })
      )
    )
  })

/**
 * Main application workflow orchestrating the complete prompt-builder experience
 *
 * Flow:
 * 1. Show welcome screen
 * 2. Select template from available options
 * 3. Collect user responses from template fields
 * 4. Generate prompt using template
 * 5. Validate generated prompt
 * 6. Display prompt in formatted panel
 * 7. Show review table of responses
 * 8. Attempt to copy to clipboard
 *
 * Note: This demo version uses pre-filled responses because interactive
 * prompts (prompt, selectOption, multiSelect, confirm) are not yet implemented
 * in TUIHandler. Once Ink integration is complete, full interactivity will
 * be restored.
 */
const promptBuilderApp = (): Effect.Effect<void> =>
  Effect.gen(function* () {
    yield* showWelcome()

    const template = yield* selectTemplate()

    const responses = yield* collectResponses(template)

    const promptText = template.generatePrompt(responses)

    // Validate generated prompt
    yield* validateGeneratedPrompt(promptText).pipe(
      Effect.flatMap(() => Effect.succeed(undefined)),
      Effect.catchAll((err) =>
        Effect.gen(function* () {
          yield* displayError(`Failed to generate prompt: ${err.message}`)
          return yield* Effect.fail(err)
        })
      )
    )

    const builtPrompt: BuiltPrompt = {
      template,
      responses,
      promptText
    }

    yield* displayGeneratedPrompt(builtPrompt)
    yield* displayReview(builtPrompt)

    // Attempt clipboard copy
    yield* copyPromptToClipboard(promptText)
    yield* displaySuccess('Ready to use!')

    yield* display('')
    yield* display('Thank you for using Prompt Builder!', { type: 'success' })
  })

/**
 * Run the application with EffectCLI service provided for clipboard access
 */
const main = promptBuilderApp().pipe(
  Effect.provide(EffectCLI.Default)
)

/**
 * Execute the effect
 */
export default Effect.runPromise(main).catch((err) => {
  console.error('Application error:', err)
  process.exit(1)
})
