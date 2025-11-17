/**
 * Validation utilities for prompt-builder example
 *
 * Provides input validation using Effect Schema for template fields
 * Ensures user responses meet field requirements before prompt generation
 */

import { Effect } from 'effect'
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
  value: unknown,
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
          return yield* Effect.fail(`${field.label} must be one of: ${field.choices.join(', ')}`)
        }
      }
    }

    if (field.type === 'boolean' && typeof value !== 'boolean') {
      return yield* Effect.fail(`${field.label} must be answered with yes (y) or no (n)`)
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
  responses: UserResponses,
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
  fieldDef: TemplateField,
): ((input: string) => boolean | string) => {
  return (input: string) => {
    // Required check
    if (fieldDef.required && input.trim().length === 0) {
      return `${fieldDef.label} is required`
    }

    // Choice validation
    if (fieldDef.type === 'choice' && fieldDef.choices) {
      if (!fieldDef.choices.includes(input)) {
        return `Please select one of the available options: ${fieldDef.choices.join(', ')}`
      }
    }

    // Text length validation (reasonable limits)
    if (input.length > 5000) {
      return 'Your input is too long. Please keep it under 5000 characters.'
    }

    return true
  }
}

/**
 * Validate a generated prompt text
 *
 * Checks:
 * - Non-empty string
 * - Reasonable length (max 10000 characters)
 *
 * @param promptText - The text to validate
 * @returns Effect with validated text or error
 */
export const validateGeneratedPrompt = (promptText: string): Effect.Effect<string, Error> =>
  Effect.gen(function* () {
    if (!promptText || promptText.length === 0) {
      return yield* Effect.fail(
        new Error(
          'Unable to generate prompt: The generated prompt is empty. Please check your template and responses.',
        ),
      )
    }

    if (promptText.length > 10000) {
      return yield* Effect.fail(
        new Error(
          'Unable to generate prompt: The generated prompt is too long (maximum 10,000 characters). Please simplify your inputs.',
        ),
      )
    }

    return promptText
  })
