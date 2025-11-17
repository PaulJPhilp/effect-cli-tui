# Deep Design & Code Review: effect-cli-tui

**Comprehensive Technical Review**  
*Author: Senior TypeScript + Effect + Node.js CLI/TUI Engineer*  
*Date: 2025*

---

## Executive Summary

effect-cli-tui is a **well-architected, modern Effect-native CLI/TUI library** that successfully achieves its core goal of providing composable, type-safe terminal interactions. The codebase demonstrates solid engineering principles, strong separation of concerns, and thoughtful API design.

### Strengths
- ✅ **Effect-first architecture** with consistent error handling (CLIError, TUIError, InkError)
- ✅ **Clear module boundaries** (EffectCLI, TUIHandler, DisplayService, InkService)
- ✅ **Modern Ink/React component system** for rich terminal UIs
- ✅ **Robust resource management** with proper cleanup in async contexts
- ✅ **Comprehensive test suite** with ~40+ unit/integration tests
- ✅ **Well-documented APIs** with JSDoc examples and integration patterns

### High-Impact Issues
1. **Display API lacks consistency** — Convenience wrappers always provide DisplayService.Default, preventing composition
2. **Error mapping is fragile** — InkError→TUIError relies on string matching ("cancelled")
3. **Service dependencies create subtle coupling** — TUIHandler→InkService→render() with global process listeners
4. **Missing validation abstractions** — No helpers for common patterns (email, URLs, file paths)
5. **CLI error reporting could be more structured** — Exit codes not distinguished from other failures

### Key Recommendations
1. Refactor display API to support effect composition without auto-providing layers
2. Strengthen error semantics with explicit cancellation tracking
3. Add effect-schema validation helpers for common CLI patterns
4. Improve CLI exit code handling with structured reasons
5. Add comprehensive error recovery examples

---

## 1. Architecture & API Surface

### 1.1 Module Structure

The library follows a clean, layered architecture:

```
┌────────────────────────────────────────────────┐
│          User Application (Effect.gen)         │
├────────────────────────────────────────────────┤
│  Public API Layer (display, displaySuccess...)  │
├────────────────────────────────────────────────┤
│  Service Layer                                  │
│  ┌─────────────────┬──────────────┬──────────┐ │
│  │ TUIHandler      │ EffectCLI    │ Display  │ │
│  │ (+ InkService)  │              │ Service  │ │
│  └─────────────────┴──────────────┴──────────┘ │
├────────────────────────────────────────────────┤
│  Core Infrastructure Layer                      │
│  ┌──────────────┬──────────────┬────────────┐  │
│  │ Ink/React    │ child_process│ Theme      │  │
│  │ Components   │              │ System     │  │
│  └──────────────┴──────────────┴────────────┘  │
└────────────────────────────────────────────────┘
```

**Modules:**

| Module | Purpose | Type | Dependencies |
|--------|---------|------|--------------|
| `cli.ts` | CLI command execution | Effect.Service | none (core) |
| `tui.ts` | Interactive prompts | Effect.Service | InkService |
| `services/display` | Console output formatting | Effect.Service | ThemeService |
| `services/ink` | Ink/React rendering | Effect.Service | none (core) |
| `services/theme` | Icon/color theming | Effect.Service | (none) |
| `components/**` | React/Ink UI components | React.FC | react, ink |
| `core/display.ts` | Public display API | Convenience wrappers | DisplayService |
| `core/colors.ts` | Styled output helpers | Utility functions | chalk |
| `core/terminal.ts` | TTY detection & I/O | Effect.Service | none |
| `runtime.ts` | Pre-configured runtimes | Runtime factories | all services |

**Dependency Graph (Clean):**
```
EffectCLI (standalone)
  │
TUIHandler ──→ InkService ──→ Ink/React
  │
DisplayService ──→ ThemeService
  │
ThemeService (standalone)
```

### 1.2 Public API Surface

**Well-defined exports in `src/index.ts`:**

**Classes (Services):**
- `EffectCLI` — CLI command execution
- `TUIHandler` — Interactive prompts & display
- `DisplayService` — Console output
- `InkService` — Ink rendering
- `ThemeService` — Theme management
- `Terminal` — TTY utilities

**Display Functions (Convenience):**
- `display(msg, opts)` — Generic message
- `displaySuccess(msg)` — Success message
- `displayError(msg)` — Error message
- `displayLines(lines, opts)` — Multi-line output
- `displayJson(data, opts)` — JSON formatting
- `displayOutput(msg, type, opts)` — Explicit type

**Styling Functions:**
- `applyChalkStyle(text, opts)` — Manual chalk styling
- `displayHighlight(msg)` — Cyan bold
- `displayMuted(msg)` — Gray dim
- `displayWarning(msg)` — Yellow with icon
- `displayInfo(msg)` — Blue with icon
- `displayListItem(item)` — Bullet list item

**Components (Ink/React):**
- `Input` — Text input
- `Select` — Single select
- `MultiSelect` — Multi-select
- `Confirm` — Yes/No dialog
- `Password` — Hidden password
- `ProgressBar` — Progress indicator
- `Spinner` — Loading spinner
- `Message` — Styled message

**Error Types:**
- `CLIError` — CLI execution failures
- `TUIError` — Prompt interaction failures
- `InkError` — Ink rendering failures

**Runtimes:**
- `EffectCLIRuntime` — Full CLI+TUI stack
- `TUIHandlerRuntime` — TUI only
- `EffectCLIOnlyRuntime` — CLI only
- `DisplayRuntime` — Display only

### 1.3 Cohesion & Coupling Analysis

**Strengths:**

✅ **Clear responsibility separation:**
- `EffectCLI` handles only command execution
- `TUIHandler` handles only prompt orchestration
- `DisplayService` handles only console output
- `InkService` handles only React rendering

✅ **Unidirectional dependencies:**
- TUIHandler depends on InkService (appropriate)
- DisplayService depends on ThemeService (appropriate)
- No circular dependencies

✅ **Service Layer abstraction:**
- All services use Effect.Service pattern
- Dependency injection via layers
- Easy to mock in tests

**Issues & Concerns:**

⚠️ **Issue #1: Display API lacks composition support**

The convenience wrappers (`display`, `displaySuccess`, etc.) automatically provide `DisplayService.Default`:

```typescript
// From src/core/display.ts
export function display(msg: string, opts = {}) {
  return Effect.gen(function* () {
    const display = yield* DisplayService
    yield* display.output(msg, opts)
  }).pipe(Effect.provide(DisplayService.Default))  // ← ALWAYS provides
}
```

**Problem:**
- Users cannot compose display functions into larger effects with custom theme layers
- Breaks the Effect composition model
- Forces runtime providers to be duplicated

**Example failure:**
```typescript
// This should work but doesn't compose well:
const workflow = Effect.gen(function* () {
  yield* display('msg')  // Provides its own layer
  const tui = yield* TUIHandler  // Needs a layer
  // Now both DisplayService and TUIHandler have been provided separately
})
```

⚠️ **Issue #2: Service dependencies create coupling through global state**

`InkService` manages SIGINT handlers globally:

```typescript
// From src/services/ink/service.ts line 111
process.prependListener("SIGINT", sigintHandler)  // ← Global process listener
```

**Problem:**
- Multiple concurrent InkService instances could interfere
- Cancellation detection relies on message string matching
- Not composable with other SIGINT handlers

⚠️ **Issue #3: Theme access is both sync and async**

Some functions try to access theme synchronously:

```typescript
// From src/core/colors.ts (displayHighlight)
try {
  const themeModule = require("../services/theme/service")  // ← require() in module
  if (themeModule?.getCurrentThemeSync?.()) {
    const theme = themeModule.getCurrentThemeSync()
  }
} catch {
  // Fallback to default
}
```

**Problem:**
- Mix of sync/async theme access
- require() call in ESM module
- Brittle try/catch fallback pattern

**Recommendation:** Make theme access Effect-based consistently.

---

## 2. TypeScript & Effect Usage Review

### 2.1 Type-Level Modeling

**Strong Points:**

✅ **CLIError with discriminated union:**
```typescript
export class CLIError extends Data.TaggedError("CLIError") {
  constructor(
    readonly reason: "CommandFailed" | "Timeout" | "NotFound" | "ExecutionError",
    readonly message: string,
    readonly exitCode?: number
  ) { super() }
}
```
- _tag automatically set by Data.TaggedError
- reason is discriminated union (type-safe pattern matching)
- exitCode optionally attached to relevant errors

✅ **TUIError with clear error semantics:**
```typescript
export class TUIError extends Data.TaggedError("TUIError") {
  constructor(
    readonly reason: "Cancelled" | "ValidationFailed" | "RenderError",
    readonly message: string
  ) { super() }
}
```

✅ **InkError for rendering failures:**
```typescript
export class InkError extends Data.TaggedError("InkError") {
  constructor(
    readonly reason: "RenderError" | "ComponentError" | "TerminalError",
    readonly message: string
  ) { super() }
}
```

✅ **DisplayOptions properly typed:**
```typescript
export interface DisplayOptions {
  type?: DisplayType  // "info" | "success" | "error" | "warning"
  prefix?: string
  newline?: boolean
  style?: ChalkStyleOptions
}
```

✅ **SelectOption allows string or detailed forms:**
```typescript
export interface SelectOption {
  label: string
  value: string
  description?: string
}
```

**Issues:**

⚠️ **Issue #1: DisplayType union is fragmented**

`DisplayType` defined in two places:
- `src/services/display/types.ts`: `"info" | "success" | "error" | "warning"`
- `src/types.ts`: Re-exported from above

Also, there's `DisplayTypeColor` which is a discriminated union but not consistently used:

```typescript
// From src/types.ts
export type DisplayTypeColor =
  | { type: "info"; color: "blue" }
  | { type: "success"; color: "green" }
  | { type: "error"; color: "red" }
  | { type: "warning"; color: "yellow" }
```

**Problem:** Multiple representations of the same concept. Should consolidate.

⚠️ **Issue #2: Error cancellation detection is string-based**

```typescript
// From src/tui.ts line 99-103
if (
  err.reason === "TerminalError" &&
  err.message.toLowerCase().includes("cancelled")  // ← String matching!
) {
  return new TUIError("Cancelled", err.message)
}
```

**Problem:**
- Fragile pattern matching on message text
- Locale-dependent (translations would break)
- Should use explicit error type or reason

**Better:**
```typescript
// Explicit cancellation marker in InkError
export class InkError extends Data.TaggedError("InkError") {
  constructor(
    readonly reason: "RenderError" | "ComponentError" | "TerminalError" | "Cancelled",
    readonly message: string
  ) { super() }
}
```

⚠️ **Issue #3: PromptOptions could support more validation patterns**

```typescript
export interface PromptOptions {
  default?: string
  validate?: (input: string) => boolean | string
}
```

**Problem:**
- Only supports sync validation
- No async validation (for real-time API checks)
- No structured error reporting

**Better (with effect-schema):**
```typescript
import { Schema, Effect } from "effect"

export interface PromptOptions {
  default?: string
  validate?: (input: string) => Effect<void, ValidationError>
}
```

### 2.2 Effect Patterns

**Excellent Usage:**

✅ **Effect.Service pattern consistently applied:**
```typescript
export class EffectCLI extends Effect.Service<EffectCLI>()("app/EffectCLI", {
  effect: Effect.sync(() => ({
    run: (...) => Effect.async(...),
    stream: (...) => Effect.async(...)
  }))
}) {}
```

✅ **Effect.async for process spawning with proper cleanup:**
```typescript
Effect.async<CLIResult, CLIError>((resume) => {
  const child = spawn(...)
  const timeout = options.timeout ? setTimeout(() => {
    child.kill()
    resume(Effect.fail(...))
  }, ms) : null

  child.on("close", () => {
    if (timeout) clearTimeout(timeout)
    resume(...)
  })
})
```

✅ **Effect.acquireUseRelease for Ink rendering:**
```typescript
Effect.acquireUseRelease(
  // Acquire: Create Ink instance
  Effect.try({ try: () => render(component) }),
  // Use: Wait for completion
  (instance) => Effect.tryPromise({ try: () => instance.waitUntilExit() }),
  // Release: Cleanup (always runs)
  (instance) => Effect.sync(() => instance.unmount())
)
```

**Issues:**

⚠️ **Issue #1: Direct console I/O vs Effect.Console**

`src/core/display.ts` uses Effect.Console (good):
```typescript
return type === "error"
  ? Console.error(output)
  : Console.log(output)
```

But `src/core/colors.ts` has some legacy sync console usage patterns.

⚠️ **Issue #2: TUIHandler display uses sync Console.log**

```typescript
// From src/tui.ts line 63
yield* Console.log(`\n${prefix} ${message}`)
```

This is actually fine (Effect.Console wraps sync operations), but could be unified with DisplayService for consistency.

⚠️ **Issue #3: Missing error context in some Effect compositions**

When mapping InkError to TUIError, there's no intermediate context:

```typescript
// From src/tui.ts
.pipe(
  Effect.mapError((err) => {
    if (err instanceof InkError) {
      if (err.reason === "TerminalError" && 
          err.message.toLowerCase().includes("cancelled")) {
        return new TUIError("Cancelled", err.message)
      }
      return new TUIError("RenderError", err.message)
    }
    return new TUIError("RenderError", String(err))
  })
)
```

**Better:**
```typescript
.pipe(
  Effect.mapError(mapInkErrorToTUI)  // Extract to function
)

function mapInkErrorToTUI(err: unknown): TUIError {
  if (err instanceof InkError) {
    return err.reason === "TerminalError"
      ? new TUIError("Cancelled", err.message)
      : new TUIError("RenderError", err.message)
  }
  return new TUIError("RenderError", String(err))
}
```

### 2.3 Error Channel Usage

**Strong:**

✅ **Typed errors in all public APIs:**
- `EffectCLI.run/stream` → `Effect<CLIResult | void, CLIError>`
- `TUIHandler.prompt/select/confirm` → `Effect<T, TUIError>`
- `InkService.renderWithResult` → `Effect<T, InkError>`
- `DisplayService.output` → `Effect<void>` (no failure path)

✅ **Consistent error tagging enables pattern matching:**
```typescript
yield* effect.pipe(
  Effect.catchTag("CLIError", (err) => {
    switch (err.reason) {
      case "NotFound": /* ... */
      case "Timeout": /* ... */
      case "CommandFailed": /* ... */
    }
  })
)
```

**Issues:**

⚠️ **Issue #1: ValidationFailed reason rarely produced**

`TUIError` has `ValidationFailed` reason but it's never actually used:

```typescript
// From src/types.ts
readonly reason: "Cancelled" | "ValidationFailed" | "RenderError"
```

In `src/tui.ts`, validation errors always map to `RenderError`:
```typescript
return new TUIError("RenderError", err.message)  // Never ValidationFailed
```

**Fix:** Remove unused reason or properly implement validation error path.

### 2.4 Type Ergonomics

**Good:**

✅ **Exported types are named intuitively:**
- `SelectOption` (for select/multiSelect choices)
- `CLIRunOptions` (for command execution options)
- `PromptOptions` (for prompt validation)
- `DisplayType` (for message types)
- `BorderStyle` (for box styling)

✅ **Minimal use of any/unknown:**
- Most functions have concrete return types
- Error handling uses proper type narrowing

**Issues:**

⚠️ **Issue #1: Some type casts in component code**

```typescript
// From src/core/colors.ts line 96
color: warningColor as any  // ← Type assertion bypasses safety
```

Better:
```typescript
type ColorValue = ChalkColor
const warningColor: ColorValue = getDisplayColor("warning")
```

⚠️ **Issue #2: React component prop types could be more specific**

```typescript
// From src/components/Select.tsx
indicatorComponent={(props: { isSelected?: boolean }) => ...}
itemComponent={(props: { label: string; description?: string; isSelected?: boolean }) => ...}
```

These should be exported as proper interfaces:
```typescript
export interface SelectIndicatorProps {
  isSelected?: boolean
}

export interface SelectItemProps {
  label: string
  description?: string
  isSelected?: boolean
}
```

---

## 3. Display API Design & Console Output

### 3.1 API Surface & Consistency

**Current Display API:**

| Function | Purpose | Parameters | Returns |
|----------|---------|-----------|---------|
| `display(msg, opts)` | Generic message | message, DisplayOptions | Effect<void> |
| `displaySuccess(msg, opts)` | Success prefix | message, opts | Effect<void> |
| `displayError(msg, opts)` | Error prefix + stderr | message, opts | Effect<void> |
| `displayLines(lines, opts)` | Multi-line output | lines[], opts | Effect<void> |
| `displayJson(data, opts)` | JSON formatting | data, JsonDisplayOptions | Effect<void> |
| `displayOutput(msg, type, opts)` | Explicit type | message, type, opts | Effect<void> |

**Design Assessment:**

✅ **Strengths:**
- Consistent function signatures
- Type-safe message types ("info" | "success" | "error" | "warning")
- Options pattern allows future extensibility
- Separate convenience functions (displaySuccess, displayError)

⚠️ **Issues:**

**Issue #1: Auto-providing DisplayService breaks composition**

Every convenience function does:
```typescript
export function display(message: string, opts = {}) {
  return Effect.gen(function* () {
    const display = yield* DisplayService
    yield* display.output(message, opts)
  }).pipe(Effect.provide(DisplayService.Default))  // ← Problem!
}
```

**Problem:**
```typescript
// Users can't compose with custom theme:
const workflow = Effect.gen(function* () {
  yield* display("msg")  // Provides DisplayService.Default
  // Can't inject custom theme here
}).pipe(Effect.provide(customThemeLayer))  // This layer is ignored!
```

**Fix:**
```typescript
// Return bare Effect, let user provide
export function display(message: string, opts = {}): Effect<void, DisplayService> {
  return Effect.gen(function* () {
    const displayService = yield* DisplayService
    yield* displayService.output(message, opts)
  })
}
```

Then users do:
```typescript
yield* display("msg")  // Requires DisplayService
  .pipe(Effect.provide(myCustomLayer))
```

**Issue #2: Inconsistent stdout/stderr routing**

```typescript
// From src/services/display/service.ts
return type === "error"
  ? Console.error(output)  // ← stderr
  : Console.log(output)    // ← stdout
```

This is CLI-correct (errors to stderr) but:
- `displayError` always goes to stderr (good)
- But warnings/info go to stdout
- Not documented in public API

**Recommendation:** Document stdout/stderr routing:
```typescript
/**
 * Display output using CLI best practices:
 * - "error" and "warning" → stderr
 * - "info" and "success" → stdout
 */
```

**Issue #3: JsonDisplayOptions has confusing prefix options**

```typescript
export interface JsonDisplayOptions extends Omit<DisplayOptions, "prefix"> {
  spaces?: number
  showPrefix?: boolean        // ← Icon prefix
  customPrefix?: string       // ← Custom string prefix
}
```

**Problem:**
- `showPrefix` controls icon display
- But `customPrefix` is a string
- Omits `prefix` from DisplayOptions but adds string-based prefix handling
- Unclear interaction between `showPrefix` and `customPrefix`

**Better design:**
```typescript
export interface JsonDisplayOptions extends DisplayOptions {
  spaces?: number
  showIcon?: boolean          // ← Clearer: show the icon
  icon?: string              // ← Instead of customPrefix
}
```

### 3.2 Output Behavior & stdout/stderr

**Good:**

✅ **Error messages routed to stderr:**
```typescript
type === "error" ? Console.error(output) : Console.log(output)
```

✅ **Supports both prefix and no-prefix modes:**
```typescript
displayJson(data, { showPrefix: false })  // Machine-friendly
displayJson(data, { showPrefix: true })   // Human-friendly with icon
```

**Issues:**

⚠️ **Issue #1: No formatting guidelines for machine output**

JSON output could be:
```typescript
// Human-readable
{
  "key": "value"
}

// Machine-readable (compact)
{"key":"value"}
```

Currently uses `spaces: 2` by default, which is good for humans but verbose for machines.

**Recommendation:** Add `compact?: boolean` option:
```typescript
export interface JsonDisplayOptions {
  spaces?: number | boolean  // true = 2, false = 0
  compact?: boolean          // Alternative: explicit compact mode
}
```

⚠️ **Issue #2: displayLines doesn't support different types per line**

All lines get the same prefix:
```typescript
export function displayLines(
  lines: string[],
  options: DisplayOptions = {}
) {
  // All lines use same type/prefix
}
```

**Suggestion:** Support per-line options:
```typescript
interface Line {
  text: string
  type?: DisplayType  // Optional override
}

export function displayLines(
  lines: (string | Line)[],
  options: DisplayOptions = {}
)
```

### 3.3 Formatting & Theming

**Strong Points:**

✅ **Theme system is well-designed:**
- `ThemeService` for dependency injection
- `createTheme()` for custom themes
- Preset themes (default, minimal, dark, emoji)
- Clear theme structure (icons, colors)

✅ **Chalk integration is clean:**
```typescript
export function applyChalkStyle(text: string, options?: {
  bold?: boolean
  dim?: boolean
  italic?: boolean
  underline?: boolean
  inverse?: boolean
  strikethrough?: boolean
  color?: ChalkColor
  bgColor?: ChalkBgColor
}): string
```

**Issues:**

⚠️ **Issue #1: Theme access pattern is inconsistent**

`displayHighlight` tries sync theme access:
```typescript
try {
  const themeModule = require("../services/theme/service")
  if (themeModule?.getCurrentThemeSync?.()) {
    const theme = themeModule.getCurrentThemeSync()
    highlightColor = theme.colors.highlight
  }
} catch {
  // Fallback
}
```

**Problem:**
- require() in ESM module
- Fallback pattern is brittle
- Should use Effect to access theme

**Better:**
```typescript
export function displayHighlight(message: string): Effect<void> {
  return Effect.gen(function* () {
    const theme = yield* ThemeService
    const current = yield* theme.getTheme()
    const styledMessage = applyChalkStyle(message, {
      bold: true,
      color: current.colors.highlight
    })
    yield* display(styledMessage)
  })
}
```

### 3.4 DX Ergonomics

**Good:**

✅ **Consistent naming:** All display functions start with `display`

✅ **Flexibility with options pattern:**
```typescript
// Simple
yield* displaySuccess("Done!")

// Complex
yield* display("Custom", {
  type: "info",
  prefix: ">>>",
  newline: false,
  style: { bold: true, color: "cyan" }
})
```

**Issues:**

⚠️ **Issue #1: No streaming/buffering support**

All display functions output immediately. For large logs:
```typescript
// Inefficient: N console.log calls
yield* displayLines(hugeArrayOfLines)
```

**Suggestion:** Add buffering mode:
```typescript
export function displayBuffered(lines: string[], opts = {}): Effect<void> {
  // Batch console.log to reduce system calls
}
```

⚠️ **Issue #2: No structured logging support**

All output is free-form strings. For machine consumption:
```typescript
// No way to output structured logs
yield* displayJson({ level: "info", msg: "...", timestamp: "..." })
// But this looks like data, not a log
```

---

## 4. TUIHandler & Prompt UX

### 4.1 Prompt Method Design

**Excellent API Surface:**

✅ **Comprehensive prompt types:**
- `prompt(msg, opts)` — Text input
- `selectOption(msg, choices)` — Single select
- `multiSelect(msg, choices)` — Multi-select (checkbox)
- `confirm(msg, opts)` — Yes/No dialog
- `password(msg, opts)` — Hidden input
- `display(msg, type)` — Message display

✅ **SelectOption with descriptions:**
```typescript
interface SelectOption {
  label: string      // Display text
  value: string      // Returned value
  description?: string  // Help text
}

// Usage:
[
  { label: "Basic", value: "basic", description: "Simple starter" },
  { label: "CLI", value: "cli", description: "Command-line tool" }
]
```

✅ **Validation support in prompts:**
```typescript
const name = yield* tui.prompt("Name:", {
  default: "Guest",
  validate: (input) => input.length > 0 || "Name required"
})
```

**Issues:**

⚠️ **Issue #1: Validation returns boolean | string, not structured errors**

```typescript
validate?: (input: string) => boolean | string
```

**Problem:**
- String errors don't have structured metadata
- No error codes for localization
- Can't distinguish between validation failure types

**Better (with effect-schema):**
```typescript
import { Schema, Effect } from "effect"

const nameSchema = Schema.String.pipe(
  Schema.minLength(1, { message: "Name required" }),
  Schema.maxLength(50, { message: "Name too long" })
)

yield* tui.prompt("Name:", {
  validate: (input) => Schema.parse(nameSchema)(input)
})
```

⚠️ **Issue #2: No async validation**

Current sync-only validation can't validate against external sources:
```typescript
// Can't do this:
validate: async (email) => {
  const exists = await checkEmailExists(email)
  return exists ? "Email already registered" : true
}
```

**Better:**
```typescript
const emailSchema = Schema.String.pipe(
  Schema.filter((e) => e.includes("@"), { message: "Invalid email" })
  // Could chain async validators with Effect
)

yield* tui.prompt("Email:", {
  validate: (email) => Schema.parse(emailSchema)(email)
})
```

⚠️ **Issue #3: No built-in retry logic**

When validation fails, user must manually implement retry:
```typescript
let valid = false
let name: string = ""
while (!valid) {
  name = yield* tui.prompt("Name:")
  // Check validation...
}
```

**Suggestion:** Add `retryOnValidation` option:
```typescript
const name = yield* tui.prompt("Name:", {
  validate: (input) => input.length > 0 || "Name required",
  retryOnValidation: true  // Auto-retry on validation failure
})
```

### 4.2 Flow Composition

**Strong Points:**

✅ **Prompts compose naturally with Effect.gen:**
```typescript
const workflow = Effect.gen(function* () {
  const name = yield* tui.prompt("Name:")
  const role = yield* tui.selectOption("Role:", roles)
  const confirmed = yield* tui.confirm("Proceed?")
  
  if (confirmed) {
    yield* tui.display("Creating account...", "info")
  }
  return { name, role, confirmed }
})
```

✅ **Can intermix with other effects:**
```typescript
Effect.gen(function* () {
  const name = yield* tui.prompt("Name:")
  const result = yield* cli.run("git", ["config", "user.name", name])
  yield* tui.display("Name configured!", "success")
})
```

**Issues:**

⚠️ **Issue #1: No multi-step form composition helpers**

Building forms requires manual composition:
```typescript
// Manual form building
const form = Effect.gen(function* () {
  const step1 = yield* tui.prompt("Step 1:")
  const step2 = yield* tui.prompt("Step 2:")
  const step3 = yield* tui.prompt("Step 3:")
  return { step1, step2, step3 }
})

// No helper like:
// yield* tui.form({ field1: {}, field2: {}, ... })
```

**Suggestion:** Add form builder helper:
```typescript
interface FormField {
  name: string
  message: string
  type: "text" | "password" | "select"
  choices?: string[]
  validate?: (val: string) => boolean | string
  default?: string
}

const result = yield* tui.form([
  { name: "name", message: "Name:", type: "text" },
  { name: "password", message: "Password:", type: "password" },
  { name: "role", message: "Role:", type: "select", choices: ["admin", "user"] }
])
```

⚠️ **Issue #2: No conditional prompting based on previous answers**

```typescript
// Want this to work naturally:
const role = yield* tui.selectOption("Role:", ["admin", "user"])

// But no pattern for:
if (role === "admin") {
  const adminPassword = yield* tui.password("Admin password:")
}
```

This works but lacks abstraction for complex conditional flows.

### 4.3 Cancellation & Error Semantics

**Strong:**

✅ **Cancellation detected and mapped:**
```typescript
// User presses Ctrl+C
// InkError("TerminalError") → TUIError("Cancelled")

yield* tui.prompt("Name:").pipe(
  Effect.catchTag("TUIError", (err) => {
    if (err.reason === "Cancelled") {
      yield* tui.display("Cancelled", "info")
    }
  })
)
```

✅ **SIGINT handler properly managed:**
```typescript
// From src/services/ink/service.ts
process.prependListener("SIGINT", sigintHandler)  // Register
// ... component execution ...
process.removeListener("SIGINT", sigintHandler)   // Cleanup
```

**Issues:**

⚠️ **Issue #1: Cancellation detection is string-based**

```typescript
if (
  err.reason === "TerminalError" &&
  err.message.toLowerCase().includes("cancelled")
) {
  return new TUIError("Cancelled", err.message)
}
```

**Problem:**
- Fragile: depends on exact error message
- Not locale-safe
- Could accidentally match non-cancellation errors

**Better:** Use explicit InkError reason:
```typescript
// Add to InkError reasons
readonly reason: "RenderError" | "ComponentError" | "TerminalError" | "Cancelled"

// Then map directly:
if (err.reason === "Cancelled") {
  return new TUIError("Cancelled", err.message)
}
```

⚠️ **Issue #2: No built-in cancellation recovery patterns**

Users must manually handle cancellation flow:
```typescript
const name = yield* tui.prompt("Name:").pipe(
  Effect.catchTag("TUIError", (err) => {
    if (err.reason === "Cancelled") {
      return Effect.fail(err)  // Must explicitly fail
    }
  })
)
```

**Suggestion:** Provide cancellation helpers:
```typescript
// Helper to abort on cancellation
yield* tui.prompt("Name:").pipe(
  Effect.onCancel(() => Effect.fail(new UserCancelledError()))
)

// Helper to use default on cancellation
yield* tui.prompt("Name:").pipe(
  Effect.onCancel(() => Effect.succeed("Guest"))
)
```

### 4.4 Accessibility & UX Basics

**Good:**

✅ **Clear prompts with descriptions:**
```typescript
// Supports descriptions for clarity
tui.selectOption("Choose template:", [
  { label: "Basic", description: "Simple starter template" },
  { label: "CLI", description: "Full CLI with commands" }
])
```

✅ **Sensible defaults:**
```typescript
prompt("Name:", { default: "Guest" })
confirm("Proceed?", { default: false })
```

✅ **Default icons and colors:**
- Success: ✓ (green)
- Error: ✗ (red)
- Warning: ⚠ (yellow)
- Info: ℹ (blue)

**Issues:**

⚠️ **Issue #1: No help text / longer descriptions**

Max available is short `description` field. No way to show detailed help.

**Suggestion:** Add help text mode:
```typescript
tui.selectOption("Choose:", choices, {
  showHelp: true,
  help: `
    Choose the appropriate template...
    
    Basic: For simple projects
    CLI: For command-line tools
  `
})
```

⚠️ **Issue #2: No filtering for large lists**

If you have 100 options, user must arrow through all. No search/filter.

**Suggestion:** Use ink-search-list or similar:
```typescript
tui.selectOption("Choose:", hugeLongList, {
  searchable: true  // Enable incremental search
})
```

---

## 5. EffectCLI & Command Execution

### 5.1 API Design

**Well-Designed:**

✅ **Clear separation between run and stream:**
```typescript
// Capture output
const result = yield* cli.run("npm", ["install"])
console.log(result.stdout)

// Stream output directly
yield* cli.stream("npm", ["install"])  // User sees output in real-time
```

✅ **CLIResult structure is clear:**
```typescript
interface CLIResult {
  exitCode: number
  stdout: string
  stderr: string
}
```

✅ **CLIRunOptions provides context:**
```typescript
interface CLIRunOptions {
  cwd?: string                         // Working directory
  env?: Record<string, string>         // Environment variables
  timeout?: number                     // Timeout in milliseconds
}
```

✅ **Error types are specific:**
- `"CommandFailed"` — Non-zero exit code
- `"Timeout"` — Command exceeded timeout
- `"NotFound"` — Command not found (ENOENT)
- `"ExecutionError"` — Other execution errors

**Issues:**

⚠️ **Issue #1: Exit code not distinguished from exit code reason**

All non-zero exits are "CommandFailed":
```typescript
if (exitCode === 0) {
  resume(Effect.succeed(...))
} else {
  resume(Effect.fail(
    new CLIError("CommandFailed", `...exit code ${exitCode}`)
  ))
}
```

**Problem:**
- Can't distinguish between exit code 1 (error) vs 127 (not found) vs 124 (timeout)
- Caller must parse exitCode from message string
- Violates principle of structured error reporting

**Better:**
```typescript
export class CLIError extends Data.TaggedError("CLIError") {
  constructor(
    readonly reason: 
      | "CommandFailed" 
      | "Timeout" 
      | "NotFound" 
      | "ExecutionError"
      | "SuccessWithWarnings"  // exitCode 0 but stderr present
    readonly message: string,
    readonly exitCode?: number
  ) { super() }
}

// Then:
if (exitCode === 0) {
  resume(Effect.succeed(...))
} else if (exitCode === 127) {
  resume(Effect.fail(new CLIError("NotFound", "...")))
} else {
  resume(Effect.fail(
    new CLIError("CommandFailed", "...", exitCode)
  ))
}
```

⚠️ **Issue #2: stderr not treated as success indicator**

Command might succeed with stderr warnings:
```typescript
// run returns success even if stderr has content
const result = yield* cli.run("cargo", ["build"])
if (result.stderr.includes("warning")) {
  // No way to know at Effect level if warnings occurred
}
```

**Suggestion:** Add warnings detection:
```typescript
export class CLIResult {
  exitCode: number
  stdout: string
  stderr: string
  hasWarnings: boolean  // true if stderr is non-empty
  hasErrors: boolean    // true if exitCode !== 0
}
```

⚠️ **Issue #3: Stream mode silently ignores output**

```typescript
// stream() returns Effect<void, CLIError>
// User doesn't know what happened after completion
yield* cli.stream("build")  // Did it succeed? What was output?
```

**Better:** Return summary or use event hooks:
```typescript
interface StreamOptions extends CLIRunOptions {
  onStdout?: (chunk: string) => void
  onStderr?: (chunk: string) => void
  onClose?: (exitCode: number) => void
}

yield* cli.stream("build", [], {
  onClose: (exitCode) => console.log(`Exited with ${exitCode}`)
})
```

### 5.2 Exit Code & Error Semantics

**Good Error Mapping:**

✅ **ENOENT → NotFound:**
```typescript
if (isErrnoException(err) && err.code === "ENOENT") {
  resume(Effect.fail(new CLIError("NotFound", ...)))
}
```

✅ **Timeout respected:**
```typescript
const timeout = setTimeout(() => {
  child.kill()
  resume(Effect.fail(new CLIError("Timeout", ...)))
}, options.timeout)
```

✅ **Non-zero exit → CommandFailed:**
```typescript
if (exitCode !== 0) {
  resume(Effect.fail(new CLIError("CommandFailed", ...)))
}
```

**Issues:**

⚠️ **Issue #1: Exit code 0 success assumes no errors**

```typescript
if (exitCode === 0) {
  resume(Effect.succeed(...))
}
```

**Problem:**
- Some commands return 0 but have warnings in stderr
- No structured way to report partial success

**Better:**
```typescript
const hasWarnings = stderr.length > 0
const hasErrors = exitCode !== 0

return {
  exitCode,
  stdout,
  stderr,
  status: hasErrors ? "error" : hasWarnings ? "warning" : "success"
}
```

⚠️ **Issue #2: Error messages don't preserve stderr context**

When a command fails, stderr is included in message string:
```typescript
const message = `The command failed (exit code ${exitCode}).\n\nError details:\n${stderr || "..."}`
```

**Problem:**
- Stderr is part of message string, not structured
- Can't extract machine-readable error info
- Locale-dependent messages

**Better:** Keep stderr separate:
```typescript
export class CLIError extends Data.TaggedError("CLIError") {
  constructor(
    readonly reason: string,
    readonly message: string,
    readonly exitCode?: number,
    readonly stderr?: string  // Structured stderr
  ) { super() }
}
```

### 5.3 Streaming vs Captured Output

**Good Design:**

✅ **Two clear modes:**
- `run()` — Captures output, returns result
- `stream()` — Inherits stdio, streams directly

✅ **Resource cleanup on stream:**
```typescript
child.on("close", (exitCode) => {
  if (timeout) clearTimeout(timeout)
  if (exitCode === 0) {
    resume(Effect.succeed(undefined))
  }
})
```

**Issues:**

⚠️ **Issue #1: No hybrid mode for partial capture**

Can't do: "Stream output AND capture for later analysis"

**Suggestion:** Add hybrid mode:
```typescript
interface StreamOptions extends CLIRunOptions {
  captureOutput?: boolean  // Also buffer stdout/stderr
}

const result = yield* cli.stream("build", [], {
  captureOutput: true
})

// After streaming, result contains buffered output
console.log("Build output:", result.stdout)
```

⚠️ **Issue #2: No control over stream verbosity**

Everything is streamed, can't filter or suppress parts:

**Suggestion:** Add filtering:
```typescript
interface StreamOptions {
  onStdout?: (chunk: string) => boolean  // Return false to suppress
  onStderr?: (chunk: string) => boolean
}
```

### 5.4 Timeouts & Robustness

**Good:**

✅ **Timeout handling is clean:**
```typescript
const timeout = options.timeout
  ? setTimeout(() => {
      child.kill()
      resume(Effect.fail(new CLIError("Timeout", ...)))
    }, options.timeout)
  : null
```

✅ **Always cleaned up:**
```typescript
child.on("close", () => {
  if (timeout) clearTimeout(timeout)
})

child.on("error", () => {
  if (timeout) clearTimeout(timeout)
})
```

**Issues:**

⚠️ **Issue #1: No graceful shutdown period**

Process is killed immediately:
```typescript
child.kill()  // Sends SIGTERM, but immediate timeout
```

**Better:** Allow grace period:
```typescript
interface CLIRunOptions {
  timeout?: number
  killTimeout?: number  // Grace period before SIGKILL (default 1000ms)
}

// Process: send SIGTERM → wait killTimeout → send SIGKILL
```

⚠️ **Issue #2: No retry on transient failures**

Timeout or temp failure means the effect fails immediately:
```typescript
yield* cli.run("flaky-command")  // Fails once = fails forever
```

**Suggestion:** Add retry support:
```typescript
interface CLIRunOptions {
  retries?: number
  retryDelay?: number  // ms between retries
}
```

---

## 6. Tests, Examples, and Documentation

### 6.1 Test Suite Assessment

**Comprehensive Coverage:**

✅ **Well-organized test structure:**
```
__tests__/
├── unit/                    # Focused unit tests
│   ├── cli-*.test.ts
│   ├── tui-*.test.ts
│   ├── display-*.test.ts
│   ├── theme.test.ts
│   └── ...
├── integration/             # End-to-end flows
│   ├── cli-execution.test.ts
│   └── sm-cli-pattern.test.ts
├── components/              # React/Ink components
│   ├── Input.test.tsx
│   ├── Select.test.tsx
│   └── ...
└── fixtures/                # Test helpers
    └── test-layers.ts
```

✅ **Strong unit test coverage for CLI:**
- Basic execution
- Arguments handling
- Error handling (ENOENT, timeout, exit codes)
- Stream mode
- Timeout behavior
- Process cleanup

✅ **Integration tests verify composition:**
```typescript
it("should compose TUIHandler and EffectCLI", async () => {
  const program = Effect.gen(function* () {
    const tui = yield* TUIHandler
    const cli = yield* EffectCLI
    yield* tui.display("Starting...", "info")
    const result = yield* cli.run("echo", ["hello"])
    return result
  })

  const result = await Effect.runPromise(program)
  expect(result.stdout).toBe("hello\n")
})
```

✅ **Error path testing:**
```typescript
it("should fail with TUIError on cancellation", ...)
it("should fail with CLIError on timeout", ...)
```

**Issues:**

⚠️ **Issue #1: Limited examples of real-world workflows**

Examples are mostly synthetic:
```typescript
// examples/basic-prompts.tsx shows simple input, but:
// - No multi-step validation
// - No error recovery
// - No complex conditional flows
```

**Suggestion:** Add realistic examples:
```typescript
// examples/full-workflow.ts - Project scaffolding wizard
// examples/git-wrapper.ts - Git command wrapper with prompts
// examples/form-builder.ts - Dynamic form generation
// examples/data-pipeline.ts - Multi-step data processing
```

⚠️ **Issue #2: No test for concurrent prompts**

Only tested sequentially. What if multiple TUIHandler calls in parallel?

**Suggestion:** Add concurrency tests:
```typescript
it("should handle multiple concurrent prompts", async () => {
  const program = Effect.gen(function* () {
    const tui = yield* TUIHandler
    const [name, role] = yield* Effect.all([
      tui.prompt("Name:"),
      tui.prompt("Role:")
    ], { mode: "either" })
  })
})
```

⚠️ **Issue #3: Limited negative path testing**

Most tests verify happy path. Few test:
- Partial failures with recovery
- Nested error handling (cli.run inside tui.prompt)
- Error message localization
- Large output handling

### 6.2 Examples & Documentation

**Good Documentation:**

✅ **README.md is comprehensive:**
- Quick start
- Core concepts
- Examples (basic, error handling, workflow composition)
- API reference with all methods
- Error handling patterns
- Theming guide

✅ **ARCHITECTURE.md explains design:**
- Component overview
- Design patterns
- Error handling strategies
- Testing patterns

✅ **Examples provided:**
- basic-prompts.tsx
- error-handling.ts
- multi-step-wizard.tsx
- progress-demo.tsx
- prompt-builder/

**Issues:**

⚠️ **Issue #1: Examples don't demonstrate best practices**

Example code sometimes takes shortcuts:

```typescript
// examples/basic-prompts.tsx
if (import.meta.main) {
  main().catch((err) => {
    console.error("Error:", err)
    process.exit(1)
  })
}
```

**Better:**
```typescript
if (import.meta.main) {
  await Effect.runPromise(program).pipe(
    Effect.tap(() => process.exit(0)),
    Effect.catch(() => process.exit(1))
  )
}
```

⚠️ **Issue #2: No advanced patterns documented**

Missing docs for:
- Building reusable prompt builders
- Composing effects with other libraries (logging, analytics)
- Custom theme creation workflow
- CLI argument validation with effect-schema
- Structured error reporting

**Suggestion:** Add advanced guide:
```markdown
# Advanced Patterns

## Form Builder Pattern
## CLI Argument Validation
## Custom Component Creation
## Error Recovery Strategies
## Integration with Logging
```

⚠️ **Issue #3: API reference could show error flows**

Each function documents success case but not error handling:

```typescript
/**
 * Prompt user for text input
 * @param message - The prompt message
 * @returns Effect<string, TUIError>  // ← Mentions error but...
 */
```

**Better:**
```typescript
/**
 * Prompt user for text input
 * 
 * @param message - The prompt message
 * @param options - Validation and default
 * @returns Effect<string, TUIError>
 * 
 * @throws TUIError with reason:
 *   - "Cancelled" - User pressed Ctrl+C
 *   - "ValidationFailed" - Input failed validation
 *   - "RenderError" - Terminal rendering failed
 * 
 * @example
 * ```ts
 * const name = yield* tui.prompt("Name:").pipe(
 *   Effect.catchTag("TUIError", (err) => {
 *     if (err.reason === "Cancelled") {
 *       return Effect.succeed("Guest")
 *     }
 *     return Effect.fail(err)
 *   })
 * )
 * ```
 */
```

---

## 7. Packaging, ESM, and DX

### 7.1 Module Format & package.json

**Excellent ESM setup:**

✅ **Clean package.json:**
```json
{
  "name": "effect-cli-tui",
  "type": "module",  // ESM-only
  "main": "dist/index.js",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "files": ["dist", "README.md", "LICENSE"]
}
```

✅ **ESM-only build (tsup):**
```typescript
// tsup.config.ts
export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  dts: { extension: '.d.ts' },
  external: ['effect', 'react', 'ink', ...],
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react'
  }
})
```

✅ **Proper external dependencies:**
- effect (peer dependency)
- react, ink, ink-* (dependencies)
- Other UI libraries excluded from bundle

**Assessment:**

✅ **Strengths:**
- ESM-only is modern and correct
- Clear export field for TypeScript
- External deps properly configured
- sideEffects: false enables tree-shaking

### 7.2 Tree-shaking & Side Effects

**Good Setup:**

✅ **sideEffects: false** in package.json:
- Enables dead code elimination
- Modules are pure (no side effects on import)

✅ **Modular structure supports tree-shaking:**
```
src/
├── cli.ts (independent)
├── tui.ts (independent)
├── services/display/ (independent)
├── services/ink/ (independent)
├── components/ (independent)
```

Users importing only DisplayService don't pull in InkService.

**Potential Issue:**

⚠️ **Some global listeners might prevent shaking**

InkService registers SIGINT listener during render:
```typescript
process.prependListener("SIGINT", sigintHandler)
```

This isn't a side effect on import (happens at render time), so tree-shaking works fine.

### 7.3 DX Details

**Excellent:**

✅ **Clear main entry point:**
```typescript
import {
  TUIHandler, EffectCLI, DisplayService,
  display, displaySuccess,
  themes, createTheme
} from "effect-cli-tui"
```

✅ **No deep imports needed:**
- All public APIs exported from `src/index.ts`
- Users don't do `from "effect-cli-tui/dist/services/display"`

✅ **Pre-configured runtimes reduce friction:**
```typescript
import { EffectCLIRuntime, TUIHandlerRuntime } from "effect-cli-tui"

const program = Effect.gen(function* () {
  const tui = yield* TUIHandler
  yield* tui.prompt("Name:")
})

await EffectCLIRuntime.runPromise(program)
```

**Issues:**

⚠️ **Issue #1: Error messages when misused are not great**

If user forgets to provide a service:
```typescript
const program = Effect.gen(function* () {
  const cli = yield* EffectCLI
  // No Effect.provide(EffectCLI.Default)
})

await Effect.runPromise(program)
// Error: Missing service: app/EffectCLI
// (Not user-friendly)
```

**Suggestion:** Improve error messages:
```typescript
// Better error:
// ╭──────────────────────────────────────────╮
// │ Missing Required Service: EffectCLI      │
// ├──────────────────────────────────────────┤
// │ Did you forget to provide a runtime?     │
// │                                          │
// │ Try one of:                              │
// │ • EffectCLIRuntime.runPromise(program)   │
// │ • Effect.provide(EffectCLI.Default)     │
// ╰──────────────────────────────────────────╯
```

⚠️ **Issue #2: No terminal detection**

Library works in non-TTY environments but might behave oddly:
```typescript
// Running in non-interactive context (CI/SSH) with prompts
// Prompts fail silently or hang
```

**Suggestion:** Add terminal detection:
```typescript
export class Terminal extends Effect.Service<Terminal>() {
  isTTY(): boolean { /* ... */ }
  supportsColors(): boolean { /* ... */ }
}

// Warn users in non-TTY:
export async function runWithTUI(program) {
  const terminal = yield* Terminal
  if (!terminal.isTTY()) {
    console.warn("⚠ Running in non-interactive environment")
  }
}
```

⚠️ **Issue #3: Version compatibility not documented**

Which versions of React, Ink work?
- Package.json specifies react: ^18.3.1, ink: ^4.4.1
- But no documented compatibility matrix

**Suggestion:** Add compatibility table:
```markdown
# Compatibility

| effect-cli-tui | Effect | React | Ink | Node |
|---|---|---|---|---|
| 2.0.x | 3.19+ | 18+ | 4+ | 20+ |
| 1.x | 3.9+ | 17+ | 3+ | 18+ |
```

---

## 8. Refactor Plan (Phased)

Based on the analysis above, here's a prioritized refactor plan to improve the library systematically.

### Phase 1: Safety & Correctness (High Impact, Low Effort)

**Goal:** Fix fragile patterns and strengthen type safety without breaking APIs.

#### 1.1: Strengthen Error Cancellation Detection

**Task:** Replace string-based cancellation detection with explicit error reason

**Current:**
```typescript
if (err.reason === "TerminalError" && 
    err.message.toLowerCase().includes("cancelled")) {
  return new TUIError("Cancelled", err.message)
}
```

**Target:**
```typescript
export class InkError extends Data.TaggedError("InkError") {
  constructor(
    readonly reason: "RenderError" | "ComponentError" | "TerminalError" | "Cancelled",
    readonly message: string
  ) { super() }
}

// Direct mapping:
if (err.reason === "Cancelled") {
  return new TUIError("Cancelled", err.message)
}
```

**Files:** `src/types.ts`, `src/services/ink/errors.ts`, `src/tui.ts`

**Impact:** Eliminates fragile string matching, improves reliability  
**Effort:** 2-3 hours  
**Breaking:** No (internal types only)

#### 1.2: Fix Theme Access Pattern

**Task:** Replace sync theme access with Effect-based approach

**Current:**
```typescript
try {
  const themeModule = require("../services/theme/service")
  const theme = themeModule.getCurrentThemeSync()
} catch {
  // Fallback
}
```

**Target:**
```typescript
export function displayHighlight(message: string): Effect<void> {
  return Effect.gen(function* () {
    const theme = yield* ThemeService
    const current = yield* theme.getTheme()
    // ... use current theme
  })
}
```

**Files:** `src/core/colors.ts`

**Impact:** Removes require() from ESM, proper Effect composition  
**Effort:** 3-4 hours  
**Breaking:** No (only changes function signature to return Effect)

#### 1.3: Add Missing Error Reasons

**Task:** Add unused error reasons to error handling or remove them

**Current:** `TUIError` has `ValidationFailed` reason that's never used

**Target:** Either implement validation error path or remove reason

**Files:** `src/types.ts`, `src/tui.ts`, tests

**Impact:** Reduces confusion about what errors are possible  
**Effort:** 1-2 hours  
**Breaking:** No

#### 1.4: Fix Type Assertions

**Task:** Replace `as any` with proper type narrowing

**Current:**
```typescript
color: warningColor as any
```

**Target:**
```typescript
type ColorValue = ChalkColor
const warningColor: ColorValue = getDisplayColor("warning")
```

**Files:** `src/core/colors.ts`

**Impact:** Improves type safety, catches mistakes earlier  
**Effort:** 1 hour  
**Breaking:** No

#### 1.5: Extract Error Mapping Functions

**Task:** Create reusable error mapping functions

**Current:** Inline error mapping in multiple methods

**Target:**
```typescript
function mapInkErrorToTUI(err: unknown): TUIError {
  if (err instanceof InkError) {
    return err.reason === "Cancelled"
      ? new TUIError("Cancelled", err.message)
      : new TUIError("RenderError", err.message)
  }
  return new TUIError("RenderError", String(err))
}
```

**Files:** `src/tui.ts`

**Impact:** DRY principle, easier to maintain  
**Effort:** 1-2 hours  
**Breaking:** No

### Phase 2: API & Architecture (High Impact, Medium Effort)

**Goal:** Improve API ergonomics and fix architectural issues.

#### 2.1: Fix Display API Composition

**Task:** Remove auto-providing of DisplayService from convenience wrappers

**Current:**
```typescript
export function display(msg: string, opts = {}) {
  return Effect.gen(function* () {
    const display = yield* DisplayService
    yield* display.output(msg, opts)
  }).pipe(Effect.provide(DisplayService.Default))  // ← Problem
}
```

**Target:**
```typescript
export function display(msg: string, opts = {}): Effect.Effect<void> {
  return Effect.gen(function* () {
    const display = yield* DisplayService
    yield* display.output(msg, opts)
  })
  // No auto-provide; user supplies layer
}
```

**Migration path:**
1. Create new functions without auto-provide
2. Keep old functions for compatibility (deprecate)
3. Update documentation with new pattern
4. In v3.0, remove old functions

**Files:** `src/core/display.ts`, tests, docs

**Impact:** Enables proper Effect composition and theming  
**Effort:** 4-6 hours (including tests & migration guide)  
**Breaking:** Yes (users must provide layers), but mitigated with compatibility layer

#### 2.2: Improve CLI Error Semantics

**Task:** Structure CLIError with explicit exit code handling

**Current:**
```typescript
export class CLIError extends Data.TaggedError("CLIError") {
  constructor(
    readonly reason: "CommandFailed" | "Timeout" | "NotFound" | "ExecutionError",
    readonly message: string,
    readonly exitCode?: number
  ) { super() }
}
```

**Target:**
```typescript
export class CLIError extends Data.TaggedError("CLIError") {
  constructor(
    readonly reason: 
      | "CommandFailed"      // exitCode !== 0
      | "Timeout"
      | "NotFound"
      | "ExecutionError"
      | "SuccessWithWarnings", // exitCode === 0 but stderr present
    readonly message: string,
    readonly exitCode?: number,
    readonly stderr?: string  // Structured stderr
  ) { super() }
}
```

Plus new CLIResult:
```typescript
export interface CLIResult {
  exitCode: number
  stdout: string
  stderr: string
  hasWarnings: boolean  // stderr.length > 0
  hasErrors: boolean    // exitCode !== 0
}
```

**Files:** `src/types.ts`, `src/cli.ts`

**Impact:** Better error discrimination, easier debugging  
**Effort:** 4-5 hours (including tests)  
**Breaking:** Depends on implementation; can be non-breaking if we keep old properties

#### 2.3: Add Validation Schema Helpers

**Task:** Create effect-schema validators for common CLI patterns

**Files:** New file `src/interactive/validators.ts`

**Content:**
```typescript
import { Schema, Effect } from "effect"

export const Validators = {
  email: () => Schema.String.pipe(
    Schema.filter((s) => s.includes("@"), { message: "Invalid email" })
  ),
  
  url: () => Schema.String.pipe(
    Schema.filter((s) => s.startsWith("http"), { message: "Invalid URL" })
  ),
  
  filePath: () => Schema.String.pipe(
    Schema.filter((s) => s.length > 0, { message: "File path required" })
  ),
  
  minLength: (n: number) => (s: string) =>
    s.length >= n ? true : `Must be at least ${n} characters`,
  
  // Async validators
  uniqueUsername: (checkFn: (name: string) => Effect<boolean>) =>
    Schema.String.pipe(
      Schema.asyncTransformation(
        Schema.String,
        async (name) => {
          const unique = await checkFn(name).pipe(Effect.runPromise)
          return unique ? name : new ValidationError("Username taken")
        }
      )
    )
}

// Usage:
yield* tui.prompt("Email:", {
  validate: (input) => {
    try {
      Schema.parseSync(Validators.email())(input)
      return true
    } catch (err) {
      return String(err)
    }
  }
})
```

**Impact:** Reduces boilerplate, provides common patterns  
**Effort:** 3-4 hours  
**Breaking:** No (new functionality)

### Phase 3: UX & Ergonomics (Medium Impact, Medium Effort)

**Goal:** Improve user experience and reduce boilerplate.

#### 3.1: Add Form Builder Helper

**Task:** Create abstraction for building multi-field forms

**Content:**
```typescript
export interface FormField {
  name: string
  message: string
  type: "text" | "password" | "select" | "multiselect" | "confirm"
  choices?: string[]
  validate?: (value: string) => boolean | string
  default?: string
}

export interface FormResult {
  [key: string]: string | string[] | boolean
}

export function buildForm(
  fields: FormField[],
  options?: { showProgress?: boolean }
): Effect.Effect<FormResult, TUIError> {
  return Effect.gen(function* () {
    const tui = yield* TUIHandler
    const result: FormResult = {}

    for (const field of fields) {
      switch (field.type) {
        case "text":
          result[field.name] = yield* tui.prompt(field.message, {
            default: field.default,
            validate: field.validate
          })
          break
        case "password":
          result[field.name] = yield* tui.password(field.message, {
            validate: field.validate
          })
          break
        case "select":
          result[field.name] = yield* tui.selectOption(
            field.message,
            field.choices || []
          )
          break
        case "multiselect":
          result[field.name] = yield* tui.multiSelect(
            field.message,
            field.choices || []
          )
          break
        case "confirm":
          result[field.name] = yield* tui.confirm(field.message)
          break
      }
    }

    return result
  })
}
```

**Files:** New file `src/interactive/form-builder.ts`

**Impact:** Makes form creation much easier  
**Effort:** 3-4 hours (including tests)  
**Breaking:** No

#### 3.2: Add Cancellation Helpers

**Task:** Create helpers for common cancellation patterns

**Content:**
```typescript
export function onCancel<A>(
  effect: Effect.Effect<A, TUIError>,
  onCancelled: () => Effect.Effect<A>
): Effect.Effect<A> {
  return effect.pipe(
    Effect.catchTag("TUIError", (err) => {
      if (err.reason === "Cancelled") {
        return onCancelled()
      }
      return Effect.fail(err)
    })
  )
}

// Usage:
yield* tui.prompt("Name:").pipe(
  onCancel(() => Effect.succeed("Guest"))
)
```

**Files:** New file `src/interactive/cancellation.ts`

**Impact:** Reduces boilerplate for common patterns  
**Effort:** 2-3 hours  
**Breaking:** No

#### 3.3: Add Progress Indicator

**Task:** Create async operation progress display

**Content:**
```typescript
export function withProgress<A, E>(
  effect: Effect.Effect<A, E>,
  message: string,
  options?: { dots?: boolean; interval?: number }
): Effect.Effect<A, E> {
  return Effect.gen(function* () {
    const spinner = yield* Effect.acquire(startSpinner(message, options))
    const result = yield* effect.pipe(
      Effect.tap(() => stopSpinner(spinner))
    )
    return result
  })
}

// Usage:
const result = yield* withProgress(
  cli.run("npm", ["install"]),
  "Installing dependencies..."
)
```

**Files:** Extends `src/progress/spinner.ts`

**Impact:** Better visual feedback for long operations  
**Effort:** 2-3 hours  
**Breaking:** No

### Phase 4: Tests, Docs, & Packaging (Medium Impact, Medium Effort)

**Goal:** Improve test coverage, examples, and documentation.

#### 4.1: Add Real-World Examples

**Task:** Create realistic, production-ready examples

**Examples to create:**
1. `examples/project-scaffolder.ts` — Full project creation workflow
2. `examples/git-wrapper.ts` — Git command with interactive prompts
3. `examples/data-processor.ts` — Multi-step data processing pipeline
4. `examples/server-deployment.ts` — Server deployment workflow

**Impact:** Shows best practices, helps adoption  
**Effort:** 6-8 hours  
**Breaking:** No

#### 4.2: Comprehensive Error Recovery Guide

**Task:** Document error handling patterns

**Content:**
- Cancellation recovery
- Validation retry
- CLI timeout recovery
- Partial failure handling
- Logging integration

**Files:** `docs/ERROR_HANDLING.md`

**Impact:** Helps users build robust apps  
**Effort:** 3-4 hours  
**Breaking:** No

#### 4.3: Improve Test Coverage

**Task:** Add tests for uncovered scenarios

**Scenarios:**
1. Concurrent prompts
2. Nested error handling
3. Large output handling
4. Multi-step form validation
5. Error message localization

**Impact:** Increases confidence in library  
**Effort:** 5-7 hours  
**Breaking:** No

#### 4.4: Add Terminal Compatibility Guide

**Task:** Document terminal requirements and quirks

**Content:**
- TTY detection
- Color support detection
- Windows vs Unix differences
- SSH/container issues
- Accessibility considerations

**Files:** `docs/TERMINAL_SUPPORT.md`

**Impact:** Helps users debug environment issues  
**Effort:** 2-3 hours  
**Breaking:** No

---

## 9. Top 5 Recommendations for effect-cli-tui

Based on the comprehensive review, here are the highest-impact improvements:

### 1. **Fix Display API Composition (Phase 2.1)**

**Priority:** High  
**Impact:** Enables proper Effect composition, theming, and testing

The current display API auto-provides `DisplayService.Default`, preventing proper composition with custom themes or other services. This is a foundational issue that limits the library's flexibility.

**Recommendation:**
- Remove auto-provide from convenience wrappers
- Document migration path with deprecation period
- Provide helper for common patterns

**Why:** Aligns with Effect principles, enables advanced usage patterns

---

### 2. **Strengthen Error Semantics (Phase 1.1 + 2.2)**

**Priority:** High  
**Impact:** Makes error handling more reliable and maintainable

Current error handling relies on:
- String matching for cancellation detection (fragile)
- Ambiguous CLIError reasons (can't distinguish exit codes)
- Unused error reasons (ValidationFailed never used)

**Recommendation:**
- Add explicit "Cancelled" reason to InkError
- Structure CLIError with stdout/stderr/warnings
- Implement or remove unused error reasons

**Why:** Improves reliability and makes debugging easier

---

### 3. **Add Validation & Form Helpers (Phase 2.3 + 3.1)**

**Priority:** Medium-High  
**Impact:** Dramatically reduces boilerplate for common CLI patterns

Current users must manually:
- Write validation functions for each field
- Chain multiple prompts together
- Handle form state

**Recommendation:**
- Add effect-schema validators for common patterns (email, URL, file path)
- Create form builder helper for multi-field prompts
- Provide validation utilities in public API

**Why:** Dramatically improves DX, reduces boilerplate

---

### 4. **Improve CLI Exit Code Handling (Phase 2.2)**

**Priority:** Medium  
**Impact:** Makes CLI error handling more structured and debuggable

Current approach treats all non-zero exits as "CommandFailed", with no structured stderr reporting.

**Recommendation:**
- Add stderr to CLIResult (structured, not message string)
- Add hasWarnings/hasErrors flags to CLIResult
- Consider adding "SuccessWithWarnings" error reason

**Why:** Enables better error recovery and structured logging

---

### 5. **Create Comprehensive Real-World Examples (Phase 4.1)**

**Priority:** Medium  
**Impact:** Accelerates adoption and prevents common mistakes

Current examples are synthetic. Users need to see real patterns like:
- Project scaffolding workflow
- Git integration patterns
- Multi-step form validation
- Error recovery in production code

**Recommendation:**
- Create 3-4 production-ready examples
- Include error handling throughout
- Document best practices inline

**Why:** Reduces time to productive usage, prevents anti-patterns

---

## Summary Table: All Recommendations

| # | Task | Phase | Effort | Impact | Breaking | Priority |
|---|------|-------|--------|--------|----------|----------|
| 1 | Fix Display API Composition | 2.1 | M | High | Yes* | P0 |
| 2 | Strengthen Error Cancellation | 1.1 | S | High | No | P0 |
| 3 | Improve CLI Error Semantics | 2.2 | M | High | Maybe | P1 |
| 4 | Add Validation Helpers | 2.3 | M | High | No | P1 |
| 5 | Add Form Builder | 3.1 | M | High | No | P1 |
| 6 | Fix Theme Access | 1.2 | S | Medium | No | P2 |
| 7 | Extract Error Mapping | 1.5 | S | Low | No | P3 |
| 8 | Add Cancellation Helpers | 3.2 | S | Medium | No | P2 |
| 9 | Add Progress Wrapper | 3.3 | S | Medium | No | P2 |
| 10 | Real-World Examples | 4.1 | M | Medium | No | P2 |
| 11 | Error Recovery Guide | 4.2 | M | Medium | No | P2 |
| 12 | Test Coverage | 4.3 | M | Medium | No | P3 |

*Breaking change can be mitigated with compatibility layer

---

## Final Assessment

**effect-cli-tui is a well-designed, Effect-native library** that successfully achieves its core goal of providing composable, type-safe terminal interfaces for Node.js CLI applications.

### Standout Strengths
1. **Sound Effect architecture** with consistent error handling
2. **Clean module boundaries** with clear separation of concerns
3. **Modern Ink/React component system** for rich UIs
4. **Comprehensive test suite** with good integration coverage
5. **Well-documented APIs** with practical examples

### Areas for Improvement
1. **Display API composition** is the highest-priority fix
2. **Error semantics could be stronger** (less reliance on string matching)
3. **Validation/form patterns** need abstraction helpers
4. **CLI exit code handling** could be more structured
5. **Examples need production-ready patterns**

### Recommended Next Steps
1. **Immediate (P0):** Fix display API composition and error cancellation detection
2. **Near-term (P1):** Add validation helpers and form builder, improve CLI error handling
3. **Medium-term (P2):** Create real-world examples, add convenience helpers
4. **Long-term (P3):** Expand test coverage, create migration guides

With these improvements, effect-cli-tui will be an exceptional library for building robust, composable CLI applications in Effect-ts.

---

**End of Review**

