import * as Effect from 'effect/Effect'
import { displayTable, TableColumn, TableOptions } from 'effect-cli-tui'
import { describe, expect, it, vi } from 'vitest'

describe('Table Display', () => {
  describe('displayTable', () => {
    it('should display empty table with no data message', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const data: { name: string; age: number }[] = []
      const columns: TableColumn[] = [
        { key: 'name', header: 'Name' },
        { key: 'age', header: 'Age' },
      ]

      await Effect.runPromise(displayTable(data, { columns }))

      expect(consoleSpy).toHaveBeenCalledWith('\nℹ No data to display\n')
      consoleSpy.mockRestore()
    })

    it('should display table with basic data', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const data = [
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 },
      ]
      const columns: TableColumn[] = [
        { key: 'name', header: 'Name' },
        { key: 'age', header: 'Age' },
      ]

      await Effect.runPromise(displayTable(data, { columns }))

      // cli-table3 outputs the entire table as a single string
      expect(consoleSpy).toHaveBeenCalledTimes(1)
      const output = consoleSpy.mock.calls[0][0] as string
      expect(output).toContain('Name')
      expect(output).toContain('Age')
      expect(output).toContain('Alice')
      expect(output).toContain('Bob')
      consoleSpy.mockRestore()
    })

    it('should handle custom column widths', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const data = [{ name: 'Very Long Name Here', age: 30 }]
      const columns: TableColumn[] = [
        { key: 'name', header: 'Name', width: 25 },
        { key: 'age', header: 'Age', width: 10 },
      ]

      await Effect.runPromise(displayTable(data, { columns }))

      const output = consoleSpy.mock.calls.map((call) => call[0]).join('')
      expect(output).toContain('Very Long Name Here')
      consoleSpy.mockRestore()
    })

    it('should apply custom styling', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const data = [{ name: 'Test', age: 25 }]
      const columns: TableColumn[] = [
        { key: 'name', header: 'Name' },
        { key: 'age', header: 'Age' },
      ]
      const options: TableOptions<(typeof data)[0]> = {
        columns,
        style: { color: 'green', bold: true },
      }

      await Effect.runPromise(displayTable(data, options))

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('should handle formatter functions', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const data = [{ name: 'alice', age: 30 }]
      const columns: TableColumn[] = [
        {
          key: 'name',
          header: 'Name',
          formatter: (value: string) => value.toUpperCase(),
        },
        { key: 'age', header: 'Age' },
      ]

      await Effect.runPromise(displayTable(data, { columns }))

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('ALICE'))
      consoleSpy.mockRestore()
    })

    it('should support different border styles', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const data = [{ name: 'Test', age: 25 }]
      const columns: TableColumn[] = [
        { key: 'name', header: 'Name' },
        { key: 'age', header: 'Age' },
      ]

      await Effect.runPromise(displayTable(data, { columns, bordered: true }))

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('should handle string keys that are not in data', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const data = [{ name: 'Test' }]
      const columns: TableColumn[] = [
        { key: 'name', header: 'Name' },
        { key: 'missing', header: 'Missing' },
      ]

      await Effect.runPromise(displayTable(data, { columns }))

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Test'))
      consoleSpy.mockRestore()
    })

    it('should return Effect<void>', async () => {
      const data = [{ name: 'Test', age: 25 }]
      const columns: TableColumn[] = [
        { key: 'name', header: 'Name' },
        { key: 'age', header: 'Age' },
      ]

      const effect = displayTable(data, { columns })
      expect(effect).toBeDefined()

      await Effect.runPromise(effect)
    })
  })
})
