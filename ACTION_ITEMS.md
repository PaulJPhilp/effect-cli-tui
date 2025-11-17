# Action Items: Effect-CLI-TUI Deep Review

Based on the comprehensive design review, here are prioritized, actionable next steps.

---

## 🔥 P0: Critical (Start Immediately)

### P0.1: Fix Display API Composition Issue

**Impact:** High | **Effort:** Medium | **Breaking:** Yes (mitigated)

**Problem:** Display functions auto-provide DisplayService.Default, breaking Effect composition

**Actionable Steps:**

1. Create new composition-friendly versions:
   ```typescript
   // src/core/display-composition.ts
   export function display(msg: string, opts = {}): Effect.Effect<void> {
     return Effect.gen(function* () {
       const ds = yield* DisplayService
       yield* ds.output(msg, opts)
     })
     // NO Effect.provide() - let user compose
   }
   ```

2. Mark old versions as deprecated:
   ```typescript
   /**
    * @deprecated Use composed version with Effect.provide()
    * Migration: yield* display("msg") requires providing DisplayService
    */
   ```

3. Update docs with migration path

4. Release as v2.1.0-beta.1 for feedback

5. Keep old versions working for 2 minor releases

**Files to change:**
- `src/core/display.ts` — Add composition-friendly versions
- `src/core/colors.ts` — Same pattern
- `README.md` — Update examples
- `docs/MIGRATION.md` — Create migration guide

**Timeline:** 1 week

---

### P0.2: Fix Error Cancellation Detection

**Impact:** High | **Effort:** Small | **Breaking:** No

**Problem:** String matching for cancellation is fragile and not locale-safe

**Actionable Steps:**

1. Update InkError type:
   ```typescript
   // src/types.ts
   export class InkError extends Data.TaggedError("InkError") {
     constructor(
       readonly reason: 
         | "RenderError" 
         | "ComponentError" 
         | "TerminalError"
         | "Cancelled"  // ADD THIS
       readonly message: string
     ) { super() }
   }
   ```

2. Update InkService to emit correct reason:
   ```typescript
   // src/services/ink/service.ts - in SIGINT handler
   reject(
     new InkError("Cancelled", "Operation cancelled by user (Ctrl+C)")
   )
   ```

3. Update TUIHandler error mapping:
   ```typescript
   // src/tui.ts
   .pipe(
     Effect.mapError((err) => {
       if (err instanceof InkError) {
         return err.reason === "Cancelled"
           ? new TUIError("Cancelled", err.message)
           : new TUIError("RenderError", err.message)
       }
       return new TUIError("RenderError", String(err))
     })
   )
   ```

4. Add tests for cancellation detection

**Files to change:**
- `src/types.ts`
- `src/services/ink/errors.ts`
- `src/services/ink/service.ts`
- `src/tui.ts`
- `__tests__/unit/tui-service.test.ts`

**Timeline:** 2-3 days

---

## ⭐ P1: High Priority (Next Sprint)

### P1.1: Add Validation Schema Helpers

**Impact:** High (DX) | **Effort:** Small | **Breaking:** No

**Actionable Steps:**

1. Create validators module:
   ```typescript
   // src/interactive/validators.ts
   import { Schema } from "effect"
   
   export const CommonValidators = {
     email: () => Schema.String.pipe(
       Schema.filter((s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s), 
         { message: "Invalid email address" })
     ),
     
     url: () => Schema.String.pipe(
       Schema.filter((s) => s.startsWith("http://") || s.startsWith("https://"),
         { message: "Must be a valid HTTP(S) URL" })
     ),
     
     filePath: () => Schema.String.pipe(
       Schema.minLength(1, { message: "File path required" })
     ),
     
     portNumber: () => Schema.Number.pipe(
       Schema.greaterThan(0, { message: "Port must be > 0" }),
       Schema.lessThan(65536, { message: "Port must be < 65536" })
     ),
   }
   ```

2. Add to public exports:
   ```typescript
   // src/index.ts
   export { CommonValidators } from "./interactive/validators"
   ```

3. Create tests:
   ```typescript
   // __tests__/unit/validators.test.ts
   // Test each validator with valid/invalid inputs
   ```

4. Document in README with examples

**Files to create:**
- `src/interactive/validators.ts`
- `__tests__/unit/validators.test.ts`

**Timeline:** 2-3 days

---

### P1.2: Add Form Builder Helper

**Impact:** High (DX) | **Effort:** Small | **Breaking:** No

**Actionable Steps:**

1. Create form builder:
   ```typescript
   // src/interactive/form-builder.ts
   export interface FormField {
     name: string
     message: string
     type: "text" | "password" | "select" | "confirm"
     default?: string
     choices?: string[]
     validate?: (input: string) => boolean | string
   }
   
   export async function buildForm(
     fields: FormField[],
     options?: { showProgress?: boolean }
   ): Promise<Record<string, any>> {
     // Implementation
   }
   ```

2. Usage example:
   ```typescript
   const result = await buildForm([
     { name: "email", message: "Email:", type: "text", validate: CommonValidators.email() },
     { name: "password", message: "Password:", type: "password" },
     { name: "role", message: "Role:", type: "select", choices: ["admin", "user"] }
   ])
   ```

3. Tests + docs

**Files to create:**
- `src/interactive/form-builder.ts`
- `__tests__/unit/form-builder.test.ts`
- Example in `examples/`

**Timeline:** 2-3 days

---

### P1.3: Improve CLI Error Semantics

**Impact:** Medium | **Effort:** Medium | **Breaking:** Depends on implementation

**Actionable Steps:**

1. Update CLIResult:
   ```typescript
   // src/types.ts
   export interface CLIResult {
     exitCode: number
     stdout: string
     stderr: string
     hasWarnings: boolean    // NEW
     hasErrors: boolean      // NEW
   }
   ```

2. Update CLIError to preserve stderr:
   ```typescript
   export class CLIError extends Data.TaggedError("CLIError") {
     constructor(
       readonly reason: string,
       readonly message: string,
       readonly exitCode?: number,
       readonly stderr?: string  // NEW
     ) { super() }
   }
   ```

3. Update cli.ts to populate these fields:
   ```typescript
   const hasWarnings = stderr.length > 0
   const hasErrors = exitCode !== 0
   
   return {
     exitCode,
     stdout,
     stderr,
     hasWarnings,
     hasErrors
   }
   ```

4. Tests

**Files to change:**
- `src/types.ts`
- `src/cli.ts`
- `__tests__/unit/cli-service.test.ts`

**Timeline:** 1 week

---

## 🎯 P2: Medium Priority (Next Few Weeks)

### P2.1: Fix Theme Access Pattern

**Impact:** Medium | **Effort:** Small | **Breaking:** No

**Actionable Steps:**

1. Update color display functions:
   ```typescript
   // src/core/colors.ts
   export function displayHighlight(message: string): Effect.Effect<void> {
     return Effect.gen(function* () {
       const theme = yield* ThemeService
       const current = yield* theme.getTheme()
       const styled = applyChalkStyle(message, {
         bold: true,
         color: current.colors.highlight
       })
       yield* display(styled)
     })
   }
   ```

2. Remove require() and try/catch pattern

3. Tests

**Files to change:**
- `src/core/colors.ts`

**Timeline:** 1-2 days

---

### P2.2: Add Cancellation Helpers

**Impact:** Medium | **Effort:** Small | **Breaking:** No

**Actionable Steps:**

1. Create cancellation helpers:
   ```typescript
   // src/interactive/cancellation.ts
   export function onCancel<A>(
     effect: Effect.Effect<A, TUIError>,
     onCancelled: () => Effect.Effect<A>
   ): Effect.Effect<A> {
     return effect.pipe(
       Effect.catchTag("TUIError", (err) => {
         if (err.reason === "Cancelled") return onCancelled()
         return Effect.fail(err)
       })
     )
   }
   
   export function withDefault<A>(
     effect: Effect.Effect<A, TUIError>,
     defaultValue: A
   ): Effect.Effect<A> {
     return onCancel(effect, () => Effect.succeed(defaultValue))
   }
   ```

2. Add to public exports

3. Tests + docs

**Files to create:**
- `src/interactive/cancellation.ts`
- `__tests__/unit/cancellation.test.ts`

**Timeline:** 1 day

---

## 📚 P3: Documentation & Examples (Ongoing)

### P3.1: Create Real-World Examples

**Impact:** Medium | **Effort:** Medium | **Breaking:** No

**Actionable Steps:**

1. Project scaffolder:
   ```typescript
   // examples/project-scaffolder.ts
   // - Multi-step form with validation
   // - File creation
   // - Error recovery
   ```

2. Git wrapper:
   ```typescript
   // examples/git-wrapper.ts
   // - Interactive git commands
   // - Command piping
   // - Error handling
   ```

3. Data processor:
   ```typescript
   // examples/data-processor.ts
   // - Multi-step pipeline
   // - Progress indicators
   // - Error logging
   ```

**Timeline:** 1-2 weeks

---

### P3.2: Error Recovery Guide

**Impact:** Medium | **Effort:** Small | **Breaking:** No

**Create:** `docs/ERROR_RECOVERY.md` with patterns for:
- Cancellation recovery
- Validation retry loops
- CLI timeout handling
- Partial failure recovery
- Logging integration

**Timeline:** 1 week

---

## 🧪 P4: Testing & Coverage

### P4.1: Expand Test Coverage

**Scenarios to add:**
1. Concurrent prompts
2. Nested error handling (cli.run inside tui.prompt)
3. Large output handling (10MB+ stdout)
4. Multi-step form validation
5. SIGINT during different stages
6. Theme switching mid-operation

**Timeline:** 2-3 weeks

---

## 📋 Implementation Checklist

### Week 1 (P0 - Critical)
- [ ] Create composition-friendly display functions
- [ ] Update error cancellation detection
- [ ] Update TUIHandler error mapping
- [ ] Tests for both changes
- [ ] Update README with examples

### Week 2-3 (P1 - High Priority)
- [ ] Add validators module
- [ ] Add form builder helper
- [ ] Improve CLI error semantics
- [ ] All tests + docs
- [ ] Update README and API docs

### Week 4 (P2 - Medium Priority)
- [ ] Fix theme access pattern
- [ ] Add cancellation helpers
- [ ] All tests + docs

### Week 5-6 (P3 - Documentation)
- [ ] Real-world examples (3-4 comprehensive ones)
- [ ] Error recovery guide

### Week 7-8 (P4 - Testing)
- [ ] Expand test coverage for edge cases

---

## Release Plan

### v2.1.0 (2-3 weeks)
- [x] P0.1 & P0.2: Critical fixes
- [x] P1.1 & P1.2: Validators + form builder
- Migration guide included
- Deprecation notices for old display API

### v2.2.0 (1-2 weeks after v2.1)
- [x] P1.3: CLI error semantics improvements
- [x] P2.1 & P2.2: Theme access + cancellation helpers
- Real-world examples included
- Error recovery guide included

### v2.3.0 (Later)
- [x] P3 & P4: More examples, expanded tests
- [x] Terminal support guide

### v3.0.0 (Major release, 6+ months out)
- Remove old Display API
- Any other breaking changes needed

---

## Success Criteria

✅ **P0 Phase Complete When:**
- [ ] Display functions support composition without auto-providing
- [ ] Cancellation detection uses explicit error reasons
- [ ] All tests pass
- [ ] Migration guide provided

✅ **P1 Phase Complete When:**
- [ ] Validators available for common patterns
- [ ] Form builder reduces multi-field prompt boilerplate by 70%+
- [ ] CLI errors properly structure stderr
- [ ] All tests pass

✅ **P2 Phase Complete When:**
- [ ] Theme access is consistently Effect-based
- [ ] Cancellation helpers reduce cancellation handling boilerplate by 50%+

✅ **Overall Success When:**
- [ ] Library rated 4.5+ stars on npm
- [ ] 0 P0/P1 issues in GitHub
- [ ] Examples referenced in multiple projects
- [ ] Active community using advanced patterns

---

## Questions to Resolve

1. **Breaking Changes:** Is v2.1-v2.2 deprecation period acceptable for Display API changes?
2. **Validators Package:** Keep in core or separate npm package?
3. **Form Builder:** Should it support async validation?
4. **CLI Errors:** Should we add more granular exit code reasons?
5. **Examples:** Priority on production-ready (complex) vs educational (simple)?

---

**Next Step:** Review this plan with team, prioritize based on roadmap, and begin P0 items immediately.

