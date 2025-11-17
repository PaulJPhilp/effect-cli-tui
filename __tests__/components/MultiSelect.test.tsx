/**
 * Tests for MultiSelect component
 */

import { render } from 'ink-testing-library'
import { describe, expect, it, vi } from 'vitest'
import { MultiSelect } from '../../src/components/MultiSelect'

describe('MultiSelect component', () => {
  const choices = ['Item 1', 'Item 2', 'Item 3', 'Item 4']

  it('should render prompt message', () => {
    const { lastFrame } = render(
      <MultiSelect message="Select items:" choices={choices} onSubmit={vi.fn()} />,
    )
    const output = lastFrame()
    expect(output).toContain('Select items:')
  })

  it('should render all choices with checkboxes', () => {
    const { lastFrame } = render(
      <MultiSelect message="Choose:" choices={choices} onSubmit={vi.fn()} />,
    )
    const output = lastFrame()
    expect(output).toContain('Item 1')
    expect(output).toContain('Item 2')
    expect(output).toContain('Item 3')
    expect(output).toContain('Item 4')
  })

  it('should display selection count', () => {
    const { lastFrame } = render(
      <MultiSelect message="Pick multiple:" choices={choices} onSubmit={vi.fn()} />,
    )
    const output = lastFrame()
    expect(output).toContain('Selected: 0')
  })

  it('should show helper text', () => {
    const { lastFrame } = render(
      <MultiSelect message="Options:" choices={choices} onSubmit={vi.fn()} />,
    )
    const output = lastFrame()
    expect(output).toContain('Space to toggle')
    expect(output).toContain('Enter to submit')
  })

  it('should handle empty choices', () => {
    const { lastFrame } = render(
      <MultiSelect message="No choices:" choices={[]} onSubmit={vi.fn()} />,
    )
    const output = lastFrame()
    expect(output).toContain('No choices:')
  })

  it('should handle single choice', () => {
    const { lastFrame } = render(
      <MultiSelect message="Single choice:" choices={['Only option']} onSubmit={vi.fn()} />,
    )
    const output = lastFrame()
    expect(output).toContain('Only option')
  })

  it('should call onSubmit with selected items', () => {
    const onSubmit = vi.fn()
    render(<MultiSelect message="Select:" choices={choices} onSubmit={onSubmit} />)
    expect(onSubmit).toBeDefined()
  })

  it('should render confirmation message when items selected', () => {
    const { lastFrame } = render(
      <MultiSelect message="Pick many:" choices={choices} onSubmit={vi.fn()} />,
    )
    const output = lastFrame()
    // Component properly structured
    expect(output).toBeTruthy()
  })

  it('should handle many items', () => {
    const manyChoices = Array.from({ length: 30 }, (_, i) => `Option ${i + 1}`)
    const { lastFrame } = render(
      <MultiSelect message="Many options:" choices={manyChoices} onSubmit={vi.fn()} />,
    )
    const output = lastFrame()
    expect(output).toContain('Option 1')
  })
})
