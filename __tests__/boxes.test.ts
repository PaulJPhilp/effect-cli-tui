import * as Effect from 'effect/Effect'
import { describe, expect, it, vi } from 'vitest'
import { displayBox, displayPanel, BoxStyle } from 'effect-cli-tui'

describe('Box Display', () => {
  describe('displayBox', () => {
    it('should display content in a basic box', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const content = 'Hello World'
      await Effect.runPromise(displayBox(content))

      expect(consoleSpy).toHaveBeenCalled()
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Hello World'))
      consoleSpy.mockRestore()
    })

    it('should handle multi-line content', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const content = 'Line 1\nLine 2\nLine 3'
      await Effect.runPromise(displayBox(content))

      expect(consoleSpy).toHaveBeenCalled()
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Line 1'))
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Line 2'))
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Line 3'))
      consoleSpy.mockRestore()
    })

    it('should support different border styles', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const content = 'Test'
      const styles: (keyof BoxStyle)[] = ['single', 'double', 'rounded', 'bold', 'classic']

      for (const style of styles) {
        await Effect.runPromise(displayBox(content, { borderStyle: style }))
      }

      expect(consoleSpy).toHaveBeenCalledTimes(styles.length)
      consoleSpy.mockRestore()
    })

    it('should display box with title', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const content = 'Content'
      const title = 'My Title'
      await Effect.runPromise(displayBox(content, { title }))

      expect(consoleSpy).toHaveBeenCalled()
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining(title))
      consoleSpy.mockRestore()
    })

    it('should handle padding', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const content = 'Test'
      await Effect.runPromise(displayBox(content, { padding: 2 }))

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('should support different types (colors)', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const content = 'Test'
      const types: ('info' | 'success' | 'error' | 'warning')[] = ['info', 'success', 'error', 'warning']

      for (const type of types) {
        await Effect.runPromise(displayBox(content, { type }))
      }

      expect(consoleSpy).toHaveBeenCalledTimes(types.length)
      consoleSpy.mockRestore()
    })

    it('should return Effect<void>', async () => {
      const content = 'Test'
      const effect = displayBox(content)
      expect(effect).toBeDefined()

      await Effect.runPromise(effect)
    })
  })

  describe('displayPanel', () => {
    it('should be equivalent to displayBox with title', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const content = 'Panel content'
      const title = 'Panel Title'

      await Effect.runPromise(displayPanel(content, title))

      expect(consoleSpy).toHaveBeenCalled()
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining(content))
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining(title))
      consoleSpy.mockRestore()
    })

    it('should support additional options', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const content = 'Panel content'
      const title = 'Panel Title'
      const options: BoxStyle = { borderStyle: 'double', type: 'success' }

      await Effect.runPromise(displayPanel(content, title, options))

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('should return Effect<void>', async () => {
      const content = 'Test'
      const title = 'Test'
      const effect = displayPanel(content, title)
      expect(effect).toBeDefined()

      await Effect.runPromise(effect)
    })
  })
})
