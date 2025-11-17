# effect-cli-tui

Effect-native CLI wrapper with interactive prompts and display utilities for building powerful terminal user interfaces.

[![npm version](https://img.shields.io/npm/v/effect-cli-tui)](https://www.npmjs.com/package/effect-cli-tui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎯 **Effect-Native** — Built on Effect-TS for type-safe, composable effects
- 🖥️ **Interactive Prompts** — Powered by @inquirer/prompts with full customization
- 📢 **Display API** — Simple, powerful console output utilities
- ⚙️ **CLI Wrapper** — Run commands via Effect with error handling
- 🔄 **Composable** — Chain operations seamlessly with Effect's `yield*` syntax
- 📦 **ESM-Native** — Modern JavaScript modules for tree-shaking and optimal bundling
- ✅ **Fully Tested** — Comprehensive test suite with integration tests
- 📝 **Well-Documented** — Clear API docs and practical examples

## Installation

```bash
npm install effect-cli-tui
# or
pnpm add effect-cli-tui
# or
yarn add effect-cli-tui
```

## Quick Start

```typescript
import { Effect } from 'effect'
import { display, displaySuccess, TUIHandler, EffectCLIRuntime } from 'effect-cli-tui'

const program = Effect.gen(function* () {
  // Display utilities
  yield* display('Welcome to my CLI app!')
  yield* displaySuccess('Initialization complete')

  const tui = yield* TUIHandler

  // Interactive prompt
  const name = yield* tui.prompt('What is your name?')

  // Display results
  yield* displaySuccess(`Hello, ${name}!`)
})

await EffectCLIRuntime.runPromise(program)
await EffectCLIRuntime.dispose()
```

## Core Concepts

### Display API

Simple, powerful console output utilities for CLI applications.

**Functions:**
- `display(message, options?)` - Display single-line messages with styling
- `displayLines(lines, options?)` - Display multiple lines with consistent formatting
- `displayJson(data, options?)` - Pretty-print JSON data
- `displaySuccess(message)` - Convenience for success messages
- `displayError(message)` - Convenience for error messages

**Example:**
```typescript
import { display, displayLines, displayJson } from 'effect-cli-tui'

// Simple messages
yield* display('Processing files...')
yield* displaySuccess('All files processed!')

// Multi-line output
yield* displayLines([
  'Configuration Summary',
  '─────────────────────',
  'Mode: Production',
  'Files: 42 processed'
])

// JSON output
yield* displayJson({ status: 'ok', count: 42 })
```

### TUIHandler

Interactive terminal prompts with Effect integration.

**Methods:**
- `prompt(message, options?)` - Text input
- `selectOption(message, options)` - Single selection
- `multiSelect(message, options)` - Multiple selection
- `confirm(message)` - Yes/No confirmation
- `display(message, type)` - Display styled messages

### EffectCLI

Execute CLI commands with Effect error handling.

**Methods:**
- `run(command, args?, options?)` - Execute and capture output
- `stream(command, args?, options?)` - Stream output directly

## Examples

### Interactive Project Setup

```typescript
import * as Effect from 'effect/Effect'
import { TUIHandler, TUIHandlerRuntime } from 'effect-cli-tui'

const setupProject = Effect.gen(function* () {
  const tui = yield* TUIHandler

  // Gather project info
  const name = yield* tui.prompt('Project name:')
  const description = yield* tui.prompt('Description:', { default: 'My project' })

  // Choose template
  const template = yield* tui.selectOption('Choose template:', [
    'Basic',
    'CLI'
  ])

  // Multi-select features
  const features = yield* tui.multiSelect('Select features:', [
    'Testing',
    'Linting',
    'Type Checking'
  ])

  // Confirm
  const shouldCreate = yield* tui.confirm(`Create ${name}? (${template})`)

  if (shouldCreate) {
    yield* tui.display('Creating project...', 'info')
    // ... project creation logic ...
    yield* tui.display('Project created!', 'success')
  } else {
    yield* tui.display('Cancelled', 'error')
  }
})

await TUIHandlerRuntime.runPromise(setupProject)
await TUIHandlerRuntime.dispose()
```

### CLI Command Execution

```typescript
import * as Effect from 'effect/Effect'
import { EffectCLI, EffectCLIOnlyRuntime } from 'effect-cli-tui'

const buildProject = Effect.gen(function* () {
  const cli = yield* EffectCLI

  console.log('Building project...')
  const result = yield* cli.run('build', [], { timeout: 30000 })

  console.log('Build output:')
  console.log(result.stdout)

  if (result.stderr) {
    console.error('Build warnings:')
    console.error(result.stderr)
  }
})

await EffectCLIOnlyRuntime.runPromise(buildProject)
await EffectCLIOnlyRuntime.dispose()
```

### Workflow Composition

```typescript
import * as Effect from 'effect/Effect'
import { TUIHandler, EffectCLI, EffectCLIRuntime } from 'effect-cli-tui'

const completeWorkflow = Effect.gen(function* () {
  const tui = yield* TUIHandler
  const cli = yield* EffectCLI

  // Step 1: Gather input
  yield* tui.display('Step 1: Gathering input...', 'info')
  const values = []
  for (let i = 0; i < 3; i++) {
    const value = yield* tui.prompt(`Enter value ${i + 1}:`)
    values.push(value)
  }

  // Step 2: Process
  yield* tui.display('Step 2: Processing...', 'info')
  // Process values...

  // Step 3: Report
  yield* tui.display('Complete!', 'success')
  console.log('Processed values:', values)
})

await EffectCLIRuntime.runPromise(completeWorkflow)
await EffectCLIRuntime.dispose()
```

## Error Handling

All effects can fail with typed errors:

```typescript
import * as Effect from 'effect/Effect'
import { TUIHandler, TUIHandlerRuntime } from 'effect-cli-tui'

const safePrompt = Effect.gen(function* () {
  const tui = yield* TUIHandler

  const result = yield* tui.prompt('Enter something:').pipe(
    Effect.catchTag('TUIError', (err) => {
      if (err.reason === 'Cancelled') {
        console.log('User cancelled the operation')
        return Effect.succeed('default value')
      }
      console.error(`UI Error: ${err.message}`)
      return Effect.succeed('default value')
    })
  )

  return result
})

await TUIHandlerRuntime.runPromise(safePrompt)
await TUIHandlerRuntime.dispose()
```

### Cancellation Handling

All interactive prompts support cancellation via Ctrl+C (SIGINT). When a user presses Ctrl+C during a prompt, the operation will fail with a `TUIError` with reason `'Cancelled'`:

```typescript
const program = Effect.gen(function* () {
  const tui = yield* TUIHandler

  const name = yield* tui.prompt('Enter your name:').pipe(
    Effect.catchTag('TUIError', (err) => {
      if (err.reason === 'Cancelled') {
        yield* tui.display('Operation cancelled', 'warning')
        return Effect.fail(new Error('User cancelled'))
      }
      return Effect.fail(err)
    })
  )

  return name
})
```

### Error Handling Patterns

**Handle CLI Errors:**
```typescript
const result = yield* cli.run('git', ['status']).pipe(
  Effect.catchTag('CLIError', (err) => {
    switch (err.reason) {
      case 'NotFound':
        yield* displayError('Command not found. Please install Git.')
        return Effect.fail(err)
      case 'Timeout':
        yield* displayError('Command timed out. Try again.')
        return Effect.fail(err)
      case 'CommandFailed':
        yield* displayError(`Failed with exit code ${err.exitCode}`)
        return Effect.fail(err)
      default:
        return Effect.fail(err)
    }
  })
)
```

**Handle Validation Errors with Retry:**
```typescript
const email = yield* tui.prompt('Email:', {
  validate: (input) => input.includes('@') || 'Invalid email'
}).pipe(
  Effect.catchTag('TUIError', (err) => {
    if (err.reason === 'ValidationFailed') {
      yield* displayError(`Validation failed: ${err.message}`)
      // Retry or use default
      return Effect.succeed('default@example.com')
    }
    return Effect.fail(err)
  })
)
```

**Error Recovery with Fallback:**
```typescript
const template = yield* tui.selectOption('Template:', ['basic', 'cli']).pipe(
  Effect.catchTag('TUIError', (err) => {
    if (err.reason === 'Cancelled') {
      yield* tui.display('Using default: basic', 'info')
      return Effect.succeed('basic') // Fallback value
    }
    return Effect.fail(err)
  })
)
```

See `examples/error-handling.ts` for more comprehensive error handling examples.

## Theming

Customize icons, colors, and styles for display types using the theme system.

### Using Preset Themes

```typescript
import { ThemeService, themes, EffectCLIRuntime } from 'effect-cli-tui'

const program = Effect.gen(function* () {
  const theme = yield* ThemeService
  
  // Use emoji theme
  yield* theme.setTheme(themes.emoji)
  yield* displaySuccess('Success!')  // Uses ✅ emoji
  
  // Use minimal theme (no icons)
  yield* theme.setTheme(themes.minimal)
  yield* displaySuccess('Done!')  // No icon, just green text
  
  // Use dark theme (optimized for dark terminals)
  yield* theme.setTheme(themes.dark)
  yield* displayInfo('Info')  // Uses cyan instead of blue
})
```

### Creating Custom Themes

```typescript
import { createTheme, ThemeService, EffectCLIRuntime } from 'effect-cli-tui'

const customTheme = createTheme({
  icons: {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  },
  colors: {
    success: 'green',
    error: 'red',
    warning: 'yellow',
    info: 'cyan',  // Changed from blue
    highlight: 'magenta'  // Changed from cyan
  }
})

const program = Effect.gen(function* () {
  const theme = yield* ThemeService
  yield* theme.setTheme(customTheme)
  
  yield* display('Custom theme!', { type: 'success' })
})
```

### Scoped Theme Changes

Use `withTheme()` to apply a theme temporarily:

```typescript
const program = Effect.gen(function* () {
  const theme = yield* ThemeService
  
  // Set default theme
  yield* theme.setTheme(themes.default)
  
  // Use emoji theme only for this scope
  yield* theme.withTheme(themes.emoji, Effect.gen(function* () {
    yield* displaySuccess('Uses emoji theme')
    yield* displayError('Also uses emoji theme')
  }))
  
  // Back to default theme here
  yield* displaySuccess('Uses default theme')
})
```

### Available Preset Themes

- **`themes.default`** - Current behavior (✓, ✗, ⚠, ℹ with green/red/yellow/blue)
- **`themes.minimal`** - No icons, simple colors
- **`themes.dark`** - Optimized for dark terminal backgrounds (cyan for info)
- **`themes.emoji`** - Emoji icons (✅, ❌, ⚠️, ℹ️)

### Theme API

```typescript
// Get current theme
const theme = yield* ThemeService
const currentTheme = theme.getTheme()

// Set theme
yield* theme.setTheme(customTheme)

// Scoped theme
yield* theme.withTheme(customTheme, effect)

// Convenience functions
yield* setTheme(customTheme)
const current = yield* getCurrentTheme()
yield* withTheme(customTheme, effect)
```

## API Reference

### Display API

#### `display(message: string, options?: DisplayOptions): Effect<void>`

Display a single-line message with optional styling.

```typescript
yield* display('This is an info message')
yield* display('Success!', { type: 'success' })
yield* display('Custom prefix>>>', { prefix: '>>>' })
yield* display('No newline', { newline: false })
```

**Options:**
- `type?: 'info' | 'success' | 'error'` - Message type (default: 'info')
- `prefix?: string` - Custom prefix (overrides default)
- `newline?: boolean` - Add newline before message (default: true)

#### `displayLines(lines: string[], options?: DisplayOptions): Effect<void>`

Display multiple lines with consistent formatting.

```typescript
yield* displayLines([
  'Project Status',
  '──────────────',
  '✅ Database: Connected',
  '✅ Cache: Ready'
], { type: 'success' })
```

#### `displayJson(data: unknown, options?: JsonDisplayOptions): Effect<void>`

Pretty-print JSON data with optional prefix.

```typescript
yield* displayJson({ name: 'project', version: '1.0.0' })
yield* displayJson(data, { spaces: 4, showPrefix: false })
yield* displayJson(data, { customPrefix: '>>>' }) // Custom prefix
```

**JsonDisplayOptions extends DisplayOptions:**
- `spaces?: number` - Indentation spaces (default: 2)
- `showPrefix?: boolean` - Show/hide the default prefix icon (default: true)
- `customPrefix?: string` - Custom prefix string (overrides default icon when provided)

#### `displaySuccess(message: string): Effect<void>`

Convenience function for success messages.

```typescript
yield* displaySuccess('Operation completed!')
```

#### `displayError(message: string): Effect<void>`

Convenience function for error messages.

```typescript
yield* displayError('Failed to connect')
```

### TUIHandler

#### `prompt(message: string, options?: PromptOptions): Effect<string, TUIError>`

Display a text input prompt.

```typescript
const name = yield* tui.prompt('Enter your name:', {
  default: 'User'
})
```

#### `selectOption(message: string, choices: string[]): Effect<string, TUIError>`

Display a single-select dialog.

**Controls:**
- **Arrow keys** (↑/↓) - Navigate up/down
- **Enter** - Select highlighted option

```typescript
const choice = yield* tui.selectOption('Choose one:', [
  'Option A',
  'Option B'
])
```

#### `multiSelect(message: string, choices: string[]): Effect<string[], TUIError>`

Display a multi-select dialog (checkbox).

**Controls:**
- **Arrow keys** (↑/↓) - Navigate up/down
- **Space** - Toggle selection (☐ ↔ ☑)
- **Enter** - Submit selections

```typescript
const choices = yield* tui.multiSelect('Choose multiple:', [
  'Feature 1',
  'Feature 2'
])
```

#### `confirm(message: string): Effect<boolean, TUIError>`

Display a yes/no confirmation.

```typescript
const confirmed = yield* tui.confirm('Are you sure?')
```

#### `display(message: string, type: 'info' | 'success' | 'error'): Effect<void>`

Display a styled message.

```typescript
yield* tui.display('Operation successful!', 'success')
yield* tui.display('This is an error', 'error')
yield* tui.display('For your information', 'info')
```

### EffectCLI

#### `run(command: string, args?: string[], options?: CLIRunOptions): Effect<CLIResult, CLIError>`

Execute a command and capture output.

```typescript
const result = yield* cli.run('echo', ['Hello'], {
  cwd: '/path/to/dir',
  env: { NODE_ENV: 'production' },
  timeout: 5000
})

console.log(result.stdout) // "Hello"
```

#### `stream(command: string, args?: string[], options?: CLIRunOptions): Effect<void, CLIError>`

Execute a command with streaming output (inherited stdio).

```typescript
yield* cli.stream('npm', ['install'], {
  cwd: '/path/to/project'
})
```

## Types

### SelectOption
```typescript
interface SelectOption {
  label: string      // Display text
  value: string      // Returned value
  description?: string  // Optional help text
}
```

**Note:** `selectOption()` and `multiSelect()` accept both `string[]` (for simple cases) and `SelectOption[]` (for options with descriptions). When using `SelectOption[]`, descriptions are displayed as gray, dimmed text below each option label.

### CLIResult
```typescript
interface CLIResult {
  exitCode: number
  stdout: string
  stderr: string
}
```

### CLIRunOptions
```typescript
interface CLIRunOptions {
  cwd?: string                         // Working directory
  env?: Record<string, string>         // Environment variables
  timeout?: number                     // Timeout in milliseconds
}
```

### PromptOptions
```typescript
interface PromptOptions {
  default?: string                     // Default value
  validate?: (input: string) => boolean | string  // Validation function
}
```

### Display Types
```typescript
type DisplayType = 'info' | 'success' | 'error'

interface DisplayOptions {
  type?: DisplayType          // Message type (default: 'info')
  prefix?: string             // Custom prefix
  newline?: boolean           // Add newline before message (default: true)
}

interface JsonDisplayOptions extends DisplayOptions {
  spaces?: number             // JSON indentation spaces (default: 2)
  prefix?: boolean            // Show type prefix (default: true)
}
```

## Error Types

### TUIError
Thrown by `TUIHandler` when prompts fail.

```typescript
type TUIError = {
  _tag: 'TUIError'
  reason: 'Cancelled' | 'ValidationFailed' | 'RenderError'
  message: string
}
```

### CLIError
Thrown by `EffectCLI` when commands fail.

```typescript
class CLIError extends Data.TaggedError('CLIError') {
  readonly reason: 'CommandFailed' | 'Timeout' | 'NotFound' | 'ExecutionError'
  readonly message: string
  readonly exitCode?: number  // Exit code when command fails (if available)
}
```

## Roadmap

### v1.1+
- [x] **Theme System** — Customize icons, colors, and styles
- [ ] Validation helpers for common patterns
- [ ] Progress indicators and loading states
- [ ] Better error messages and recovery

### v2.0
- [ ] **Ink Integration** — React components for rich terminal UIs
- [ ] Advanced layout system (flexbox-like layouts)
- [ ] Real-time dashboards and progress displays
- [ ] **Supermemory Integration** — Context-aware prompts

## Contributing

Contributions welcome! Please:

1. Create a feature branch (`git checkout -b feature/your-feature`)
2. Make your changes with tests
3. Run validation: `bun run build && bun test && bun run lint`
4. Commit with conventional commits
5. Push and open a PR

### Development

```bash
# Install dependencies
bun install

# Build
bun run build

# Test
bun test
bun test:watch
bun test:coverage

# Lint & format
bun run lint
bun run format

# Type check
bun run type-check
```

### Running Examples

Test that examples work:
```bash
bun run examples/test-example.ts
```

For interactive examples, see [`examples/README.md`](./examples/README.md).

## License

MIT © 2025 Paul Philp

## Related Projects

- **[create-effect-agent](https://github.com/PaulJPhilp/create-effect-agent)** — CLI tool using effect-cli-tui
- **[Effect](https://github.com/effect-ts/effect)** — Effect-TS runtime
- **[@inquirer/prompts](https://github.com/SBoudrias/Inquirer.js)** — Interactive CLI prompts

## Support

- 📖 [API Documentation](./docs/API.md)
- 🏗️ [Architecture](./docs/ARCHITECTURE.md)
- 🐛 [Issues](https://github.com/PaulJPhilp/effect-cli-tui/issues)
- 💬 [Discussions](https://github.com/PaulJPhilp/effect-cli-tui/discussions)
