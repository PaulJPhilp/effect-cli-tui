/**
 * Tests for ProgressBar component
 */

import { render } from 'ink-testing-library'
import { describe, expect, it } from 'vitest'
import { ProgressBar } from '../../src/components/ProgressBar'

describe('ProgressBar component', () => {
  it('should render progress bar with percentage', () => {
    const { lastFrame } = render(<ProgressBar value={50} max={100} showPercentage />)
    const output = lastFrame()
    expect(output).toContain('50%')
  })

  it('should render progress bar with label', () => {
    const { lastFrame } = render(<ProgressBar value={75} max={100} label="Downloading" />)
    const output = lastFrame()
    expect(output).toContain('Downloading')
    expect(output).toContain('75%')
  })

  it('should calculate percentage correctly', () => {
    const { lastFrame } = render(<ProgressBar value={25} max={50} showPercentage />)
    const output = lastFrame()
    // 25/50 = 50%
    expect(output).toContain('50%')
  })

  it('should cap percentage at 100', () => {
    const { lastFrame } = render(<ProgressBar value={150} max={100} showPercentage />)
    const output = lastFrame()
    expect(output).toContain('100%')
  })

  it('should hide percentage when showPercentage is false', () => {
    const { lastFrame } = render(<ProgressBar value={50} max={100} showPercentage={false} />)
    const output = lastFrame()
    expect(output).not.toContain('50%')
  })
})
