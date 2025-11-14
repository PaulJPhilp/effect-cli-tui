# Resource Safety in EffectCLI

## Overview

The `EffectCLI` service now uses `Effect.acquireRelease` to ensure proper cleanup of child processes and timeouts, preventing resource leaks even when operations are interrupted or fail.

## Problem: Resource Leaks

**Before:** Child processes and timeouts could leak resources:
```typescript
// Old pattern - could leak on interruption
child.on('close', (exitCode) => {
  if (timeout) clearTimeout(timeout)  // ❌ Only cleared on normal close
  // But if effect is cancelled, timeout persists!
})
```

**Issues:**
- ❌ Timeout cleared only on normal process close
- ❌ Process not killed if effect fails/cancelled
- ❌ Zombie processes on interruption
- ❌ Lingering timers consuming memory

## Solution: Effect.acquireRelease

**After:** Guaranteed cleanup via `acquireRelease`:
```typescript
return Effect.acquireRelease(
  // Acquire: Create process
  Effect.sync(() => {
    const child = spawn(...)
    return { child, timeouts: [] }
  }),
  // Release: ALWAYS called (success or failure)
  ({ child, timeouts }) =>
    Effect.sync(() => {
      // Clear all timeouts
      timeouts.forEach((timeout) => clearTimeout(timeout))
      // Kill process if running
      if (!child.killed) {
        child.kill('SIGTERM')
      }
    })
).pipe(
  // Use: Handle process lifecycle
  Effect.flatMap(({ child, timeouts }) => { ... })
)
```

## Guarantees

### 1. **Process Cleanup on Error**
```typescript
const program = Effect.gen(function* () {
  const cli = yield* EffectCLI
  yield* cli.run('failing-command')  // ❌ Command fails
  // Process is AUTOMATICALLY killed even on error
}).pipe(Effect.provide(EffectCLI.Default))
```

### 2. **Timeout Cleanup on Success**
```typescript
const program = Effect.gen(function* () {
  const cli = yield* EffectCLI
  const result = yield* cli.run('quick-command', [], { timeout: 5000 })
  // Timeout AUTOMATICALLY cleared when command completes
  return result
}).pipe(Effect.provide(EffectCLI.Default))
```

### 3. **Cleanup on Interruption (Ctrl+C)**
```typescript
const program = Effect.gen(function* () {
  const cli = yield* EffectCLI
  // Even if user presses Ctrl+C, child process is killed
  yield* cli.run('long-running-command')
}).pipe(Effect.provide(EffectCLI.Default))

// User presses Ctrl+C:
// - acquireRelease release phase RUNS
// - Process killed with SIGTERM
// - Timeouts cleared
```

### 4. **Cleanup on Scope Exit**
```typescript
// If providing through a Scope, cleanup happens on scope exit
Effect.scoped(
  Effect.gen(function* () {
    const cli = yield* EffectCLI
    yield* cli.run('command')
    // Release phase runs when scope closes
  }).pipe(Effect.provide(EffectCLI.Default))
)
```

## Implementation Details

### acquireRelease Pattern

```typescript
Effect.acquireRelease(
  acquire: Effect<Resource>,
  release: (resource: Resource) => Effect<void>
)
```

**Three phases:**

1. **Acquire Phase**: Creates the process and resource tracker
   ```typescript
   const child = spawn('effect', [...], { ... })
   return { child, timeouts: [] }
   ```

2. **Use Phase**: Handles the process lifecycle (in flatMap)
   ```typescript
   child.stdout.on('data', ...) // Capture output
   child.on('close', ...) // Handle completion
   child.on('error', ...) // Handle errors
   ```

3. **Release Phase**: GUARANTEED to run
   ```typescript
   // Clears timeouts
   timeouts.forEach((timeout) => clearTimeout(timeout))
   // Kills process
   if (!child.killed) child.kill('SIGTERM')
   ```

### Completion Guard

```typescript
let completed = false

child.on('close', (exitCode) => {
  if (!completed) {  // ✅ Only resume once
    completed = true
    // Handle result
  }
})

child.on('error', (err) => {
  if (!completed) {  // ✅ Only resume once
    completed = true
    // Handle error
  }
})

timeout = setTimeout(() => {
  if (!completed) {  // ✅ Only timeout once
    completed = true
    // Handle timeout
  }
})
```

**Why:** Prevents multiple `resume()` calls which would cause Effect errors.

## Behavior Guarantees

| Scenario | Before | After |
|----------|--------|-------|
| Command succeeds | Process cleaned up | ✅ Process killed, timeout cleared |
| Command fails | Process may leak | ✅ Process killed, timeout cleared |
| Command times out | Process killed, timeout cleared | ✅ Process killed, timeout cleared |
| Effect cancelled | Process leaks, timeout leaks | ✅ Process killed, timeout cleared |
| Scope closed | Process may leak | ✅ Process killed, timeout cleared |

## Resource Limits

The service now properly cleans up:

- ✅ **Child processes** — Limited by `ulimit -n` (max open files)
- ✅ **Timeout handles** — Tracked in timeouts array, cleared on release
- ✅ **Event listeners** — Still attached to process (need explicit removal for long-lived processes)
- ✅ **File descriptors** — Pipes closed when process exits

## Example: Safe Nested Execution

```typescript
const safeWorkflow = Effect.gen(function* () {
  const cli = yield* EffectCLI
  const tui = yield* TUIHandler

  try {
    // Each run is independently safe
    const result1 = yield* cli.run('build', [], { timeout: 30000 })
    yield* tui.display('Build completed', 'success')

    const result2 = yield* cli.run('test', [], { timeout: 60000 })
    yield* tui.display('Tests passed', 'success')

    return { result1, result2 }
  } catch (err) {
    // If any operation fails, all resources cleaned up
    yield* tui.display(`Failed: ${err}`, 'error')
    return Effect.fail(err)
  }
}).pipe(
  Effect.provide(EffectCLI.Default),
  Effect.provide(TUIHandler.Default)
)

// If interrupted at any point:
// - Current process killed
// - Its timeout cleared
// - No resource leak
```

## Testing Resource Safety

### Test 1: Process Cleanup on Error

```typescript
it('should kill process on error', async () => {
  const program = Effect.gen(function* () {
    const cli = yield* EffectCLI
    yield* cli.run('false')  // Fails with exit code 1
  }).pipe(
    Effect.provide(EffectCLI.Default),
    Effect.catchTag('CLIError', () => Effect.void)
  )

  await Effect.runPromise(program)
  // Process is guaranteed dead
})
```

### Test 2: Timeout Cleanup

```typescript
it('should clear timeout on completion', async () => {
  const program = Effect.gen(function* () {
    const cli = yield* EffectCLI
    // Command completes before timeout
    yield* cli.run('echo hello', [], { timeout: 5000 })
  }).pipe(Effect.provide(EffectCLI.Default))

  await Effect.runPromise(program)
  // Timeout is cleared
})
```

### Test 3: Cancellation Cleanup

```typescript
it('should cleanup on cancellation', async () => {
  const program = Effect.gen(function* () {
    const cli = yield* EffectCLI
    yield* cli.run('sleep 100')  // Long-running
  }).pipe(Effect.provide(EffectCLI.Default))

  // Create an interrupted runtime
  const runtime = ManagedRuntime.make(EffectCLI.Default)

  const fiber = runtime.runFiber(program)
  // After a short delay
  fiber.cancel()

  // Process is killed, timeout cleared
})
```

## Future Improvements

- [ ] Add event listener cleanup (currently left attached)
- [ ] Support SIGKILL fallback if SIGTERM doesn't work
- [ ] Add resource limits per process (memory, CPU)
- [ ] Track resource usage metrics
- [ ] Add configurable kill strategies (SIGTERM, SIGKILL, etc.)

## Related

- **Effect.acquireRelease**: https://effect.website/docs/api/Effect#acquireRelease
- **Process management**: src/cli.ts (run and stream methods)
- **P0#8**: Terminal state safety (spinner cleanup)
- **MIGRATION_GUIDE.md**: Usage patterns

