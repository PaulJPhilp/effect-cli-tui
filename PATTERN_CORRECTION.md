# Effect Service Pattern Correction

## Summary

This document records the correction from incorrect service patterns to the modern **Effect.Service API** (Effect 3.9+).

## ❌ Anti-Pattern: Rejected

The following patterns are **FORBIDDEN**:

1. **Plain classes with `new` keyword:**
   ```typescript
   export class EffectCLI {
     run(...): Effect<T, E> { ... }
   }

   const cli = new EffectCLI()  // ❌ NO
   ```

2. **Manual Context.Tag + Layer composition:**
   ```typescript
   export class EffectCLI extends Context.Tag("EffectCLI")<...>() {}
   export const EffectCLILive = Layer.succeed(EffectCLI, ...)  // ❌ NO
   ```

These patterns do NOT provide:
- Proper dependency injection
- Testability with mock layers
- Composability with Effect runtime
- Alignment with modern Effect standards (3.9+)

## ✅ Correct Pattern: Effect.Service API

**All services must use `Effect.Service`** from Effect 3.9+:

```typescript
import * as Effect from 'effect/Effect'

export class EffectCLI extends Effect.Service<EffectCLI>()("app/EffectCLI", {
  effect: Effect.gen(function* () {
    return {
      run: (command: string, args?: string[], options?: CLIRunOptions) =>
        Effect.async<CLIResult, CLIError>((resume) => {
          // Implementation
        }),
      stream: (command: string, args?: string[], options?: CLIRunOptions) =>
        Effect.async<void, CLIError>((resume) => {
          // Implementation
        })
    } as const
  }),
  dependencies: [] // Service dependencies if needed
}) {}
```

**Usage:**
```typescript
const program = Effect.gen(function* () {
  const cli = yield* EffectCLI
  const result = yield* cli.run('build')
}).pipe(Effect.provide(EffectCLI.Default))
```

## Why This Pattern?

✅ **Unified Definition** — Context.Tag + Layer in one declaration
✅ **Auto-generated Layers** — `.Default` and `.DefaultWithoutDependencies` created automatically
✅ **Composable** — Works seamlessly with Effect's runtime and composition
✅ **Testable** — Easy to mock:
```typescript
export const MockCLI = Effect.Service<EffectCLI>()("app/EffectCLI", {
  effect: Effect.sync(() => ({
    run: () => Effect.succeed({ exitCode: 0, stdout: '', stderr: '' }),
    stream: () => Effect.void
  }))
}).Default
```

✅ **Modern Standard** — Effect 3.9+ recommended approach
✅ **Type-Safe** — Full TypeScript support with auto-inference

## Files Updated

- **CLAUDE.md** — Added "Effect Service Pattern (Required)" section
- **ISSUES.md** — Updated Issue #6 with correct Effect.Service pattern
- **PATTERN_CORRECTION.md** — This document

## Services to Refactor (P0#6)

Priority order for Effect.Service refactoring:
1. `src/cli.ts` → `EffectCLI` class
2. `src/tui.ts` → `TUIHandler` class
3. Supporting services in `src/core/` (Output, Signals, etc.)

## Implementation Notes

When refactoring to Effect.Service:
- Keep all public method signatures the same
- Move implementation into the `effect` generator
- Return object with methods as `const` for inference
- Add proper error typing with `Data.TaggedError`
- Create corresponding mock services for testing

## Related Breaking Changes

Users will need to update usage:

**Before:**
```typescript
const cli = new EffectCLI()
const result = await Effect.runPromise(cli.run('build'))
```

**After:**
```typescript
const program = Effect.gen(function* () {
  const cli = yield* EffectCLI
  return yield* cli.run('build')
}).pipe(Effect.provide(EffectCLI.Default))

await Effect.runPromise(program)
```

---

**Status:** Guidelines corrected and documented. Ready for P0#6 implementation.
