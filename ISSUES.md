# GitHub Issues from Code Review

Generated from comprehensive code review. Use these templates to create GitHub issues.

---

## P0 BLOCKERS

### Issue 1: Add Missing Dependencies (@inquirer/prompts, @effect/schema)
**Priority:** CRITICAL
**Severity:** Blocks type-checking and validation

**Description:**
Two critical dependencies are missing from `package.json`:
- `@inquirer/prompts` - Used in `src/interactive/prompt.ts` but not declared
- `@effect/schema` - Required per CLAUDE.md for all input validation

**Current Status:**
```bash
$ pnpm type-check
error TS2307: Cannot find module '@inquirer/prompts'
```

**Fix Required:**
```json
{
  "dependencies": {
    "@effect/schema": "^0.75.0",
    "@inquirer/prompts": "^5.0.0",
    "chalk": "^5.3.0",
    "cli-spinners": "^3.0.0",
    "cli-table3": "^0.6.3",
    "effect": "^3.18.0",
    "highlight.js": "^11.9.0"
  }
}
```

**Files Affected:**
- `package.json`

**Related Files:**
- `src/interactive/prompt.ts:8` - imports from @inquirer/prompts
- `CLAUDE.md` - validation section requires @effect/schema

---

### Issue 2: Enable TypeScript Strictness (noUncheckedIndexedAccess)
**Priority:** HIGH
**Severity:** Allows unsafe array/object access

**Description:**
`noUncheckedIndexedAccess` is missing from `tsconfig.json`. This allows unsafe element access without runtime checks.

**Evidence:**
```typescript
// src/tables/table.ts:64
let value = row[col.key as string];  // ❌ Could be undefined, not type-checked
```

**Fix:**
Add `"noUncheckedIndexedAccess": true` to `tsconfig.json` compilerOptions.

**Files Affected:**
- `tsconfig.json`

---

### Issue 3: Add "type": "module" to package.json
**Priority:** HIGH
**Severity:** ESM module resolution could fail

**Description:**
The library is ESM-only but lacks `"type": "module"` declaration in package.json.

**Current:**
```json
{
  "name": "effect-cli-tui",
  "version": "1.0.0",
  // ❌ Missing "type": "module"
}
```

**Fix:**
```json
{
  "name": "effect-cli-tui",
  "version": "1.0.0",
  "type": "module",
  // ...
}
```

**Files Affected:**
- `package.json`

---

### Issue 4: Remove Implicit `any` Types (4 instances)
**Priority:** HIGH
**Severity:** Type safety gap

**Description:**
Four instances of implicit `any` types throughout the codebase violate strict TypeScript settings.

**Locations:**
1. `src/tables/table.ts:6` - Default generic parameter
   ```typescript
   export interface TableColumn<T = any> { ... }
   ```

2. `src/tables/table.ts:9` - Function parameter
   ```typescript
   formatter?: (value: any) => string;
   ```

3. `src/tables/table.ts:62` - Variable declaration
   ```typescript
   data.forEach((row: any) => { ... })
   ```

4. `src/progress/spinner.ts:59` - Type cast
   ```typescript
   }, (spinner as any).interval || 100);
   ```

**Fix:**
Replace with proper types or `unknown`. See detailed patches in code review.

**Files Affected:**
- `src/tables/table.ts`
- `src/progress/spinner.ts`

---

### Issue 5: Create ESLint Configuration
**Priority:** HIGH
**Severity:** No linting enforcement

**Description:**
ESLint config is missing. `pnpm lint` command exists but has no rules to enforce.

**Current:**
```bash
$ pnpm lint
No files matching the pattern "src" were found.
```

**Required Files:**
- `.eslintrc.json` - ESLint configuration
- Update `package.json` devDependencies with TypeScript ESLint packages

**Details:**
- Parser: `@typescript-eslint/parser`
- Plugins: `@typescript-eslint`
- Rules: Enforce no-any, no-unused-vars, etc.
- Target: `src/` and `__tests__/` directories

**Files Affected:**
- `.eslintrc.json` (create)
- `package.json` (add dev dependencies)

---

### Issue 6: Refactor Services to Effect.Service Pattern (Effect 3.9+)
**Priority:** CRITICAL
**Severity:** Architecture mismatch with modern Effect patterns

**Description:**
`TUIHandler` and `EffectCLI` are implemented as plain classes with constructors, not as Effect services. This prevents proper dependency injection, testability, and composition. Must use the modern `Effect.Service` API from Effect 3.9+.

**Current Pattern (Incorrect):**
```typescript
export class EffectCLI {
  run(command: string, ...): Effect<CLIResult, CLIError> { ... }
}

// Usage:
const cli = new EffectCLI()  // ❌ Manual instantiation, not composable
```

**Required Pattern (Effect.Service API):**
```typescript
import * as Effect from 'effect/Effect'

export class EffectCLI extends Effect.Service<EffectCLI>()("app/EffectCLI", {
  effect: Effect.gen(function* () {
    return {
      run: (command: string, args?: string[], options?: CLIRunOptions) =>
        Effect.async<CLIResult, CLIError>((resume) => {
          // Implementation: spawn process, handle output, etc.
        }),
      stream: (command: string, args?: string[], options?: CLIRunOptions) =>
        Effect.async<void, CLIError>((resume) => {
          // Implementation: stream output to parent process
        })
    } as const
  }),
  dependencies: [] // Add any service dependencies here
}) {}

// Usage:
const program = Effect.gen(function* () {
  const cli = yield* EffectCLI
  const result = yield* cli.run('build')
}).pipe(Effect.provide(EffectCLI.Default))
```

**Benefits:**
- ✅ Unified Context.Tag + Layer definition
- ✅ Proper dependency injection
- ✅ Testable with mock layers
- ✅ Works with Effect composition
- ✅ Modern Effect 3.9+ standard

**Test Layer Example:**
```typescript
export const MockCLI = Effect.Service<EffectCLI>()("app/EffectCLI", {
  effect: Effect.sync(() => ({
    run: () => Effect.succeed({ exitCode: 0, stdout: 'mock', stderr: '' }),
    stream: () => Effect.void
  }))
}).Default
```

**Files Affected:**
- `src/cli.ts`
- `src/tui.ts`
- `src/index.ts` (exports)
- `__tests__/` (update tests with mock services)

**Breaking Change:** Yes - public API changes (users will use `yield* EffectCLI` instead of `new EffectCLI()`)

---

### Issue 7: Add Resource Safety for Process Spawning
**Priority:** CRITICAL
**Severity:** Resource leaks on interruption

**Description:**
Child processes spawned in `EffectCLI.run()` are not managed with `acquireRelease`, causing potential resource leaks on interruption or error.

**Current Code:**
```typescript
// src/cli.ts:16-94
const child = spawn('effect', [command, ...args], { cwd, env })
// ❌ No cleanup guarantee on interruption/errors
```

**Required Fix:**
```typescript
return Effect.acquireRelease(
  Effect.sync(() => spawn(...)),
  (child) => Effect.sync(() => {
    if (!child.killed) child.kill('SIGTERM')
  })
).pipe(Effect.flatMap(child => /* rest of logic */))
```

**Files Affected:**
- `src/cli.ts`

**Related:**
- Timeout cleanup needs to be integrated into acquireRelease

---

### Issue 8: Add Terminal State Safety for Spinner
**Priority:** CRITICAL
**Severity:** Terminal corruption on interruption

**Description:**
Spinner's cursor hiding/showing is not managed with `acquireRelease`, causing terminal corruption on Ctrl+C.

**Current Code:**
```typescript
// src/progress/spinner.ts:51-86
if (options?.hideCursor) {
  process.stdout.write('\x1B[?25l')  // ❌ No guarantee of restoration
}
currentSpinner = setInterval(...)  // ❌ No cleanup on interruption
```

**Required Fix:**
```typescript
return Effect.acquireRelease(
  Effect.sync(() => {
    if (options?.hideCursor) process.stdout.write('\x1B[?25l')
    return setInterval(...)
  }),
  (interval) => Effect.sync(() => {
    clearInterval(interval)
    if (options?.hideCursor) process.stdout.write('\x1B[?25h')
  })
)
```

**Files Affected:**
- `src/progress/spinner.ts`

**Related Issues:**
- #12: Add signal handling (SIGINT/SIGTERM)

---

## P1 HIGH PRIORITY

### Issue 9: Create Test Layers and Mocks
**Priority:** HIGH
**Severity:** Untestable services

**Description:**
No mock layers exist for `EffectCLI` and `TUIHandler`. Unit testing is impossible without them.

**Files Affected:**
- `__tests__/fixtures/test-layers.ts` (create)

**Depends On:**
- Issue #6 (Context.Tag/Layer refactoring)

---

### Issue 10: Add Command Execution Buffer Limits
**Priority:** MEDIUM-HIGH
**Severity:** Potential OOM on large output

**Description:**
`EffectCLI.run()` has no max buffer limit. Large command output accumulates unbounded in memory.

**Fix:**
- Add `maxBuffer` option (default 10MB)
- Kill process if buffer exceeded
- Return `CLIError` with buffer overflow reason

**Files Affected:**
- `src/cli.ts`
- `src/types.ts` (CLIRunOptions interface)

---

### Issue 11: Add Signal Handling (SIGINT/SIGTERM)
**Priority:** HIGH
**Severity:** Terminal state corruption on interrupt

**Description:**
No handlers for SIGINT/SIGTERM. Terminal state (cursor visibility) not restored on Ctrl+C.

**Required:**
- Catch SIGINT/SIGTERM
- Restore cursor visibility
- Cleanup spinner intervals
- Exit gracefully

**Files Affected:**
- `src/core/signal-handler.ts` (create)
- `src/cli.ts` (integrate)
- `src/progress/spinner.ts` (integrate)

---

### Issue 12: Fix Error Reason Types
**Priority:** MEDIUM
**Severity:** Incorrect error categorization

**Description:**
`CLIError` reason 'NotFound' used for non-ENOENT errors. Should distinguish execution errors.

**Current:**
```typescript
export class CLIError extends Data.TaggedError('CLIError') {
  readonly reason: 'CommandFailed' | 'Timeout' | 'NotFound'
}
```

**Fix:**
```typescript
export class CLIError extends Data.TaggedError('CLIError') {
  readonly reason: 'CommandFailed' | 'Timeout' | 'NotFound' | 'ExecutionError'
}
```

**Files Affected:**
- `src/types.ts`
- `src/cli.ts`

---

### Issue 13: Add Secret Redaction in Logs
**Priority:** MEDIUM
**Severity:** Information disclosure risk

**Description:**
Environment variables and command output logged without filtering sensitive data (passwords, tokens, keys, secrets).

**Required:**
- Create `src/core/redact.ts`
- Filter logs for common patterns
- Use in CLI output and display functions

**Files Affected:**
- `src/core/redact.ts` (create)
- `src/cli.ts` (integrate)

---

### Issue 14: Remove Duplicate Display Module
**Priority:** MEDIUM
**Severity:** Maintenance burden, confusion

**Description:**
Two overlapping display implementations: `src/display.ts` (original) and `src/core/display.ts` (enhanced).

**Current:**
- Both implement `display()`, `displayLines()`, `displayJson()`
- Both exported from `src/index.ts`
- Confusing which to use

**Fix:**
- Delete `src/display.ts`
- Keep `src/core/display.ts` only
- Update imports in `src/index.ts`

**Files Affected:**
- `src/display.ts` (delete)
- `src/index.ts` (update imports)

---

### Issue 15: Create Output Service Abstraction
**Priority:** MEDIUM
**Severity:** Limited testability

**Description:**
Direct console.log/write calls throughout codebase prevent testing with custom streams.

**Required:**
- Create `OutputService` Context.Tag
- Provide `OutputLive` and `OutputTest` layers
- Use in all display functions

**Files Affected:**
- `src/core/output.ts` (create)
- All display modules (integrate)

---

### Issue 16: Fix Hardcoded Path in Vitest Config
**Priority:** MEDIUM
**Severity:** Not portable

**Description:**
Vitest config has hardcoded absolute path in alias.

**Current:**
```javascript
// vitest.config.mjs:18
alias: {
  'effect-cli-tui': '/Users/paul/Projects/Published/effect-cli-tui/dist/index.js'
}
```

**Fix:**
```javascript
alias: {
  'effect-cli-tui': new URL('./dist/index.js', import.meta.url).pathname
}
```

**Files Affected:**
- `vitest.config.mjs`

---

### Issue 17: Fix Naming Convention (Single-letter Parameter)
**Priority:** LOW
**Severity:** Code clarity

**Description:**
Single-letter parameter name violates naming conventions.

**Location:**
```typescript
// src/interactive/prompt.ts:35
validate: validate ? (v) => {  // ❌ Should be 'input' or 'value'
```

**Fix:**
```typescript
validate: validate ? (input) => {
  const result = validate(input);
  return result === true ? true : String(result);
} : undefined,
```

**Files Affected:**
- `src/interactive/prompt.ts`

---

### Issue 18: Add JSDoc to Error Classes
**Priority:** LOW
**Severity:** Missing IDE intellisense

**Description:**
`CLIError` and `TUIError` lack JSDoc documentation.

**Files Affected:**
- `src/types.ts`

---

## P2 MEDIUM PRIORITY

### Issue 19: Enable Coverage Configuration
**Priority:** MEDIUM
**Severity:** Unknown code coverage

**Description:**
Coverage config commented out in `vitest.config.mjs`. Cannot measure test coverage.

**Files Affected:**
- `vitest.config.mjs`

---

### Issue 20: Fix Exports Map Type Condition
**Priority:** MEDIUM
**Severity:** TypeScript resolution could fail

**Description:**
Exports map doesn't match actual built type file name.

**Build produces:** `dist/index.d.mts`
**Exports map expects:** `dist/index.d.ts`

**Files Affected:**
- `package.json`

---

### Issue 21: Add Snapshot Tests for ANSI Output
**Priority:** MEDIUM
**Severity:** ANSI styling not tested

**Description:**
No snapshot tests for boxes, tables, spinners with ANSI codes.

**Files Affected:**
- `__tests__/` (new tests)

---

### Issue 22: Add Integration Tests for Process Execution
**Priority:** MEDIUM
**Severity:** EffectCLI not tested

**Description:**
`EffectCLI` has instantiation test only. No integration test of actual command execution.

**Files Affected:**
- `__tests__/` (new integration tests)

---

### Issue 23: Move effect to peerDependencies
**Priority:** LOW
**Severity:** Duplicate Effect instances possible

**Description:**
`effect` should be in `peerDependencies` (like `ink`, `react`) to avoid duplicate instances.

**Current:**
```json
"dependencies": {
  "effect": "^3.18.0"
}
```

**Should be:**
```json
"peerDependencies": {
  "effect": "^3.0.0",
  "ink": "^4.0.0",
  "react": "^18.0.0"
}
```

**Files Affected:**
- `package.json`

---

## Summary

**Total Issues:** 23
**P0 Blockers:** 8 (all critical)
**P1 High Priority:** 9
**P2 Medium:** 6

**Recommended Implementation Order:**
1. P0#1-5, P0#3 (fastest wins, unblock type-checking)
2. P0#6 (major refactor, enables P1 items)
3. P0#7-8 (resource safety)
4. P1 items (architecture, testing)
5. P2 items (cleanup, documentation)
