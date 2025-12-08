# Ultracite Code Standards

This project uses **Ultracite**, a zero-config Biome preset that enforces strict code quality standards through automated formatting and linting.

## Quick Reference

- **Format code**: `npx ultracite fix`
- **Check for issues**: `npx ultracite check`
- **Diagnose setup**: `npx ultracite doctor`

Biome (the underlying engine) provides extremely fast Rust-based linting and formatting. Most issues are automatically fixable.

---

## Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

### Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any` when the type is genuinely unknown
- Use const assertions (`as const`) for immutable values and literal types
- Leverage TypeScript's type narrowing instead of type assertions
- Use meaningful variable names instead of magic numbers - extract constants with descriptive names

## TypeScript Rules & Effect-TS Patterns

### Type Safety & Configuration

- Enable `strict: true` in tsconfig.json with:
  - `noImplicitAny: true`
  - `strictNullChecks: true`
  - `strictFunctionTypes: true`
  - `exactOptionalPropertyTypes: true`
- Use `--noEmitOnError` compiler flag
- Never use `// @ts-ignore` without explanatory comments

### Type Definitions

- **Never use `any`** - use `unknown` with type guards instead
- **Never use Enums** - use union types: `type Status = "active" | "inactive"`
- Use `readonly` for immutable properties and arrays
- Explicitly type function parameters and return types
- Use discriminated unions with exhaustiveness checking

### Interfaces vs Types

- **Use `interface` for object contracts** (all `api.ts` files)
- Use `type` only for: unions, intersections, branded types
- Add `// biome-ignore lint: Interface preferred for object contracts` when needed

```typescript
// Good
export interface HttpClientApi {
  readonly request: <T>(path: string) => Effect.Effect<T, HttpClientError>;
}

// Bad - Don't use type for object contracts
export type HttpClientApi = { ... }
```

### Service Pattern

Use `Effect.Service` with `Effect.fn()`:

```typescript
export class ServiceName extends Effect.Service<ServiceName>()("ServiceName", {
  effect: Effect.fn(function* (config: ConfigType) {
    return { ... } satisfies ServiceApi;
  }),
}) {}
```

### Error Types

Use `Data.TaggedError` for discriminated errors:

```typescript
export class MemoryNotFoundError extends Data.TaggedError("MemoryNotFoundError")<{
  readonly key: string;
}> {}

export type MemoryError = MemoryNotFoundError | MemoryValidationError;
```

### Branded Types

Use `Brand.refined` for validated types:

```typescript
export type Namespace = string & Brand.Brand<"Namespace">;
export const Namespace = Brand.refined<Namespace>(
  (ns) => ns.length > 0 && /^[a-zA-Z0-9_-]+$/.test(ns),
  (ns) => Brand.error("Invalid namespace")
);
```

### File Structure

```
services/[name]/
├── api.ts       # Interface contract (use interface, not type)
├── errors.ts    # Data.TaggedError classes
├── types.ts     # Branded types, config types
├── service.ts   # Effect.Service implementation
├── helpers.ts   # Pure utility functions
└── index.ts     # Public exports
```

### Naming Conventions

- Interface types: PascalCase + "Api" suffix (e.g., `InMemoryClientApi`)
- Service classes: PascalCase, no suffix (e.g., `InMemoryClient`)
- Error classes: PascalCase + "Error" suffix (e.g., `MemoryNotFoundError`)

### Imports

```typescript
// Effect - named imports from "effect"
import { Effect, Data, Brand } from "effect";

// Types - use import type
import type { HttpClientError } from "./errors.js";

// Internal - use path aliases with .js extension
import { MyService } from "@services/MyService/service.js";
```

### JSDoc

Add JSDoc for public APIs with `@since`, `@param`, `@returns`, `@example`.

### Satisfies Operator

Use `satisfies` for type checking without widening:

```typescript
return {
  put: (key, value) => Effect.succeed(void 0),
} satisfies ServiceApi;
```

### Advanced Patterns

- Implement generics with appropriate constraints
- Use mapped types and conditional types to reduce duplication
- Use `const` assertions for literal types
- Use branded/nominal types for type-level validation
- Create type guard functions for type narrowing

### Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- Use `const` by default, `let` only when reassignment is needed, never `var`

### Async & Promises

- Always `await` promises in async functions - don't forget to use the return value
- Use `async/await` syntax instead of promise chains for better readability
- Handle errors appropriately in async code with try-catch blocks
- Don't use async functions as Promise executors

### React & JSX

- Use function components over class components
- Call hooks at the top level only, never conditionally
- Specify all dependencies in hook dependency arrays correctly
- Use the `key` prop for elements in iterables (prefer unique IDs over array indices)
- Nest children between opening and closing tags instead of passing as props
- Don't define components inside other components
- Use semantic HTML and ARIA attributes for accessibility:
  - Provide meaningful alt text for images
  - Use proper heading hierarchy
  - Add labels for form inputs
  - Include keyboard event handlers alongside mouse events
  - Use semantic elements (`<button>`, `<nav>`, etc.) instead of divs with roles

### Error Handling & Debugging

- Remove `console.log`, `debugger`, and `alert` statements from production code
- Throw `Error` objects with descriptive messages, not strings or other values
- Use `try-catch` blocks meaningfully - don't catch errors just to rethrow them
- Prefer early returns over nested conditionals for error cases

### Code Organization

- Keep functions focused and under reasonable cognitive complexity limits
- Extract complex conditions into well-named boolean variables
- Use early returns to reduce nesting
- Prefer simple conditionals over nested ternary operators
- Group related code together and separate concerns

### Security

- Add `rel="noopener"` when using `target="_blank"` on links
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't use `eval()` or assign directly to `document.cookie`
- Validate and sanitize user input

### Performance

- Avoid spread syntax in accumulators within loops
- Use top-level regex literals instead of creating them in loops
- Prefer specific imports over namespace imports
- Avoid barrel files (index files that re-export everything)
- Use proper image components (e.g., Next.js `<Image>`) over `<img>` tags

### Framework-Specific Guidance

**Next.js:**
- Use Next.js `<Image>` component for images
- Use `next/head` or App Router metadata API for head elements
- Use Server Components for async data fetching instead of async Client Components

**React 19+:**
- Use ref as a prop instead of `React.forwardRef`

**Solid/Svelte/Vue/Qwik:**
- Use `class` and `for` attributes (not `className` or `htmlFor`)

---

## Testing

- Write assertions inside `it()` or `test()` blocks
- Avoid done callbacks in async tests - use async/await instead
- Don't use `.only` or `.skip` in committed code
- Keep test suites reasonably flat - avoid excessive `describe` nesting

## When Biome Can't Help

Biome's linter will catch most issues automatically. Focus your attention on:

1. **Business logic correctness** - Biome can't validate your algorithms
2. **Meaningful naming** - Use descriptive names for functions, variables, and types
3. **Architecture decisions** - Component structure, data flow, and API design
4. **Edge cases** - Handle boundary conditions and error states
5. **User experience** - Accessibility, performance, and usability considerations
6. **Documentation** - Add comments for complex logic, but prefer self-documenting code

---

Most formatting and common issues are automatically fixed by Biome. Run `npx ultracite fix` before committing to ensure compliance.
