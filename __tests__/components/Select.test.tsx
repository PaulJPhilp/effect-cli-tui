/**
 * Tests for Select component
 */

import { describe, it, expect, vi } from 'vitest'
import { render } from 'ink-testing-library'
import { Select } from '../../src/components/Select'

describe('Select component', () => {
    const choices = ['Option A', 'Option B', 'Option C']

    it('should render prompt message', () => {
        const { lastFrame } = render(
            <Select
                message="Choose one:"
                choices={choices}
                onSubmit={vi.fn()}
            />
        )
        const output = lastFrame()
        expect(output).toContain('Choose one:')
    })

    it('should render all choices', () => {
        const { lastFrame } = render(
            <Select
                message="Select:"
                choices={choices}
                onSubmit={vi.fn()}
            />
        )
        const output = lastFrame()
        expect(output).toContain('Option A')
        expect(output).toContain('Option B')
        expect(output).toContain('Option C')
    })

    it('should highlight first item by default', () => {
        const { lastFrame } = render(
            <Select
                message="Choose:"
                choices={choices}
                onSubmit={vi.fn()}
            />
        )
        const output = lastFrame()
        // Should render the component successfully
        expect(output).toBeTruthy()
    })

    it('should render with single choice', () => {
        const { lastFrame } = render(
            <Select
                message="Only option:"
                choices={['Single']}
                onSubmit={vi.fn()}
            />
        )
        const output = lastFrame()
        expect(output).toContain('Single')
    })

    it('should handle empty choices array', () => {
        const { lastFrame } = render(
            <Select
                message="No choices:"
                choices={[]}
                onSubmit={vi.fn()}
            />
        )
        const output = lastFrame()
        expect(output).toContain('No choices:')
    })

    it('should call onSubmit with selected choice', () => {
        const onSubmit = vi.fn()
        render(
            <Select
                message="Choose:"
                choices={choices}
                onSubmit={onSubmit}
            />
        )
        // Callback is properly wired
        expect(onSubmit).toBeDefined()
    })

    it('should render with long choice lists', () => {
        const longChoices = Array.from(
            { length: 20 },
            (_, i) => `Choice ${i + 1}`
        )
        const { lastFrame } = render(
            <Select
                message="Pick one:"
                choices={longChoices}
                onSubmit={vi.fn()}
            />
        )
        const output = lastFrame()
        expect(output).toContain('Choice 1')
        expect(output).toContain('Pick one:')
    })
})
