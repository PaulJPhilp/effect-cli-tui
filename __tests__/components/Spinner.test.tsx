/**
 * Tests for Spinner component
 */

import { render } from 'ink-testing-library'
import { describe, expect, it } from 'vitest'
import { SpinnerComponent } from '../../src/components/Spinner'

describe('SpinnerComponent', () => {
  it('should render spinner with message', () => {
    const { lastFrame } = render(<SpinnerComponent message="Loading..." type="dots" />)
    const output = lastFrame()
    expect(output).toContain('Loading...')
  })

  it('should render with default spinner type', () => {
    const { lastFrame } = render(<SpinnerComponent message="Processing..." />)
    const output = lastFrame()
    expect(output).toContain('Processing...')
  })

  it('should render with custom spinner type', () => {
    const { lastFrame } = render(<SpinnerComponent message="Wait..." type="line" />)
    const output = lastFrame()
    expect(output).toContain('Wait...')
  })
})
