# Migration Guide: Effect.Service Refactoring

This guide helps you migrate code from the old class-based pattern to the new `Effect.Service` pattern (Effect 3.9+).

## Overview

The `EffectCLI` and `TUIHandler` services have been refactored to use the modern `Effect.Service` API. This provides better dependency injection, testability, and composability.

## Before (Old Pattern) ❌

```typescript
import { EffectCLI, TUIHandler } from 'effect-cli-tui'

const program = async () => {
  const cli = new EffectCLI()
  const tui = new TUIHandler()

  const result = await Effect.runPromise(cli.run('build'))

  const name = await Effect.runPromise(tui.prompt('Your name:'))
}
```

**Issues with this pattern:**
- Manual instantiation with `new` keyword
- Cannot inject different implementations
- Difficult to test (hard to mock)
- Not composable with Effect runtime

## After (Effect.Service Pattern) ✅

```typescript
import { EffectCLI, TUIHandler } from 'effect-cli-tui'
import { Effect } from 'effect'

const program = Effect.gen(function* () {
  const cli = yield* EffectCLI
  const tui = yield* TUIHandler

  const result = yield* cli.run('build')
  yield* tui.display(`Completed!`, 'success')

  const name = yield* tui.prompt('Your name:')
  return name
}).pipe(
  Effect.provide(EffectCLI.Default),
  Effect.provide(TUIHandler.Default)
)

await Effect.runPromise(program)
```

**Benefits:**
- ✅ Composable with Effect runtime
- ✅ Easy dependency injection
- ✅ Testable with mock layers
- ✅ Proper resource management
- ✅ Type-safe error handling

---

## EffectCLI Changes

### API Remains the Same

The public methods are identical:

```typescript
// run(command, args?, options?)
const result = yield* cli.run('build', ['--release'], { timeout: 30000 })

// stream(command, args?, options?)
yield* cli.stream('npm', ['install'])
```

### Usage Pattern Changed

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

### Error Handling (Unchanged)

```typescript
yield* cli.run('build').pipe(
  Effect.catchTag('CLIError', (err) => {
    if (err.reason === 'Timeout') {
      // Handle timeout
    }
    return Effect.fail(err)
  })
)
```

---

## TUIHandler Changes

### API Enhanced

New methods added to match README documentation:

```typescript
const tui = yield* TUIHandler

// Display (existing, unchanged)
yield* tui.display('Welcome!', 'success')

// Prompt methods (now available via TUIHandler service!)
const name = yield* tui.prompt('Enter name:')
const confirmed = yield* tui.confirm('Continue?')
const choice = yield* tui.selectOption('Choose:', ['A', 'B', 'C'])
const selected = yield* tui.multiSelect('Select:', ['A', 'B', 'C'])
const password = yield* tui.password('Enter password:')
```

### Usage Pattern Changed

**Before:**
```typescript
import { TUIHandler } from 'effect-cli-tui'
import { promptInput } from 'effect-cli-tui' // Had to import separately

const tui = new TUIHandler()
const name = await Effect.runPromise(promptInput('Name:'))
```

**After:**
```typescript
import { TUIHandler } from 'effect-cli-tui'

const program = Effect.gen(function* () {
  const tui = yield* TUIHandler
  const name = yield* tui.prompt('Name:')
}).pipe(Effect.provide(TUIHandler.Default))

await Effect.runPromise(program)
```

### Error Handling

```typescript
yield* tui.prompt('Name:').pipe(
  Effect.catchTag('TUIError', (err) => {
    if (err.reason === 'ValidationFailed') {
      // Handle validation error
    }
    return Effect.fail(err)
  })
)
```

---

## Testing with Mock Layers

### EffectCLI Mock

```typescript
import { Effect, Layer } from 'effect'

export const MockEffectCLI = Effect.Service<EffectCLI>()('app/EffectCLI', {
  effect: Effect.sync(() => ({
    run: () => Effect.succeed({
      exitCode: 0,
      stdout: 'mock output',
      stderr: ''
    }),
    stream: () => Effect.void
  }))
}).Default

// Use in tests:
const testProgram = Effect.gen(function* () {
  const cli = yield* EffectCLI
  return yield* cli.run('test')
}).pipe(Effect.provide(MockEffectCLI))

// Output will be from mock, not actual CLI
```

### TUIHandler Mock

```typescript
export const MockTUIHandler = Effect.Service<TUIHandler>()('app/TUIHandler', {
  effect: Effect.sync(() => ({
    display: () => Effect.void,
    prompt: () => Effect.succeed('mock input'),
    selectOption: () => Effect.succeed('option 1'),
    multiSelect: () => Effect.succeed(['option 1']),
    confirm: () => Effect.succeed(true),
    password: () => Effect.succeed('password123')
  }))
}).Default

// Use in tests:
const testProgram = Effect.gen(function* () {
  const tui = yield* TUIHandler
  const name = yield* tui.prompt('Name:')
  return name
}).pipe(Effect.provide(MockTUIHandler))
```

---

## Full Migration Example

### Before

```typescript
import { EffectCLI, TUIHandler } from 'effect-cli-tui'
import * as Effect from 'effect/Effect'

async function setupProject() {
  const cli = new EffectCLI()
  const tui = new TUIHandler()

  try {
    const projectName = await Effect.runPromise(
      tui.prompt('Project name:')
    )

    const confirmed = await Effect.runPromise(
      tui.confirm(`Create ${projectName}?`)
    )

    if (confirmed) {
      const result = await Effect.runPromise(
        cli.run('create', [projectName])
      )
      console.log('Project created!')
    }
  } catch (err) {
    console.error('Failed:', err)
  }
}

setupProject()
```

### After

```typescript
import { EffectCLI, TUIHandler } from 'effect-cli-tui'
import * as Effect from 'effect/Effect'

const setupProject = Effect.gen(function* () {
  const cli = yield* EffectCLI
  const tui = yield* TUIHandler

  yield* tui.display('Setting up project...', 'info')

  const projectName = yield* tui.prompt('Project name:')

  const confirmed = yield* tui.confirm(`Create ${projectName}?`)

  if (!confirmed) {
    yield* tui.display('Cancelled', 'error')
    return Effect.fail(new Error('User cancelled'))
  }

  const result = yield* cli.run('create', [projectName])

  yield* tui.display('Project created!', 'success')

  return result
}).pipe(
  Effect.provide(EffectCLI.Default),
  Effect.provide(TUIHandler.Default),
  Effect.catchTag('CLIError', (err) => {
    console.error('CLI Error:', err.message)
    return Effect.fail(err)
  }),
  Effect.catchTag('TUIError', (err) => {
    console.error('TUI Error:', err.message)
    return Effect.fail(err)
  })
)

await Effect.runPromise(setupProject)
```

---

## Breaking Changes Summary

| Aspect | Before | After |
|--------|--------|-------|
| **Instantiation** | `new EffectCLI()` | `yield* EffectCLI` |
| **Dependencies** | Constructor injection | `Effect.provide()` |
| **Testing** | Manual mocking | `MockLayer` pattern |
| **Composition** | Promise-based | Effect-based composition |
| **Error Handling** | Try/catch | `Effect.catchTag()` |
| **TUIHandler.prompt** | ❌ Not available | ✅ `yield* tui.prompt()` |

---

## Migration Checklist

- [ ] Replace `new EffectCLI()` with `yield* EffectCLI`
- [ ] Replace `new TUIHandler()` with `yield* TUIHandler`
- [ ] Wrap code in `Effect.gen()` block
- [ ] Add `.pipe(Effect.provide(EffectCLI.Default))`
- [ ] Add `.pipe(Effect.provide(TUIHandler.Default))`
- [ ] Replace `await Effect.runPromise()` for each service call with single run
- [ ] Update error handling to use `Effect.catchTag()`
- [ ] Update tests to use mock layers
- [ ] Remove separate imports of `promptInput`, `promptChoice`, etc.

---

## FAQ

### Q: Do I need to use all services?

**A:** No. You can use only the services you need:

```typescript
const program = Effect.gen(function* () {
  const cli = yield* EffectCLI
  return yield* cli.run('build')
}).pipe(Effect.provide(EffectCLI.Default))
```

### Q: Can I still import standalone prompt functions?

**A:** Yes, `promptInput`, `promptChoice`, etc. are still exported from `interactive/prompt.ts` for advanced use cases. But you should prefer using `TUIHandler` for consistency.

### Q: How do I provide dependencies for services?

**A:** Use `Effect.provide()` with the `.Default` layer:

```typescript
program.pipe(
  Effect.provide(EffectCLI.Default),
  Effect.provide(TUIHandler.Default)
)
```

Or in a single call:

```typescript
program.pipe(
  Effect.provide([EffectCLI.Default, TUIHandler.Default])
)
```

### Q: What if I need custom implementations?

**A:** Create your own Effect.Service layer:

```typescript
const CustomCLI = Effect.Service<EffectCLI>()('app/EffectCLI', {
  effect: Effect.sync(() => ({
    run: /* your implementation */,
    stream: /* your implementation */
  }))
}).Default

program.pipe(Effect.provide(CustomCLI))
```

---

## Getting Help

- Check the code examples in `src/` files for JSDoc documentation
- Review test files in `__tests__/` for usage patterns
- Read the Effect.Service guide: https://effect.website/blog/releases/effect/39/

