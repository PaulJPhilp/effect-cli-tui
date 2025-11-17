/**
 * Tests for Message component
 */

import { render } from 'ink-testing-library'
import { describe, expect, it } from 'vitest'
import { Message } from '../../src/components/Message'

describe('Message component', () => {
  it('should render info message with info icon', () => {
    const { lastFrame } = render(<Message message="Test info message" type="info" />)
    const output = lastFrame()
    expect(output).toContain('ℹ')
    expect(output).toContain('Test info message')
  })

  it('should render success message with checkmark icon', () => {
    const { lastFrame } = render(<Message message="Success!" type="success" />)
    const output = lastFrame()
    expect(output).toContain('✓')
    expect(output).toContain('Success!')
  })

  it('should render error message with X icon', () => {
    const { lastFrame } = render(<Message message="Error occurred" type="error" />)
    const output = lastFrame()
    expect(output).toContain('✗')
    expect(output).toContain('Error occurred')
  })

  it('should render warning message with warning icon', () => {
    const { lastFrame } = render(<Message message="Warning!" type="warning" />)
    const output = lastFrame()
    expect(output).toContain('⚠')
    expect(output).toContain('Warning!')
  })

  it('should default to info type when not specified', () => {
    const { lastFrame } = render(<Message message="Default" />)
    const output = lastFrame()
    expect(output).toContain('ℹ')
    expect(output).toContain('Default')
  })
})
