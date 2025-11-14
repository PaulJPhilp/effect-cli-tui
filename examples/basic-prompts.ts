/**
 * Basic prompts example
 *
 * Demonstrates how to use Input, Select, Confirm, and Password components
 * with the renderInkWithResult Effect wrapper.
 *
 * Run with: npx ts-node examples/basic-prompts.ts
 */

import * as Effect from 'effect/Effect'
import { renderInkWithResult } from '../src/effects/ink-wrapper'
import { Input, Select, Confirm, Password } from '../src/components'

/**
 * Example workflow: Collect user information
 */
const userWorkflow = Effect.gen(function* () {
    console.log('\n📝 User Registration\n')

    // Prompt for name
    const name = yield* renderInkWithResult<string>((onComplete) =>
        <Input
            message="What is your name?"
            validate={(v) => (v.length > 0 ? true : 'Name is required')}
            onSubmit={onComplete}
        />
    )
    console.log(`\n✓ Hello, ${name}!\n`)

    // Select a role
    const role = yield* renderInkWithResult<string>((onComplete) =>
        <Select
            message="Choose your role:"
            choices={['Admin', 'User', 'Guest']}
            onSubmit={onComplete}
        />
    )
    console.log(`✓ Role selected: ${role}\n`)

    // Confirm action
    const confirmed = yield* renderInkWithResult<boolean>((onComplete) =>
        <Confirm
            message="Create account with these details?"
            default={true}
            onSubmit={onComplete}
        />
    )

    if (!confirmed) {
        console.log('\n✗ Account creation cancelled.\n')
        return
    }

    // Password prompt
    const password = yield* renderInkWithResult<string>((onComplete) =>
        <Password
            message="Enter a password:"
            validate={(v) => (v.length >= 8 ? true : 'Password must be 8+ chars')}
            onSubmit={onComplete}
        />
    )

    console.log('\n✓ Account created successfully!')
    console.log(`  Name: ${name}`)
    console.log(`  Role: ${role}`)
    console.log(`  Password: ${'*'.repeat(password.length)}\n`)
})

/**
 * Run the workflow
 */
export const main = () => {
    return Effect.runPromise(userWorkflow)
}

// Run if executed directly
if (import.meta.main) {
    main().catch((err) => {
        console.error('Error:', err)
        process.exit(1)
    })
}
