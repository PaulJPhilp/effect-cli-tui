/**
 * Tests for prompt-builder example application workflows
 *
 * Tests the complete workflow including:
 * - Welcome screen display
 * - Template selection
 * - Response collection and validation
 * - Prompt generation
 * - Display utilities
 * - Error handling
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import { displayPanel, displaySuccess, displayError, displayLines, displayTable } from '../../src/index'
import { zeroShotTemplate, templates, getTemplate } from '../../examples/prompt-builder/templates'
import {
  validateField,
  validateResponses,
  validateGeneratedPrompt,
  createInputValidator
} from '../../examples/prompt-builder/validation'
import { TemplateField, UserResponses, BuiltPrompt } from '../../examples/prompt-builder/types'
import { MockCLI } from '../fixtures/test-layers'

// Mock renderInkWithResult to avoid actual Ink rendering in tests
vi.mock('../../src/effects/ink-wrapper', () => ({
  renderInkWithResult: vi.fn((componentFn: (onComplete: (value: any) => void) => any) => {
    // Extract the component and call onComplete with a mock value
    // This is a simplified mock - in real tests you'd want more control
    return Effect.succeed('mock-value')
  })
}))

describe('Prompt Builder Example - Workflow Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Welcome Screen', () => {
    it('should display welcome panel with application overview', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const welcomeContent = [
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
      ].join('\n')

      await Effect.runPromise(
        displayPanel(welcomeContent, 'Welcome to Prompt Builder', { type: 'info' })
      )

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('Template System', () => {
    it('should have all 5 templates available', () => {
      expect(templates).toHaveLength(5)
      expect(templates.map(t => t.name)).toContain('Zero-Shot')
      expect(templates.map(t => t.name)).toContain('One-Shot')
      expect(templates.map(t => t.name)).toContain('Instruction-First')
      expect(templates.map(t => t.name)).toContain('Contract-First')
      expect(templates.map(t => t.name)).toContain('Chain-of-Thought')
    })

    it('should get template by ID', () => {
      const template = getTemplate('zero-shot')
      expect(template).toBeDefined()
      expect(template?.name).toBe('Zero-Shot')
    })

    it('should return undefined for invalid template ID', () => {
      const template = getTemplate('invalid-id')
      expect(template).toBeUndefined()
    })

    it('should generate prompt from zero-shot template', () => {
      const responses: UserResponses = {
        task: 'Summarize the text',
        format: 'Bullet points',
        style: 'Professional'
      }

      const prompt = zeroShotTemplate.generatePrompt(responses)
      expect(prompt).toContain('Summarize the text')
      expect(prompt).toContain('Bullet points')
      expect(prompt).toContain('Professional')
    })
  })

  describe('Validation', () => {
    describe('validateField', () => {
      it('should validate required field', async () => {
        const field: TemplateField = {
          name: 'task',
          label: 'Task',
          description: 'What to do',
          type: 'text',
          required: true
        }

        const result = await Effect.runPromise(
          validateField(field, 'test value').pipe(
            Effect.catchAll((err) => Effect.succeed(err))
          )
        )

        expect(result).toBe(true)
      })

      it('should fail validation for empty required field', async () => {
        const field: TemplateField = {
          name: 'task',
          label: 'Task',
          description: 'What to do',
          type: 'text',
          required: true
        }

        const result = await Effect.runPromise(
          validateField(field, '').pipe(
            Effect.catchAll((err) => Effect.succeed(err))
          )
        )

        // Empty string is caught by the !value check first
        expect(result).toBe('Task is required')
      })

      it('should pass validation for whitespace-only field (validateField does not trim)', async () => {
        const field: TemplateField = {
          name: 'task',
          label: 'Task',
          description: 'What to do',
          type: 'text',
          required: true
        }

        // Note: validateField does not trim, so whitespace passes
        // createInputValidator does trim and would catch this
        const result = await Effect.runPromise(
          validateField(field, '   ').pipe(
            Effect.catchAll((err) => Effect.succeed(err))
          )
        )

        expect(result).toBe(true) // Whitespace passes because !value is false and length > 0
      })

      it('should validate choice field', async () => {
        const field: TemplateField = {
          name: 'style',
          label: 'Style',
          description: 'Select style',
          type: 'choice',
          required: false,
          choices: ['Professional', 'Casual', 'Technical']
        }

        const validResult = await Effect.runPromise(
          validateField(field, 'Professional').pipe(
            Effect.catchAll((err) => Effect.succeed(err))
          )
        )
        expect(validResult).toBe(true)

        const invalidResult = await Effect.runPromise(
          validateField(field, 'Invalid').pipe(
            Effect.catchAll((err) => Effect.succeed(err))
          )
        )
        expect(invalidResult).toContain('must be one of')
      })

      it('should validate boolean field', async () => {
        const field: TemplateField = {
          name: 'confirm',
          label: 'Confirm',
          description: 'Confirm action',
          type: 'boolean',
          required: true
        }

        const validResult = await Effect.runPromise(
          validateField(field, true).pipe(
            Effect.catchAll((err) => Effect.succeed(err))
          )
        )
        expect(validResult).toBe(true)

        const invalidResult = await Effect.runPromise(
          validateField(field, 'yes').pipe(
            Effect.catchAll((err) => Effect.succeed(err))
          )
        )
        expect(invalidResult).toContain('must be answered with yes (y) or no (n)')
      })
    })

    describe('validateResponses', () => {
      it('should validate all responses successfully', async () => {
        const fields: TemplateField[] = [
          {
            name: 'task',
            label: 'Task',
            description: 'What to do',
            type: 'text',
            required: true
          },
          {
            name: 'format',
            label: 'Format',
            description: 'Output format',
            type: 'text',
            required: false
          }
        ]

        const responses: UserResponses = {
          task: 'Test task',
          format: 'JSON'
        }

        const result = await Effect.runPromise(
          validateResponses(fields, responses).pipe(
            Effect.catchAll((err) => Effect.fail(err))
          )
        )

        expect(result).toEqual(responses)
      })

      it('should fail validation when required field is missing', async () => {
        const fields: TemplateField[] = [
          {
            name: 'task',
            label: 'Task',
            description: 'What to do',
            type: 'text',
            required: true
          }
        ]

        const responses: UserResponses = {}

        const result = await Effect.runPromise(
          validateResponses(fields, responses).pipe(
            Effect.catchAll((err) => Effect.succeed(err))
          )
        )

        expect(result).toBe('Task is required')
      })
    })

    describe('createInputValidator', () => {
      it('should validate required input', () => {
        const field: TemplateField = {
          name: 'task',
          label: 'Task',
          description: 'What to do',
          type: 'text',
          required: true
        }

        const validator = createInputValidator(field)
        expect(validator('')).toBe('Task is required')
        expect(validator('   ')).toBe('Task is required')
        expect(validator('valid input')).toBe(true)
      })

      it('should validate choice input', () => {
        const field: TemplateField = {
          name: 'style',
          label: 'Style',
          description: 'Select style',
          type: 'choice',
          required: false,
          choices: ['Professional', 'Casual']
        }

        const validator = createInputValidator(field)
        expect(validator('Professional')).toBe(true)
        expect(validator('Invalid')).toContain('Please select one of')
      })

      it('should validate input length', () => {
        const field: TemplateField = {
          name: 'task',
          label: 'Task',
          description: 'What to do',
          type: 'text',
          required: false
        }

        const validator = createInputValidator(field)
        const longInput = 'a'.repeat(5001)
        expect(validator(longInput)).toContain('too long')
        expect(validator('normal input')).toBe(true)
      })
    })

    describe('validateGeneratedPrompt', () => {
      it('should validate non-empty prompt', async () => {
        const result = await Effect.runPromise(
          validateGeneratedPrompt('Valid prompt text').pipe(
            Effect.catchAll((err) => Effect.fail(err))
          )
        )

        expect(result).toBe('Valid prompt text')
      })

      it('should fail validation for empty prompt', async () => {
        const result = await Effect.runPromise(
          validateGeneratedPrompt('').pipe(
            Effect.catchAll((err) => Effect.succeed(err.message))
          )
        )

        expect(result).toContain('empty')
      })

      it('should fail validation for prompt that is too long', async () => {
        const longPrompt = 'a'.repeat(10001)
        const result = await Effect.runPromise(
          validateGeneratedPrompt(longPrompt).pipe(
            Effect.catchAll((err) => Effect.succeed(err.message))
          )
        )

        expect(result).toContain('too long')
      })
    })
  })

  describe('Prompt Generation', () => {
    it('should generate zero-shot prompt correctly', () => {
      const responses: UserResponses = {
        task: 'Summarize the following article',
        format: 'Bullet points',
        style: 'Professional'
      }

      const prompt = zeroShotTemplate.generatePrompt(responses)
      expect(prompt).toContain('Task: Summarize the following article')
      expect(prompt).toContain('Output Format: Bullet points')
      expect(prompt).toContain('Style/Tone: Professional')
    })

    it('should handle optional fields in prompt generation', () => {
      const responses: UserResponses = {
        task: 'Translate text',
        format: 'JSON'
        // style is optional and missing
      }

      const prompt = zeroShotTemplate.generatePrompt(responses)
      expect(prompt).toContain('Task: Translate text')
      expect(prompt).toContain('Output Format: JSON')
      // Should use default for style
      expect(prompt).toContain('Style/Tone: Professional')
    })
  })

  describe('Display Functions', () => {
    it('should display success message', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await Effect.runPromise(displaySuccess('Operation completed'))

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('✓'))
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Operation completed'))
      consoleSpy.mockRestore()
    })

    it('should display error message', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await Effect.runPromise(displayError('Something went wrong'))

      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('✗'))
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Something went wrong'))
      consoleErrorSpy.mockRestore()
    })

    it('should display multiple lines', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await Effect.runPromise(displayLines(['Line 1', 'Line 2', 'Line 3']))

      expect(consoleSpy).toHaveBeenCalledTimes(3)
      consoleSpy.mockRestore()
    })

    it('should display table with review data', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const reviewData = [
        { field: 'Task', value: 'Summarize text' },
        { field: 'Format', value: 'Bullet points' }
      ]

      await Effect.runPromise(
        displayTable(reviewData, {
          columns: [
            { key: 'field', header: 'Field', width: 20 },
            { key: 'value', header: 'Value', width: 50 }
          ]
        })
      )

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('BuiltPrompt Structure', () => {
    it('should create valid BuiltPrompt object', () => {
      const responses: UserResponses = {
        task: 'Test task',
        format: 'JSON'
      }

      const promptText = zeroShotTemplate.generatePrompt(responses)
      const builtPrompt: BuiltPrompt = {
        template: zeroShotTemplate,
        responses,
        promptText
      }

      expect(builtPrompt.template).toBe(zeroShotTemplate)
      expect(builtPrompt.responses).toEqual(responses)
      expect(builtPrompt.promptText).toBe(promptText)
      expect(builtPrompt.promptText).toContain('Test task')
    })
  })

  describe('Error Handling', () => {
    it('should handle validation errors gracefully', async () => {
      const field: TemplateField = {
        name: 'task',
        label: 'Task',
        description: 'What to do',
        type: 'text',
        required: true
      }

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = await Effect.runPromise(
        Effect.gen(function* () {
          yield* validateField(field, '').pipe(
            Effect.catchAll((err) =>
              Effect.gen(function* () {
                yield* displayError(`Validation error: ${err}`)
                return yield* Effect.fail(new Error(err))
              })
            )
          )
        }).pipe(Effect.catchAll(() => Effect.succeed('handled')))
      )

      expect(result).toBe('handled')
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('✗'))
      consoleErrorSpy.mockRestore()
    })

    it('should handle template not found error', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = await Effect.runPromise(
        Effect.gen(function* () {
          const selectedTemplate = templates.find((t) => t.name === 'NonExistent')
          if (!selectedTemplate) {
            yield* displayError('Unable to find the selected template. Please try selecting again.')
            return yield* Effect.fail(new Error('Invalid template'))
          }
          return selectedTemplate
        }).pipe(Effect.catchAll(() => Effect.succeed('handled')))
      )

      expect(result).toBe('handled')
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('✗'))
      consoleErrorSpy.mockRestore()
    })
  })

  describe('Integration Workflow', () => {
    it('should complete full workflow with valid inputs', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      // Simulate the workflow steps
      const workflow = Effect.gen(function* () {
        // 1. Welcome screen
        yield* displayPanel(
          'Test content',
          'Welcome to Prompt Builder',
          { type: 'info' }
        )

        // 2. Select template (mocked)
        const template = zeroShotTemplate
        yield* displaySuccess(`Selected: ${template.name}`)

        // 3. Collect responses (mocked)
        const responses: UserResponses = {
          task: 'Test task',
          format: 'JSON',
          style: 'Professional'
        }

        // 4. Validate responses
        yield* validateResponses(template.fields, responses).pipe(
          Effect.catchAll(() => Effect.fail(new Error('Validation failed')))
        )

        yield* displaySuccess('All responses validated!')

        // 5. Generate prompt
        const promptText = template.generatePrompt(responses)

        // 6. Validate generated prompt
        yield* validateGeneratedPrompt(promptText).pipe(
          Effect.catchAll(() => Effect.fail(new Error('Prompt validation failed')))
        )

        // 7. Display prompt
        yield* displaySuccess(`✨ Generated ${template.name} Prompt:`)

        // 8. Display review
        const reviewData = template.fields
          .filter((f) => responses[f.name] !== undefined)
          .map((f) => ({
            field: f.label,
            value: String(responses[f.name]).substring(0, 50)
          }))

        if (reviewData.length > 0) {
          yield* displayTable(reviewData, {
            columns: [
              { key: 'field', header: 'Field', width: 20 },
              { key: 'value', header: 'Value', width: 50 }
            ]
          })
        }

        return { template, responses, promptText }
      }).pipe(Effect.provide(MockCLI))

      const result = await Effect.runPromise(workflow)

      expect(result.template).toBe(zeroShotTemplate)
      expect(result.responses).toEqual({
        task: 'Test task',
        format: 'JSON',
        style: 'Professional'
      })
      expect(result.promptText).toContain('Test task')

      consoleSpy.mockRestore()
    })
  })
})

