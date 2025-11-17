# Runtime Setup for effect-cli-tui

## Overview

Before implementing Phase 1 fixes, we've set up a `ManagedRuntime` infrastructure that bundles all services together. This simplifies the API and aligns with Effect best practices as documented in the [Effect Runtime documentation](https://effect.website/docs/runtime/).

## What Was Added

### New File: `src/runtime.ts`

This module provides pre-configured runtimes with all necessary services:

1. **EffectCLIRuntime** - Full runtime with all services (CLI, TUI, Display, Ink, Terminal)
2. **TUIHandlerRuntime** - Runtime with TUI services only
3. **EffectCLIOnlyRuntime** - Runtime with CLI service only
4. **DisplayRuntime** - Runtime with Display service only
5. **Convenience functions** - `runWithRuntime()`, `runWithTUI()`, `runWithCLI()`

## Benefits

### 1. Simplified API

**Before (manual layer provision):**
```typescript
const program = Effect.gen(function* () {
  const tui = yield* TUIHandler
  const name = yield* tui.prompt('Name:')
  return name
}).pipe(Effect.provide(TUIHandler.Default))

await Effect.runPromise(program)
```

**After (with Runtime):**
```typescript
import { TUIHandlerRuntime } from 'effect-cli-tui'

const program = Effect.gen(function* () {
  const tui = yield* TUIHandler
  const name = yield* tui.prompt('Name:')
  return name
})

await TUIHandlerRuntime.runPromise(program)
```

### 2. Centralized Dependency Management

The Runtime automatically handles:
- Service layer composition
- Dependency ordering (e.g., InkService before TUIHandler)
- Resource cleanup via `ManagedRuntime.dispose()`

### 3. Better for CLI Applications

For CLI tools, you typically want all services available. The Runtime makes this easy:

```typescript
import { EffectCLIRuntime } from 'effect-cli-tui'

const main = async () => {
  const program = Effect.gen(function* () {
    const cli = yield* EffectCLI
    const tui = yield* TUIHandler
    
    const name = yield* tui.prompt('Project name:')
    const result = yield* cli.run('npm', ['init', '-y'])
    yield* tui.display('Project created!', 'success')
    return result
  })
  
  await EffectCLIRuntime.runPromise(program)
  await EffectCLIRuntime.dispose() // Clean up resources
}
```

## Current Limitations

### TUIHandler Dependency Issue

Currently, `TUIHandler` methods manually provide `InkService.Default`:

```typescript
// src/tui.ts:102
prompt: (...) => Effect.gen(function* () {
  const ink = yield* InkService;
  // ...
}).pipe(Effect.provide(InkService.Default))  // ❌ Manual provision
```

**This will be fixed in Phase 1** by:
1. Changing `effect: Effect.sync(...)` to `effect: Effect.gen(function* () { ... })`
2. Yielding `InkService` in the service definition
3. Declaring `dependencies: [InkService.Default]` in the service config

**After Phase 1 fix:**
```typescript
export class TUIHandler extends Effect.Service<TUIHandler>()("app/TUIHandler", {
  effect: Effect.gen(function* () {
    const ink = yield* InkService; // Declare dependency here
    return {
      prompt: (...) => Effect.gen(function* () {
        // Use ink from closure, no manual provision needed
        return yield* ink.renderWithResult(...)
      }),
      // ...
    }
  }),
  dependencies: [InkService.Default] // Declare dependency
}) {}
```

## Usage Examples

### Full CLI Application

```typescript
import { Effect, TUIHandler, EffectCLI } from 'effect-cli-tui'
import { EffectCLIRuntime } from 'effect-cli-tui'

const setupProject = Effect.gen(function* () {
  const tui = yield* TUIHandler
  const cli = yield* EffectCLI
  
  const name = yield* tui.prompt('Project name:')
  const template = yield* tui.selectOption('Template:', ['basic', 'cli', 'full'])
  
  yield* tui.display('Creating project...', 'info')
  const result = yield* cli.run('npm', ['init', '-y'])
  
  yield* tui.display('Project created!', 'success')
  return result
})

// Run with full runtime
await EffectCLIRuntime.runPromise(setupProject)
await EffectCLIRuntime.dispose()
```

### TUI Only

```typescript
import { Effect, TUIHandler } from 'effect-cli-tui'
import { TUIHandlerRuntime } from 'effect-cli-tui'

const collectInfo = Effect.gen(function* () {
  const tui = yield* TUIHandler
  const name = yield* tui.prompt('Name:')
  const email = yield* tui.prompt('Email:')
  return { name, email }
})

const info = await TUIHandlerRuntime.runPromise(collectInfo)
await TUIHandlerRuntime.dispose()
```

### Convenience Function (Auto-dispose)

```typescript
import { Effect, TUIHandler } from 'effect-cli-tui'
import { runWithTUI } from 'effect-cli-tui'

const program = Effect.gen(function* () {
  const tui = yield* TUIHandler
  return yield* tui.prompt('Name:')
})

// Automatically disposes runtime after execution
const name = await runWithTUI(program)
```

## Integration with Phase 1 Fixes

The Runtime setup enables cleaner Phase 1 fixes:

1. **Fix TUIHandler Dependencies** - Once fixed, Runtime will automatically handle dependency injection
2. **Update README Examples** - Can show Runtime usage as the recommended pattern
3. **Simplify Tests** - Tests can use Runtime instead of manual layer provision
4. **Better Error Messages** - Runtime provides better context for missing dependencies

## Next Steps

1. ✅ Runtime infrastructure created
2. ⏳ Fix TUIHandler service dependencies (Phase 1)
3. ⏳ Update README with Runtime examples
4. ⏳ Update tests to use Runtime where appropriate
5. ⏳ Fix other Phase 1 issues (stream() bug, type declarations, etc.)

## References

- [Effect Runtime Documentation](https://effect.website/docs/runtime/)
- [ManagedRuntime API](https://effect.website/docs/runtime/#managedruntime)
- Design Review: `DESIGN_REVIEW.md` (Phase 1 recommendations)

