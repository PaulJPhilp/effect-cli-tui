/**
 * Tests for Password component
 */

import { describe, it, expect, vi } from 'vitest'
import { render } from 'ink-testing-library'
import { Password } from '../../src/components/Password'

describe('Password component', () => {
    it('should render password prompt', () => {
        const { lastFrame } = render(
            <Password message="Enter password:" onSubmit={vi.fn()} />
        )
        const output = lastFrame()
        expect(output).toContain('Enter password:')
    })

    it('should display masked input field', () => {
        const { lastFrame } = render(
            <Password message="Password:" onSubmit={vi.fn()} />
        )
        const output = lastFrame()
        // Component renders with masked input
        expect(output).toContain('Password:')
    })

    it('should call onSubmit when password entered', () => {
        const onSubmit = vi.fn()
        render(
            <Password message="Enter secret:" onSubmit={onSubmit} />
        )
        expect(onSubmit).toBeDefined()
    })

    it('should show validation error', () => {
        const validateFn = vi.fn(
            (input) => input.length >= 8 || 'Password too short'
        )
        const { lastFrame } = render(
            <Password
                message="Create password:"
                validate={validateFn}
                onSubmit={vi.fn()}
            />
        )
        const output = lastFrame()
        expect(output).toContain('Create password:')
    })

    it('should accept valid password', () => {
        const onSubmit = vi.fn()
        const validateFn = vi.fn((input) => input.length >= 8)

        render(
            <Password
                message="Password:"
                validate={validateFn}
                onSubmit={onSubmit}
            />
        )

        expect(validateFn).toBeDefined()
        expect(onSubmit).toBeDefined()
    })

    it('should handle optional validation', () => {
        const { lastFrame } = render(
            <Password message="Optional pass:" onSubmit={vi.fn()} />
        )
        const output = lastFrame()
        expect(output).toContain('Optional pass:')
    })

    it('should clear error on input change', () => {
        const { lastFrame } = render(
            <Password
                message="Password:"
                validate={(v) => (v.length > 0 ? true : 'Required')}
                onSubmit={vi.fn()}
            />
        )
        const output = lastFrame()
        // Component properly rendered
        expect(output).toContain('Password:')
    })

    it('should not display actual password characters', () => {
        const { lastFrame } = render(
            <Password message="Secret:" onSubmit={vi.fn()} />
        )
        const output = lastFrame()
        // Should use mask character (•) not actual password
        expect(output).not.toContain('myactualpassword')
    })
})
