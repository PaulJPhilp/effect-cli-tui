import chalk from 'chalk'
import Table from 'cli-table3'
import { Effect } from 'effect'
import { applyChalkStyle } from '../core/colors'
import type { ChalkColor, DisplayType, TableAlignment } from '../types'

export interface TableColumn<T = Record<string, unknown>> {
  key: keyof T | string
  header: string
  width?: number
  align?: TableAlignment
  truncate?: boolean
  formatter?: (value: unknown) => string
}

export interface TableOptions<T> {
  columns: TableColumn<T>[]
  type?: DisplayType
  style?: {
    color?: ChalkColor
    bold?: boolean
  }
  bordered?: boolean
  head?: {
    color?: ChalkColor
    bold?: boolean
  }
  stripColors?: boolean
}

/**
 * Display a formatted table with structured data
 */
export function displayTable<T>(data: T[], options: TableOptions<T>): Effect.Effect<void> {
  return Effect.sync(() => {
    if (!data || data.length === 0) {
      console.log('\nℹ No data to display\n')
      return
    }

    const table = new Table({
      head: options.columns.map((col) => {
        const header = col.header
        return options.head ? applyChalkStyle(header, options.head) : chalk.bold(header)
      }),
      colWidths: options.columns.map((col) => col.width || 20),
      style: {
        head: [],
        border: options.bordered ? ['cyan'] : [],
        compact: true,
      },
      wordWrap: true,
    })

    // Add rows
    for (const row of data) {
      const rowData = options.columns.map((col) => {
        let value = (row as Record<string, unknown>)[col.key as string]

        // Apply formatter if provided
        if (col.formatter) {
          value = col.formatter(value)
        }

        // Apply style if provided
        const stringValue = String(value || '')
        return options.style ? applyChalkStyle(stringValue, options.style) : stringValue
      })

      table.push(rowData)
    }

    console.log(`\n${table.toString()}\n`)
  })
}
