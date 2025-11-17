# API Reference

Complete API documentation for effect-cli-tui.

## Table of Contents

- [TUIHandler](#tuihandler)
- [EffectCLI](#effectcli)
- [Types](#types)
- [Errors](#errors)
- [Examples](#examples)

---

## TUIHandler

Interactive terminal user interface handler using @inquirer/prompts.

### Constructor

```typescript
const tui = new TUIHandler()
```

### Methods

#### `prompt(message: string, options?: PromptOptions): Effect<string, TUIError>`

Display a text input prompt and return the user's input.

**Parameters:**
- `message`: The prompt message to display
- `options.default`: Optional default value if user presses enter
- `options.validate`: Optional validation function

**Returns:** Effect that resolves with the entered string

**Errors:** `TUIError` with reason `'RenderError'`

**Example:**
```typescript
import * as Effect from 'effect/Effect'
import { TUIHandler } from 'effect-cli-tui'

const getUsername = Effect.gen(function* (_) {
  const tui = new TUIHandler()
  
  const username = yield* _(
    tui.prompt('Enter username:', {
      default: 'guest'
    })
  )
  
  return username
})

await Effect.runPromise(getUsername)
```

---

#### `selectOption(message: string, options: SelectOption[]): Effect<string, TUIError>`

Display a dropdown menu for selecting a single option.

**Parameters:**
- `message`: The selection prompt message
- `options`: Array of `SelectOption` objects

**Returns:** Effect that resolves with the selected value

**Errors:**
- `TUIError` with reason `'RenderError'` if rendering fails
- `TUIError` with reason `'RenderError'` if no options provided

**Example:**
```typescript
const selectFramework = Effect.gen(function* (_) {
  const tui = new TUIHandler()
  
  const framework = yield* _(
    tui.selectOption('Choose a framework:', [
      { label: 'React', value: 'react', description: 'A JavaScript library' },
      { label: 'Vue', value: 'vue', description: 'A JavaScript framework' },
      { label: 'Svelte', value: 'svelte', description: 'A compiler' }
    ])
  )
  
  console.log(`Selected: ${framework}`)
})
```

---

#### `multiSelect(message: string, options: SelectOption[]): Effect<string[], TUIError>`

Display checkboxes for selecting multiple options.

**Parameters:**
- `message`: The selection prompt message
- `options`: Array of `SelectOption` objects

**Returns:** Effect that resolves with array of selected values

**Errors:**
- `TUIError` with reason `'RenderError'` if rendering fails
- `TUIError` with reason `'RenderError'` if no options provided

**Example:**
```typescript
const selectFeatures = Effect.gen(function* (_) {
  const tui = new TUIHandler()
  
  const features = yield* _(
    tui.multiSelect('Select features:', [
      { label: 'TypeScript', value: 'ts' },
      { label: 'Testing', value: 'tests' },
      { label: 'Linting', value: 'lint' },
      { label: 'Pre-commit', value: 'husky' }
    ])
  )
  
  console.log(`Selected features:`, features)
})
```

---

#### `confirm(message: string): Effect<boolean, TUIError>`

Display a yes/no confirmation prompt.

**Parameters:**
- `message`: The confirmation message

**Returns:** Effect that resolves with boolean (true for yes, false for no)

**Errors:** `TUIError` with reason `'RenderError'`

**Example:**
```typescript
const confirmAction = Effect.gen(function* (_) {
  const tui = new TUIHandler()
  
  const confirmed = yield* _(
    tui.confirm('Delete all files? (cannot be undone)')
  )
  
  if (confirmed) {
    console.log('Deleting...')
    // perform deletion
  } else {
    console.log('Cancelled')
  }
})
```

---

#### `display(message: string, type: 'info' | 'success' | 'error'): Effect<void>`

Display a styled message to the console.

**Parameters:**
- `message`: The message to display
- `type`: Message type affecting styling
  - `'success'`: Green checkmark (✓)
  - `'error'`: Red cross (✗)
  - `'info'`: Blue info (ℹ)

**Returns:** Effect that resolves to void

**Errors:** None (always succeeds)

**Example:**
```typescript
const displayMessages = Effect.gen(function* (_) {
  const tui = new TUIHandler()
  
  yield* _(tui.display('Operation started', 'info'))
  
  try {
    // do something
    yield* _(tui.display('Operation successful!', 'success'))
  } catch (err) {
    yield* _(tui.display('Operation failed', 'error'))
  }
})
```

---

## EffectCLI

Execute CLI commands with Effect error handling and output capture.

### Constructor

```typescript
const cli = new EffectCLI()
```

### Methods

#### `run(command: string, args?: string[], options?: CLIRunOptions): Effect<CLIResult, CLIError>`

Execute a command and capture its output.

**Parameters:**
- `command`: The command to execute
- `args`: Optional array of command arguments
- `options.cwd`: Working directory (defaults to `process.cwd()`)
- `options.env`: Environment variables to merge with current env
- `options.timeout`: Maximum execution time in milliseconds

**Returns:** Effect that resolves with `CLIResult` containing:
- `exitCode`: Command exit code
- `stdout`: Standard output string
- `stderr`: Standard error string

**Errors:** `CLIError` with reason:
- `'CommandFailed'`: Command exited with non-zero code
- `'Timeout'`: Command exceeded timeout
- `'NotFound'`: Command not found

**Example:**
```typescript
const runBuild = Effect.gen(function* (_) {
  const cli = new EffectCLI()
  
  const result = yield* _(
    cli.run('npm', ['run', 'build'], {
      timeout: 60000,
      cwd: '/path/to/project'
    })
  )
  
  console.log('Build output:', result.stdout)
  console.log('Exit code:', result.exitCode)
})
```

---

#### `stream(command: string, args?: string[], options?: CLIRunOptions): Effect<void, CLIError>`

Execute a command with output streamed directly to console (inherited stdio).

**Parameters:**
- `command`: The command to execute
- `args`: Optional array of command arguments
- `options.cwd`: Working directory
- `options.env`: Environment variables
- `options.timeout`: Maximum execution time

**Returns:** Effect that resolves to void when command completes

**Errors:** `CLIError` with same reasons as `run()`

**Example:**
```typescript
const streamInstall = Effect.gen(function* (_) {
  const cli = new EffectCLI()
  
  yield* _(
    cli.stream('npm', ['install'], {
      cwd: '/path/to/project'
    })
  )
  
  console.log('Installation complete')
})
```

---

## Types

### SelectOption

```typescript
interface SelectOption {
  label: string       // Display text shown to user
  value: string       // Value returned when selected
  description?: string // Optional help text below label
}
```

**Example:**
```typescript
const options: SelectOption[] = [
  {
    label: 'TypeScript',
    value: 'ts',
    description: 'Add TypeScript support'
  },
  {
    label: 'JavaScript',
    value: 'js',
    description: 'Keep as JavaScript'
  }
]
```

---

### CLIResult

```typescript
interface CLIResult {
  exitCode: number    // Command exit code
  stdout: string      // Standard output
  stderr: string      // Standard error
}
```

**Example:**
```typescript
const { exitCode, stdout, stderr } = yield* _(
  cli.run('git', ['status'])
)

if (exitCode === 0) {
  console.log(stdout)
} else {
  console.error(stderr)
}
```

---

### CLIRunOptions

```typescript
interface CLIRunOptions {
  cwd?: string                    // Working directory
  env?: Record<string, string>    // Environment variables
  timeout?: number                // Timeout in milliseconds
  maxBuffer?: number              // Max bytes to capture (0 = unlimited)
  signal?: AbortSignal            // Abort running command
  killSignal?: NodeJS.Signals | number // Signal used to terminate the process
  stdin?: string | Buffer         // Optional stdin payload
}
```

**Example:**
```typescript
const options: CLIRunOptions = {
  cwd: '/home/user/project',
  env: { NODE_ENV: 'production' },
  timeout: 30000
}
```

---

### PromptOptions

```typescript
interface PromptOptions {
  default?: string                                    // Default value
  validate?: (input: string) => boolean | string    // Validation function
}
```

**Example:**
```typescript
const options: PromptOptions = {
  default: 'localhost',
  validate: (input) => {
    if (input.length === 0) return 'Host cannot be empty'
    return true
  }
}
```

---

## Errors

### TUIError

Thrown by TUIHandler methods when prompts fail.

```typescript
class TUIError {
  _tag: 'TUIError'
  reason: 'Cancelled' | 'ValidationFailed' | 'RenderError'
  message: string
}
```

**Example:**
```typescript
const safePrompt = yield* _(
  tui.prompt('Enter name:').pipe(
    Effect.catchTag('TUIError', (error) => {
      console.error(`Prompt failed: ${error.message}`)
      return Effect.succeed('default')
    })
  )
)
```

---

### CLIError

Thrown by EffectCLI methods when commands fail.

```typescript
class CLIError {
  _tag: 'CLIError'
  reason: 'CommandFailed' | 'Timeout' | 'NotFound' | 'ExecutionError' | 'Aborted' | 'OutputLimitExceeded'
  message: string
}
```

**Example:**
```typescript
const safeCLI = yield* _(
  cli.run('npm', ['install']).pipe(
    Effect.catchTag('CLIError', (error) => {
      if (error.reason === 'NotFound') {
        console.error('npm not found')
      } else if (error.reason === 'Timeout') {
        console.error('Installation took too long')
      }
      return Effect.succeed(null)
    })
  )
)
```

---

## Examples

### Complete Setup Wizard

```typescript
import * as Effect from 'effect/Effect'
import { TUIHandler, EffectCLI } from 'effect-cli-tui'

const setupWizard = Effect.gen(function* (_) {
  const tui = new TUIHandler()
  const cli = new EffectCLI()

  yield* _(tui.display('Welcome to Project Setup!', 'info'))

  // Get project details
  const name = yield* _(tui.prompt('Project name:'))
  
  const template = yield* _(
    tui.selectOption('Choose template:', [
      { label: 'Minimal', value: 'minimal' },
      { label: 'Full Stack', value: 'fullstack' }
    ])
  )

  const includeTests = yield* _(tui.confirm('Include tests?'))

  // Confirm
  const confirmed = yield* _(
    tui.confirm(`Create ${name} with ${template}?`)
  )

  if (!confirmed) {
    yield* _(tui.display('Setup cancelled', 'info'))
    return
  }

  // Create project
  yield* _(tui.display('Creating project...', 'info'))
  
  yield* _(
    cli.stream('npm', ['create', 'vite@latest', name, '--', '--template', template], {
      timeout: 120000
    })
  )

  yield* _(tui.display('Project created!', 'success'))

  if (includeTests) {
    yield* _(tui.display('Adding test setup...', 'info'))
    yield* _(
      cli.stream('npm', ['install', '-D', 'vitest'], {
        cwd: name,
        timeout: 60000
      })
    )
    yield* _(tui.display('Tests configured!', 'success'))
  }

  yield* _(tui.display(`Project ready at: ./${name}`, 'success'))
})

Effect.runPromise(setupWizard)
```

### Multi-step Workflow

```typescript
const workflow = Effect.gen(function* (_) {
  const tui = new TUIHandler()

  const inputs = []
  for (let i = 0; i < 3; i++) {
    const value = yield* _(
      tui.prompt(`Step ${i + 1} - Enter value:`)
    )
    inputs.push(value)
  }

  yield* _(
    tui.display(`Collected ${inputs.length} values`, 'success')
  )

  return inputs
})
```

### Error Handling Pattern

```typescript
const robustPrompt = (message: string) =>
  tui.prompt(message).pipe(
    Effect.retry({
      times: 3,
      schedule: Effect.exponentialBackoff(100)
    }),
    Effect.catchTag('TUIError', () =>
      Effect.succeed('default value')
    )
  )
```
