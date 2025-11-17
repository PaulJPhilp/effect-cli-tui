# Deep Design & Code Review: effect-cli-tui

## Executive Summary

**effect-cli-tui** is a well-architected, Effect-native CLI/TUI library that successfully implements composable, type-safe terminal UI patterns in TypeScript. The codebase demonstrates strong design principles:

- ✅ **Correct Effect.Service pattern** - All services properly use Effect 3.9+ API
- ✅ **Sound type safety** - Discriminated unions, tagged errors, strong TypeScript
- ✅ **Good separation of concerns** - Display, TUI, CLI, and theme layers are well-decoupled
- ✅ **Comprehensive error handling** - Typed errors with specific reasons for pattern matching
- ✅ **Strong test coverage** - Unit, integration, and comprehensive test suites exist

**Key Strengths:** Solid architectural foundation, modern Effect patterns, excellent documentation, robust error handling.

**Areas for Enhancement:** Minor edge cases, some API ergonomics refinements, advanced streaming patterns, and comprehensive test coverage gaps.

---

## 1. Architecture & API Surface

### 1.1 Module Structure

```
src/
├── cli.ts                          # EffectCLI service for command execution
├── tui.ts                          # TUIHandler service for interactive prompts
├── types.ts                        # Shared types and error definitions
├── runtime.ts                      # Pre-configured ManagedRuntimes for convenience
├── core/
│   ├── display.ts                  # Display API convenience wrappers
│   ├── colors.ts                   # Chalk styling utilities
│   ├── terminal.ts                 # Terminal I/O service (stdout/stderr)
│   ├── icons.ts                    # Icon and color constants
│   ├── signal-handler.ts           # Signal handling utilities
│   ├── error-utils.ts              # Type guard utilities
│   └── redact.ts                   # Output redaction for sensitive data
├── services/
│   ├── display/                    # DisplayService (core output formatting)
│   ├── theme/                      # ThemeService (icon/color theming)
│   └── ink/                        # InkService (React/Ink rendering)
├── components/                     # Ink React components (Input, Select, etc.)
├── boxes/                          # Box/panel rendering
├── tables/                         # Table rendering via cli-table3
├── progress/                       # Spinner animations
└── index.ts                        # Public API exports
```

### 1.2 Dependency Graph

```
Public API (index.ts)
    ↓
EffectCLI ←─────────┐
TUIHandler ←────────┤─→ InkService
DisplayService ←───┤
ThemeService ←─────┤
Terminal ←─────────┘

TUIHandler → InkService (declared dependency)
InkService → Terminal
DisplayService → Terminal, ThemeService
```

### 1.3 Public API Surface

**Core Services (Effect.Service):**
- `EffectCLI` - Command execution with `run()` and `stream()` methods
- `TUIHandler` - Interactive prompts (prompt, selectOption, multiSelect, confirm, password, display)
- `DisplayService` - Typed output (output, lines, json, success, error)
- `InkService` - Ink/React component rendering
- `ThemeService` - Theme management and switching
- `Terminal` - Low-level stdout/stderr I/O

**Convenience Wrappers:**
- `display()`, `displayLines()`, `displayJson()`, `displaySuccess()`, `displayError()`
- `displayTable()`, `displayBox()`, `displayPanel()`
- `spinnerEffect()`, `startSpinner()`, `stopSpinner()`, `updateSpinner()`

**Error Types:**
- `CLIError` with reasons: "CommandFailed" | "Timeout" | "NotFound" | "ExecutionError"
- `TUIError` with reasons: "Cancelled" | "ValidationFailed" | "RenderError"
- `InkError` with reasons: "RenderError" | "ComponentError" | "TerminalError"

**Type Definitions:**
- `CLIResult`, `CLIRunOptions`, `PromptOptions`
- `DisplayOptions`, `JsonDisplayOptions`, `DisplayType`
- `SelectOption`, `BorderStyle`, `TableAlignment`, `BoxStyle`

### 1.4 Architecture Strengths

| Strength | Details |
|----------|---------|
| **Clear Separation** | Display, TUI, CLI, and theme concerns are well-isolated |
| **Effect First** | All IO is wrapped in Effect for composability |
| **Type-Safe Errors** | Tagged unions enable precise error handling |
| **Service Pattern** | Consistent use of Effect.Service for all abstractions |
| **Layered Runtime** | Pre-configured runtimes for different use cases |
| **Extensible** | Theme system, components, and services are pluggable |

### 1.5 Architecture Weaknesses & Risks

| Risk | Impact | Severity |
|------|--------|----------|
| **Circular references** | None detected in current structure | Low |
| **Deep import paths** | Public API is well-documented, minimal deep imports | Low |
| **Service coupling** | TUIHandler → InkService is appropriate | Low |
| **Missing async cleanup** | Resource management relies on Effect.acquireUseRelease | Medium |
| **CLI command timeout race condition** | setTimeout/clearTimeout pattern could have edge cases | Medium |
| **Stream error handling** | Some process error cases may not be fully covered | Medium |

---

## 2. TypeScript & Effect Usage Review

### 2.1 Type Safety Assessment

#### ✅ Good Patterns Observed

**Discriminated Unions for Errors:**
```typescript
// ✓ Sound error type design
export class CLIError extends Data.TaggedError("CLIError") {
  constructor(
    readonly reason: "CommandFailed" | "Timeout" | "NotFound" | "ExecutionError",
    readonly message: string,
    readonly exitCode?: number
  )
}
```

**String Literal Types:**
```typescript
// ✓ Precise type for display types
export type DisplayType = "info" | "success" | "error" | "warning";
```

**Overload Compatibility:**
```typescript
// ✓ Supports both string[] and SelectOption[]
selectOption(message: string, choices: string[] | SelectOption[]): Effect<string, TUIError>
```

**Interface Composition:**
```typescript
// ✓ JsonDisplayOptions extends DisplayOptions sensibly
export interface JsonDisplayOptions extends Omit<DisplayOptions, "prefix"> {
  spaces?: number;
  showPrefix?: boolean;
  customPrefix?: string;
}
```

#### ⚠️ Type Safety Concerns

**1. Error Type Narrowing (Medium Impact)**

Current implementation maps `InkError` to `TUIError` with string-based checks:
```typescript
// Current: Fragile string-based detection
if (err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled")) {
  return new TUIError("Cancelled", err.message);
}

// Better: Use structured error codes or typed reasons
```

**Recommendation:** Create specific `InkError` subclasses for different failure modes instead of relying on message string inspection.

**2. Validation Function Return Type (Low Impact)**

```typescript
validate?: (input: string) => boolean | string  // Ambiguous - needs docs
```

Should be clarified: `true` = valid, `false | string` = invalid (message).

**3. Unknown Error Handling (Low Impact)**

Several `catch` blocks accept `unknown`:
```typescript
catch: (err: unknown) =>  // Could narrow this
```

Should use type guards consistently with `isError()` utility.

**4. ChalkStyleOptions Completeness (Low Impact)**

Options support most chalk features but missing some:
- ✓ bold, dim, italic, underline, inverse, strikethrough
- ✗ No support for `hidden`, `overline` (modern chalk)

#### ✅ Effect Usage Patterns - All Correct

**Service Definition (Effect 3.9+ Standard):**
```typescript
// ✓ Correct pattern - Effect.Service, not Context.Tag
export class EffectCLI extends Effect.Service<EffectCLI>()("app/EffectCLI", {
  effect: Effect.sync(() => ({...})),
})
```

**Error Channel Usage:**
```typescript
// ✓ Typed error channels
run(...): Effect.Effect<CLIResult, CLIError>
prompt(...): Effect.Effect<string, TUIError>
```

**Effect Composition:**
```typescript
// ✓ Proper use of Effect.gen and yield*
const program = Effect.gen(function* () {
  const cli = yield* EffectCLI
  const result = yield* cli.run('cmd')
})
```

**Resource Management:**
```typescript
// ✓ Proper use of acquireUseRelease
Effect.acquireUseRelease(
  Effect.try({try: () => render(component), catch: ...}),
  (instance) => Effect.tryPromise({...}),
  (instance) => Effect.sync(() => instance.unmount())
)
```

### 2.2 Type Ergonomics

**Export Strategy:**
- ✓ All public types exported from `src/index.ts`
- ✓ Re-exports for backward compatibility
- ✓ Clear naming conventions

**Generic Usage:**
- ✓ Minimal, well-motivated generics (e.g., `renderWithResult<T>`)
- ✓ No over-generalization

**Type Inference:**
- ✓ Most types inferred automatically
- ✓ Return types are explicit

### 2.3 TypeScript & Effect Recommendations

1. **Replace InkError string-based detection with structured error types:**
   ```typescript
   // Phase 1: Add structured error detection
   type InkErrorReason = "RenderError" | "ComponentError" | "TerminalError" | "Cancelled"
   
   // Then in error mapping:
   if (err instanceof InkError && isCancellationError(err)) {
     return new TUIError("Cancelled", err.message)
   }
   ```
   **Impact:** Medium | **Effort:** Small

2. **Add type guard for validation result:**
   ```typescript
   // More explicit type
   type ValidationResult = true | { isValid: false; message: string }
   validate?: (input: string) => ValidationResult
   ```
   **Impact:** Low | **Effort:** Medium

3. **Widen ChalkStyleOptions for future chalk updates:**
   ```typescript
   interface ChalkStyleOptions {
     // ... existing ...
     overline?: boolean;
     hidden?: boolean;
   }
   ```
   **Impact:** Low | **Effort:** Small

4. **Add `as const` assertions to error reason types for better inference:**
   ```typescript
   readonly reason: "CommandFailed" as const
   ```
   **Impact:** Low | **Effort:** Small

---

## 3. Display API Review

### 3.1 Display API Surface

**Core Functions:**
- `display(message, options?)` → Effect<void>
- `displayLines(lines, options?)` → Effect<void>
- `displayJson(data, options?)` → Effect<void>
- `displaySuccess(message, options?)` → Effect<void>
- `displayError(message, options?)` → Effect<void>
- `displayOutput(message, type, options?)` → Effect<void>

**Styling & Colors:**
- `displayHighlight(message)` - Cyan bold
- `displayWarning(message)` - Yellow bold with prefix
- `displayMuted(message)` - Gray dim
- `displayInfo(message)` - Blue
- `displayListItem(text, indent?)` - Indented bullet point
- `applyChalkStyle(text, options)` - Custom styling

**Advanced Display:**
- `displayTable(data, columns, options?)` → Effect<void>
- `displayBox(content, options?)` → Effect<void>
- `displayPanel(content, title?, options?)` → Effect<void>

### 3.2 Output Behavior Assessment

#### ✅ Strengths

**Proper stdout/stderr Routing:**
```typescript
// ✓ Error messages route to stderr
return type === "error"
  ? Console.error(output)
  : Console.log(output);
```

**Consistent Formatting:**
```typescript
// ✓ Sensible defaults
const { type = DEFAULT_DISPLAY_TYPE, ...restOptions } = options;
```

**JSON Pretty-Printing:**
```typescript
// ✓ Configurable indentation
const jsonString = JSON.stringify(data, null, spaces);
```

**Prefix Alignment in Multi-line JSON:**
```typescript
// ✓ Proper visual alignment
const prefixedJson = jsonString
  .split("\n")
  .map((line, index) =>
    index === 0
      ? `${styledPrefix} ${line}`
      : `${" ".repeat(String(styledPrefix).length + 1)}${line}`
  )
  .join("\n");
```

#### ⚠️ Display API Concerns

**1. Default Newline Behavior (Low Impact)**

```typescript
const output = options.newline !== false ? `\n${jsonString}` : jsonString;
```

Leading newline should be optional or configurable. Users often want fine-grained control over spacing.

**2. Prefix Ambiguity in JSON Display (Low Impact)**

```typescript
// Unclear: showPrefix controls the icon, but customPrefix overrides
showPrefix?: boolean;
customPrefix?: string;
```

Should have clearer semantics:
- `showPrefix: true` → Use theme icon
- `showPrefix: false` → No icon
- `customPrefix` → Use custom (ignores showPrefix)

**3. DisplayOptions extensibility (Medium Impact)**

Options don't allow for future feature additions (e.g., custom formatters):
```typescript
interface DisplayOptions {
  type?: DisplayType;
  prefix?: string;
  newline?: boolean;
  style?: ChalkStyleOptions;
  // Missing: formatter, indentLevel, trimOutput, etc.
}
```

**4. No structured logging hooks (Medium Impact)**

No way to intercept or log display calls (useful for testing/debugging):
```typescript
// Can't easily add logging layer without modifying code
display(message, options)  // Just outputs, no hook
```

### 3.3 Theming Integration

**✅ Strengths:**
- Theme system is well-integrated with display API
- Preset themes (default, minimal, emoji, dark) cover common use cases
- `withTheme()` allows scoped theme changes

**⚠️ Weaknesses:**
- Theme changes are global (mutable service state)
- No validation that custom themes have all required icons/colors
- No TypeScript narrowing for theme-aware display functions

### 3.4 Display API Recommendations

1. **Make leading newline behavior explicit:**
   ```typescript
   interface DisplayOptions {
     type?: DisplayType;
     prefix?: string;
     newline?: boolean;     // Current
     leadingNewline?: boolean;  // Add: control leading \n
     indentLevel?: number;  // Add: for nested output
   }
   ```
   **Impact:** Low | **Effort:** Small

2. **Clarify JSON prefix semantics:**
   ```typescript
   // Better: single property instead of two
   interface JsonDisplayOptions extends DisplayOptions {
     prefixMode?: "theme-icon" | "custom" | "none";
     customPrefix?: string;
   }
   ```
   **Impact:** Low | **Effort:** Medium (breaking change)

3. **Add display interceptor hook for testing/logging:**
   ```typescript
   // Create a DisplayLogger service
   export class DisplayLogger extends Effect.Service<DisplayLogger>()(...) {
     intercept: (message: string, options: DisplayOptions) => Effect<void>
   }
   ```
   **Impact:** Medium | **Effort:** Medium

4. **Validate custom themes at creation time:**
   ```typescript
   // Current: No validation
   const customTheme = createTheme({...})
   
   // Better: Validate required fields
   const customTheme = createTheme({...}).pipe(
     Effect.flatMap(validateTheme)  // Catch missing icons early
   )
   ```
   **Impact:** Low | **Effort:** Small

5. **Add structured log level support:**
   ```typescript
   // Beyond current success/error/info/warning
   type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal"
   display(message, { level: "debug" })  // Future-proofing
   ```
   **Impact:** Low | **Effort:** Small

---

## 4. TUIHandler & Prompt UX

### 4.1 Prompt Method Design

#### ✅ Strengths

**Consistent API Across Prompt Types:**
```typescript
// All return Effect with clear type signatures
prompt(message, options?): Effect<string, TUIError>
selectOption(message, choices): Effect<string, TUIError>
multiSelect(message, choices): Effect<string[], TUIError>
confirm(message, options?): Effect<boolean, TUIError>
password(message, options?): Effect<string, TUIError>
```

**SelectOption Flexibility:**
```typescript
// Supports both simple strings and rich options
selectOption('Choose:', ['A', 'B', 'C'])
selectOption('Choose:', [
  { label: 'Option A', value: 'a', description: 'First option' },
  { label: 'Option B', value: 'b', description: 'Second option' }
])
```

**Type-Safe Error Handling:**
```typescript
// Clear error reasons for pattern matching
const name = yield* tui.prompt('Name:').pipe(
  Effect.catchTag('TUIError', (err) => {
    if (err.reason === 'Cancelled') {
      // User pressed Ctrl+C
      return Effect.succeed('default')
    }
    // Other error handling
  })
)
```

**Validation Support:**
```typescript
const email = yield* tui.prompt('Email:', {
  validate: (input) => 
    input.includes('@') ? true : 'Invalid email'
})
```

#### ⚠️ TUIHandler Concerns

**1. Display Method Coupling (Low Impact)**

```typescript
// TUIHandler.display() is independent of DisplayService
display: (message: string, type: DisplayType = DEFAULT_DISPLAY_TYPE): Effect<void> =>
  Effect.gen(function* () {
    const prefix = getDisplayIcon(type);
    yield* Console.log(`\n${prefix} ${message}`);
  }),
```

Should use DisplayService internally for consistency:
```typescript
display: (message: string, type: DisplayType) => 
  ink.display.output(message, { type })
```

**2. No input masking beyond password (Low Impact)**

Only `password()` masks input. No API for:
- `confirm(message, { showDefault: true })` - Show [Y/n] clearly
- `prompt(message, { maskCharacter: '*' })` - Custom masking

**3. Limited option defaults (Medium Impact)**

```typescript
// No sensible defaults for common patterns
selectOption(message, choices)  // No default selection indicator
confirm(message)  // No visible default hint
```

Should support:
```typescript
selectOption(message, choices, { highlight: 0 })  // Start at first
confirm(message, { default: true })  // Show which is default
```

**4. Validation error feedback (Medium Impact)**

When validation fails, users get minimal feedback:
```typescript
// Current: Just returns false | string, no async validation
validate?: (input: string) => boolean | string

// Missing: Async validation, retry logic, detailed error context
```

**5. No composition helpers (Medium Impact)**

Building multi-step workflows requires boilerplate:
```typescript
// Must manually handle each step
const name = yield* tui.prompt('Name:')
const email = yield* tui.prompt('Email:').pipe(
  Effect.catchTag('TUIError', ...)
)
const confirmed = yield* tui.confirm(`Confirm ${name}/${email}?`)
```

Should have helpers like:
```typescript
// Hypothetical: Sequential prompts with shared context
const inputs = yield* tui.promptSequence([
  { type: 'text', message: 'Name:', validate: ... },
  { type: 'text', message: 'Email:', validate: ... },
  { type: 'confirm', message: 'Confirm?', depends: { name, email } }
])
```

### 4.2 Flow Composition Assessment

**✅ Strengths:**
- All prompts return Effect, enabling natural composition
- Error handling is explicit and type-safe
- Cancellation is properly propagated

**⚠️ Weaknesses:**
- No built-in retry mechanism
- No transaction/rollback pattern for multi-step flows
- No state sharing utilities for complex wizards

### 4.3 Cancellation & Error Semantics

**✅ Correct Implementation:**
```typescript
// ✓ SIGINT (Ctrl+C) is properly detected
sigintHandler = () => {
  if (!completed) {
    completed = true;
    reject(new InkError('TerminalError', 'Cancelled: User pressed Ctrl+C'));
  }
};
process.on('SIGINT', sigintHandler);
```

**✓ Maps to TUIError correctly:**
```typescript
if (err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled")) {
  return new TUIError("Cancelled", err.message);
}
```

**⚠️ Minor Issue:**
String-based detection is fragile. Better to use structured cancellation signal:
```typescript
// Proposal: Add isCancellationError() type guard
function isCancellationError(err: InkError): boolean {
  return err.reason === 'TerminalError' && err.message.includes('Cancelled');
}
```

### 4.4 Accessibility & UX

**✅ Strengths:**
- Clear prompts and labels
- Descriptions for options (via SelectOption)
- Helpful error messages

**⚠️ Areas for Improvement:**
- No screen reader hints/ARIA-equivalent for terminal
- No keyboard shortcuts beyond arrow keys, space, enter
- No visual feedback for multi-step progress
- No way to go back/retry in interactive workflows

### 4.5 TUIHandler Recommendations

1. **Use DisplayService for TUIHandler.display():**
   ```typescript
   display: (message: string, type: DisplayType) => {
     return Effect.gen(function* () {
       const display = yield* DisplayService
       yield* display.output(message, { type })
     })
   }
   ```
   **Impact:** Low | **Effort:** Small

2. **Add structured cancellation error detection:**
   ```typescript
   // Add helper in core module
   export function isCancellationError(err: unknown): boolean {
     return err instanceof InkError && 
            err.reason === 'TerminalError' &&
            err.message.includes('Cancelled')
   }
   
   // Use in error mapping:
   Effect.mapError((err) => {
     if (isCancellationError(err)) {
       return new TUIError('Cancelled', err.message)
     }
     return new TUIError('RenderError', String(err))
   })
   ```
   **Impact:** Low | **Effort:** Small

3. **Add confirm() default hint display:**
   ```typescript
   confirm(message: string, options?: {
     default?: boolean  // Show [Y/n] or [y/N]
   }): Effect<boolean, TUIError>
   ```
   **Impact:** Low | **Effort:** Small

4. **Support async validation:**
   ```typescript
   prompt(message: string, options?: {
     validate?: (input: string) => boolean | string | Promise<boolean | string>
   }): Effect<string, TUIError>
   ```
   **Impact:** Medium | **Effort:** Medium

5. **Add promptSequence helper for multi-step workflows:**
   ```typescript
   interface PromptDefinition {
     key: string
     type: 'text' | 'select' | 'multiselect' | 'confirm' | 'password'
     message: string
     choices?: string[] | SelectOption[]
     default?: string | boolean
     validate?: (input: any, context: Record<string, any>) => boolean | string
   }
   
   promptSequence(definitions: PromptDefinition[]): Effect<Record<string, any>, TUIError>
   ```
   **Impact:** High | **Effort:** Medium

6. **Add retry helper:**
   ```typescript
   promptWithRetry<T>(
     effect: Effect<T, TUIError>,
     options?: { maxRetries?: number; beforeRetry?: () => Effect<void> }
   ): Effect<T, TUIError>
   ```
   **Impact:** Medium | **Effort:** Small

---

## 5. EffectCLI & Command Execution

### 5.1 API Design Assessment

#### ✅ Strengths

**Clear Method Signatures:**
```typescript
run(command: string, args?: string[], options?: CLIRunOptions): Effect<CLIResult, CLIError>
stream(command: string, args?: string[], options?: CLIRunOptions): Effect<void, CLIError>
```

**Comprehensive CLIResult:**
```typescript
interface CLIResult {
  exitCode: number;     // ✓ Essential
  stdout: string;       // ✓ Captured output
  stderr: string;       // ✓ Error output
}
```

**Rich CLIRunOptions:**
```typescript
interface CLIRunOptions {
  cwd?: string;               // ✓ Working directory
  env?: Record<string, string>;  // ✓ Environment variables
  timeout?: number;           // ✓ Timeout in ms
}
```

**Comprehensive Error Handling:**
```typescript
type CLIErrorReason = 
  | "CommandFailed"      // ✓ Non-zero exit
  | "Timeout"            // ✓ Exceeded timeout
  | "NotFound"           // ✓ Command doesn't exist
  | "ExecutionError";    // ✓ Other execution issues

class CLIError extends Data.TaggedError("CLIError") {
  readonly exitCode?: number;  // ✓ Exit code available for "CommandFailed"
}
```

#### ⚠️ EffectCLI Concerns

**1. Exit Code Semantics (Medium Impact)**

```typescript
// Current: All non-zero exits map to "CommandFailed"
if (exitCode === 0) {
  resume(Effect.succeed(...))
} else {
  resume(Effect.fail(new CLIError("CommandFailed", ...)))
}

// Missing: Different handling for common exit codes
// - 1: General error
// - 127: Command not found
// - 128+N: Signal termination (128+15=SIGTERM)
// - 255: Out of range
```

**Recommendation:** Map specific exit codes to more precise error reasons:
```typescript
const getErrorReason = (exitCode: number): CLIErrorReason => {
  if (exitCode === 0) return null;  // Success
  if (exitCode === 1) return "CommandFailed";
  if (exitCode === 127) return "NotFound";
  if (exitCode >= 128 && exitCode <= 128 + 64) return "SignalTermination";
  return "CommandFailed";
};
```

**2. Timeout Handling Race Condition (Medium Impact)**

```typescript
// Current: clearTimeout() happens in close handler
child.on("close", (exitCode) => {
  if (timeout) clearTimeout(timeout);  // May be called by timeout first
  // ...
});

// Risk: If timeout fires just as command completes:
// 1. child.kill() is called
// 2. But close handler still fires
// 3. Resume called twice (!)
```

Actually checking the code more carefully:
```typescript
const timeout = options.timeout
  ? (() => {
      const timeoutMs = options.timeout;
      return setTimeout(() => {
        child.kill();
        resume(Effect.fail(new CLIError("Timeout", ...)));  // ← Resume called
      }, timeoutMs);
    })()
  : null;

child.on("close", (exitCode) => {
  if (timeout) clearTimeout(timeout);
  if (exitCode === 0) {
    resume(Effect.succeed(...));  // ← Resume called again
  }
});
```

**Risk:** If child.kill() causes close event before timeout clears, `resume()` is called twice. Effect.async should handle this, but it's defensive to add a guard.

**3. Signal Handling Not Exposed (Low Impact)**

```typescript
// No way to:
// - Send specific signals (SIGTERM, SIGKILL, etc.)
// - Know which signal terminated the process
// - Handle process groups
```

**4. Stream Error Events Not Fully Handled (Medium Impact)**

```typescript
// stream() implementation
child.on("error", (err) => {
  // Handles ENOENT and general execution errors
  // But: stdio: "inherit" means errors may bypass this handler
});

// Missing: Handle stream-specific errors (broken pipe, etc.)
```

**5. No Output Streaming for run() (Medium Impact)**

```typescript
// Current: Buffers entire output in memory
stdout += data.toString();  // Could be gigabytes!
stderr += data.toString();

// Missing: Option to stream output or set size limits
```

**6. Environment Variable Merging (Low Impact)**

```typescript
// Current: Spreads process.env over options.env
env: { ...process.env, ...options.env }

// Risk: User might want to clear environment
// Better: Allow explicit control
env?: Record<string, string> | null;  // null = clear environment
```

### 5.2 Exit Code & Error Semantics

**✅ Correct Implementation:**
- Non-zero exit codes map to CLIError
- Exit code is captured in error for diagnostics
- Timeout produces specific error reason

**⚠️ Improvement Areas:**
- Could be more granular with signal-based exit codes
- Could preserve more context (e.g., which signal)

### 5.3 Streaming vs Captured Output

**✅ Strengths:**
- Clear distinction between `run()` (captured) and `stream()` (inherited stdio)
- Appropriate use cases documented in README

**⚠️ Weaknesses:**
- No streaming with output capture (for progress tracking)
- No line-by-line processing option
- Memory usage unbounded for large outputs

### 5.4 Timeouts & Robustness

**✅ Strengths:**
- Timeout implemented with process.kill()
- Error message is clear
- Works for both run() and stream()

**⚠️ Weaknesses:**
- Potential race condition (resume called twice) on timeout + close race
- No graceful shutdown before SIGKILL
- No timeout per-operation, only global

### 5.5 EffectCLI Recommendations

1. **Add guard against double-resume on timeout race:**
   ```typescript
   let completed = false;
   
   const timeout = options.timeout ? setTimeout(() => {
     if (!completed) {
       completed = true;
       child.kill();
       resume(Effect.fail(new CLIError("Timeout", ...)));
     }
   }, timeoutMs) : null;
   
   child.on("close", (exitCode) => {
     if (timeout && !completed) {  // ← Add guard
       clearTimeout(timeout);
       completed = true;
       // ... continue ...
     }
   });
   ```
   **Impact:** Medium (correctness) | **Effort:** Small

2. **Map specific exit codes to error reasons:**
   ```typescript
   // Add helper function
   function mapExitCodeToReason(exitCode: number | null): CLIErrorReason {
     if (exitCode === 0) return "Success";  // shouldn't reach error path
     if (exitCode === 127) return "NotFound";
     if (exitCode >= 128 && exitCode < 192) return "SignalTermination";
     return "CommandFailed";
   }
   
   // Update CLIErrorReason to include "SignalTermination"
   ```
   **Impact:** Low | **Effort:** Small

3. **Add optional output streaming for run():**
   ```typescript
   interface CLIRunOptions {
     cwd?: string;
     env?: Record<string, string>;
     timeout?: number;
     onStdout?: (chunk: string) => void;  // Stream output
     onStderr?: (chunk: string) => void;
     maxBufferSize?: number;  // Limit memory usage
   }
   ```
   **Impact:** High (feature) | **Effort:** Medium

4. **Improve environment variable handling:**
   ```typescript
   interface CLIRunOptions {
     cwd?: string;
     env?: Record<string, string> | null;  // null = clear env
     timeout?: number;
     // Option to inherit only specific env vars
     inheritEnv?: keyof typeof process.env[];
   }
   ```
   **Impact:** Medium | **Effort:** Small

5. **Expose signal handling:**
   ```typescript
   interface CLIRunOptions {
     signal?: NodeJS.Signals;  // Default: SIGTERM for timeout
   }
   ```
   **Impact:** Low | **Effort:** Small

6. **Add output size limit:**
   ```typescript
   if (stdout.length > (options.maxBufferSize ?? 10 * 1024 * 1024)) {
     // Truncate or fail
   }
   ```
   **Impact:** Medium (robustness) | **Effort:** Small

---

## 6. Tests, Examples, and Documentation

### 6.1 Test Suite Assessment

#### ✅ Test Coverage Strengths

**Comprehensive Unit Tests:**
- `cli-service.test.ts` - 500+ lines, covering run(), stream(), all error cases
- `cli-comprehensive.test.ts` - Edge cases, exit codes, environment variables
- `cli-stream-method.test.ts` - Stream-specific testing
- `cli-service-edge-cases.test.ts` - Boundary conditions
- `tui-handler.test.ts` - All prompt types
- `display-comprehensive.test.ts` - Display options and styling
- `signal-handler-comprehensive.test.ts` - SIGINT/SIGTERM handling

**Integration Tests:**
- `integration-comprehensive.test.ts` - Multi-service workflows
- `integration.test.ts` - Basic compositions
- `sm-cli-pattern.test.ts` - State machine pattern testing

**Component Tests:**
- Tests for all Ink components (Input, Select, MultiSelect, Confirm, Password, etc.)

#### ⚠️ Test Coverage Gaps

**Missing Test Areas:**

| Area | Importance | Gap |
|------|-----------|-----|
| **Memory limits** | High | No test for max buffer size handling |
| **Large output** | High | No test for commands producing gigabytes |
| **Signal behavior** | High | Limited testing of SIGTERM vs SIGKILL timing |
| **Timeout edge cases** | High | No test for timeout at exact command completion |
| **Stream error events** | Medium | Limited testing of broken pipe, closed streams |
| **Multi-step workflows** | Medium | No comprehensive wizard pattern tests |
| **Theme persistence** | Medium | No test for theme state across multiple effects |
| **Service initialization** | Medium | Limited testing of service startup/shutdown |
| **Concurrent prompts** | Medium | No test for concurrent TUI operations (if unsupported) |

### 6.2 Examples Assessment

**✅ Strong Examples:**
- `examples/basic-prompts.tsx` - Clear prompt examples
- `examples/error-handling.ts` - Error patterns
- `examples/multi-step-wizard.tsx` - Workflow composition
- `examples/progress-demo.tsx` - Spinner usage
- `examples/prompt-builder/` - Complex example with validation, templates

**⚠️ Missing Examples:**

| Example | Value | Difficulty |
|---------|-------|-----------|
| Large command output handling | High | Hard |
| Signal handling (graceful shutdown) | Medium | Medium |
| Streaming output processing | Medium | Medium |
| Concurrent CLI operations | Low | Hard |
| Theme customization advanced | Medium | Easy |
| Error recovery patterns | High | Easy |

### 6.3 Documentation Assessment

**✅ Strengths:**
- README.md is comprehensive and well-organized
- API reference covers all public methods
- Error handling section with examples
- Theming documentation with presets
- Code examples are executable and tested

**⚠️ Documentation Gaps:**

1. **Architecture documentation:** No docs explaining layers, service dependencies
2. **Performance characteristics:** No guidance on memory usage, timeout tuning
3. **Testing guide:** No guidance for users testing CLI code
4. **Migration guide for breaking changes:** (v2.0 had significant changes)
5. **Advanced patterns:** No documentation of composition patterns beyond basics

### 6.4 Tests, Examples, and Documentation Recommendations

1. **Add test for output buffer limits:**
   ```typescript
   describe('EffectCLI', () => {
     it('should handle large output without memory issues', async () => {
       const largeCommand = 'yes | head -n 1000000'  // 1M lines
       const result = yield* cli.run(largeCommand, [], { 
         timeout: 5000,
         maxBufferSize: 10 * 1024 * 1024  // 10MB limit
       })
     })
   })
   ```
   **Impact:** High | **Effort:** Medium

2. **Add integration test for signal handling:**
   ```typescript
   it('should handle SIGTERM gracefully', async () => {
     const program = Effect.gen(function* () {
       const cli = yield* EffectCLI
       const result = yield* cli.run('sleep', ['10'], { timeout: 1000 })
     })
   })
   ```
   **Impact:** High | **Effort:** Medium

3. **Add example for error recovery patterns:**
   ```typescript
   // examples/error-recovery.ts
   // Show retry loops, fallbacks, user confirmation on errors
   ```
   **Impact:** High | **Effort:** Small

4. **Add architecture documentation:**
   ```markdown
   docs/ARCHITECTURE_DETAILED.md
   - Service layer diagram
   - Dependency resolution order
   - How runtimes compose services
   - Resource lifecycle management
   ```
   **Impact:** Medium | **Effort:** Medium

5. **Add performance tuning guide:**
   ```markdown
   docs/PERFORMANCE.md
   - Guidance on output buffering
   - Timeout tuning for various commands
   - Memory usage characteristics
   - Recommendations for long-running operations
   ```
   **Impact:** Medium | **Effort:** Medium

6. **Add testing guide for users:**
   ```markdown
   docs/TESTING.md
   - How to test CLI code using effect-cli-tui
   - Mock layer patterns
   - Testing multi-step workflows
   - Testing error paths
   ```
   **Impact:** High | **Effort:** Medium

---

## 7. Packaging, ESM, and DX

### 7.1 Module Format & Package.json

**✅ Strengths:**

```json
{
  "type": "module",              // ✓ ESM-native
  "main": "dist/index.js",       // ✓ Correct for ESM
  "module": "dist/index.js",     // ✓ Redundant but harmless
  "types": "dist/index.d.ts",    // ✓ TypeScript declarations
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "sideEffects": false,          // ✓ Enables tree-shaking
  "files": ["dist", "README.md", "LICENSE"]  // ✓ Clean distribution
}
```

**Peer Dependency:**
```json
"peerDependencies": {
  "effect": "^3.19.0"            // ✓ Single peer dep
}
```

### 7.2 Tree-Shaking & Side Effects

**✅ Assessment:**

- Package.json declares `"sideEffects": false`
- No global state initialization at module load
- All exports are functions/classes, not singletons
- Services are lazy-initialized (Effect.sync/Effect.gen)

**Potential Issues:**
- Some imports of chalk, which has no sideEffects declaration
- But chalk is a legitimate dependency, not a problem

### 7.3 DX Details

**✅ Strengths:**

**Clear main entry point:**
```typescript
// Users can do:
import { TUIHandler, EffectCLI, display } from 'effect-cli-tui'
// No need for deep imports:
// import from 'effect-cli-tui/dist/core/display'
```

**Convenience runtimes:**
```typescript
// Simple to get started:
await EffectCLIRuntime.runPromise(program)
// vs manual layer composition
```

**Good error messages:**
```typescript
const message = 
  `The command "${command}" was not found. Please verify it is installed and available in your PATH.`
```

#### ⚠️ DX Concerns

**1. No environment validation (Low Impact)**

```typescript
// No check if running in a TTY
// Users might call tui.prompt() in non-TTY environment

// Should check:
if (!process.stdin.isTTY) {
  return Effect.fail(new TUIError(
    'RenderError',
    'Interactive prompts require a TTY'
  ))
}
```

**2. Runtime disposal (Low Impact)**

```typescript
// Requires manual disposal
await EffectCLIRuntime.runPromise(program)
await EffectCLIRuntime.dispose()

// Could provide convenience function
const result = await runWithRuntime(program)  // Disposes automatically
```

Actually, this is already provided! ✓

**3. Service initialization failures (Low Impact)**

```typescript
// If Ink rendering fails, users get generic errors
// Could provide better diagnostics
```

**4. No changelog/breaking changes communication (Low Impact)**

- v2.0 had breaking changes but README doesn't mention v1.x
- No migration guide visible

### 7.4 Packaging & DX Recommendations

1. **Add TTY detection to TUIHandler:**
   ```typescript
   prompt(message, options?): Effect<string, TUIError> {
     return Effect.gen(function* () {
       if (!process.stdin.isTTY) {
         return Effect.fail(
           new TUIError('RenderError', 'Interactive prompts require a TTY')
         )
       }
       // ... proceed with rendering
     })
   }
   ```
   **Impact:** Low (UX) | **Effort:** Small

2. **Add package metadata for better discovery:**
   ```json
   {
     "keywords": ["effect", "cli", "tui", "terminal", "prompts", "interactive"],
     "repository": "github:PaulJPhilp/effect-cli-tui",
     "bugs": "github:PaulJPhilp/effect-cli-tui/issues"
   }
   ```
   **Impact:** Low (marketing) | **Effort:** Trivial

3. **Add comprehensive changelog:**
   ```markdown
   CHANGELOG.md (ensure it documents v2.0 breaking changes)
   ```
   **Impact:** Low (clarity) | **Effort:** Small

4. **Create migration guide from v1 to v2:**
   ```markdown
   docs/MIGRATION_V1_TO_V2.md
   ```
   **Impact:** Medium (for v1 users) | **Effort:** Small

5. **Add diagnostic mode for troubleshooting:**
   ```typescript
   export const getDiagnostics = (): Effect<{
     isTTY: boolean
     platforml: string
     nodeVersion: string
     effectVersion: string
   }> => ...
   
   // Usage: Help users debug issues
   ```
   **Impact:** Low | **Effort:** Small

---

## 8. Refactor Plan (Phased)

### Phase 1 – Safety & Correctness (2-3 days)

Focus on fixing bugs and making the codebase more robust.

| Task | Impact | Effort | Details |
|------|--------|--------|---------|
| Fix timeout double-resume race condition | High | S | Add `completed` guard to prevent resume() being called twice |
| Add TTY detection to TUIHandler | Medium | S | Check `process.stdin.isTTY` before rendering |
| Improve error type detection | Medium | S | Replace string-based InkError detection with type guards |
| Add type guards for validation results | Low | S | Create ValidationResult type for clarity |
| Expand ChalkStyleOptions | Low | S | Add modern chalk features (hidden, overline) |

**Total Effort:** ~3 days

### Phase 2 – API & Architecture (4-5 days)

Enhance APIs with new capabilities and better semantics.

| Task | Impact | Effort | Details |
|------|--------|--------|---------|
| Add output streaming for run() | High | M | Support onStdout, onStderr callbacks, maxBufferSize |
| Map exit codes to specific reasons | Medium | S | Distinguish between 127, signal termination, etc. |
| Use DisplayService in TUIHandler.display() | Low | S | Ensure consistent styling and behavior |
| Improve JSON prefix semantics | Medium | M | Clarify prefixMode vs customPrefix |
| Add environment variable control | Low | S | Support `env: null` to clear environment |

**Total Effort:** ~4 days

### Phase 3 – UX & Ergonomics (5-7 days)

Improve user experience with new helpers and better defaults.

| Task | Impact | Effort | Details |
|------|--------|--------|---------|
| Add promptSequence helper | High | M | Multi-step prompt composition helper |
| Support async validation | Medium | M | Allow Promise returns from validate functions |
| Add confirm() default hint | Low | S | Show [Y/n] or [y/N] indicators |
| Add retry helper | Medium | S | promptWithRetry() convenience function |
| Add display interceptor hook | Medium | M | For testing and logging |

**Total Effort:** ~5 days

### Phase 4 – Tests, Docs, & Packaging (4-6 days)

Comprehensive testing and documentation improvements.

| Task | Impact | Effort | Details |
|------|--------|--------|---------|
| Add buffer limit tests | High | M | Test handling of large output, 10MB+ files |
| Add signal handling tests | High | M | Timeout edge cases, SIGTERM behavior |
| Add error recovery examples | High | S | Show retry patterns, fallbacks |
| Add architecture documentation | Medium | M | Service layer diagram, dependency graphs |
| Add performance tuning guide | Medium | M | Memory, timeout, resource guidelines |
| Add testing guide for users | High | M | Mock patterns, workflow testing |
| Add migration guide | Low | S | From v1 to v2 changes |
| Add diagnostic mode | Low | S | getTDiagnostics() for troubleshooting |

**Total Effort:** ~6 days

### Timeline & Resource Allocation

```
Phase 1 (Safety): ████░░░░░░░░░░░░░░░░░░ 3 days
Phase 2 (API):    ████░░░░░░░░░░░░░░░░░░░░ 4 days  
Phase 3 (UX):     █████░░░░░░░░░░░░░░░░░░░░ 5 days
Phase 4 (Docs):   ██████░░░░░░░░░░░░░░░░░░░ 6 days

Total: ~18 days for 1 engineer
Or: ~9 days with 2 engineers (parallel phases)
```

---

## 9. Top 5 Recommendations for effect-cli-tui

### 🥇 Recommendation #1: Fix Timeout Race Condition (Critical)

**Problem:** The `run()` and `stream()` methods have a potential race condition where `resume()` could be called twice if a command completes exactly as the timeout fires.

**Solution:**
```typescript
// In cli.ts:run() and stream() methods
let completed = false;

const timeout = options.timeout ? setTimeout(() => {
  if (!completed) {
    completed = true;
    child.kill();
    resume(Effect.fail(new CLIError("Timeout", ...)));
  }
}, timeoutMs) : null;

child.on("close", (exitCode) => {
  if (timeout && !completed) {
    clearTimeout(timeout);
    completed = true;
    // ... rest of handler
  }
});
```

**Impact:** High (correctness/reliability)  
**Effort:** Small  
**Timeline:** Phase 1

---

### 🥈 Recommendation #2: Use Structured Error Detection Instead of String Matching

**Problem:** Error classification in TUIHandler relies on fragile string matching:
```typescript
if (err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled"))
```

**Solution:** Create structured error detection function:
```typescript
// core/error-utils.ts
export function isCancellationError(err: InkError): boolean {
  return (
    err.reason === "TerminalError" &&
    err.message.includes("Cancelled")  // Case-sensitive check
  );
}

// In tui.ts
Effect.mapError((err) => {
  if (err instanceof InkError && isCancellationError(err)) {
    return new TUIError("Cancelled", err.message);
  }
  return new TUIError("RenderError", err.message);
})
```

**Impact:** Medium (maintainability, reliability)  
**Effort:** Small  
**Timeline:** Phase 1

---

### 🥉 Recommendation #3: Add Output Streaming & Size Limits to EffectCLI.run()

**Problem:** The `run()` method buffers entire command output in memory, which can cause OOM for long-running commands or large outputs.

**Solution:**
```typescript
interface CLIRunOptions {
  cwd?: string;
  env?: Record<string, string>;
  timeout?: number;
  onStdout?: (chunk: string) => void;      // NEW
  onStderr?: (chunk: string) => void;      // NEW
  maxBufferSize?: number;                  // NEW (default 50MB)
}

// In run() method:
child.stdout.on("data", (data: Buffer) => {
  const chunk = data.toString();
  stdout += chunk;
  
  if (options.onStdout) options.onStdout(chunk);
  
  if (stdout.length > (options.maxBufferSize ?? 50 * 1024 * 1024)) {
    child.kill();
    resume(Effect.fail(new CLIError(
      "ExecutionError",
      "Command output exceeded maximum buffer size"
    )));
  }
});
```

**Impact:** High (reliability for real-world usage)  
**Effort:** Medium  
**Timeline:** Phase 2

---

### 🎯 Recommendation #4: Add Multi-Step Prompt Helper (promptSequence)

**Problem:** Building multi-step wizards requires boilerplate and makes error handling cumbersome.

**Solution:**
```typescript
interface PromptDefinition {
  key: string;
  type: "text" | "select" | "multiselect" | "confirm" | "password";
  message: string;
  choices?: string[] | SelectOption[];
  default?: string | boolean;
  validate?: (value: unknown, context: Record<string, unknown>) => boolean | string;
  skip?: (context: Record<string, unknown>) => boolean;
}

// Usage:
const answers = yield* tui.promptSequence([
  {
    key: "name",
    type: "text",
    message: "Project name:",
    validate: (v) => v.length >= 3 ? true : "Min 3 chars"
  },
  {
    key: "template",
    type: "select",
    message: "Choose template:",
    choices: ["basic", "cli"]
  },
  {
    key: "confirmed",
    type: "confirm",
    message: (ctx) => `Create ${ctx.name}?`
  }
]);
```

**Impact:** High (UX, reduces boilerplate)  
**Effort:** Medium  
**Timeline:** Phase 3

---

### 🚀 Recommendation #5: Comprehensive Testing & Documentation for Production Use

**Problem:** Critical use cases lack test coverage and guidance (large outputs, timeouts, signal handling, error recovery).

**Solution:**
1. Add tests for edge cases:
   - Large output (>100MB) handling
   - Exact timeout vs command completion race
   - Signal termination timing
   - Out-of-memory scenarios

2. Create comprehensive guides:
   - `docs/PERFORMANCE.md` - Tuning, memory, timeouts
   - `docs/TESTING.md` - Testing CLI code patterns
   - `docs/ERROR_RECOVERY.md` - Retry, fallback patterns
   - Example: `examples/error-recovery.ts`

**Impact:** High (production readiness)  
**Effort:** Medium-Large  
**Timeline:** Phase 4

---

## 10. Summary & Next Steps

### Current State

effect-cli-tui is a **well-designed, production-ready library** that successfully brings Effect's composability and type safety to CLI/TUI development. The codebase demonstrates:

✅ Correct use of modern Effect patterns (Effect.Service)  
✅ Sound TypeScript with strong error modeling  
✅ Clean architecture with good separation of concerns  
✅ Comprehensive documentation and examples  
✅ Solid test coverage for core functionality  

### Key Improvements

The 5 recommendations above address:
1. **Correctness** - Fix timeout race condition
2. **Reliability** - Structured error detection, output limits
3. **Usability** - Multi-step helpers, better defaults
4. **Production-readiness** - Tests and documentation

### Implementation Priority

**Critical (Week 1):**
- Fix timeout race condition (Phase 1)
- Add structured error detection (Phase 1)

**High (Week 2-3):**
- Output streaming & size limits (Phase 2)
- Multi-step prompt helper (Phase 3)

**Medium (Week 4+):**
- Error recovery examples and docs (Phase 4)
- Architecture and performance guides (Phase 4)

---

## Appendix: Code Examples for Implementation

### Example 1: Timeout Race Condition Fix

```typescript
// src/cli.ts - run() method
run: (
  command: string,
  args: string[] = [],
  options: CLIRunOptions = {}
) =>
  Effect.async<CLIResult, CLIError>((resume) => {
    const cwd = options.cwd || process.cwd();
    let stdout = "";
    let stderr = "";
    let completed = false;  // ← ADD: Guard flag

    const child = spawn(command, args, {
      cwd,
      env: { ...process.env, ...options.env },
    });

    if (!child.stdout || !child.stderr) {
      if (!completed) {  // ← CHECK: Not already completed
        completed = true;  // ← SET: Mark as completed
        resume(
          Effect.fail(
            new CLIError(
              "NotFound",
              "Unable to start the command..."
            )
          )
        );
      }
      return;
    }

    child.stdout.on("data", (data: Buffer) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data: Buffer) => {
      stderr += data.toString();
    });

    const timeout = options.timeout
      ? (() => {
          const timeoutMs = options.timeout;
          return setTimeout(() => {
            if (!completed) {  // ← CHECK: Guard before kill
              completed = true;  // ← SET: Mark as completed
              child.kill();
              resume(
                Effect.fail(
                  new CLIError(
                    "Timeout",
                    `The command took too long...`
                  )
                )
              );
            }
          }, timeoutMs);
        })()
      : null;

    child.on("close", (exitCode) => {
      if (!completed) {  // ← CHECK: Only process if not already handled
        completed = true;  // ← SET: Mark as completed
        if (timeout) clearTimeout(timeout);

        if (exitCode === 0) {
          resume(
            Effect.succeed({ exitCode: exitCode ?? 0, stdout, stderr })
          );
        } else {
          resume(
            Effect.fail(
              new CLIError(
                "CommandFailed",
                `The command failed (exit code ${exitCode})...`,
                exitCode ?? undefined
              )
            )
          );
        }
      }
    });

    child.on("error", (err) => {
      if (!completed) {  // ← CHECK: Guard before handling error
        completed = true;  // ← SET: Mark as completed
        if (timeout) clearTimeout(timeout);
        // ... rest of error handling
      }
    });
  })
```

### Example 2: Structured Error Detection

```typescript
// src/core/error-utils.ts
export function isCancellationError(err: unknown): boolean {
  return (
    err instanceof InkError &&
    err.reason === "TerminalError" &&
    err.message.includes("Cancelled")
  );
}

// src/tui.ts - In prompt method
prompt: (
  message: string,
  options?: {
    default?: string;
    validate?: (input: string) => boolean | string;
  }
): Effect.Effect<string, TUIError> =>
  ink
    .renderWithResult<string>((onComplete) =>
      React.createElement(Input, {
        message,
        defaultValue: options?.default,
        validate: options?.validate,
        onSubmit: onComplete,
      })
    )
    .pipe(
      Effect.mapError((err) => {
        if (isCancellationError(err)) {
          return new TUIError("Cancelled", "User cancelled the operation");
        }
        if (err instanceof InkError) {
          return new TUIError("RenderError", err.message);
        }
        return new TUIError("RenderError", String(err));
      })
    )
```

---

**End of Comprehensive Design Review**

---

*This review was completed with comprehensive codebase analysis, examining architecture, TypeScript patterns, Effect usage, API design, testing, documentation, and packaging. All recommendations are prioritized by impact and effort, with specific code examples provided for implementation.*

