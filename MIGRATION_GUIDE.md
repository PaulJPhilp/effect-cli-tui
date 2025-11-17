# Migration Guide: v1.x → v2.0.0

Comprehensive guide for migrating from **effect-cli-tui v1.x** to **v2.0.0** (Ink-based interactive terminals).

## Overview

**v2.0.0 is a major breaking release** with two significant changes:

1. **Architecture**: Refactored to `Effect.Service` pattern for better dependency injection and testability
2. **UI Framework**: Migrated from console-based + `@inquirer/prompts` to **Ink (React for terminal)** for modern interactive components

## What's New in v2.0.0 ✨

- 🎨 **React-based interactive components** via Ink
- 🔧 **Effect.Service pattern** for modern dependency injection
- ⌨️ **Rich input components**: Input, Select, MultiSelect, Confirm, Password
- 📊 **Progress indicators**: Spinner, ProgressBar
- 💪 **Better composability** with Effect runtime
- ✅ **Type-safe error handling** with tagged errors
- 🧪 **Better testability** with mock layers and ink-testing-library

---

## Quick Reference: What Changed

### Interactive Prompts

**v1.x** - Used `@inquirer/prompts`:
```typescript
import { promptInput, promptChoice } from 'effect-cli-tui'

const name = await Effect.runPromise(
  promptInput('Name:')  // One import per function
)
```

**v2.0.0** - Uses Ink + Effect.Service:
```typescript
import { renderInkWithResult, Input } from 'effect-cli-tui'

const name = yield* renderInkWithResult((onComplete) =>
  <Input message="Name:" onSubmit={onComplete} />
)
```

### Service Instantiation

**v1.x**:
```typescript
const tui = new TUIHandler()
const cli = new EffectCLI()
```

**v2.0.0**:
```typescript
const program = Effect.gen(function* () {
  const tui = yield* TUIHandler
  const cli = yield* EffectCLI
  // ... use services
}).pipe(
  Effect.provide(TUIHandler.Default),
  Effect.provide(EffectCLI.Default)
)
```

---

## Detailed Migration Steps

### Step 1: Update Service Instantiation

**Before (v1.x):**
```typescript
import { EffectCLI, TUIHandler } from 'effect-cli-tui'

const cli = new EffectCLI()
const tui = new TUIHandler()

const result = await Effect.runPromise(cli.run('build'))
```

**After (v2.0.0):**
```typescript
import { EffectCLI, TUIHandler } from 'effect-cli-tui'

const program = Effect.gen(function* () {
  const cli = yield* EffectCLI
  const tui = yield* TUIHandler

  const result = yield* cli.run('build')
  return result
}).pipe(
  Effect.provide(EffectCLI.Default),
  Effect.provide(TUIHandler.Default)
)

await Effect.runPromise(program)
```

### Step 2: Migrate Interactive Prompts to Ink Components

The biggest change in v2.0 is the migration from `@inquirer/prompts` to **Ink-based React components**.

#### Text Input

**v1.x**:
```typescript
import { promptInput } from 'effect-cli-tui'

const name = yield* promptInput('Name:', {
  validate: (v) => v.length > 0 || 'Required'
})
```

**v2.0.0**:
```typescript
import { renderInkWithResult, Input } from 'effect-cli-tui'

const name = yield* renderInkWithResult<string>((onComplete) =>
  <Input
    message="Name:"
    validate={(v) => v.length > 0 || 'Required'}
    onSubmit={onComplete}
  />
)
```

#### Single Selection

**v1.x**:
```typescript
import { promptChoice } from 'effect-cli-tui'

const choice = yield* promptChoice('Choose:', ['A', 'B', 'C'])
```

**v2.0.0**:
```typescript
import { renderInkWithResult, Select } from 'effect-cli-tui'

const choice = yield* renderInkWithResult<string>((onComplete) =>
  <Select
    message="Choose:"
    choices={['A', 'B', 'C']}
    onSubmit={onComplete}
  />
)
```

#### Multiple Selection

**v1.x**:
```typescript
import { promptMultiSelect } from 'effect-cli-tui'

const selected = yield* promptMultiSelect('Pick:', ['A', 'B', 'C'])
```

**v2.0.0**:
```typescript
import { renderInkWithResult, MultiSelect } from 'effect-cli-tui'

const selected = yield* renderInkWithResult<string[]>((onComplete) =>
  <MultiSelect
    message="Pick:"
    choices={['A', 'B', 'C']}
    onSubmit={onComplete}
  />
)
```

#### Confirmation

**v1.x**:
```typescript
import { promptConfirm } from 'effect-cli-tui'

const confirmed = yield* promptConfirm('Continue?')
```

**v2.0.0**:
```typescript
import { renderInkWithResult, Confirm } from 'effect-cli-tui'

const confirmed = yield* renderInkWithResult<boolean>((onComplete) =>
  <Confirm
    message="Continue?"
    default={true}
    onSubmit={onComplete}
  />
)
```

#### Password Input

**v1.x**:
```typescript
import { promptPassword } from 'effect-cli-tui'

const password = yield* promptPassword('Password:')
```

**v2.0.0**:
```typescript
import { renderInkWithResult, Password } from 'effect-cli-tui'

const password = yield* renderInkWithResult<string>((onComplete) =>
  <Password
    message="Password:"
    onSubmit={onComplete}
  />
)
```

### Step 3: Update Progress Indicators

**v1.x**:
```typescript
import { startSpinner, stopSpinner } from 'effect-cli-tui'

startSpinner('Loading...')
await doWork()
stopSpinner()
```

**v2.0.0**:
```typescript
import { renderInkComponent, SpinnerComponent } from 'effect-cli-tui'

// Show spinner while work completes
yield* renderInkComponent(
  <SpinnerComponent message="Loading..." />
)
```

### Step 4: Update TUIHandler.display() Calls

**v1.x**:
```typescript
const tui = new TUIHandler()
yield* tui.display('Success!', 'success')
```

**v2.0.0**:
```typescript
const tui = yield* TUIHandler
yield* tui.display('Success!', 'success')
```

The API is identical, only the instantiation changed.

---

## Complete Migration Example

### Before (v1.x)

```typescript
import { EffectCLI, TUIHandler, promptInput, promptChoice, promptConfirm } from 'effect-cli-tui'
import * as Effect from 'effect/Effect'

async function setupProject() {
  const cli = new EffectCLI()
  const tui = new TUIHandler()

  const projectName = await Effect.runPromise(
    promptInput('Project name:')
  )

  const type = await Effect.runPromise(
    promptChoice('Type:', ['Web', 'CLI', 'Library'])
  )

  const confirmed = await Effect.runPromise(
    promptConfirm(`Create ${projectName}?`)
  )

  if (!confirmed) return

  await Effect.runPromise(cli.run('init', [projectName, type]))

  console.log('✓ Project created!')
}

setupProject().catch(console.error)
```

### After (v2.0.0)

```typescript
import { EffectCLI, TUIHandler, renderInkWithResult, Input, Select, Confirm } from 'effect-cli-tui'
import * as Effect from 'effect/Effect'

const setupProject = Effect.gen(function* () {
  const cli = yield* EffectCLI
  const tui = yield* TUIHandler

  const projectName = yield* renderInkWithResult<string>((onComplete) =>
    <Input
      message="Project name:"
      onSubmit={onComplete}
    />
  )

  const type = yield* renderInkWithResult<string>((onComplete) =>
    <Select
      message="Type:"
      choices={['Web', 'CLI', 'Library']}
      onSubmit={onComplete}
    />
  )

  const confirmed = yield* renderInkWithResult<boolean>((onComplete) =>
    <Confirm
      message={`Create ${projectName}?`}
      onSubmit={onComplete}
    />
  )

  if (!confirmed) {
    yield* tui.display('Cancelled', 'error')
    return
  }

  yield* cli.run('init', [projectName, type])
  yield* tui.display('Project created!', 'success')
}).pipe(
  Effect.provide(EffectCLI.Default),
  Effect.provide(TUIHandler.Default),
  Effect.catchTag('CLIError', (err) => {
    console.error('Error:', err.message)
    return Effect.fail(err)
  })
)

Effect.runPromise(setupProject).catch(console.error)
```

---

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

**A:** No. The legacy `promptInput`, `promptChoice`, `promptConfirm`, and related helpers were removed along with the `@inquirer/prompts` dependency. All interactive flows now go through Ink components via `TUIHandler` or `renderInkWithResult`.

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

