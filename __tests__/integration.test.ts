import * as Effect from 'effect/Effect'
import { describe, expect, it, vi } from 'vitest'
import { EffectCLI, TUIHandler, display, displayLines, displayJson, displaySuccess, displayError } from 'effect-cli-tui'

describe('effect-cli-tui Integration', () => {
  describe('TUIHandler - Display Messages', () => {
    it('should display success message', async () => {
      const tui = new TUIHandler()
      const consoleSpy = vi.spyOn(console, 'log')
      await Effect.runPromise(tui.display('Success!', 'success'))
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('✓')
      )
      consoleSpy.mockRestore()
    })

    it('should display error message', async () => {
      const tui = new TUIHandler()
      const consoleSpy = vi.spyOn(console, 'log')
      await Effect.runPromise(tui.display('Error!', 'error'))
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('✗')
      )
      consoleSpy.mockRestore()
    })

    it('should display info message', async () => {
      const tui = new TUIHandler()
      const consoleSpy = vi.spyOn(console, 'log')
      await Effect.runPromise(tui.display('Info', 'info'))
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('ℹ')
      )
      consoleSpy.mockRestore()
    })
  })

  describe('Display API', () => {
    it('display should output with info prefix by default', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      await Effect.runPromise(display('Test message'))
      expect(consoleSpy).toHaveBeenCalledWith('\nℹ Test message')
      consoleSpy.mockRestore()
    })

    it('display should output with success prefix', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      await Effect.runPromise(display('Success!', { type: 'success' }))
      expect(consoleSpy).toHaveBeenCalledWith('\n✓ Success!')
      consoleSpy.mockRestore()
    })

    it('display should output with error prefix', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      await Effect.runPromise(display('Error!', { type: 'error' }))
      expect(consoleSpy).toHaveBeenCalledWith('\n✗ Error!')
      consoleSpy.mockRestore()
    })

    it('display should support custom prefix', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      await Effect.runPromise(display('Custom', { prefix: '>>>' }))
      expect(consoleSpy).toHaveBeenCalledWith('\n>>> Custom')
      consoleSpy.mockRestore()
    })

    it('display should support newline option', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      await Effect.runPromise(display('No newline', { newline: false }))
      expect(consoleSpy).toHaveBeenCalledWith('ℹ No newline')
      consoleSpy.mockRestore()
    })

    it('displayLines should output multiple lines with prefixes', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      await Effect.runPromise(displayLines(['Line 1', 'Line 2'], { type: 'info' }))
      expect(consoleSpy).toHaveBeenNthCalledWith(1, '\nℹ Line 1')
      expect(consoleSpy).toHaveBeenNthCalledWith(2, '\nℹ Line 2')
      consoleSpy.mockRestore()
    })

    it('displayJson should format JSON correctly', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const data = { key: 'value', num: 42 }
      await Effect.runPromise(displayJson(data, { spaces: 2 }))
      expect(consoleSpy).toHaveBeenCalledWith('\nℹ {\n  "key": "value",\n  "num": 42\n}')
      consoleSpy.mockRestore()
    })

    it('displayJson should support custom spaces', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const data = { test: true }
      await Effect.runPromise(displayJson(data, { spaces: 4 }))
      expect(consoleSpy).toHaveBeenCalledWith('\nℹ {\n    "test": true\n}')
      consoleSpy.mockRestore()
    })

    it('displayJson should support prefix option', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const data = { msg: 'hello' }
      await Effect.runPromise(displayJson(data, { prefix: false }))
      expect(consoleSpy).toHaveBeenCalledWith('\n{\n  "msg": "hello"\n}')
      consoleSpy.mockRestore()
    })

    it('displaySuccess should be equivalent to display with success type', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      await Effect.runPromise(displaySuccess('Done!'))
      expect(consoleSpy).toHaveBeenCalledWith('\n✓ Done!')
      consoleSpy.mockRestore()
    })

    it('displayError should be equivalent to display with error type', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      await Effect.runPromise(displayError('Failed!'))
      expect(consoleSpy).toHaveBeenCalledWith('\n✗ Failed!')
      consoleSpy.mockRestore()
    })

    it('all display functions should return Effect<void, never, never>', async () => {
      const successEffect = displaySuccess('test')
      const errorEffect = displayError('test')
      const displayEffect = display('test')
      const linesEffect = displayLines(['test'])
      const jsonEffect = displayJson({ test: true })

      expect(successEffect).toBeDefined()
      expect(errorEffect).toBeDefined()
      expect(displayEffect).toBeDefined()
      expect(linesEffect).toBeDefined()
      expect(jsonEffect).toBeDefined()

      // Should run without errors
      await Effect.runPromise(successEffect)
      await Effect.runPromise(errorEffect)
      await Effect.runPromise(displayEffect)
      await Effect.runPromise(linesEffect)
      await Effect.runPromise(jsonEffect)
    })
  })

  describe('EffectCLI - Integration', () => {
    it('should be instantiable', () => {
      const cli = new EffectCLI()
      expect(cli).toBeDefined()
      expect(typeof cli.run).toBe('function')
      expect(typeof cli.stream).toBe('function')
    })

    it('should return Effect.Effect type', () => {
      const cli = new EffectCLI()
      const result = cli.run('--version', [])
      expect(result).toBeDefined()
    })
  })
})
