[**effect-cli-tui**](../../README.md)

***

[effect-cli-tui](../../modules.md) / [index](../README.md) / TUIHandler

# Class: TUIHandler

Defined in: [Projects/Published/effect-cli-tui/src/tui.ts:45](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/tui.ts#L45)

TUI Handler Service

Provides interactive terminal UI operations including prompts,
selections, confirmations, and display messages.

Use via dependency injection:
```ts
const tui = yield* TUIHandler
const result = yield* tui.prompt('Question?')
```

## Extends

- `object` & `object`

## Constructors

### Constructor

> **new TUIHandler**(`_`): `TUIHandler`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:26563

#### Parameters

##### \_

###### confirm

(`message`, `options?`) => `Effect`\<`boolean`, [`TUIError`](../../types/classes/TUIError.md)\> = `...`

Ask user for yes/no confirmation

**Example**

```ts
const confirmed = yield* tui.confirm('Are you sure?', { default: false })
```

###### display

(`message`, `type`) => `Effect`\<`void`\> = `...`

Display a message with optional styling

**Example**

```ts
yield* tui.display('Operation complete!', 'success')
```

###### multiSelect

(`message`, `choices`) => `Effect`\<`string`[], [`TUIError`](../../types/classes/TUIError.md)\> = `...`

Let user select multiple options from a list

**Example**

```ts
// Simple string array
const selected = yield* tui.multiSelect(
  'Choose multiple:',
  ['Item 1', 'Item 2', 'Item 3']
)

// With descriptions
const selected = yield* tui.multiSelect(
  'Choose features:',
  [
    { label: 'Testing', value: 'test', description: 'Unit and integration tests' },
    { label: 'Linting', value: 'lint', description: 'ESLint configuration' }
  ]
)
```

###### password

(`message`, `options?`) => `Effect`\<`string`, [`TUIError`](../../types/classes/TUIError.md)\> = `...`

Prompt user for password input (hidden)

**Example**

```ts
const password = yield* tui.password('Enter password:', {
  validate: (pwd) => pwd.length >= 8 || 'Password must be at least 8 characters'
})
```

###### prompt

(`message`, `options?`) => `Effect`\<`string`, [`TUIError`](../../types/classes/TUIError.md)\> = `...`

Prompt user for text input with optional validation

**Example**

```ts
const name = yield* tui.prompt('Enter your name:', { default: 'Guest' })
```

###### selectOption

(`message`, `choices`) => `Effect`\<`string`, [`TUIError`](../../types/classes/TUIError.md)\> = `...`

Let user select a single option from a list

**Example**

```ts
// Simple string array
const choice = yield* tui.selectOption(
  'Choose one:',
  ['Option A', 'Option B', 'Option C']
)

// With descriptions
const choice = yield* tui.selectOption(
  'Choose template:',
  [
    { label: 'Basic', value: 'basic', description: 'Simple starter template' },
    { label: 'CLI', value: 'cli', description: 'Command-line interface template' }
  ]
)
```

#### Returns

`TUIHandler`

#### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).constructor

## Properties

### \_tag

> `readonly` **\_tag**: `"app/TUIHandler"`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:26564

#### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).\_tag

***

### confirm()

> `readonly` **confirm**: (`message`, `options?`) => `Effect`\<`boolean`, [`TUIError`](../../types/classes/TUIError.md)\>

Defined in: [Projects/Published/effect-cli-tui/src/tui.ts:233](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/tui.ts#L233)

Ask user for yes/no confirmation

#### Parameters

##### message

`string`

The confirmation prompt

##### options?

Optional default value

###### default?

`boolean`

#### Returns

`Effect`\<`boolean`, [`TUIError`](../../types/classes/TUIError.md)\>

Effect that resolves with boolean (true = yes, false = no)

#### Example

```ts
const confirmed = yield* tui.confirm('Are you sure?', { default: false })
```

#### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).confirm

***

### display()

> `readonly` **display**: (`message`, `type`) => `Effect`\<`void`\>

Defined in: [Projects/Published/effect-cli-tui/src/tui.ts:62](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/tui.ts#L62)

Display a message with optional styling

#### Parameters

##### message

`string`

The message to display

##### type

[`DisplayType`](../type-aliases/DisplayType.md) = `DEFAULT_DISPLAY_TYPE`

Message type: 'info', 'success', 'error', or 'warning'

#### Returns

`Effect`\<`void`\>

Effect that displays the message

#### Example

```ts
yield* tui.display('Operation complete!', 'success')
```

#### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).display

***

### multiSelect()

> `readonly` **multiSelect**: (`message`, `choices`) => `Effect`\<`string`[], [`TUIError`](../../types/classes/TUIError.md)\>

Defined in: [Projects/Published/effect-cli-tui/src/tui.ts:193](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/tui.ts#L193)

Let user select multiple options from a list

#### Parameters

##### message

`string`

The selection prompt

##### choices

Array of available choices (strings or SelectOption objects with descriptions)

`string`[] | [`SelectOption`](../../types/interfaces/SelectOption.md)[]

#### Returns

`Effect`\<`string`[], [`TUIError`](../../types/classes/TUIError.md)\>

Effect that resolves with array of selected choice values

#### Example

```ts
// Simple string array
const selected = yield* tui.multiSelect(
  'Choose multiple:',
  ['Item 1', 'Item 2', 'Item 3']
)

// With descriptions
const selected = yield* tui.multiSelect(
  'Choose features:',
  [
    { label: 'Testing', value: 'test', description: 'Unit and integration tests' },
    { label: 'Linting', value: 'lint', description: 'ESLint configuration' }
  ]
)
```

#### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).multiSelect

***

### password()

> `readonly` **password**: (`message`, `options?`) => `Effect`\<`string`, [`TUIError`](../../types/classes/TUIError.md)\>

Defined in: [Projects/Published/effect-cli-tui/src/tui.ts:275](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/tui.ts#L275)

Prompt user for password input (hidden)

#### Parameters

##### message

`string`

The prompt message

##### options?

Optional validation function

###### validate?

(`input`) => `string` \| `boolean`

#### Returns

`Effect`\<`string`, [`TUIError`](../../types/classes/TUIError.md)\>

Effect that resolves with the password

#### Example

```ts
const password = yield* tui.password('Enter password:', {
  validate: (pwd) => pwd.length >= 8 || 'Password must be at least 8 characters'
})
```

#### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).password

***

### prompt()

> `readonly` **prompt**: (`message`, `options?`) => `Effect`\<`string`, [`TUIError`](../../types/classes/TUIError.md)\>

Defined in: [Projects/Published/effect-cli-tui/src/tui.ts:83](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/tui.ts#L83)

Prompt user for text input with optional validation

#### Parameters

##### message

`string`

The prompt message

##### options?

Optional validation and default value

###### default?

`string`

###### validate?

(`input`) => `string` \| `boolean`

#### Returns

`Effect`\<`string`, [`TUIError`](../../types/classes/TUIError.md)\>

Effect that resolves with the user's input

#### Example

```ts
const name = yield* tui.prompt('Enter your name:', { default: 'Guest' })
```

#### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).prompt

***

### selectOption()

> `readonly` **selectOption**: (`message`, `choices`) => `Effect`\<`string`, [`TUIError`](../../types/classes/TUIError.md)\>

Defined in: [Projects/Published/effect-cli-tui/src/tui.ts:140](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/tui.ts#L140)

Let user select a single option from a list

#### Parameters

##### message

`string`

The selection prompt

##### choices

Array of available choices (strings or SelectOption objects with descriptions)

`string`[] | [`SelectOption`](../../types/interfaces/SelectOption.md)[]

#### Returns

`Effect`\<`string`, [`TUIError`](../../types/classes/TUIError.md)\>

Effect that resolves with the selected choice value

#### Example

```ts
// Simple string array
const choice = yield* tui.selectOption(
  'Choose one:',
  ['Option A', 'Option B', 'Option C']
)

// With descriptions
const choice = yield* tui.selectOption(
  'Choose template:',
  [
    { label: 'Basic', value: 'basic', description: 'Simple starter template' },
    { label: 'CLI', value: 'cli', description: 'Command-line interface template' }
  ]
)
```

#### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).selectOption

***

### \_op

> `readonly` `static` **\_op**: `"Tag"`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:33

#### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).\_op

***

### \[ChannelTypeId\]

> `readonly` `static` **\[ChannelTypeId\]**: `VarianceStruct`\<`never`, `unknown`, `never`, `unknown`, `TUIHandler`, `unknown`, `TUIHandler`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Channel.d.ts:108

#### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).\[ChannelTypeId\]

***

### \[EffectTypeId\]

> `readonly` `static` **\[EffectTypeId\]**: `VarianceStruct`\<`TUIHandler`, `never`, `TUIHandler`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:195

#### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).\[EffectTypeId\]

***

### \[ignoreSymbol\]?

> `static` `optional` **\[ignoreSymbol\]**: `TagUnifyIgnore`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:46

#### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).\[ignoreSymbol\]

***

### \[SinkTypeId\]

> `readonly` `static` **\[SinkTypeId\]**: `VarianceStruct`\<`TUIHandler`, `unknown`, `never`, `never`, `TUIHandler`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Sink.d.ts:82

#### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).\[SinkTypeId\]

***

### \[STMTypeId\]

> `readonly` `static` **\[STMTypeId\]**: `object`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/STM.d.ts:136

#### \_A

> `readonly` **\_A**: `Covariant`\<`TUIHandler`\>

#### \_E

> `readonly` **\_E**: `Covariant`\<`never`\>

#### \_R

> `readonly` **\_R**: `Covariant`\<`TUIHandler`\>

#### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).\[STMTypeId\]

***

### \[StreamTypeId\]

> `readonly` `static` **\[StreamTypeId\]**: `VarianceStruct`\<`TUIHandler`, `never`, `TUIHandler`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Stream.d.ts:111

#### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).\[StreamTypeId\]

***

### \[TagTypeId\]

> `readonly` `static` **\[TagTypeId\]**: `object`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:36

#### \_Identifier

> `readonly` **\_Identifier**: `Invariant`\<`TUIHandler`\>

#### \_Service

> `readonly` **\_Service**: `Invariant`\<`TUIHandler`\>

#### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).\[TagTypeId\]

***

### \[typeSymbol\]?

> `static` `optional` **\[typeSymbol\]**: `unknown`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:44

#### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).\[typeSymbol\]

***

### \[unifySymbol\]?

> `static` `optional` **\[unifySymbol\]**: `TagUnify`\<`Class`\<`TUIHandler`, `"app/TUIHandler"`, \{ `dependencies`: readonly \[`Layer`\<[`InkService`](../../services/classes/InkService.md), `never`, `never`\>\]; `effect`: `Effect`\<\{ `confirm`: (`message`, `options?`) => `Effect`\<`boolean`, [`TUIError`](../../types/classes/TUIError.md)\>; `display`: (`message`, `type`) => `Effect`\<`void`\>; `multiSelect`: (`message`, `choices`) => `Effect`\<`string`[], [`TUIError`](../../types/classes/TUIError.md)\>; `password`: (`message`, `options?`) => `Effect`\<`string`, [`TUIError`](../../types/classes/TUIError.md)\>; `prompt`: (`message`, `options?`) => `Effect`\<`string`, [`TUIError`](../../types/classes/TUIError.md)\>; `selectOption`: (`message`, `choices`) => `Effect`\<`string`, [`TUIError`](../../types/classes/TUIError.md)\>; \}, `never`, [`InkService`](../../services/classes/InkService.md)\>; \}\>\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:45

#### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).\[unifySymbol\]

***

### Default

> `readonly` `static` **Default**: `Layer`\<`TUIHandler`, `never`, `never`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:26574

#### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).Default

***

### DefaultWithoutDependencies

> `readonly` `static` **DefaultWithoutDependencies**: `Layer`\<`TUIHandler`, `never`, [`InkService`](../../services/classes/InkService.md)\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:26573

#### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).DefaultWithoutDependencies

***

### Identifier

> `readonly` `static` **Identifier**: `TUIHandler`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:35

#### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).Identifier

***

### key

> `readonly` `static` **key**: `"app/TUIHandler"`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:43

#### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).key

***

### make()

> `readonly` `static` **make**: (`_`) => `TUIHandler`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:26567

#### Parameters

##### \_

###### confirm

(`message`, `options?`) => `Effect`\<`boolean`, [`TUIError`](../../types/classes/TUIError.md)\> = `...`

Ask user for yes/no confirmation

**Example**

```ts
const confirmed = yield* tui.confirm('Are you sure?', { default: false })
```

###### display

(`message`, `type`) => `Effect`\<`void`\> = `...`

Display a message with optional styling

**Example**

```ts
yield* tui.display('Operation complete!', 'success')
```

###### multiSelect

(`message`, `choices`) => `Effect`\<`string`[], [`TUIError`](../../types/classes/TUIError.md)\> = `...`

Let user select multiple options from a list

**Example**

```ts
// Simple string array
const selected = yield* tui.multiSelect(
  'Choose multiple:',
  ['Item 1', 'Item 2', 'Item 3']
)

// With descriptions
const selected = yield* tui.multiSelect(
  'Choose features:',
  [
    { label: 'Testing', value: 'test', description: 'Unit and integration tests' },
    { label: 'Linting', value: 'lint', description: 'ESLint configuration' }
  ]
)
```

###### password

(`message`, `options?`) => `Effect`\<`string`, [`TUIError`](../../types/classes/TUIError.md)\> = `...`

Prompt user for password input (hidden)

**Example**

```ts
const password = yield* tui.password('Enter password:', {
  validate: (pwd) => pwd.length >= 8 || 'Password must be at least 8 characters'
})
```

###### prompt

(`message`, `options?`) => `Effect`\<`string`, [`TUIError`](../../types/classes/TUIError.md)\> = `...`

Prompt user for text input with optional validation

**Example**

```ts
const name = yield* tui.prompt('Enter your name:', { default: 'Guest' })
```

###### selectOption

(`message`, `choices`) => `Effect`\<`string`, [`TUIError`](../../types/classes/TUIError.md)\> = `...`

Let user select a single option from a list

**Example**

```ts
// Simple string array
const choice = yield* tui.selectOption(
  'Choose one:',
  ['Option A', 'Option B', 'Option C']
)

// With descriptions
const choice = yield* tui.selectOption(
  'Choose template:',
  [
    { label: 'Basic', value: 'basic', description: 'Simple starter template' },
    { label: 'CLI', value: 'cli', description: 'Command-line interface template' }
  ]
)
```

#### Returns

`TUIHandler`

#### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).make

***

### Service

> `readonly` `static` **Service**: `TUIHandler`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:34

#### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).Service

***

### stack?

> `readonly` `static` `optional` **stack**: `string`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:42

#### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).stack

***

### use()

> `readonly` `static` **use**: \<`X`\>(`body`) => \[`X`\] *extends* \[`Effect`\<`A`, `E`, `R`\>\] ? `Effect`\<`A`, `E`, `TUIHandler` \| `R`\> : \[`X`\] *extends* \[`PromiseLike`\<`A`\>\] ? `Effect`\<`A`, `UnknownException`, `TUIHandler`\> : `Effect`\<`X`, `never`, `TUIHandler`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:26566

#### Type Parameters

##### X

`X`

#### Parameters

##### body

(`_`) => `X`

#### Returns

\[`X`\] *extends* \[`Effect`\<`A`, `E`, `R`\>\] ? `Effect`\<`A`, `E`, `TUIHandler` \| `R`\> : \[`X`\] *extends* \[`PromiseLike`\<`A`\>\] ? `Effect`\<`A`, `UnknownException`, `TUIHandler`\> : `Effect`\<`X`, `never`, `TUIHandler`\>

#### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).use

## Methods

### \[iterator\]()

> `static` **\[iterator\]**(): `EffectGenerator`\<`Tag`\<`TUIHandler`, `TUIHandler`\>\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:137

#### Returns

`EffectGenerator`\<`Tag`\<`TUIHandler`, `TUIHandler`\>\>

#### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).\[iterator\]

***

### \[NodeInspectSymbol\]()

> `static` **\[NodeInspectSymbol\]**(): `unknown`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Inspectable.d.ts:22

#### Returns

`unknown`

#### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).\[NodeInspectSymbol\]

***

### context()

> `static` **context**(`self`): `Context`\<`TUIHandler`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:41

#### Parameters

##### self

`TUIHandler`

#### Returns

`Context`\<`TUIHandler`\>

#### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).context

***

### of()

> `static` **of**(`self`): `TUIHandler`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:40

#### Parameters

##### self

`TUIHandler`

#### Returns

`TUIHandler`

#### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).of

***

### pipe()

#### Call Signature

> `static` **pipe**\<`A`\>(`this`): `A`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:10

##### Type Parameters

###### A

`A`

##### Parameters

###### this

`A`

##### Returns

`A`

##### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).pipe

#### Call Signature

> `static` **pipe**\<`A`, `B`\>(`this`, `ab`): `B`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:11

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

##### Returns

`B`

##### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).pipe

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`\>(`this`, `ab`, `bc`): `C`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:12

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

##### Returns

`C`

##### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).pipe

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`\>(`this`, `ab`, `bc`, `cd`): `D`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:13

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

##### Returns

`D`

##### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).pipe

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`\>(`this`, `ab`, `bc`, `cd`, `de`): `E`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:14

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

##### Returns

`E`

##### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).pipe

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`): `F`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:15

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

##### Returns

`F`

##### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).pipe

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`): `G`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:16

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

##### Returns

`G`

##### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).pipe

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`): `H`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:17

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

##### Returns

`H`

##### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).pipe

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`): `I`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:18

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

##### Returns

`I`

##### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).pipe

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`): `J`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:19

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

##### Returns

`J`

##### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).pipe

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`): `K`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:20

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

##### Returns

`K`

##### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).pipe

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`, `kl`): `L`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:21

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

###### L

`L` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

###### kl

(`_`) => `L`

##### Returns

`L`

##### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).pipe

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`, `kl`, `lm`): `M`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:22

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

###### L

`L` = `never`

###### M

`M` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

###### kl

(`_`) => `L`

###### lm

(`_`) => `M`

##### Returns

`M`

##### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).pipe

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`, `kl`, `lm`, `mn`): `N`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:23

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

###### L

`L` = `never`

###### M

`M` = `never`

###### N

`N` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

###### kl

(`_`) => `L`

###### lm

(`_`) => `M`

###### mn

(`_`) => `N`

##### Returns

`N`

##### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).pipe

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`, `kl`, `lm`, `mn`, `no`): `O`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:24

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

###### L

`L` = `never`

###### M

`M` = `never`

###### N

`N` = `never`

###### O

`O` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

###### kl

(`_`) => `L`

###### lm

(`_`) => `M`

###### mn

(`_`) => `N`

###### no

(`_`) => `O`

##### Returns

`O`

##### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).pipe

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`, `kl`, `lm`, `mn`, `no`, `op`): `P`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:25

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

###### L

`L` = `never`

###### M

`M` = `never`

###### N

`N` = `never`

###### O

`O` = `never`

###### P

`P` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

###### kl

(`_`) => `L`

###### lm

(`_`) => `M`

###### mn

(`_`) => `N`

###### no

(`_`) => `O`

###### op

(`_`) => `P`

##### Returns

`P`

##### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).pipe

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`, `Q`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`, `kl`, `lm`, `mn`, `no`, `op`, `pq`): `Q`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:26

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

###### L

`L` = `never`

###### M

`M` = `never`

###### N

`N` = `never`

###### O

`O` = `never`

###### P

`P` = `never`

###### Q

`Q` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

###### kl

(`_`) => `L`

###### lm

(`_`) => `M`

###### mn

(`_`) => `N`

###### no

(`_`) => `O`

###### op

(`_`) => `P`

###### pq

(`_`) => `Q`

##### Returns

`Q`

##### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).pipe

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`, `Q`, `R`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`, `kl`, `lm`, `mn`, `no`, `op`, `pq`, `qr`): `R`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:27

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

###### L

`L` = `never`

###### M

`M` = `never`

###### N

`N` = `never`

###### O

`O` = `never`

###### P

`P` = `never`

###### Q

`Q` = `never`

###### R

`R` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

###### kl

(`_`) => `L`

###### lm

(`_`) => `M`

###### mn

(`_`) => `N`

###### no

(`_`) => `O`

###### op

(`_`) => `P`

###### pq

(`_`) => `Q`

###### qr

(`_`) => `R`

##### Returns

`R`

##### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).pipe

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`, `Q`, `R`, `S`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`, `kl`, `lm`, `mn`, `no`, `op`, `pq`, `qr`, `rs`): `S`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:28

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

###### L

`L` = `never`

###### M

`M` = `never`

###### N

`N` = `never`

###### O

`O` = `never`

###### P

`P` = `never`

###### Q

`Q` = `never`

###### R

`R` = `never`

###### S

`S` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

###### kl

(`_`) => `L`

###### lm

(`_`) => `M`

###### mn

(`_`) => `N`

###### no

(`_`) => `O`

###### op

(`_`) => `P`

###### pq

(`_`) => `Q`

###### qr

(`_`) => `R`

###### rs

(`_`) => `S`

##### Returns

`S`

##### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).pipe

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`, `Q`, `R`, `S`, `T`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`, `kl`, `lm`, `mn`, `no`, `op`, `pq`, `qr`, `rs`, `st`): `T`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:29

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

###### L

`L` = `never`

###### M

`M` = `never`

###### N

`N` = `never`

###### O

`O` = `never`

###### P

`P` = `never`

###### Q

`Q` = `never`

###### R

`R` = `never`

###### S

`S` = `never`

###### T

`T` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

###### kl

(`_`) => `L`

###### lm

(`_`) => `M`

###### mn

(`_`) => `N`

###### no

(`_`) => `O`

###### op

(`_`) => `P`

###### pq

(`_`) => `Q`

###### qr

(`_`) => `R`

###### rs

(`_`) => `S`

###### st

(`_`) => `T`

##### Returns

`T`

##### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).pipe

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`, `Q`, `R`, `S`, `T`, `U`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`, `kl`, `lm`, `mn`, `no`, `op`, `pq`, `qr`, `rs`, `st`, `tu`): `U`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:30

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

###### L

`L` = `never`

###### M

`M` = `never`

###### N

`N` = `never`

###### O

`O` = `never`

###### P

`P` = `never`

###### Q

`Q` = `never`

###### R

`R` = `never`

###### S

`S` = `never`

###### T

`T` = `never`

###### U

`U` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

###### kl

(`_`) => `L`

###### lm

(`_`) => `M`

###### mn

(`_`) => `N`

###### no

(`_`) => `O`

###### op

(`_`) => `P`

###### pq

(`_`) => `Q`

###### qr

(`_`) => `R`

###### rs

(`_`) => `S`

###### st

(`_`) => `T`

###### tu

(`_`) => `U`

##### Returns

`U`

##### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).pipe

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`, `Q`, `R`, `S`, `T`, `U`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`, `kl`, `lm`, `mn`, `no`, `op`, `pq`, `qr`, `rs`, `st`, `tu`): `U`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:31

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

###### L

`L` = `never`

###### M

`M` = `never`

###### N

`N` = `never`

###### O

`O` = `never`

###### P

`P` = `never`

###### Q

`Q` = `never`

###### R

`R` = `never`

###### S

`S` = `never`

###### T

`T` = `never`

###### U

`U` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

###### kl

(`_`) => `L`

###### lm

(`_`) => `M`

###### mn

(`_`) => `N`

###### no

(`_`) => `O`

###### op

(`_`) => `P`

###### pq

(`_`) => `Q`

###### qr

(`_`) => `R`

###### rs

(`_`) => `S`

###### st

(`_`) => `T`

###### tu

(`_`) => `U`

##### Returns

`U`

##### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).pipe

***

### toJSON()

> `static` **toJSON**(): `unknown`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Inspectable.d.ts:21

#### Returns

`unknown`

#### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).toJSON

***

### toString()

> `static` **toString**(): `string`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Inspectable.d.ts:20

#### Returns

`string`

#### Inherited from

Effect.Service\<TUIHandler\>()("app/TUIHandler", \{ effect: Effect.gen(function\* () \{ const ink = yield\* InkService; return \{ /\*\* \* Display a message with optional styling \* \* @param message - The message to display \* @param type - Message type: 'info', 'success', 'error', or 'warning' \* @returns Effect that displays the message \* \* @example \* \`\`\`ts \* yield\* tui.display('Operation complete!', 'success') \* \`\`\` \*/ display: ( message: string, type: DisplayType = DEFAULT\_DISPLAY\_TYPE ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const prefix = getDisplayIcon(type); yield\* Console.log(\`\n$\{prefix\} $\{message\}\`); \}), /\*\* \* Prompt user for text input with optional validation \* \* @param message - The prompt message \* @param options - Optional validation and default value \* @returns Effect that resolves with the user's input \* \* @example \* \`\`\`ts \* const name = yield\* tui.prompt('Enter your name:', \{ default: 'Guest' \}) \* \`\`\` \*/ prompt: ( message: string, options?: \{ default?: string; validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Input, \{ message, defaultValue: options?.default, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select a single option from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with the selected choice value \* \* @example \* \`\`\`ts \* // Simple string array \* const choice = yield\* tui.selectOption( \* 'Choose one:', \* \['Option A', 'Option B', 'Option C'\] \* ) \* \* // With descriptions \* const choice = yield\* tui.selectOption( \* 'Choose template:', \* \[ \* \{ label: 'Basic', value: 'basic', description: 'Simple starter template' \}, \* \{ label: 'CLI', value: 'cli', description: 'Command-line interface template' \} \* \] \* ) \* \`\`\` \*/ selectOption: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Select, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Let user select multiple options from a list \* \* @param message - The selection prompt \* @param choices - Array of available choices (strings or SelectOption objects with descriptions) \* @returns Effect that resolves with array of selected choice values \* \* @example \* \`\`\`ts \* // Simple string array \* const selected = yield\* tui.multiSelect( \* 'Choose multiple:', \* \['Item 1', 'Item 2', 'Item 3'\] \* ) \* \* // With descriptions \* const selected = yield\* tui.multiSelect( \* 'Choose features:', \* \[ \* \{ label: 'Testing', value: 'test', description: 'Unit and integration tests' \}, \* \{ label: 'Linting', value: 'lint', description: 'ESLint configuration' \} \* \] \* ) \* \`\`\` \*/ multiSelect: ( message: string, choices: string\[\] \| SelectOption\[\] ): Effect.Effect\<string\[\], TUIError\> =\> ink .renderWithResult\<string\[\]\>((onComplete) =\> React.createElement(MultiSelect, \{ message, choices, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Ask user for yes/no confirmation \* \* @param message - The confirmation prompt \* @param options - Optional default value \* @returns Effect that resolves with boolean (true = yes, false = no) \* \* @example \* \`\`\`ts \* const confirmed = yield\* tui.confirm('Are you sure?', \{ default: false \}) \* \`\`\` \*/ confirm: ( message: string, options?: \{ default?: boolean \} ): Effect.Effect\<boolean, TUIError\> =\> ink .renderWithResult\<boolean\>((onComplete) =\> React.createElement(Confirm, \{ message, default: options?.default, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), /\*\* \* Prompt user for password input (hidden) \* \* @param message - The prompt message \* @param options - Optional validation function \* @returns Effect that resolves with the password \* \* @example \* \`\`\`ts \* const password = yield\* tui.password('Enter password:', \{ \* validate: (pwd) =\> pwd.length \>= 8 \|\| 'Password must be at least 8 characters' \* \}) \* \`\`\` \*/ password: ( message: string, options?: \{ validate?: (input: string) =\> boolean \| string; \} ): Effect.Effect\<string, TUIError\> =\> ink .renderWithResult\<string\>((onComplete) =\> React.createElement(Password, \{ message, validate: options?.validate, onSubmit: onComplete, \}) ) .pipe( Effect.mapError((err) =\> \{ if (err instanceof InkError) \{ // Map cancellation to TUIError with Cancelled reason if ( err.reason === "TerminalError" && err.message.toLowerCase().includes("cancelled") ) \{ return new TUIError("Cancelled", err.message); \} return new TUIError("RenderError", err.message); \} return new TUIError("RenderError", String(err)); \}) ), \} as const; \}), dependencies: \[InkService.Default\], \}).toString
