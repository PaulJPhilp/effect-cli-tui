# Architecture

Technical architecture and design decisions for effect-cli-tui.

## Table of Contents

- [Overview](#overview)
- [Core Components](#core-components)
- [Design Patterns](#design-patterns)
- [Error Handling](#error-handling)
- [Testing Strategy](#testing-strategy)
- [Future Enhancements](#future-enhancements)

---

## Overview

effect-cli-tui is built on two core principles:

1. **Effect-First**: Everything is an Effect for composable, type-safe error handling
2. **Separation of Concerns**: Clear boundaries between CLI execution and interactive UI

```
┌─────────────────────────────────────────────┐
│        User Application Code                │
└─────────────────────────────────────────────┘
           ↓            ↓
    ┌──────────────┐ ┌──────────────┐
    │  TUIHandler  │ │ EffectCLI    │
    └──────────────┘ └──────────────┘
           ↓            ↓
    ┌──────────────┐ ┌──────────────┐
    │  @inquirer   │ │ child_process│
    └──────────────┘ └──────────────┘
```

---

## Core Components

### 1. TUIHandler

**Purpose:** Provide interactive prompts wrapped in Effect for composable UI interactions.

**Key Design Decisions:**

- **Uses @inquirer/prompts**: Battle-tested, active project, good API
- **Wraps in Effect.tryPromise**: Converts async promises to Effects
- **Consistent Error Typing**: All failures return `TUIError`
- **Display Separate from Input**: `display()` is synchronous, prompts are async

**Methods:**
- `prompt()` - Text input (Effect.tryPromise)
- `selectOption()` - Single select (Effect.tryPromise)
- `multiSelect()` - Checkbox (Effect.tryPromise)
- `confirm()` - Yes/No (Effect.tryPromise)
- `display()` - Console output (Effect.sync)

**Error Flow:**
```
User Input → @inquirer → Promise
                ↓
          Effect.tryPromise()
                ↓
        TUIError('RenderError')
```

### 2. EffectCLI

**Purpose:** Execute CLI commands with Effect error handling, output capture, and timeouts.

**Key Design Decisions:**

- **Uses child_process.spawn**: Direct streams over exec for better control
- **Async Effect Wrapper**: Effect.async for long-running processes
- **Output Capture**: Collects stdout/stderr separately
- **Timeout Support**: Configurable timeout with process cleanup
- **Two Modes**: `run()` for capture, `stream()` for pass-through

**Methods:**
- `run()` - Capture output and return CLIResult
- `stream()` - Stream output directly to console

**Execution Flow:**
```
cli.run('command', ['args']) 
    ↓
Effect.async((resume) => {
  spawn process
  collect stdout/stderr
  on close: resume(Effect.succeed(result))
  on error: resume(Effect.fail(CLIError))
  on timeout: kill process + resume(Effect.fail(CLIError))
})
```

---

## Design Patterns

### 1. Effect Composition

All public methods return `Effect<T, E>` for composable operations:

```typescript
// Can be chained with Effect.gen
const workflow = Effect.gen(function* (_) {
  const name = yield* _(tui.prompt('Name:'))
  const choice = yield* _(tui.selectOption('Choice:', options))
  const result = yield* _(cli.run('build'))
  return { name, choice, result }
})
```

### 2. Typed Errors

Each component defines its own error type:

```typescript
// TUIError for user input failures
type TUIError = {
  _tag: 'TUIError'
  reason: 'Cancelled' | 'ValidationFailed' | 'RenderError'
}

// CLIError for command failures
type CLIError = {
  _tag: 'CLIError'
  reason: 'CommandFailed' | 'Timeout' | 'NotFound'
}
```

Benefits:
- Type-safe error handling with `catchTag()`
- Distinguish between different failure modes
- Clear error semantics in code

### 3. Resource Cleanup

#### TUIHandler
- No resources to clean up (synchronous or throws)

#### EffectCLI
- Process cleanup on timeout
- Stream closure on error
- Guaranteed cleanup via Effect runtime

```typescript
const timeout = options.timeout
  ? setTimeout(() => {
      child.kill()      // Cleanup
      resume(Effect.fail(...))
    }, options.timeout)
  : null

child.on('close', () => {
  if (timeout) clearTimeout(timeout)  // Cleanup
  resume(...)
})
```

### 4. Configuration Objects

Each feature supports options objects for flexibility:

```typescript
// PromptOptions for validation
interface PromptOptions {
  default?: string
  validate?: (input: string) => boolean | string
}

// CLIRunOptions for execution context
interface CLIRunOptions {
  cwd?: string
  env?: Record<string, string>
  timeout?: number
}
```

---

## Error Handling

### TUIHandler Errors

**Scenario: Prompt Rendering Fails**
```typescript
// Caught by @inquirer, wrapped in TUIError
const name = yield* _(
  tui.prompt('Name:').pipe(
    Effect.catchTag('TUIError', (err) => {
      console.error(`Failed to prompt: ${err.message}`)
      return Effect.succeed('default')
    })
  )
)
```

### EffectCLI Errors

**Scenario: Command Not Found**
```typescript
// ENOENT error from spawn
child.on('error', (err) => {
  if (err.code === 'ENOENT') {
    resume(Effect.fail(
      new CLIError('NotFound', 'Effect CLI not found...')
    ))
  }
})
```

**Scenario: Command Timeout**
```typescript
// Timeout exceeded
const timeout = setTimeout(() => {
  child.kill()
  resume(Effect.fail(
    new CLIError('Timeout', 'Command timed out after 30000ms')
  ))
}, 30000)
```

**Scenario: Non-Zero Exit Code**
```typescript
// Process exited with error
child.on('close', (exitCode) => {
  if (exitCode !== 0) {
    resume(Effect.fail(
      new CLIError('CommandFailed', `...exit code ${exitCode}`)
    ))
  }
})
```

---

## Testing Strategy

### Unit Tests

Test individual methods in isolation:

```typescript
describe('TUIHandler', () => {
  it('should display success message', () => {
    // Test display() with console.log spy
  })
})
```

### Integration Tests

Test common workflows:

```typescript
describe('effect-cli-tui Integration', () => {
  it('should compose TUIHandler and EffectCLI', async () => {
    const result = await Effect.runPromise(
      Effect.gen(function* (_) {
        yield* _(tui.display('Starting...', 'info'))
        const result = yield* _(cli.run('--version'))
        return result
      })
    )
  })
})
```

### Test Patterns

**Mocking Prompts:**
```typescript
vi.mocked(inquirerSelect).mockResolvedValue('selected-value')
```

**Verifying Console Output:**
```typescript
const consoleSpy = vi.spyOn(console, 'log')
await Effect.runPromise(tui.display('Test', 'success'))
expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('✓'))
```

**Error Testing:**
```typescript
const error = yield* _(
  cli.run('nonexistent').pipe(
    Effect.flip  // Convert failure to success for testing
  )
)
expect(error.reason).toBe('NotFound')
```

---

## File Structure

```
effect-cli-tui/
├── src/
│   ├── cli.ts           # EffectCLI implementation
│   ├── tui.ts           # TUIHandler implementation
│   ├── types.ts         # Shared types and error classes
│   ├── effects/
│   │   └── ink-wrapper.ts    # Ink rendering (future)
│   └── index.ts         # Public API exports
│
├── __tests__/
│   ├── integration.test.ts   # Integration tests
│   └── ink/              # Ink-specific tests (future)
│
├── docs/
│   ├── README.md        # User documentation
│   ├── API.md           # API reference
│   └── ARCHITECTURE.md  # This file
│
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vitest.config.ts     # Test configuration
└── LICENSE              # MIT License
```

---

## Future Enhancements

### v1.1: Validation & Feedback

**Goal:** Better user feedback and common validations.

```typescript
// Email validation helper
const email = yield* _(
  tui.prompt('Email:', {
    validate: Validators.email()
  })
)

// Progress indicator
yield* _(tui.showProgress('Processing...', effect))
```

### v2.0: Ink Integration

**Goal:** React components for rich terminal UIs.

```typescript
import { renderInkComponent } from 'effect-cli-tui'

const richUI = <MyComponent />
yield* _(renderInkComponent(richUI))
```

**Benefits:**
- Composable React components
- Advanced layouts and interactivity
- Consistent with React ecosystem

**Implementation:**
- Wrap Ink's `render()` in Effect
- Provide component lifecycle management
- Handle errors and cleanup

### v2.1: Supermemory Integration

**Goal:** Context-aware prompts with memory.

```typescript
const context = {
  previousValues: { name: 'John' },
  history: ['...'],
  metadata: {}
}

yield* _(
  tui.promptWithMemory('Name:', context)
)
```

### v3.0: Full TUI Framework

**Goal:** Complete framework for terminal applications.

```
├── Components
│   ├── Forms
│   ├── Tables
│   ├── Trees
│   └── Dialogs
├── Layout System
├── State Management
├── Routing
└── Middleware
```

---

## Design Principles

### 1. **Effect-First**
Everything is an Effect. This enables:
- Type-safe error handling
- Composable workflows
- Testability
- Async coordination

### 2. **Minimal Dependencies**
Only essential libraries:
- `effect` - Runtime and types
- `@inquirer/prompts` - Battle-tested UI
- `child_process` - Built-in Node.js

### 3. **Clear Responsibility**
- `TUIHandler` - User interaction only
- `EffectCLI` - Command execution only
- Types shared cleanly

### 4. **Fail Fast**
- Type errors caught at compile time
- Runtime errors caught by Effect runtime
- Clear error messages for debugging

### 5. **Composable**
- Effects chain with `yield*`
- Workflows built from simple pieces
- Easy to test and understand

---

## Contributing

When extending effect-cli-tui, maintain these principles:

1. **Wrap external async in Effect**: Use `Effect.tryPromise` or `Effect.async`
2. **Define typed errors**: Extend `Data.TaggedError`
3. **Add tests**: Integration tests for new workflows
4. **Document with examples**: Show real usage patterns
5. **Keep it simple**: One responsibility per class

---

## References

- [Effect Documentation](https://www.effect.website)
- [@inquirer/prompts](https://github.com/SBoudrias/Inquirer.js)
- [Node.js child_process](https://nodejs.org/api/child_process.html)
