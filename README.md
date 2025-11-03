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
- 📦 **Dual Module Support** — Works in both ESM and CommonJS environments
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

### ESM (Recommended)
```typescript
import * as Effect from 'effect/Effect'
import { display, displaySuccess, TUIHandler, EffectCLI } from 'effect-cli-tui'

const program = Effect.gen(function* (_) {
  // Display utilities
  yield* _(display('Welcome to my CLI app!'))
  yield* _(displaySuccess('Initialization complete'))

  const tui = new TUIHandler()
  const cli = new EffectCLI()

  // Interactive prompt
  const name = yield* _(
    tui.prompt('What is your name?')
  )

  // Display results
  yield* _(displaySuccess(`Hello, ${name}!`))
})

await Effect.runPromise(program)
```

### CommonJS
```javascript
const { Effect } = require('effect')
const { display, displaySuccess, TUIHandler, EffectCLI } = require('effect-cli-tui')

const program = Effect.gen(function* (_) {
  yield* _(display('Welcome to my CLI app!'))
  yield* _(displaySuccess('Initialization complete'))

  // ... rest of your program
})

Effect.runPromise(program)
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
yield* _(display('Processing files...'))
yield* _(displaySuccess('All files processed!'))

// Multi-line output
yield* _(displayLines([
  'Configuration Summary',
  '─────────────────────',
  'Mode: Production',
  'Files: 42 processed'
]))

// JSON output
yield* _(displayJson({ status: 'ok', count: 42 }))
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
import { TUIHandler } from 'effect-cli-tui'

const setupProject = Effect.gen(function* (_) {
  const tui = new TUIHandler()

  // Gather project info
  const name = yield* _(tui.prompt('Project name:'))
  const description = yield* _(
    tui.prompt('Description:', { default: 'My project' })
  )

  // Choose template
  const template = yield* _(
    tui.selectOption('Choose template:', [
      { label: 'Basic', value: 'basic', description: 'Minimal setup' },
      { label: 'CLI', value: 'cli', description: 'CLI tool template' }
    ])
  )

  // Multi-select features
  const features = yield* _(
    tui.multiSelect('Select features:', [
      { label: 'Testing', value: 'tests' },
      { label: 'Linting', value: 'lint' },
      { label: 'Type Checking', value: 'types' }
    ])
  )

  // Confirm
  const shouldCreate = yield* _(
    tui.confirm(`Create ${name}? (${template})`)
  )

  if (shouldCreate) {
    yield* _(tui.display('Creating project...', 'info'))
    // ... project creation logic ...
    yield* _(tui.display('Project created!', 'success'))
  } else {
    yield* _(tui.display('Cancelled', 'error'))
  }
})

await Effect.runPromise(setupProject)
```

### CLI Command Execution

```typescript
import * as Effect from 'effect/Effect'
import { EffectCLI } from 'effect-cli-tui'

const buildProject = Effect.gen(function* (_) {
  const cli = new EffectCLI()

  console.log('Building project...')
  const result = yield* _(
    cli.run('build', [], { timeout: 30000 })
  )

  console.log('Build output:')
  console.log(result.stdout)

  if (result.stderr) {
    console.error('Build warnings:')
    console.error(result.stderr)
  }
})

await Effect.runPromise(buildProject)
```

### Workflow Composition

```typescript
import * as Effect from 'effect/Effect'
import { TUIHandler, EffectCLI } from 'effect-cli-tui'

const completeWorkflow = Effect.gen(function* (_) {
  const tui = new TUIHandler()
  const cli = new EffectCLI()

  // Step 1: Gather input
  yield* _(tui.display('Step 1: Gathering input...', 'info'))
  const values = []
  for (let i = 0; i < 3; i++) {
    const value = yield* _(
      tui.prompt(`Enter value ${i + 1}:`)
    )
    values.push(value)
  }

  // Step 2: Process
  yield* _(tui.display('Step 2: Processing...', 'info'))
  // Process values...

  // Step 3: Report
  yield* _(tui.display('Complete!', 'success'))
  console.log('Processed values:', values)
})

await Effect.runPromise(completeWorkflow)
```

## Error Handling

All effects can fail with typed errors:

```typescript
import * as Effect from 'effect/Effect'
import { TUIHandler, TUIError } from 'effect-cli-tui'

const safePrompt = Effect.gen(function* (_) {
  const tui = new TUIHandler()

  const result = yield* _(
    tui.prompt('Enter something:').pipe(
      Effect.catchTag('TUIError', (err) => {
        console.error(`UI Error: ${err.message}`)
        return Effect.succeed('default value')
      })
    )
  )

  return result
})
```

## API Reference

### Display API

#### `display(message: string, options?: DisplayOptions): Effect<void>`

Display a single-line message with optional styling.

```typescript
yield* _(display('This is an info message'))
yield* _(display('Success!', { type: 'success' }))
yield* _(display('Custom prefix>>>', { prefix: '>>>' }))
yield* _(display('No newline', { newline: false }))
```

**Options:**
- `type?: 'info' | 'success' | 'error'` - Message type (default: 'info')
- `prefix?: string` - Custom prefix (overrides default)
- `newline?: boolean` - Add newline before message (default: true)

#### `displayLines(lines: string[], options?: DisplayOptions): Effect<void>`

Display multiple lines with consistent formatting.

```typescript
yield* _(displayLines([
  'Project Status',
  '──────────────',
  '✅ Database: Connected',
  '✅ Cache: Ready'
], { type: 'success' }))
```

#### `displayJson(data: unknown, options?: JsonDisplayOptions): Effect<void>`

Pretty-print JSON data with optional prefix.

```typescript
yield* _(displayJson({ name: 'project', version: '1.0.0' }))
yield* _(displayJson(data, { spaces: 4, prefix: false }))
```

**JsonDisplayOptions extends DisplayOptions:**
- `spaces?: number` - Indentation spaces (default: 2)
- `prefix?: boolean` - Show type prefix (default: true)

#### `displaySuccess(message: string): Effect<void>`

Convenience function for success messages.

```typescript
yield* _(displaySuccess('Operation completed!'))
```

#### `displayError(message: string): Effect<void>`

Convenience function for error messages.

```typescript
yield* _(displayError('Failed to connect'))
```

### TUIHandler

#### `prompt(message: string, options?: PromptOptions): Effect<string, TUIError>`

Display a text input prompt.

```typescript
const name = yield* _(
  tui.prompt('Enter your name:', {
    default: 'User'
  })
)
```

#### `selectOption(message: string, options: SelectOption[]): Effect<string, TUIError>`

Display a single-select dialog.

```typescript
const choice = yield* _(
  tui.selectOption('Choose one:', [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b', description: 'This is B' }
  ])
)
```

#### `multiSelect(message: string, options: SelectOption[]): Effect<string[], TUIError>`

Display a multi-select dialog (checkbox).

```typescript
const choices = yield* _(
  tui.multiSelect('Choose multiple:', [
    { label: 'Feature 1', value: 'feat1' },
    { label: 'Feature 2', value: 'feat2' }
  ])
)
```

#### `confirm(message: string): Effect<boolean, TUIError>`

Display a yes/no confirmation.

```typescript
const confirmed = yield* _(
  tui.confirm('Are you sure?')
)
```

#### `display(message: string, type: 'info' | 'success' | 'error'): Effect<void>`

Display a styled message.

```typescript
yield* _(tui.display('Operation successful!', 'success'))
yield* _(tui.display('This is an error', 'error'))
yield* _(tui.display('For your information', 'info'))
```

### EffectCLI

#### `run(command: string, args?: string[], options?: CLIRunOptions): Effect<CLIResult, CLIError>`

Execute a command and capture output.

```typescript
const result = yield* _(
  cli.run('echo', ['Hello'], {
    cwd: '/path/to/dir',
    env: { NODE_ENV: 'production' },
    timeout: 5000
  })
)

console.log(result.stdout) // "Hello"
```

#### `stream(command: string, args?: string[], options?: CLIRunOptions): Effect<void, CLIError>`

Execute a command with streaming output (inherited stdio).

```typescript
yield* _(
  cli.stream('npm', ['install'], {
    cwd: '/path/to/project'
  })
)
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
type CLIError = {
  _tag: 'CLIError'
  reason: 'CommandFailed' | 'Timeout' | 'NotFound'
  message: string
}
```

## Roadmap

### v1.1+
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

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes with tests
4. Run validation: `pnpm build && pnpm test && pnpm lint`
5. Commit with conventional commits
6. Push and open a PR

### Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Test
pnpm test
pnpm test:watch
pnpm test:coverage

# Lint & format
pnpm lint
pnpm format

# Type check
pnpm type-check
```

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
