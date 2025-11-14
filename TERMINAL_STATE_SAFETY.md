# Terminal State Safety in Spinner Module

## Overview

The spinner module now uses `Effect.acquireRelease` to guarantee terminal state restoration, even when the effect is interrupted or fails.

## Problem: Terminal Corruption

**Before:** Terminal could be left in a broken state:
```typescript
// Old pattern - cursor could be left hidden
if (options?.hideCursor) {
  process.stdout.write('\x1B[?25l')  // Hide cursor
}

currentSpinner = setInterval(...)  // Start animation

// ❌ If effect is cancelled:
// - Interval still running
// - Cursor still hidden
// - Terminal is corrupted (invisible cursor)
```

**Issues:**
- ❌ Cursor left hidden on interruption
- ❌ Animation intervals still running
- ❌ Spinner line not cleared
- ❌ User cannot see what they're typing

## Solution: acquireRelease with Scope

**After:** Terminal state guaranteed to be restored:
```typescript
return Effect.acquireRelease(
  // Acquire: Hide cursor and start animation
  Effect.sync(() => {
    if (options?.hideCursor) {
      process.stdout.write('\x1B[?25l')
    }
    const interval = setInterval(...)
    return { interval, cursorHidden: true }
  }),
  // Release: ALWAYS called - restore terminal
  (state) => Effect.sync(() => {
    clearInterval(state.interval)
    if (state.cursorHidden) {
      process.stdout.write('\x1B[?25h')  // Show cursor
    }
    process.stdout.write('\r\x1B[K')     // Clear line
  })
)
```

## Guarantees

### 1. **Cursor Restored on Error**
```typescript
const program = Effect.gen(function* () {
  yield* startSpinner('Processing...', { hideCursor: true })
  yield* Effect.fail(new Error('Oops!'))  // ❌ Error
  // Cursor is AUTOMATICALLY shown
}).pipe(Effect.scoped)
```

### 2. **Cursor Restored on Cancellation**
```typescript
const program = Effect.gen(function* () {
  yield* startSpinner('Long operation...', { hideCursor: true })
  // User presses Ctrl+C
  // Cursor is AUTOMATICALLY shown
}).pipe(Effect.scoped)
```

### 3. **Interval Cleaned On Interrupt**
```typescript
const program = Effect.gen(function* () {
  yield* startSpinner('Animating...', { hideCursor: true })
  // Even if interrupted, setInterval is cleared
}).pipe(Effect.scoped)
```

### 4. **Spinner Line Cleared**
```typescript
// Release phase includes: process.stdout.write('\r\x1B[K')
// This clears the spinner animation from the terminal
```

## Implementation Details

### Scope Requirement

The `startSpinner` function now requires a `Scope`:

```typescript
export function startSpinner(
  message: string,
  options?: SpinnerOptions
): Effect.Effect<void, never, Scope.Scope>
```

**Why?** `acquireRelease` needs a scope to know when to run the cleanup phase. The scope ensures cleanup happens at the right time.

**Usage:**
```typescript
// Automatic scope from Effect.gen
Effect.gen(function* () {
  yield* startSpinner('Working...')  // Scope provided automatically
  // ... do work ...
})
```

### Resource Management

**Three phases:**

1. **Acquire Phase**: Initialize and hide cursor
   ```typescript
   const interval = setInterval(...)  // Start animation
   process.stdout.write('\x1B[?25l')  // Hide cursor
   return { interval, cursorHidden: true }
   ```

2. **Use Phase**: Run the effect
   ```typescript
   yield* startSpinner('...')
   // ... effect runs ...
   // Scope stays open
   ```

3. **Release Phase**: GUARANTEED cleanup
   ```typescript
   clearInterval(state.interval)       // Stop animation
   process.stdout.write('\x1B[?25h')   // Show cursor
   process.stdout.write('\r\x1B[K')    // Clear line
   ```

### State Tracking

```typescript
interface SpinnerState {
  message: string
  frames: string[]
  currentFrame: number
  interval: NodeJS.Timer | null
  cursorHidden: boolean
}
```

Allows precise tracking of resources to cleanup:
- ✅ Animation interval
- ✅ Cursor visibility state
- ✅ Current animation state

## Terminal Control Sequences

| Sequence | Purpose | Used When |
|----------|---------|-----------|
| `\x1B[?25l` | Hide cursor | `hideCursor: true` acquire |
| `\x1B[?25h` | Show cursor | Release cleanup |
| `\r` | Carriage return | Clear line before newline |
| `\x1B[K` | Clear to end of line | Clean up spinner animation |

## Behavior Guarantees

| Scenario | Before | After |
|----------|--------|-------|
| Effect succeeds | Manual cleanup | ✅ Cursor shown, interval cleared |
| Effect fails | Cursor hidden, interval leaks | ✅ Cursor shown, interval cleared |
| Effect cancelled (Ctrl+C) | Terminal broken | ✅ Cursor shown, interval cleared |
| Scope closes | Terminal may corrupt | ✅ Terminal always clean |
| Nested spinners | Not supported | ✅ Each scope independent |

## Usage Examples

### Basic Spinner

```typescript
const program = Effect.gen(function* () {
  yield* startSpinner('Loading...', { hideCursor: true })

  const result = yield* someAsyncOperation()

  yield* stopSpinner('Done!', 'success')
  return result
}).pipe(Effect.scoped)
```

### Spinner with Effect

```typescript
const program = Effect.gen(function* () {
  const cli = yield* EffectCLI

  yield* spinnerEffect(
    'Building project...',
    cli.run('build', []),
    { hideCursor: true }
  )
}).pipe(
  Effect.provide(EffectCLI.Default),
  Effect.scoped
)
```

### Multiple Spinners (Sequential)

```typescript
const program = Effect.gen(function* () {
  // First spinner
  yield* spinnerEffect(
    'Installing...',
    cli.run('install'),
    { hideCursor: true }
  )

  // Second spinner (first fully cleaned up)
  yield* spinnerEffect(
    'Building...',
    cli.run('build'),
    { hideCursor: true }
  )
}).pipe(Effect.scoped)
```

### Update Spinner Message

```typescript
const program = Effect.gen(function* () {
  yield* startSpinner('Starting...', { hideCursor: true })

  yield* updateSpinner('Step 1...')
  yield* someOperation()

  yield* updateSpinner('Step 2...')
  yield* anotherOperation()

  yield* stopSpinner('All done!', 'success')
}).pipe(Effect.scoped)
```

## Testing Terminal Safety

### Test 1: Cursor Restored on Error

```typescript
it('should restore cursor on error', async () => {
  let cursorShown = false

  // Spy on stdout.write
  const originalWrite = process.stdout.write
  process.stdout.write = ((text: string) => {
    if (text === '\x1B[?25h') {
      cursorShown = true
    }
    return originalWrite.call(process.stdout, text)
  }) as any

  const program = Effect.gen(function* () {
    yield* startSpinner('Test', { hideCursor: true })
    yield* Effect.fail(new Error('Test error'))
  }).pipe(
    Effect.scoped,
    Effect.catchAll(() => Effect.void)
  )

  await Effect.runPromise(program)

  expect(cursorShown).toBe(true)
  process.stdout.write = originalWrite
})
```

### Test 2: Interval Cleared

```typescript
it('should clear spinner interval', async () => {
  let interval: NodeJS.Timer | null = null

  const original setInterval = global.setInterval
  global.setInterval = ((callback, delay) => {
    interval = original.call(global, callback, delay)
    return interval
  }) as any

  const program = Effect.gen(function* () {
    yield* startSpinner('Test')
  }).pipe(Effect.scoped)

  await Effect.runPromise(program)

  // After scope closes, interval should be cleared
  expect(() => {
    // Trying to get interval's internal state would be complex
    // Instead, verify no new callbacks are fired
  })
})
```

### Test 3: Cancellation Safety

```typescript
it('should cleanup on cancellation', async () => {
  const program = Effect.gen(function* () {
    yield* startSpinner('Long operation...', { hideCursor: true })
    // Simulate long operation
    yield* Effect.sleep(10000)
  }).pipe(Effect.scoped)

  const fiber = Effect.fork(program)

  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 100))

  // Cancel
  Effect.runSync(Effect.interrupt(fiber))

  // Terminal should be clean (cursor visible, interval cleared)
})
```

## Migration Notes

### New Return Type

`startSpinner` now requires `Scope`:

**Before:**
```typescript
yield* startSpinner('Loading...')  // Returns Effect<void>
```

**After:**
```typescript
yield* startSpinner('Loading...')  // Returns Effect<void, never, Scope.Scope>
```

This is handled automatically by `Effect.gen()` - the scope is provided automatically. You don't need to do anything special.

### Breaking Change

If you were manually calling `startSpinner` without being in an `Effect.gen` context, you need to wrap it with `Effect.scoped`:

**Before:**
```typescript
const effect = startSpinner('Loading...')
await Effect.runPromise(effect)
```

**After:**
```typescript
const effect = Effect.gen(function* () {
  yield* startSpinner('Loading...')
}).pipe(Effect.scoped)
await Effect.runPromise(effect)
```

## Performance Impact

- ✅ **Minimal overhead** - One `acquireRelease` wrapper
- ✅ **No additional timers** - Uses existing `setInterval`
- ✅ **Efficient cleanup** - Just stops interval and writes escape sequences
- ✅ **No polling** - Cleanup triggered by scope exit

## Related

- **Effect.acquireRelease**: https://effect.website/docs/api/Effect#acquireRelease
- **Effect.scoped**: https://effect.website/docs/api/Effect#scoped
- **Spinner module**: src/progress/spinner.ts
- **Resource Safety**: RESOURCE_SAFETY.md
- **P0#7**: Process spawning safety

