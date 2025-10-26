import * as Effect from 'effect/Effect'
import { describe, expect, it, vi } from 'vitest'
import { EffectCLI, TUIHandler } from '../src/index'

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
