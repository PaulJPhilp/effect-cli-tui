import { describe, expect, it } from 'vitest'

// Test ESM imports
describe('ESM Module Imports', () => {
  it('should import display functions from ESM build', async () => {
    // This test verifies that the ESM build exports work for display functions
    const { display, displayLines, displayJson, displaySuccess, displayError } = await import('../dist/index.js')

    expect(display).toBeDefined()
    expect(displayLines).toBeDefined()
    expect(displayJson).toBeDefined()
    expect(displaySuccess).toBeDefined()
    expect(displayError).toBeDefined()

    expect(typeof display).toBe('function')
    expect(typeof displayLines).toBe('function')
    expect(typeof displayJson).toBe('function')
    expect(typeof displaySuccess).toBe('function')
    expect(typeof displayError).toBe('function')
  })

  it('should import types from ESM build', async () => {
    // Test that types are available (this will fail at runtime if types are missing)
    const module = await import('../dist/index.js')
    expect(module).toHaveProperty('DisplayType')
    expect(module).toHaveProperty('DisplayOptions')
    expect(module).toHaveProperty('JsonDisplayOptions')
  })

  it('should import new table functions from ESM build', async () => {
    const { displayTable, TableColumn, TableOptions } = await import('../dist/index.js')

    expect(displayTable).toBeDefined()
    expect(TableColumn).toBeDefined()
    expect(TableOptions).toBeDefined()

    expect(typeof displayTable).toBe('function')
  })

  it('should import new box functions from ESM build', async () => {
    const { displayBox, displayPanel, BoxStyle } = await import('../dist/index.js')

    expect(displayBox).toBeDefined()
    expect(displayPanel).toBeDefined()
    expect(BoxStyle).toBeDefined()

    expect(typeof displayBox).toBe('function')
    expect(typeof displayPanel).toBe('function')
  })

  it('should import new spinner functions from ESM build', async () => {
    const { spinnerEffect, startSpinner, stopSpinner, SpinnerOptions } = await import('../dist/index.js')

    expect(spinnerEffect).toBeDefined()
    expect(startSpinner).toBeDefined()
    expect(stopSpinner).toBeDefined()
    expect(SpinnerOptions).toBeDefined()

    expect(typeof spinnerEffect).toBe('function')
    expect(typeof startSpinner).toBe('function')
    expect(typeof stopSpinner).toBe('function')
  })



  it('should import color functions from ESM build', async () => {
    const { applyChalkStyle, displayHighlight, displayMuted, displayWarning, displayInfo, displayListItem } = await import('../dist/index.js')

    expect(applyChalkStyle).toBeDefined()
    expect(displayHighlight).toBeDefined()
    expect(displayMuted).toBeDefined()
    expect(displayWarning).toBeDefined()
    expect(displayInfo).toBeDefined()
    expect(displayListItem).toBeDefined()

    expect(typeof applyChalkStyle).toBe('function')
    expect(typeof displayHighlight).toBe('function')
    expect(typeof displayMuted).toBe('function')
    expect(typeof displayWarning).toBe('function')
    expect(typeof displayInfo).toBe('function')
    expect(typeof displayListItem).toBe('function')
  })
})
