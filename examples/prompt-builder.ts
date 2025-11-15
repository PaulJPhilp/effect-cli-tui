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

import { Effect, Ref } from 'effect'
import {
  display,
  displaySuccess,
  displayError,
  displayPanel,
  displayBox,
  displayTable,
  TUIHandler,
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
 */
const selectTemplate = (tui: TUIHandler): Effect.Effect<PromptTemplate> =>
  Effect.gen(function* () {
    yield* display('Select a prompt engineering strategy:', { type: 'info' })

    const templateChoices = templates.map((t) => ({
      label: `${t.name}`,
      value: t.id,
      description: t.description
    }))

    const selectedId = yield* tui.selectOption('Choose template:', templateChoices)
    const template = getTemplate(selectedId)

    if (!template) {
      yield* displayError('Template not found')
      return yield* Effect.fail(new Error('Invalid template selection'))
    }

    yield* displaySuccess(`Selected: ${template.name}`)
    return template
  })

/**
 * Collect user responses for template fields through interactive prompts
 * Supports text, multiline, choice, and boolean field types with validation
 */
const collectResponses = (
  tui: TUIHandler,
  template: PromptTemplate
): Effect.Effect<UserResponses> =>
  Effect.gen(function* () {
    const responses: UserResponses = {}

    yield* display('')
    yield* display(`Answer questions to generate your ${template.name} prompt:`, {
      type: 'info'
    })
    yield* display('')

    for (const field of template.fields) {
      const prefix = field.required ? '[Required]' : '[Optional]'

      if (field.type === 'choice' && field.choices) {
        const choice = yield* tui.selectOption(
          `${prefix} ${field.label}`,
          field.choices.map((c) => ({
            label: c,
            value: c,
            description: ''
          }))
        )

        // Validate choice
        yield* validateField(field, choice).pipe(
          Effect.catchAll((err) => {
            yield* displayError(`Validation error: ${err}`)
            return Effect.fail(new Error(err))
          })
        )

        responses[field.name] = choice
      } else if (field.type === 'boolean') {
        const confirmed = yield* tui.confirm(`${prefix} ${field.label}?`)
        responses[field.name] = confirmed
      } else {
        // text and multiline types
        const input = yield* tui.prompt(`${prefix} ${field.label}:`, {
          default: field.placeholder || '',
          validate: createInputValidator(field)
        })

        // Additional validation
        yield* validateField(field, input).pipe(
          Effect.catchAll((err) => {
            yield* displayError(`Validation error: ${err}`)
            return Effect.fail(new Error(err))
          })
        )

        responses[field.name] = input
      }
    }

    // Validate all responses together
    yield* validateResponses(template.fields, responses).pipe(
      Effect.catchAll((err) => {
        yield* displayError(`Failed to validate responses: ${err}`)
        return Effect.fail(new Error(err))
      })
    )

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
      .map((f) => [
        f.label,
        String(builtPrompt.responses[f.name]).substring(0, 50)
      ])

    if (reviewData.length > 0) {
      yield* display('Your Responses:', { type: 'info' })
      yield* displayTable(
        [['Field', 'Value'], ...reviewData],
        { style: 'compact' }
      )
      yield* display('')
    }
  })

/**
 * Accept/Edit loop for prompt refinement
 * User can either accept (copy to clipboard) or edit answers and regenerate
 */
const acceptOrEdit = (
  tui: TUIHandler,
  builtPrompt: Ref.Ref<BuiltPrompt>
): Effect.Effect<BuiltPrompt> =>
  Effect.gen(function* () {
    const action = yield* tui.selectOption(
      'What would you like to do?',
      [
        {
          label: 'Accept & Copy to Clipboard',
          value: 'accept',
          description: 'Copy the prompt to clipboard'
        },
        {
          label: 'Edit Answers',
          value: 'edit',
          description: 'Modify your responses and regenerate'
        },
        {
          label: 'Exit',
          value: 'exit',
          description: 'Cancel without saving'
        }
      ]
    )

    if (action === 'exit') {
      yield* display('Cancelled.', { type: 'info' })
      return yield* Effect.fail(new Error('User cancelled'))
    }

    if (action === 'accept') {
      const current = yield* Ref.get(builtPrompt)
      yield* copyToClipboard(current.promptText).pipe(
        Effect.catchAll((err) => {
          yield* displayError(`Failed to copy to clipboard: ${err.message}`)
          yield* display('You can still manually copy the prompt text above.', {
            type: 'info'
          })
          return Effect.succeed(undefined)
        })
      )
      yield* displaySuccess('Prompt copied to clipboard!')
      return current
    }

    // Edit workflow
    const current = yield* Ref.get(builtPrompt)
    const tui2 = yield* TUIHandler

    yield* display('')
    yield* display('Select fields to edit:', { type: 'info' })

    const editChoices = current.template.fields.map((f) => ({
      label: f.label,
      value: f.name,
      description: `Current: ${String(current.responses[f.name]).substring(0, 30)}`
    }))

    const fieldToEdit = yield* tui2.selectOption(
      'Which field to edit?',
      editChoices
    )

    const fieldDef = current.template.fields.find((f) => f.name === fieldToEdit)
    if (!fieldDef) {
      yield* displayError('Field not found')
      return yield* Effect.fail(new Error('Invalid field'))
    }

    let updatedValue: string | boolean = ''
    if (fieldDef.type === 'choice' && fieldDef.choices) {
      updatedValue = yield* tui2.selectOption(
        `Update ${fieldDef.label}:`,
        fieldDef.choices.map((c) => ({
          label: c,
          value: c,
          description: ''
        }))
      )
    } else if (fieldDef.type === 'boolean') {
      updatedValue = yield* tui2.confirm(`${fieldDef.label}?`)
    } else {
      updatedValue = yield* tui2.prompt(
        `Update ${fieldDef.label}:`,
        {
          default: String(current.responses[fieldToEdit])
        }
      )
    }

    const updatedResponses = {
      ...current.responses,
      [fieldToEdit]: updatedValue
    }

    const regeneratedPrompt = current.template.generatePrompt(updatedResponses)
    const updatedBuiltPrompt: BuiltPrompt = {
      template: current.template,
      responses: updatedResponses,
      promptText: regeneratedPrompt
    }

    yield* Ref.set(builtPrompt, updatedBuiltPrompt)
    yield* displaySuccess('Answers updated. Regenerated prompt:')
    yield* displayGeneratedPrompt(updatedBuiltPrompt)
    yield* displayReview(updatedBuiltPrompt)

    return yield* acceptOrEdit(tui, builtPrompt)
  })

/**
 * Main application workflow orchestrating the complete prompt-builder experience
 *
 * Flow:
 * 1. Show welcome screen
 * 2. Select template from available options
 * 3. Collect user responses through guided interview
 * 4. Generate prompt using template
 * 5. Display prompt in formatted panel
 * 6. Show review table of responses
 * 7. Allow accept (clipboard) or edit (regenerate) workflow
 * 8. Handle errors gracefully
 */
const promptBuilderApp = (): Effect.Effect<void> =>
  Effect.gen(function* () {
    yield* showWelcome()

    const tui = yield* TUIHandler

    const template = yield* selectTemplate(tui).pipe(
      Effect.catchTag('TUIError', (err) => {
        yield* displayError(`Failed to select template: ${err.message}`)
        return yield* Effect.fail(err)
      })
    )

    const responses = yield* collectResponses(tui, template).pipe(
      Effect.catchTag('TUIError', (err) => {
        yield* displayError(`Interview cancelled: ${err.message}`)
        return yield* Effect.fail(err)
      })
    )

    const promptText = template.generatePrompt(responses)

    // Validate generated prompt
    yield* validateGeneratedPrompt(promptText).pipe(
      Effect.catchAll((err) => {
        yield* displayError(`Failed to generate prompt: ${err.message}`)
        return Effect.fail(err)
      })
    )

    const initialBuiltPrompt: BuiltPrompt = {
      template,
      responses,
      promptText
    }

    yield* displayGeneratedPrompt(initialBuiltPrompt)
    yield* displayReview(initialBuiltPrompt)

    const builtPromptRef = yield* Ref.make(initialBuiltPrompt)

    const _final = yield* acceptOrEdit(tui, builtPromptRef).pipe(
      Effect.catchAll((err) => {
        yield* display('')
        yield* display('Session ended.', { type: 'info' })
        return Effect.succeed(initialBuiltPrompt)
      })
    )

    yield* display('')
    yield* displaySuccess('Thank you for using Prompt Builder!')
  })

/**
 * Run the application with TUIHandler and EffectCLI services provided
 */
const main = promptBuilderApp().pipe(
  Effect.provide(TUIHandler.Default),
  Effect.provide(EffectCLI.Default)
)

/**
 * Execute the effect
 */
export default Effect.runPromise(main).catch((err) => {
  console.error('Application error:', err)
  process.exit(1)
})
