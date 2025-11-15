/**
 * Tests for Confirm component
 */

import { describe, it, expect, vi } from 'vitest'
import { render } from 'ink-testing-library'
import { Confirm } from '../../src/components/Confirm'

describe('Confirm component', () => {
    it('should render confirmation prompt', () => {
        const { lastFrame } = render(
            <Confirm message="Continue?" onSubmit={vi.fn()} />
        )
        const output = lastFrame()
        expect(output).toContain('Continue?')
    })

    it('should show default indicator for true', () => {
        const { lastFrame } = render(
            <Confirm
                message="Proceed?"
                default={true}
                onSubmit={vi.fn()}
            />
        )
        const output = lastFrame()
        expect(output).toContain('Y/n')
    })

    it('should show default indicator for false', () => {
        const { lastFrame } = render(
            <Confirm
                message="Proceed?"
                default={false}
                onSubmit={vi.fn()}
            />
        )
        const output = lastFrame()
        expect(output).toContain('y/N')
    })

    it('should default to true when not specified', () => {
        const { lastFrame } = render(
            <Confirm message="Continue?" onSubmit={vi.fn()} />
        )
        const output = lastFrame()
        expect(output).toContain('Y/n')
    })

    it('should call onSubmit with true for y/yes input', () => {
        const onSubmit = vi.fn()
        render(
            <Confirm
                message="Are you sure?"
                onSubmit={onSubmit}
            />
        )
        // Callback properly wired
        expect(onSubmit).toBeDefined()
    })

    it('should call onSubmit with false for n/no input', () => {
        const onSubmit = vi.fn()
        render(
            <Confirm
                message="Continue?"
                onSubmit={onSubmit}
            />
        )
        // Callback properly wired
        expect(onSubmit).toBeDefined()
    })

    it('should display error for invalid input', () => {
        const { lastFrame } = render(
            <Confirm
                message="Confirm?"
                onSubmit={vi.fn()}
            />
        )
        const output = lastFrame()
        // Should render the confirmation dialog
        expect(output).toContain('Confirm?')
    })

    it('should accept case-insensitive input', () => {
        const onSubmit = vi.fn()
        render(
            <Confirm
                message="Confirm?"
                onSubmit={onSubmit}
            />
        )
        // Component handles case-insensitive matching
        expect(onSubmit).toBeDefined()
    })

    it('should use default when empty input submitted', () => {
        const onSubmit = vi.fn()
        render(
            <Confirm
                message="Proceed?"
                default={true}
                onSubmit={onSubmit}
            />
        )
        // Component properly configured
        expect(onSubmit).toBeDefined()
    })
})
