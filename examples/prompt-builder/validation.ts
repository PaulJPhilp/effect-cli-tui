/**
 * Validation utilities for prompt-builder example
 *
 * Provides input validation using Effect Schema for template fields
 * Ensures user responses meet field requirements before prompt generation
 */

import { Schema, Effect } from 'effect'
import { TemplateField, UserResponses } from './types.js'

/**
 * Validate a single field value against its field definition
 *
 * Checks:
 * - Required fields are not empty
 * - Text length is reasonable (min 1 char)
 * - Choice values are in allowed list
 * - Boolean values are actual booleans
 *
 * @param field - The template field definition
 * @param value - The user-provided value
 * @returns Effect with validation result
 */
export const validateField = (
  field: TemplateField,
  value: unknown
): Effect.Effect<boolean, string> =>
  Effect.gen(function* () {
    if (field.required && !value) {
      return yield* Effect.fail(`${field.label} is required`)
    }

    if (typeof value === 'string') {
      if (value.length === 0 && field.required) {
        return yield* Effect.fail(`${field.label} cannot be empty`)
      }

      if (field.type === 'choice' && field.choices) {
        if (!field.choices.includes(value)) {
          return yield* Effect.fail(
            `${field.label} must be one of: ${field.choices.join(', ')}`
          )
        }
      }
    }

    if (field.type === 'boolean' && typeof value !== 'boolean') {
      return yield* Effect.fail(`${field.label} must be a yes/no value`)
    }

    return true
  })

/**
 * Validate all user responses against template fields
 *
 * @param fields - Template field definitions
 * @param responses - User responses to validate
 * @returns Effect with validation result or error message
 */
export const validateResponses = (
  fields: TemplateField[],
  responses: UserResponses
): Effect.Effect<UserResponses, string> =>
  Effect.gen(function* () {
    for (const field of fields) {
      const value = responses[field.name]
      yield* validateField(field, value)
    }

    return responses
  })

/**
 * Create a validation function for prompt inputs
 *
 * Used with TUIHandler.prompt() to validate user input in real-time
 *
 * @param fieldDef - The template field definition
 * @returns Function that validates input string
 *
 * @example
 * ```ts
 * const field = TemplateField.make({
 *   name: 'task',
 *   label: 'Task',
 *   type: 'multiline',
 *   required: true
 * })
 * const validator = createInputValidator(field)
 * const input = yield* tui.prompt('Enter task:', { validate: validator })
 * ```
 */
export const createInputValidator = (
  fieldDef: TemplateField
): ((input: string) => boolean | string) => {
  return (input: string) => {
    // Required check
    if (fieldDef.required && input.trim().length === 0) {
      return `${fieldDef.label} is required`
    }

    // Choice validation
    if (fieldDef.type === 'choice' && fieldDef.choices) {
      if (!fieldDef.choices.includes(input)) {
        return `Must be one of: ${fieldDef.choices.join(', ')}`
      }
    }

    // Text length validation (reasonable limits)
    if (input.length > 5000) {
      return 'Input too long (max 5000 characters)'
    }

    return true
  }
}

/**
 * Schema for validating the entire prompt generation result
 * Ensures the generated prompt is non-empty and reasonable length
 */
export const GeneratedPromptSchema = Schema.String.pipe(
  Schema.minLength(1, { message: 'Generated prompt cannot be empty' }),
  Schema.maxLength(10000, {
    message: 'Generated prompt too long (max 10000 characters)'
  })
)

/**
 * Validate a generated prompt text
 *
 * @param promptText - The text to validate
 * @returns Effect with validated text or error
 */
export const validateGeneratedPrompt = (
  promptText: string
): Effect.Effect<string, Error> =>
  Schema.parse(GeneratedPromptSchema)(promptText).pipe(
    Effect.mapError((err) => new Error(`Invalid prompt: ${err.message}`))
  )
