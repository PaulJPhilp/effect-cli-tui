import * as Effect from 'effect/Effect'

export class TUIHandler {
    display(
        message: string,
        type: 'info' | 'success' | 'error'
    ): Effect.Effect<void> {
        return Effect.sync(() => {
            const prefix =
                type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'
            console.log(`\n${prefix} ${message}`)
        })
    }
}
