# Deep Design & Code Review: effect-cli-tui

**Review Date:** 2025-01-XX  
**Reviewer:** Senior TypeScript + Effect + Node.js CLI/TUI Engineer  
**Library Version:** 2.0.0  
**Focus Areas:** Architecture, Type Safety, Effect Usage, API Design, Testing, Packaging

---

## Executive Summary

**effect-cli-tui** is a well-structured Effect-native CLI library with strong type safety and composable APIs. The codebase demonstrates solid understanding of Effect patterns, proper error handling, and good separation of concerns. However, there are several critical issues that need attention:

1. **Critical API Mismatch**: README examples show `new TUIHandler()` / `new EffectCLI()` but the library uses Effect.Service pattern
2. **Bug in EffectCLI.stream()**: Hardcoded "effect" command instead of using the `command` parameter
3. **API Inconsistency**: `selectOption()`/`multiSelect()` signature differs from README (expects `SelectOption[]` but takes `string[]`)
4. **Cancellation Handling**: No explicit cancellation support in Ink components (Ctrl+C handling)
5. **Type Declaration Mismatch**: package.json points to `.d.mts` but tsup outputs `.d.ts`

**Overall Assessment:** Strong foundation with excellent Effect integration, but needs API consistency fixes and documentation alignment before v2.0 release.

---

## 1. Architecture & API Surface

### Module Structure

The library follows a clean, layered architecture:

```
src/
├── index.ts              # Public API exports
├── types.ts             # Shared types & errors
├── cli.ts               # EffectCLI service
├── tui.ts               # TUIHandler service
├── core/                # Core utilities
│   ├── display.ts       # Display convenience wrappers
│   ├── colors.ts        # Chalk styling
│   ├── terminal.ts      # Terminal service
│   └── icons.ts         # Icon constants
├── services/            # Effect services
│   ├── display/         # DisplayService
│   └── ink/             # InkService
├── components/          # React/Ink components
├── tables/              # Table rendering
├── boxes/               # Box rendering
└── progress/            # Spinner utilities
```

**Strengths:**
- ✅ Clear separation: Display, TUI, CLI are independent modules
- ✅ Service pattern properly implemented with `Effect.Service`
- ✅ Convenience wrappers (`display`, `displaySuccess`) are thin and predictable
- ✅ Types centralized in `src/types.ts` with proper re-exports
- ✅ No circular dependencies detected

**Risks / Smells:**
- ⚠️ **Dual API Pattern**: Both service-based (`DisplayService`) and convenience functions (`display()`) exist. While convenient, this creates two ways to do the same thing.
- ⚠️ **README Mismatch**: README shows class instantiation (`new TUIHandler()`) but code uses Effect.Service pattern (`yield* TUIHandler`)
- ⚠️ **Incomplete Abstraction**: `TUIHandler` methods manually provide `InkService.Default` instead of declaring it as a dependency

### Public API Surface

**Exported Classes (Effect.Services):**
- `EffectCLI` - CLI command execution
- `TUIHandler` - Interactive prompts
- `DisplayService` - Display output service
- `InkService` - Ink/React rendering service
- `Terminal` - Terminal I/O service

**Exported Functions:**
- Display: `display`, `displayLines`, `displayJson`, `displaySuccess`, `displayError`, `displayOutput`
- Styling: `applyChalkStyle`, `displayHighlight`, `displayMuted`, `displayWarning`, `displayInfo`
- Tables: `displayTable`
- Boxes: `displayBox`, `displayPanel`
- Progress: `spinnerEffect`, `startSpinner`, `updateSpinner`, `stopSpinner`

**Exported Types:**
- Error types: `CLIError`, `TUIError`, `InkError`
- Options: `DisplayOptions`, `JsonDisplayOptions`, `CLIRunOptions`, `PromptOptions`
- Results: `CLIResult`, `SelectOption`
- Components: All React component props types

**API Cohesion Assessment:**
- ✅ Display API is cohesive and consistent
- ✅ Error types are well-structured with discriminated unions
- ⚠️ **TUIHandler API inconsistency**: `selectOption()`/`multiSelect()` take `string[]` but README shows `SelectOption[]`
- ⚠️ **Service dependencies**: `TUIHandler` methods manually provide `InkService.Default` instead of declaring dependency

---

## 2. TypeScript & Effect Usage Review

### Type-Level Modeling

**Error Types** (`src/types.ts`):
```typescript
export class CLIError extends Data.TaggedError("CLIError") {
  constructor(
    readonly reason: "CommandFailed" | "Timeout" | "NotFound" | "ExecutionError",
    readonly message: string
  ) { super(); }
}

export class TUIError extends Data.TaggedError("TUIError") {
  constructor(
    readonly reason: "Cancelled" | "ValidationFailed" | "RenderError",
    readonly message: string
  ) { super(); }
}
```

**Strengths:**
- ✅ Proper use of `Data.TaggedError` for discriminated unions
- ✅ Clear `reason` field enables pattern matching
- ✅ Type-safe error handling with `Effect.catchTag()`

**Issues:**
- ⚠️ **Missing Cancellation**: `TUIError` has "Cancelled" reason but components don't handle Ctrl+C
- ⚠️ **Error Message Quality**: Some error messages are verbose but could be more actionable

**Options Types:**
```typescript
interface DisplayOptions {
  type?: DisplayType;
  prefix?: string;
  newline?: boolean;
  style?: ChalkStyleOptions;
}

interface CLIRunOptions {
  cwd?: string;
  env?: Record<string, string>;
  timeout?: number;
}
```

**Strengths:**
- ✅ Optional fields with sensible defaults
- ✅ Extensible without breaking changes
- ✅ Clear, descriptive names

**Issues:**
- ⚠️ **JsonDisplayOptions.prefix**: Can be `string | boolean` which is confusing (should be separate `showPrefix?: boolean` and `customPrefix?: string`)

### Effect Patterns

**Good Patterns Found:**

1. **Service Pattern** (`src/tui.ts:40`, `src/cli.ts:10`):
```typescript
export class TUIHandler extends Effect.Service<TUIHandler>()("app/TUIHandler", {
  effect: Effect.sync(() => ({ /* methods */ }))
}) {}
```
✅ Proper Effect.Service usage with automatic Layer generation

2. **Async Wrapping** (`src/cli.ts:26`):
```typescript
run: (...) => Effect.async<CLIResult, CLIError>((resume) => {
  const child = spawn(...)
  child.on('close', (exitCode) => {
    resume(Effect.succeed({ exitCode, stdout, stderr }))
  })
})
```
✅ Proper use of `Effect.async` for Node.js event-driven APIs

3. **Error Channel Usage** (`src/cli.ts:82`):
```typescript
if (exitCode === 0) {
  resume(Effect.succeed({ exitCode, stdout, stderr }))
} else {
  resume(Effect.fail(new CLIError("CommandFailed", ...)))
}
```
✅ Errors in error channel, not thrown

**Problematic Patterns:**

1. **Manual Dependency Provision** (`src/tui.ts:102`):
```typescript
prompt: (...) => Effect.gen(function* () {
  const ink = yield* InkService;
  // ...
}).pipe(Effect.provide(InkService.Default))
```
❌ **Issue**: Should declare `InkService` as dependency in service definition, not manually provide in each method

**Recommendation:**
```typescript
export class TUIHandler extends Effect.Service<TUIHandler>()("app/TUIHandler", {
  effect: Effect.gen(function* () {
    const ink = yield* InkService; // Declare dependency here
    return { /* methods */ }
  }),
  dependencies: [InkService.Default] // Or declare here
}) {}
```

2. **Type Casting** (`src/cli.ts:94`):
```typescript
const error = err as NodeJS.ErrnoException;
```
⚠️ **Issue**: Type assertion without runtime check. Should use proper type guard.

3. **Promise Wrapping** (`src/services/ink/service.ts:51`):
```typescript
renderWithResult: <T>(...) => Effect.tryPromise({
  try: () => new Promise<T>((resolve, reject) => { /* ... */ })
})
```
✅ Acceptable pattern, but resource cleanup could be improved with `Effect.acquireUseRelease`

### Type Ergonomics

**Strengths:**
- ✅ No `any` types found in public APIs
- ✅ Proper use of generics (`renderWithResult<T>`)
- ✅ Type inference works well with Effect.gen

**Issues:**
- ⚠️ **JsonDisplayOptions.prefix**: Union type `string | boolean` is confusing
- ⚠️ **SelectOption vs string[]**: API inconsistency between types and implementation

### Recommendations

1. **Fix Service Dependencies**: Declare `InkService` as dependency in `TUIHandler` service definition
2. **Improve Type Guards**: Replace `as` casts with proper type guards for error handling
3. **Clarify JsonDisplayOptions**: Split `prefix` into `showPrefix?: boolean` and `customPrefix?: string`
4. **Add Resource Safety**: Use `Effect.acquireUseRelease` for Ink component rendering to ensure cleanup
5. **Fix API Consistency**: Align `selectOption()`/`multiSelect()` signatures with README or update README

---

## 3. Display API Design & Console Output

### API Surface & Consistency

**Display Functions** (`src/core/display.ts`):
- `display(message, options?)` - Single-line messages
- `displayLines(lines, options?)` - Multi-line output
- `displayJson(data, options?)` - JSON formatting
- `displaySuccess(message, options?)` - Success messages
- `displayError(message, options?)` - Error messages

**Strengths:**
- ✅ Consistent `DisplayOptions` across all functions
- ✅ Convenience functions are thin wrappers
- ✅ Good defaults (type: 'info', newline: true)

**Issues:**
- ⚠️ **Dual API**: Both `DisplayService` and convenience functions exist. Users might be confused which to use.
- ⚠️ **JsonDisplayOptions.prefix**: `string | boolean` is confusing. Should be separate options.

### Output Behavior & stdout/stderr

**Current Implementation** (`src/services/display/service.ts:35`):
```typescript
output: (message: string, options: DisplayOptions = {}) => {
  const output = formatDisplayOutput(message, type, restOptions);
  return Console.log(output); // Uses Console.log (stdout)
}
```

**Issues:**
- ⚠️ **No stderr Support**: Error messages go to stdout via `Console.log`. Should use `Console.error` for error types.
- ⚠️ **Terminal Service Unused**: `Terminal` service exists but DisplayService doesn't use it for stderr routing

**Recommendation:**
```typescript
output: (message: string, options: DisplayOptions = {}) => {
  const { type = DEFAULT_DISPLAY_TYPE } = options;
  const output = formatDisplayOutput(message, type, restOptions);
  return type === 'error' 
    ? Console.error(output)  // stderr for errors
    : Console.log(output);   // stdout for info/success
}
```

### Formatting & Theming

**Implementation** (`src/services/display/helpers.ts`):
- Uses `getDisplayIcon()` for prefixes (✅, ❌, ℹ️, ⚠️)
- Applies chalk styling via `applyChalkStyle()`
- Consistent prefix spacing

**Strengths:**
- ✅ Consistent icon mapping
- ✅ Extensible styling via `ChalkStyleOptions`
- ✅ Good visual distinction between types

**Issues:**
- ⚠️ **No Theme System**: Hardcoded colors/icons. Could benefit from theme configuration.

### DX Ergonomics

**Strengths:**
- ✅ Simple, intuitive API
- ✅ Good defaults (no options required)
- ✅ Type-safe options

**Issues:**
- ⚠️ **JsonDisplayOptions Confusion**: `prefix: boolean | string` is hard to understand
- ⚠️ **No Structured Logging**: No hooks for logging frameworks or structured output

### Recommendations

1. **Add stderr Support**: Route error-type messages to `Console.error` instead of `Console.log`
2. **Clarify JsonDisplayOptions**: Split `prefix` into `showPrefix?: boolean` and `customPrefix?: string`
3. **Document Dual API**: Clearly explain when to use `DisplayService` vs convenience functions
4. **Consider Theme System**: Allow users to customize colors/icons via configuration
5. **Add Structured Logging Hook**: Optional callback for integrating with logging frameworks

---

## 4. TUIHandler & Prompt UX

### Prompt Method Design

**Current API** (`src/tui.ts`):
```typescript
prompt(message: string, options?: { default?: string; validate?: (input: string) => boolean | string })
selectOption(message: string, choices: string[])  // ⚠️ Takes string[], not SelectOption[]
multiSelect(message: string, choices: string[])
confirm(message: string, options?: { default?: boolean })
password(message: string, options?: { validate?: (input: string) => boolean | string })
```

**Issues:**
- ❌ **API Mismatch**: README shows `selectOption(message, SelectOption[])` but implementation takes `string[]`
- ⚠️ **No Descriptions**: `selectOption()`/`multiSelect()` don't support `SelectOption.description` field
- ⚠️ **Limited Validation**: Validation function returns `boolean | string` but no async validation support

**Recommendation:**
```typescript
selectOption(
  message: string,
  choices: SelectOption[]  // Match README
): Effect.Effect<string, TUIError>

// Or keep string[] but update README to match
```

### Flow Composition

**Example from README:**
```typescript
const setupProject = Effect.gen(function* (_) {
  const tui = new TUIHandler()  // ❌ Wrong - should be yield* TUIHandler
  const name = yield* _(tui.prompt('Project name:'))
  // ...
})
```

**Issues:**
- ❌ **README Shows Wrong Pattern**: Examples use `new TUIHandler()` but library uses Effect.Service
- ✅ **Composition Works Well**: Once corrected, Effect.gen composition is clean and type-safe

### Cancellation & Error Semantics

**Current Implementation** (`src/components/Input.tsx`):
- No explicit Ctrl+C handling
- Components rely on Ink's default behavior
- `TUIError` has "Cancelled" reason but it's unclear when it's triggered

**Issues:**
- ⚠️ **No Explicit Cancellation**: Components don't handle SIGINT (Ctrl+C) explicitly
- ⚠️ **Cancellation Semantics Unclear**: When does "Cancelled" error occur? User presses Ctrl+C? Or component unmounts?

**Recommendation:**
```typescript
// Add signal handling to components
useEffect(() => {
  const handleSigInt = () => {
    onSubmit(new TUIError('Cancelled', 'User cancelled'))
  }
  process.on('SIGINT', handleSigInt)
  return () => process.off('SIGINT', handleSigInt)
}, [])
```

### Accessibility & UX Basics

**Strengths:**
- ✅ Clear prompts with message parameter
- ✅ Validation feedback (shows error message below input)
- ✅ Default values supported

**Issues:**
- ⚠️ **No Help Text**: `SelectOption.description` exists in types but isn't used in components
- ⚠️ **Limited Keyboard Shortcuts**: No documented shortcuts beyond arrow keys + Enter

### Recommendations

1. **Fix API Consistency**: Align `selectOption()`/`multiSelect()` with README (use `SelectOption[]`) or update README
2. **Add Cancellation Handling**: Explicitly handle Ctrl+C in components and emit "Cancelled" error
3. **Support Descriptions**: Display `SelectOption.description` in Select/MultiSelect components
4. **Fix README Examples**: Update all examples to use `yield* TUIHandler` instead of `new TUIHandler()`
5. **Add Async Validation**: Support `Effect<string, TUIError>` return type for validation functions
6. **Document Keyboard Shortcuts**: Add documentation for all supported keyboard interactions

---

## 5. EffectCLI & Command Execution

### API Design

**Current Implementation** (`src/cli.ts`):
```typescript
run(command: string, args?: string[], options?: CLIRunOptions): Effect<CLIResult, CLIError>
stream(command: string, args?: string[], options?: CLIRunOptions): Effect<void, CLIError>
```

**Strengths:**
- ✅ Clear separation: `run()` captures output, `stream()` passes through
- ✅ Consistent options across both methods
- ✅ Good defaults (empty args array, no timeout)

**Critical Bug:**
- ❌ **Hardcoded Command in stream()** (`src/cli.ts:132`):
```typescript
stream: (command: string, args: string[] = [], options: CLIRunOptions = {}) =>
  Effect.async<void, CLIError>((resume) => {
    const child = spawn("effect", [command, ...args], {  // ❌ Hardcoded "effect"
```
**Issue**: `stream()` ignores the `command` parameter and always runs "effect". This is a critical bug.

**Fix:**
```typescript
const child = spawn(command, args, {  // Use command parameter
```

### Exit Code & Error Semantics

**Current Implementation** (`src/cli.ts:73`):
```typescript
child.on("close", (exitCode) => {
  if (exitCode === 0) {
    resume(Effect.succeed({ exitCode: exitCode ?? 0, stdout, stderr }))
  } else {
    resume(Effect.fail(new CLIError("CommandFailed", ...)))
  }
})
```

**Strengths:**
- ✅ Non-zero exit codes map to `CLIError` with "CommandFailed" reason
- ✅ Exit code 0 maps to success
- ✅ Clear error messages with stderr included

**Issues:**
- ⚠️ **No Exit Code in Error**: `CLIError` doesn't include the exit code, making it hard to distinguish different failure modes
- ⚠️ **Null Exit Code Handling**: Uses `exitCode ?? 0` which might mask signal-terminated processes

**Recommendation:**
```typescript
export class CLIError extends Data.TaggedError("CLIError") {
  constructor(
    readonly reason: "CommandFailed" | "Timeout" | "NotFound" | "ExecutionError",
    readonly message: string,
    readonly exitCode?: number  // Add exit code
  ) { super(); }
}
```

### Streaming vs Captured Output

**Current Implementation:**
- `run()`: Captures stdout/stderr, returns `CLIResult`
- `stream()`: Uses `stdio: "inherit"`, returns `void`

**Strengths:**
- ✅ Clear use case distinction
- ✅ Proper stream inheritance for `stream()`

**Issues:**
- ⚠️ **No Partial Output**: `run()` doesn't provide streaming progress, only final result
- ⚠️ **Resource Cleanup**: Timeout cleanup is good, but no explicit cleanup on cancellation

### Timeouts & Robustness

**Current Implementation** (`src/cli.ts:56`):
```typescript
const timeout = options.timeout
  ? (() => {
      const timeoutMs = options.timeout;
      return setTimeout(() => {
        child.kill();  // ✅ Kills process
        resume(Effect.fail(new CLIError("Timeout", ...)))
      }, timeoutMs);
    })()
  : null;

child.on("close", (exitCode) => {
  if (timeout) clearTimeout(timeout);  // ✅ Cleans up timeout
  // ...
})
```

**Strengths:**
- ✅ Proper timeout cleanup
- ✅ Process killed on timeout
- ✅ Clear error message with timeout duration

**Issues:**
- ⚠️ **No Signal Handling**: `child.kill()` sends SIGTERM but doesn't wait for graceful shutdown
- ⚠️ **Race Condition**: Timeout and close handlers both call `clearTimeout`, but race condition possible

### Recommendations

1. **Fix stream() Bug**: Remove hardcoded "effect" command, use `command` parameter
2. **Add Exit Code to CLIError**: Include `exitCode` field in `CLIError` for better error handling
3. **Improve Signal Handling**: Use `child.kill('SIGTERM')` and wait for graceful shutdown before `SIGKILL`
4. **Add Streaming Progress**: Consider adding `runWithProgress()` that streams output while capturing
5. **Handle Null Exit Codes**: Distinguish between normal exit (0) and signal termination (null)
6. **Add Cancellation Support**: Allow cancelling long-running commands via Effect cancellation

---

## 6. Tests, Examples, and Documentation

### Test Coverage

**Test Structure:**
```
__tests__/
├── unit/              # Unit tests for services
│   ├── cli-service.test.ts
│   ├── tui-service.test.ts
│   ├── display-comprehensive.test.ts
│   └── ...
├── integration/       # Integration tests
│   ├── cli-execution.test.ts
│   └── sm-cli-pattern.test.ts
├── components/        # Component tests
└── fixtures/          # Test layers/mocks
```

**Strengths:**
- ✅ Comprehensive unit tests for all services
- ✅ Good use of mock layers (`MockTUI`, `MockCLI`)
- ✅ Tests cover error paths (`MockTUICancelled`, `MockCLIFailure`)
- ✅ Integration tests verify real workflows

**Gaps:**
- ⚠️ **No Tests for stream() Bug**: No test verifies `stream()` uses correct command
- ⚠️ **Limited Cancellation Tests**: Tests mock cancellation but don't test actual Ctrl+C handling
- ⚠️ **No Tests for Exit Code Handling**: Missing tests for null exit codes, signal termination
- ⚠️ **No Tests for stderr Routing**: DisplayService doesn't test error messages go to stderr

### Examples & Documentation

**README Examples:**
- ✅ Good quick start
- ✅ Multiple workflow examples
- ❌ **Wrong API Usage**: Shows `new TUIHandler()` instead of `yield* TUIHandler`
- ❌ **API Mismatch**: `selectOption()` examples show `SelectOption[]` but code takes `string[]`

**API Documentation:**
- ✅ Clear function signatures
- ✅ Good option type documentation
- ⚠️ **Missing Error Examples**: Limited examples of error handling patterns
- ⚠️ **No Cancellation Examples**: No examples showing how to handle user cancellation

### Recommendations

1. **Fix README Examples**: Update all examples to use Effect.Service pattern correctly
2. **Add stream() Test**: Test that `stream()` uses the correct command parameter
3. **Add Cancellation Tests**: Test actual Ctrl+C handling in components
4. **Add Error Handling Examples**: Show patterns for handling `TUIError` and `CLIError`
5. **Add Exit Code Tests**: Test null exit codes, signal termination scenarios
6. **Add Integration Test for stream()**: Verify `stream()` works with different commands
7. **Document Cancellation**: Add section explaining cancellation behavior and error handling

---

## 7. Packaging, ESM, and DX

### Module Format & package.json

**Current Configuration** (`package.json`):
```json
{
  "type": "module",
  "main": "dist/index.js",
  "module": "dist/index.js",
  "types": "dist/index.d.mts",  // ⚠️ Points to .d.mts
  "exports": {
    ".": {
      "types": "./dist/index.d.mts",  // ⚠️ Points to .d.mts
      "import": "./dist/index.js"
    }
  }
}
```

**tsup Configuration** (`tsup.config.ts`):
```typescript
export default defineConfig({
  dts: { extension: '.d.ts' },  // ⚠️ Outputs .d.ts, not .d.mts
  // ...
})
```

**Issues:**
- ❌ **Type Declaration Mismatch**: package.json points to `.d.mts` but tsup outputs `.d.ts`
- ⚠️ **No CJS Support**: ESM-only, which is fine for modern Node.js but limits compatibility

**Fix:**
```json
{
  "types": "dist/index.d.ts",  // Match tsup output
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",  // Match tsup output
      "import": "./dist/index.js"
    }
  }
}
```

### Tree-shaking & Side Effects

**Strengths:**
- ✅ ESM format enables tree-shaking
- ✅ Small, focused modules
- ✅ No `sideEffects` field needed (no side effects at module level)

**Issues:**
- ⚠️ **No sideEffects Field**: Should explicitly declare `"sideEffects": false` for better bundler optimization

### DX Details

**Strengths:**
- ✅ Clear main entry point
- ✅ All exports from single `index.ts`
- ✅ Good TypeScript declarations

**Issues:**
- ⚠️ **No Error Messages**: No helpful errors for missing TTY or unsupported environments
- ⚠️ **Peer Dependency**: `effect` is peer dependency but version range (`^3.0.0`) might be too broad

### Recommendations

1. **Fix Type Declaration Path**: Update package.json to match tsup output (`.d.ts` not `.d.mts`)
2. **Add sideEffects Field**: Add `"sideEffects": false` to package.json for better bundling
3. **Tighten Peer Dependency**: Consider `"effect": "^3.18.0"` to match actual usage
4. **Add Environment Checks**: Provide helpful errors when TTY is not available
5. **Consider Dual Publish**: If needed, add CJS support for broader compatibility (but ESM-only is fine for modern Node.js)

---

## 8. Refactor Plan (Phased)

### Phase 1 – Safety & Correctness (High Impact, Medium Effort)

**Critical Bugs & Type Safety:**

1. **Fix stream() Hardcoded Command** (`src/cli.ts:132`)
   - Impact: **High** - Breaks `stream()` for any command other than "effect"
   - Effort: **Small** - One line change
   - Change: `spawn("effect", ...)` → `spawn(command, ...)`

2. **Fix Type Declaration Mismatch** (`package.json`)
   - Impact: **High** - TypeScript users can't find type definitions
   - Effort: **Small** - Update package.json paths
   - Change: `.d.mts` → `.d.ts` in types/exports fields

3. **Fix Service Dependencies** (`src/tui.ts`)
   - Impact: **Medium** - Better dependency management
   - Effort: **Small** - Move `InkService` to service dependencies
   - Change: Declare `InkService` in `TUIHandler` dependencies

4. **Add Exit Code to CLIError** (`src/types.ts`)
   - Impact: **Medium** - Better error handling
   - Effort: **Small** - Add `exitCode?: number` field

5. **Fix README API Examples** (`README.md`)
   - Impact: **High** - Users will use wrong API
   - Effort: **Medium** - Update all examples
   - Change: `new TUIHandler()` → `yield* TUIHandler`

### Phase 2 – API & Architecture (Medium Impact, Medium Effort)

**API Consistency & Improvements:**

6. **Fix selectOption()/multiSelect() API** (`src/tui.ts`, `README.md`)
   - Impact: **Medium** - API inconsistency confusing
   - Effort: **Medium** - Update implementation or README
   - Options:
     - A) Change implementation to accept `SelectOption[]` (recommended)
     - B) Update README to show `string[]`

7. **Clarify JsonDisplayOptions.prefix** (`src/services/display/types.ts`)
   - Impact: **Low** - Confusing but works
   - Effort: **Small** - Split into `showPrefix` and `customPrefix`

8. **Add stderr Support** (`src/services/display/service.ts`)
   - Impact: **Medium** - Better CLI practices
   - Effort: **Small** - Route error types to `Console.error`

9. **Improve Type Guards** (`src/cli.ts`)
   - Impact: **Low** - Type safety improvement
   - Effort: **Small** - Replace `as` casts with proper guards

### Phase 3 – UX & Ergonomics (Medium Impact, Large Effort)

**User Experience Improvements:**

10. **Add Cancellation Handling** (`src/components/*.tsx`)
    - Impact: **Medium** - Better UX for cancellation
    - Effort: **Large** - Add SIGINT handling to all components
    - Change: Handle Ctrl+C explicitly, emit "Cancelled" error

11. **Support SelectOption Descriptions** (`src/components/Select.tsx`, `MultiSelect.tsx`)
    - Impact: **Low** - Nice-to-have feature
    - Effort: **Medium** - Update components to display descriptions

12. **Add Resource Safety for Ink** (`src/services/ink/service.ts`)
    - Impact: **Medium** - Better resource cleanup
    - Effort: **Medium** - Use `Effect.acquireUseRelease` for component rendering

13. **Add Theme System** (`src/core/colors.ts`, `src/core/icons.ts`)
    - Impact: **Low** - Customization feature
    - Effort: **Large** - Design theme API, implement

### Phase 4 – Tests, Docs, & Packaging (Low Impact, Medium Effort)

**Documentation & Testing:**

14. **Add stream() Test** (`__tests__/unit/cli-service.test.ts`)
    - Impact: **Medium** - Prevents regression
    - Effort: **Small** - Test that correct command is used

15. **Add Cancellation Tests** (`__tests__/unit/tui-service.test.ts`)
    - Impact: **Medium** - Verify cancellation behavior
    - Effort: **Medium** - Test actual Ctrl+C handling

16. **Add Error Handling Examples** (`README.md`, `examples/`)
    - Impact: **Medium** - Better developer experience
    - Effort: **Small** - Add examples showing error handling patterns

17. **Add sideEffects Field** (`package.json`)
    - Impact: **Low** - Better bundling
    - Effort: **Small** - Add `"sideEffects": false`

18. **Tighten Peer Dependency** (`package.json`)
    - Impact: **Low** - Better compatibility guarantees
    - Effort: **Small** - Update effect version range

---

## 9. Top 5 Recommendations for effect-cli-tui

### 1. Fix Critical Bugs Before v2.0 Release

**Priority: CRITICAL**

- Fix `stream()` hardcoded command bug (`src/cli.ts:132`)
- Fix type declaration mismatch (`package.json`)
- Fix README API examples (use Effect.Service pattern)

**Impact:** These bugs will cause immediate user frustration and break core functionality.

### 2. Align API with Documentation

**Priority: HIGH**

- Fix `selectOption()`/`multiSelect()` API inconsistency (either update code to match README or update README)
- Ensure all README examples use correct Effect.Service pattern

**Impact:** API/documentation mismatch causes confusion and incorrect usage.

### 3. Improve Error Handling

**Priority: MEDIUM**

- Add `exitCode` to `CLIError` for better error diagnostics
- Add explicit cancellation handling in components
- Route error-type messages to stderr instead of stdout

**Impact:** Better error handling improves developer experience and CLI best practices.

### 4. Fix Service Dependencies

**Priority: MEDIUM**

- Declare `InkService` as dependency in `TUIHandler` service definition instead of manually providing in each method
- This improves dependency management and testability

**Impact:** Cleaner architecture, better testability, more idiomatic Effect usage.

### 5. Add Comprehensive Tests

**Priority: MEDIUM**

- Add test for `stream()` command parameter
- Add tests for cancellation handling
- Add tests for exit code handling (null, signals)
- Add tests for stderr routing

**Impact:** Prevents regressions and ensures reliability.

---

## Conclusion

**effect-cli-tui** is a well-architected library with strong Effect integration and good separation of concerns. The codebase demonstrates solid understanding of Effect patterns and type safety. However, there are several critical issues that must be addressed before v2.0:

1. **Critical Bugs**: `stream()` hardcoded command, type declaration mismatch
2. **API Inconsistencies**: README vs implementation mismatches
3. **Missing Features**: Cancellation handling, stderr routing, exit codes in errors

**Overall Grade: B+**

With the Phase 1 fixes, this becomes an **A-** library. The foundation is solid; it just needs these critical fixes and API alignment.

**Recommended Action:** Address all Phase 1 items immediately, then proceed with Phase 2-4 based on priority and user feedback.

---

**Review Completed:** 2025-01-XX  
**Next Review:** After Phase 1 fixes are implemented

