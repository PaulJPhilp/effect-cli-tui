# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Prerequisites

**`bun` is required** to work with this codebase.

- Install: https://bun.sh
- Version: Node 20+ compatible
- Commands: Use `bun` instead of `npm`, `pnpm`, or `yarn`

All commands in this guide use `bun` (not `pnpm`/`npm`).

## Quick Commands

### Build & Development
```bash
bun run build              # Build with tsup
bun test                   # Run all tests once
bun test:watch            # Run tests in watch mode
bun test:ui               # Run tests with interactive UI
bun test:coverage         # Run tests with coverage report
bun run lint              # Run ESLint
bun run format            # Format code with Prettier
bun run type-check        # Run TypeScript type checking (non-emitting)
```

### Full Validation Pipeline
```bash
bun run type-check && bun run lint && bun test && bun run build
```

### Single Test File
```bash
bun test __tests__/colors.test.ts
bun test -- --watch __tests__/integration.test.ts
```

## Code Style and Best Practices

### Naming Conventions
- Use **descriptive variable names** with auxiliary verbs: `isLoading`, `hasError`, `canExecute`, `shouldDisplay`
- Use **lowercase with dashes** for directory names: `src/core`, `src/interactive`, `__tests__/integration`
- Use **PascalCase** for classes and components: `TUIHandler`, `EffectCLI`
- Use **camelCase** for functions and variables: `displayJson`, `createPrompt`, `buildWorkflow`

### Code Organization
- Structure files with exported main exports first, then subcomponents/helpers
- Use **modularization over code duplication** — extract reusable logic into separate utility functions or modules
- Keep functions **single-responsibility** — each function should do one thing well
- Use **JSDoc comments** for all exported functions and methods to improve IDE intellisense

```typescript
/**
 * Display a message with optional styling.
 *
 * @param message - The message to display
 * @param options - Display configuration options
 * @returns Effect that displays the message
 *
 * @example
 * ```ts
 * yield* _(display('Hello!', { type: 'success' }))
 * ```
 */
export const display = (message: string, options?: DisplayOptions): Effect<void> => {
  // implementation
}
```

### Error Handling
- **Use early returns** for error conditions to keep code linear
- **Implement guard clauses** to handle preconditions and invalid states early
- **Use custom error types** — always use `Data.TaggedError` for typed error handling
- Avoid deeply nested try-catch blocks; prefer Effect's `.pipe(Effect.catchTag(...))`

```typescript
// Good: Early returns and guard clauses
const validateInput = (input: string): Effect<void, ValidationError> => {
  if (!input) {
    return Effect.fail(new ValidationError('Input required'))
  }
  if (input.length > 100) {
    return Effect.fail(new ValidationError('Input too long'))
  }
  // proceed with valid input
}

// Less ideal: Deeply nested conditionals
if (input) {
  if (input.length <= 100) {
    // processing
  }
}
```

### Functional Programming
- **Favor functional patterns** for utilities and helpers — use pure functions
- **Use functional composition** with Effect's `.pipe()` for chaining operations
- **Avoid unnecessary state mutations** — prefer immutable data structures
- **Classes are acceptable** for handler classes (`TUIHandler`, `EffectCLI`) as part of the intentional architecture

### Documentation and Comments
- **Write clear JSDoc comments** for all exported functions, classes, and methods
- Include `@param`, `@returns`, and `@example` tags for complex functions
- Provide **concise comments for complex logic**, explaining the "why" not the "what"
- Keep comments up-to-date with code changes

### Testing Standards
- **Write unit tests** for all utilities and public methods
- **Test error paths** using `Effect.catchTag()` to verify error handling
- Use **descriptive test names** that clearly indicate what is being tested
- **Mock external dependencies** (child_process, @inquirer/prompts) appropriately
- Aim for meaningful test coverage over arbitrary percentages

```typescript
describe('display', () => {
  it('should output message to console with success styling', () => {
    const spy = vi.spyOn(console, 'log')
    Effect.runSync(display('Success!', { type: 'success' }))
    expect(spy).toHaveBeenCalled()
  })

  it('should fail with ValidationError when input is invalid', () => {
    const result = Effect.runSync(
      Effect.try(() => validateInput('')).pipe(
        Effect.catchTag('ValidationError', (err) => err.message)
      )
    )
    expect(result).toBe('Input required')
  })
})
```

---

## Project Structure

**effect-cli-tui** is an Effect-native CLI framework designed for composable, type-safe command execution and interactive terminal interfaces.

### Key Directories

- **`src/`** — Main source code
  - `index.ts` — Public API exports (all exports go here)
  - `types.ts` — Shared types and error definitions
  - `cli.ts` — `EffectCLI` class for running commands
  - `tui.ts` — `TUIHandler` class for interactive prompts
  - `core/` — Core display and styling utilities
  - `tables/`, `boxes/`, `progress/` — Feature modules
  - `effects/` — Ink/React wrapper for rich UIs

- **`__tests__/`** — Test suite (Vitest)
  - Unit tests: `colors.test.ts`, `boxes.test.ts`, `tables.test.ts`, `spinners.test.ts`
  - Integration: `integration.test.ts`, `integration/sm-cli-pattern.test.ts`

- **`dist/`** — Compiled output (ESM-only)
  - `index.js` — Main module
  - `index.d.ts` — TypeScript definitions
  - `index.js.map` — Source maps

## Architecture Overview

### Core Design Principles

1. **Effect-First**: All public APIs return `Effect<T, E>` for composable async operations and type-safe error handling
2. **Modular**: Clear separation between UI (`TUIHandler`), CLI execution (`EffectCLI`), and display utilities
3. **ESM-Only**: Modern JavaScript modules with tree-shaking support; built with tsup
4. **Type-Safe**: Strict TypeScript, typed errors using `Data.TaggedError`

### Main Handler Classes

**`EffectCLI`** (src/cli.ts)
- Executes CLI commands and captures output
- Methods: `run(command, args?, options?)`, `stream(command, args?, options?)`
- Returns: `Effect<CLIResult, CLIError>`
- Errors tagged as: `CLIError` with reasons like 'CommandFailed', 'Timeout', 'NotFound'

**`TUIHandler`** (src/tui.ts)
- Interactive terminal UI with prompts
- Methods: `prompt()`, `selectOption()`, `multiSelect()`, `confirm()`, `display()`
- Returns: `Effect<string | boolean | string[], TUIError>`
- Errors tagged as: `TUIError` with reasons like 'Cancelled', 'ValidationFailed', 'RenderError'

### Display System Architecture

Layered design:

```
Core Display (core/display.ts)
  ├─ display()           → Single message effect
  ├─ displayLines()      → Multiple lines
  ├─ displayJson()       → Pretty JSON
  └─ displayOutput()     → Internal formatter

Styling Layer (core/colors.ts)
  ├─ applyChalkStyle()   → Apply colors/effects
  ├─ displayHighlight()  → Cyan bold
  ├─ displayWarning()    → Yellow bold with prefix
  ├─ displayMuted()      → Gray dim
  └─ ... theme shortcuts

Feature Modules
  ├─ tables/table.ts     → cli-table3 wrapper
  ├─ boxes/box.ts        → Bordered box rendering
  └─ progress/spinner.ts → Spinner animation
```

### Error Handling Pattern

All errors are typed using Effect's `Data.TaggedError`:

```typescript
// Catch specific error tags
Effect.catchTag('TUIError', (err) => {
  // Handle specific error
})

// Or use Error.as pattern for pattern matching
```

Error types in codebase:
- `TUIError` — Interactive prompt failures
- `CLIError` — Command execution failures

### Validation with Effect Schema

**Requirement:** All input validation must use **Effect Schema**, not Zod.

Effect Schema provides:
- **Type-safe validation** with automatic TypeScript inference
- **Integration with Effect** — validators return Effects natively
- **Composable schemas** — build complex validators from simple ones
- **Consistent error handling** — validation errors as Effect failures

**Prefer Schema.Class over Schema.Struct:**
- ✅ Use `Schema.Class` for entity definitions (preferred)
- ⚠️ Use `Schema.Struct` only for anonymous/one-off structures
- Classes provide better type narrowing and IDE support
- Classes integrate seamlessly with Effect's service pattern

**Basic Schema Example:**

```typescript
import { Schema, Effect } from "effect"

// Define a schema using Schema.Class (preferred pattern)
class User extends Schema.Class<User>("User")({
  name: Schema.String.pipe(Schema.minLength(1)),
  email: Schema.String.pipe(Schema.filter((email) => email.includes('@'))),
  age: Schema.Number.pipe(Schema.greaterThan(0), Schema.lessThan(150))
}) {}

// Parse and validate
const validateUser = (input: unknown): Effect.Effect<User> => {
  return Schema.parse(User)(input)
}
```

**Validation in Prompts:**

```typescript
import { Schema, Effect } from "effect"

const projectNameSchema = Schema.String.pipe(Schema.minLength(3), Schema.maxLength(50))

const promptProject = Effect.gen(function* () {
  const tui = yield* TUIHandler

  const name = yield* tui.prompt('Project name:', {
    validate: (input) => {
      try {
        Schema.parseSync(projectNameSchema)(input)
        return true
      } catch (err) {
        return 'Project name must be 3-50 characters'
      }
    }
  })

  return { projectName: name }
})
```

**Error Handling:**

```typescript
import { Schema, Effect } from "effect"

class User extends Schema.Class<User>("User")({
  name: Schema.String.pipe(Schema.minLength(1)),
  email: Schema.String.pipe(Schema.filter((email) => email.includes('@'))),
  age: Schema.Number.pipe(Schema.greaterThan(0), Schema.lessThan(150))
}) {}

// Validation errors are Effect failures
const workflow = Effect.gen(function* () {
  const tui = yield* TUIHandler

  const result = yield* Schema.parse(User)(userData).pipe(
    Effect.catchAll((err) => {
      yield* tui.display(`Validation failed: ${err}`, 'error')
      return Effect.fail(err)
    })
  )
  return result
})
```

**Use Effect Schema for:**
- ✅ CLI argument parsing and validation
- ✅ Configuration object validation
- ✅ User input validation in prompts
- ✅ Command output parsing and validation

**Do NOT use Zod** — Effect Schema is the standard validation library for this project.

### ESM Output Configuration

- Built with **tsup** (see `tsup.config.ts`)
- **ESM-only** format (no CommonJS output despite README examples)
- External deps: `effect`, `react`, `ink` (not bundled, peer-like)
- TypeScript declarations included with source maps
- Source maps included for debugging

## Dependencies & Key Libraries

**Production Dependencies:**
- `effect` ^3.18.0 — Effect-TS runtime (core to architecture)
- `chalk` ^5.3.0 — Terminal colors and styling
- `cli-table3` ^0.6.3 — ASCII table rendering
- `cli-spinners` ^3.0.0 — Terminal spinner animations
- `highlight.js` ^11.9.0 — Syntax highlighting

**Peer Dependencies (Optional):**
- `react` ^18.0.0 — For Ink components (future feature)
- `ink` ^4.0.0 — React renderer for terminal

**Note:** Despite the ESM-only build, the README mentions CommonJS usage patterns, which are outdated. Current implementation is ESM-only.

## Testing Strategy

**Test Framework:** Vitest 4.0.6 in Node.js environment

**Test Organization:**
- Tests spy on `console.log` to verify output
- Integration tests compose Effect operations with `Effect.gen`
- Error handling tested via `Effect.catchTag()`
- Module import/export verification in dedicated test file

**Running Tests:**
```bash
bun test                     # Run all once
bun test:watch              # Watch mode
bun test -- --reporter=verbose   # Detailed output
bun test __tests__/colors.test.ts  # Single file
```

**Key Test Patterns:**
- Spy on console output for display functions
- Use `Effect.runPromise()` to execute Effects in tests
- Mock child_process for CLI tests
- Test error paths with `Effect.catchTag()`

**Testing Effect.Service Services:**

Do NOT use `new` to instantiate services in tests. Instead, use Effect dependency injection with mock layers:

```typescript
import { Layer, Effect } from 'effect'
import { TUIHandler } from '../../src/tui'

// Create a mock layer for testing
const MockTUIHandler = Layer.succeed(TUIHandler, {
  display: (msg: string) => Effect.succeed(undefined),
  prompt: (msg: string) => Effect.succeed('test-response'),
  selectOption: (opts: string[]) => Effect.succeed(opts[0]),
  multiSelect: (opts: string[]) => Effect.succeed(opts),
  confirm: (msg: string) => Effect.succeed(true),
  password: (msg: string) => Effect.succeed('test-password')
})

// Use the mock layer in tests
describe('TUIHandler', () => {
  it('should display message', async () => {
    const program = Effect.gen(function* () {
      const tui = yield* TUIHandler  // Access via dependency injection
      yield* tui.display('Hello')
      return 'success'
    }).pipe(Effect.provide(MockTUIHandler))  // Provide the mock layer

    const result = await Effect.runPromise(program)
    expect(result).toBe('success')
  })
})
```

**Service Testing Rules:**
- ✅ Always use `yield* ServiceName` to access services, never `new ServiceName()`
- ✅ Create test layers with `Layer.succeed(ServiceName, {...})`
- ✅ Provide mock layers via `.pipe(Effect.provide(MockLayer))`
- ✅ Test services in isolation with full Effect composition
- ❌ NEVER try to instantiate services directly with `new`
- ❌ NEVER inject through constructor parameters

**External Dependencies Testing Policy:**

Do NOT mock external services (like CLI tools, HTTP services, databases). This codebase intentionally avoids mocking external dependencies because:

1. **Integration Testing Over Unit Testing** — Tests should verify actual behavior with real external systems
2. **No False Positives** — Mocking can mask real failures that only appear with actual services
3. **Simplified Test Maintenance** — No mock setup/teardown overhead
4. **Real-world Validation** — Tests reflect production conditions

**When external dependencies are unavailable:**
- ❌ Do NOT add `vi.mock()` or `vi.spyOn()` for external services
- ❌ Do NOT stub HTTP calls or CLI commands
- ✅ Skip the test gracefully with `.skip()` or test environment checks
- ✅ Document why the test requires the dependency (e.g., "requires pnpm global install")
- ✅ Let CI/integration environments handle full testing with dependencies installed

**Example: Testing CLI commands**
```typescript
// ❌ WRONG - Don't mock child_process
it('should run command', async () => {
  vi.spyOn(childProcess, 'execFile').mockImplementation(...)
  // This masks real errors!
})

// ✅ RIGHT - Test with real CLI tool (or skip if unavailable)
it('should run command', async () => {
  const result = await Effect.runPromise(cli.run('real-command'))
  expect(result.success).toBe(true)
})

// ✅ ALSO RIGHT - Skip if dependency not installed
it('should run command if available', async () => {
  const hasEffect = /* check if effect CLI installed */
  if (!hasEffect) this.skip()

  const result = await Effect.runPromise(cli.run('effect', ['--version']))
  expect(result.success).toBe(true)
})
```

## Public API Exports

All public APIs are exported from `src/index.ts`. When adding new functionality:

1. Implement in appropriate `src/` module
2. Export from `src/index.ts`
3. Add tests in `__tests__/`
4. Update README.md if user-facing
5. Update docs/ if complex behavior

**Current Exports:**
- Classes: `EffectCLI`, `TUIHandler`
- Display functions: `display`, `displayLines`, `displayJson`, `displaySuccess`, `displayError`, `displayOutput`
- Styling: `applyChalkStyle`, `displayHighlight`, `displayMuted`, `displayWarning`, `displayInfo`, `displayListItem`
- Components: `displayTable`, `displayBox`, `displayPanel`
- Progress: `spinnerEffect`, `startSpinner`, `updateSpinner`, `stopSpinner`
- React integration: `renderInkComponent`, `renderInkWithResult`
- Types: All from `src/types.ts`

## Effect Service Pattern (Required)

**All services must use Effect.Service API** (Effect 3.9+). This is the standard pattern for defining services with integrated Context.Tag and Layer.

**Service Definition:**
```typescript
import * as Effect from 'effect/Effect'

export class MyService extends Effect.Service<MyService>()("app/MyService", {
  effect: Effect.gen(function* () {
    // Initialize dependencies if needed
    // const dep = yield* SomeDependency

    return {
      method1: (arg: string) => Effect.sync(() => {
        // Implementation
      }),
      method2: () => Effect.sync(() => {
        // Implementation
      })
    } as const
  }),
  dependencies: [] // or [OtherService.Default] if needed
}) {}

// Automatic Layer exports:
// MyService.Default — with all dependencies provided
// MyService.DefaultWithoutDependencies — if you need to override deps
```

**Service Usage:**
```typescript
const program = Effect.gen(function* () {
  const service = yield* MyService
  const result = yield* service.method1('arg')
  return result
}).pipe(Effect.provide(MyService.Default))
```

**Benefits:**
- ✅ Unified Context.Tag + Layer definition
- ✅ Proper dependency injection
- ✅ Testable with mock layers
- ✅ Works with Effect composition
- ✅ Modern Effect 3.9+ standard

**FORBIDDEN - Do NOT use Context.Tag:**
- ❌ **NEVER** use `Context.GenericTag` or `Context.Tag` directly
- ❌ **NEVER** manually create Context.Tag + Layer separately
- ❌ Use plain classes with `new` keyword
- ❌ Pass services through constructor parameters

**Why Context.Tag is Forbidden:**
Context.Tag is the old pre-3.9 pattern. It causes:
- Type inference issues with services
- Manual boilerplate code duplication
- Inconsistent error handling
- Harder to test with mocks
- Does not work with the modern Effect 3.9+ API

Always use `Effect.Service` instead (see pattern above).

---

## Common Development Patterns

### Adding a New Display Function

1. Create in appropriate module (`src/core/`, `src/tables/`, etc.)
2. Return `Effect<void>` (or other appropriate type)
3. Use `effect()` from Effect library for async wrapping
4. Export from `src/index.ts`
5. Add test in `__tests__/`

### Adding a New Handler Method

1. Add to `TUIHandler` or `EffectCLI` class
2. Return `Effect<T, ErrorType>` where ErrorType is the appropriate error
3. Use `Effect.tryPromise()` or `Effect.async()` to wrap async operations
4. Document error tags and return type
5. Add tests covering success and error paths

### Error Handling in Features

Always use `Data.TaggedError` for type-safe catching:

```typescript
import { Data } from 'effect'

export class MyError extends Data.TaggedError('MyError') {
  readonly reason: 'Specific' | 'Reason'
}
```

Then consumers can catch specifically:
```typescript
.pipe(Effect.catchTag('MyError', handler))
```

## TypeScript Configuration

- **Target:** ES2020
- **Module:** ESNext
- **Strict Mode:** Enabled
- **Declarations:** Generated with source maps
- **Module Resolution:** bundler (for tsup compatibility)

Update `tsconfig.json` if changing target or module system.

## Deployment & Publishing

**Pre-publish Validation:**
```bash
bun run prepublishOnly    # Runs: build && test
```

**Publishing Flow:**
1. All tests must pass
2. Build must succeed
3. Version should follow semver
4. GitHub Actions publish workflow handles npm publication

**Key Files Included in npm:**
- `dist/` (built output)
- `README.md`
- `LICENSE`
- (defined in `package.json` → `files` field)

## Important Implementation Details

### Why Effect-First?

The entire codebase is built around Effect to provide:
- **Composability**: Chain operations with `yield*` in `Effect.gen`
- **Error Handling**: Type-safe errors via tagged unions
- **Testability**: Effects are pure and easily testable
- **Resource Management**: Effect handles cleanup automatically
- **Async Management**: No callback hell, clean imperative style

### Effect Composition Example

```typescript
const workflow = Effect.gen(function* (_) {
  const name = yield* _(tui.prompt('Enter name:'))
  const result = yield* _(cli.run('build'))
  yield* _(display(`Hello ${name}!`))
  return result
})
```

### Display vs TUIHandler Display

- **`display()` functions** — Output to console.log, for feedback/results
- **`TUIHandler.display()`** — Interactive feedback during prompt workflows
- Use display functions for output, TUIHandler for interactive workflows

### Chalk Styles

Styling uses `chalk` v5 (ESM-only):
- Always import chalk in color utility functions
- Apply via `applyChalkStyle()` wrapper or directly in display functions
- Chainable: `chalk.cyan.bold('text')`

### Future: Ink Integration

**Upcoming:** Ink (React for terminal) will be integrated for rich UI components. When Ink integration is added:
- React components will be the preferred method for complex UI layouts
- Functional React components will follow the codebase style
- Terminal-specific UI patterns will apply (responsive layouts with ink-box, ink-text, etc.)
- Chalk styling will continue for basic text styling
- The `effects/ink-wrapper.ts` module provides the integration point

For now, focus on display utilities and handler methods for interactive workflows.

## Code Validation Rules (MANDATORY)

**The following patterns are STRICTLY FORBIDDEN and will be rejected in code review:**

### ❌ FORBIDDEN: Context.Tag / Context.GenericTag

**NEVER use `Context.Tag` or `Context.GenericTag` anywhere in this codebase:**

```typescript
// ❌ FORBIDDEN - DO NOT USE
import { Context } from 'effect'
export const MyService = Context.GenericTag<IMyService>('MyService')
export const MyServiceLive = Layer.succeed(MyService, { /* ... */ })

// ❌ FORBIDDEN - DO NOT USE
const service = new MyService()  // Direct instantiation
```

**MUST use Effect.Service instead:**

```typescript
// ✅ CORRECT - USE THIS PATTERN
export class MyService extends Effect.Service<MyService>()('app/MyService', {
  effect: Effect.gen(function* () {
    return { /* methods */ }
  })
}) {}
```

**Rationale:**
- Effect 3.9+ provides Effect.Service as the modern standard
- Context.Tag is the pre-3.9 legacy pattern
- Effect.Service provides automatic Context.Tag + Layer generation
- Reduces boilerplate, improves type safety
- Enables proper mocking in tests via Layer dependency injection
- Consistent with the rest of the codebase architecture

**Validation:**
- ESLint rule will reject `Context.Tag` and `Context.GenericTag` imports
- Code review will catch direct service instantiation with `new`
- All services must extend `Effect.Service<ServiceName>()`

---

## No Configuration Currently Used

- No `.cursorrules` or `.github/copilot-instructions.md` exist
- ESLint and Prettier run with defaults
- No custom path aliases configured

## Typical Workflow

1. **Make changes** to source files in `src/`
2. **Add/update tests** in `__tests__/` (important: tests spy on console)
3. **Check types**: `bun run type-check`
4. **Run tests**: `bun test`
5. **Lint**: `bun run lint`
6. **Build**: `bun run build` (generates `dist/`)
7. **Verify exports**: Check `src/index.ts` re-exports new APIs

## Troubleshooting

**Tests failing due to console output?**
- Effects should use `Effect.sync()` or `Effect.async()` for side effects
- Tests spy on `console.log`, ensure display functions call this

**Type errors after changes?**
- Run `bun run type-check` to get full type report
- Check that return types match expected Effect signatures

**Build fails?**
- Verify `tsconfig.json` and `tsup.config.ts` alignment
- Check that external deps are listed in `tsup.config.ts` external array

**Import issues?**
- All public APIs should be exported from `src/index.ts`
- Check that module is exported with correct type signatures
