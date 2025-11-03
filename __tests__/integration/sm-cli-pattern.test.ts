import * as Effect from 'effect/Effect'
import { describe, expect, it, vi } from 'vitest'
import { display, displayLines, displayJson, displaySuccess, displayError } from '../../src/display'

describe('SM-CLI Integration Patterns', () => {
  describe('Real-world CLI Usage', () => {
    it('should support project information display pattern', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const projectInfo = Effect.gen(function* (_) {
        yield* _(display('Project Information'))
        yield* _(displayLines([
          '━━━━━━━━━━━━━━━━━━━━━━━━━━',
          'Active Project: effect-patterns',
          'API Key: Configured',
          'Environment: development'
        ]))
      })

      await Effect.runPromise(projectInfo)

      expect(consoleSpy).toHaveBeenNthCalledWith(1, '\nℹ Project Information')
      expect(consoleSpy).toHaveBeenNthCalledWith(2, '\nℹ ━━━━━━━━━━━━━━━━━━━━━━━━━━')
      expect(consoleSpy).toHaveBeenNthCalledWith(3, '\nℹ Active Project: effect-patterns')
      consoleSpy.mockRestore()
    })

    it('should support JSON data display for API responses', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const apiResponse = {
        status: 'success',
        data: {
          project: 'effect-patterns',
          version: '1.0.0',
          features: ['typescript', 'effect', 'testing']
        }
      }

      await Effect.runPromise(displayJson(apiResponse))

      const expectedJson = JSON.stringify(apiResponse, null, 2)
      expect(consoleSpy).toHaveBeenCalledWith(`\nℹ ${expectedJson}`)
      consoleSpy.mockRestore()
    })

    it('should support success/error messaging patterns', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const operationResult = Effect.gen(function* (_) {
        yield* _(display('Connecting to database...'))
        yield* _(displaySuccess('Database connection established'))

        // Simulate error
        yield* _(display('Processing payment...'))
        yield* _(displayError('Payment processing failed: Insufficient funds'))
      })

      await Effect.runPromise(operationResult)

      expect(consoleSpy).toHaveBeenNthCalledWith(1, '\nℹ Connecting to database...')
      expect(consoleSpy).toHaveBeenNthCalledWith(2, '\n✓ Database connection established')
      expect(consoleSpy).toHaveBeenNthCalledWith(3, '\nℹ Processing payment...')
      expect(consoleSpy).toHaveBeenNthCalledWith(4, '\n✗ Payment processing failed: Insufficient funds')
      consoleSpy.mockRestore()
    })

    it('should work with @effect/cli command patterns', async () => {
      // This test demonstrates how the display functions integrate
      // with Effect CLI commands (simulated here)

      const mockCommand = Effect.gen(function* (_) {
        // Simulate CLI command flow
        yield* _(display('Initializing CLI command...'))
        yield* _(displayLines([
          'Command: deploy',
          'Environment: production',
          'Version: 1.2.3'
        ]))

        // Simulate successful operation
        yield* _(displaySuccess('Deployment completed successfully'))

        // Return mock result
        return { exitCode: 0, output: 'Deployed v1.2.3' }
      })

      const result = await Effect.runPromise(mockCommand)
      expect(result.exitCode).toBe(0)
      expect(result.output).toBe('Deployed v1.2.3')
    })

    it('should support custom formatting for advanced CLI output', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const customOutput = Effect.gen(function* (_) {
        // Custom prefix for logs
        yield* _(display('Starting process...', { prefix: '▶️ ' }))

        // Multi-line status with custom type
        yield* _(displayLines([
          'System Status Report',
          '════════════════════',
          'CPU: 45%',
          'Memory: 2.1GB/8GB',
          'Disk: 120GB free'
        ], { type: 'info' }))

        // JSON without prefix for clean output
        const metrics = { responseTime: 120, throughput: 1500 }
        yield* _(displayJson(metrics, { prefix: false, spaces: 4 }))

        yield* _(displaySuccess('Process completed'))
      })

      await Effect.runPromise(customOutput)

      expect(consoleSpy).toHaveBeenNthCalledWith(1, '\n▶️  Starting process...')
      expect(consoleSpy).toHaveBeenNthCalledWith(2, '\nℹ System Status Report')
      // JSON without prefix
      const expectedJson = JSON.stringify({ responseTime: 120, throughput: 1500 }, null, 4)
      expect(consoleSpy).toHaveBeenCalledWith(`\n${expectedJson}`)
      consoleSpy.mockRestore()
    })

    it('should handle newline control for inline messages', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const inlineMessages = Effect.gen(function* (_) {
        yield* _(display('Processing', { newline: false }))
        yield* _(display('... Done!', { newline: false }))
        yield* _(display('', { newline: true })) // Just a newline
        yield* _(displaySuccess('All operations completed'))
      })

      await Effect.runPromise(inlineMessages)

      expect(consoleSpy).toHaveBeenNthCalledWith(1, 'ℹ Processing')
      expect(consoleSpy).toHaveBeenNthCalledWith(2, 'ℹ ... Done!')
      expect(consoleSpy).toHaveBeenNthCalledWith(3, '')
      expect(consoleSpy).toHaveBeenNthCalledWith(4, '\n✓ All operations completed')
      consoleSpy.mockRestore()
    })
  })
})
