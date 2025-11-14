/**
 * Progress and spinner example
 *
 * Demonstrates the Spinner and ProgressBar components for showing
 * long-running operations.
 *
 * Run with: npx ts-node examples/progress-demo.ts
 */

import * as Effect from 'effect/Effect'
import { renderInkComponent } from '../src/effects/ink-wrapper'
import { SpinnerComponent, ProgressBar, Message } from '../src/components'

/**
 * Simulate a task that takes time
 */
const delay = (ms: number) =>
    Effect.promise(() => new Promise((resolve) => setTimeout(resolve, ms)))

/**
 * Show a spinner while doing work
 */
const spinnerDemo = Effect.gen(function* () {
    console.log('\n⏳ Spinner Demo\n')

    // Show spinner
    const spinnerTask = renderInkComponent(
        <SpinnerComponent message="Processing..." type="dots" />
    )

    // Run spinner in background while doing work
    yield* delay(3000)

    console.log('✓ Done!\n')
})

/**
 * Simulate a progress bar
 */
const progressDemo = Effect.gen(function* () {
    console.log('\n📊 Progress Bar Demo\n')

    // Simulate progress updates
    for (let i = 0; i <= 10; i++) {
        const percentage = i * 10
        console.log(
            `Progress: ${Array(percentage / 10)
                .fill('█')
                .join('')}${Array(10 - percentage / 10)
                .fill('░')
                .join('')} ${percentage}%`
        )
        yield* delay(200)
    }

    console.log('\n✓ Download complete!\n')
})

/**
 * Run all demos
 */
export const main = () => {
    return Effect.runPromise(
        Effect.gen(function* () {
            yield* spinnerDemo
            yield* progressDemo

            // Show completion message
            yield* renderInkComponent(
                <Message
                    message="All demos completed successfully!"
                    type="success"
                />
            )
        })
    )
}

// Run if executed directly
if (import.meta.main) {
    main().catch((err) => {
        console.error('Error:', err)
        process.exit(1)
    })
}
