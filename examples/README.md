# Running Examples

## Quick Test

Verify examples work:
```bash
bun run examples/test-example.ts
```

## Available Examples

- **`basic-prompts.tsx`** - Basic interactive prompts (Input, Select, Confirm, Password)
- **`multi-step-wizard.tsx`** - Complex multi-step workflow with validation
- **`error-handling.ts`** - Comprehensive error handling patterns (reference/documentation - examples are commented out)
- **`progress-demo.tsx`** - Spinner and progress bar demonstrations
- **`prompt-builder.tsx`** - Advanced prompt builder with templates

## Running Examples

### Using `bun` (Recommended)

```bash
bun run examples/basic-prompts.tsx
bun run examples/multi-step-wizard.tsx
bun run examples/progress-demo.tsx
bun run examples/prompt-builder.tsx

# error-handling.ts is a reference file (examples are commented out)
# Uncomment examples in the file to test them individually
```

**Note:** Interactive examples (with prompts) need to run in a terminal with TTY support. They won't work in non-interactive environments.

### Alternative: Using `tsx`

If you prefer tsx:

```bash
npx tsx examples/basic-prompts.tsx
npx tsx examples/multi-step-wizard.tsx
npx tsx examples/progress-demo.tsx
npx tsx examples/prompt-builder.tsx
```

## Example: Running Basic Prompts

```bash
bun run examples/basic-prompts.tsx
```

This will start an interactive prompt session asking for:
- Your name
- Your role (Admin/User/Guest)
- Confirmation to create account
- Password

## Example: Running Error Handling

The `error-handling.ts` file is a **reference/documentation file** with examples that are commented out. It demonstrates error handling patterns but isn't meant to be run directly.

To use the examples:
1. Open `examples/error-handling.ts`
2. Uncomment the example you want to test
3. The examples use `Effect.gen` with `yield*` which requires proper TypeScript compilation
4. Copy the example code into your own script to test it

## Troubleshooting

### "Cannot find module" errors

Make sure you've installed dependencies:
```bash
bun install
```

### Type errors

Ensure the project is built:
```bash
bun run build
```

### Interactive examples not working

Interactive examples require a TTY (terminal). They won't work in:
- CI/CD pipelines without TTY
- Non-interactive shells
- Some IDEs' integrated terminals

Run them in a regular terminal instead.
