[**effect-cli-tui**](../../README.md)

***

[effect-cli-tui](../../modules.md) / [services](../README.md) / DisplayService

# Class: DisplayService

Defined in: [Projects/Published/effect-cli-tui/src/services/display/service.ts:24](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/services/display/service.ts#L24)

Display service for terminal output

Provides methods for displaying messages, JSON, and lines
with styling support.

## Example

```ts
const program = Effect.gen(function* () {
  const display = yield* DisplayService
  yield* display.output('Hello!', { type: 'success' })
  yield* display.json({ key: 'value' })
}).pipe(Effect.provide(DisplayService.Default))
```

## Extends

- [`DisplayServiceApi`](../interfaces/DisplayServiceApi.md) & `object`

## Constructors

### Constructor

> **new DisplayService**(`_`): `DisplayService`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:26563

#### Parameters

##### \_

[`DisplayServiceApi`](../interfaces/DisplayServiceApi.md)

#### Returns

`DisplayService`

#### Inherited from

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).constructor

## Properties

### \_tag

> `readonly` **\_tag**: `"app/DisplayService"`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:26564

#### Inherited from

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).\_tag

***

### error()

> **error**: (`message`, `options?`) => `Effect`\<`void`\>

Defined in: [Projects/Published/effect-cli-tui/src/services/display/api.ts:75](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/services/display/api.ts#L75)

Display an error message

#### Parameters

##### message

`string`

Error message

##### options?

`Omit`\<[`DisplayOptions`](../../index/interfaces/DisplayOptions.md), `"type"`\>

Display options (type is set to 'error')

#### Returns

`Effect`\<`void`\>

Effect that displays the message

#### Inherited from

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).error

***

### json()

> **json**: (`data`, `options?`) => `Effect`\<`void`\>

Defined in: [Projects/Published/effect-cli-tui/src/services/display/api.ts:54](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/services/display/api.ts#L54)

Display JSON data with formatting

#### Parameters

##### data

`unknown`

Data to display as JSON

##### options?

[`JsonDisplayOptions`](../../index/interfaces/JsonDisplayOptions.md)

JSON display options

#### Returns

`Effect`\<`void`\>

Effect that displays the JSON

#### Example

```ts
const display = yield* DisplayService
yield* display.json({ key: 'value' }, { spaces: 2 })
```

#### Inherited from

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).json

***

### lines()

> **lines**: (`lines`, `options?`) => `Effect`\<`void`\>

Defined in: [Projects/Published/effect-cli-tui/src/services/display/api.ts:39](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/services/display/api.ts#L39)

Display multiple lines sequentially

#### Parameters

##### lines

`string`[]

Array of lines to display

##### options?

[`DisplayOptions`](../../index/interfaces/DisplayOptions.md)

Display options (applied to each line)

#### Returns

`Effect`\<`void`\>

Effect that displays all lines

#### Example

```ts
const display = yield* DisplayService
yield* display.lines(['Line 1', 'Line 2'], { type: 'info' })
```

#### Inherited from

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).lines

***

### output()

> **output**: (`message`, `options?`) => `Effect`\<`void`\>

Defined in: [Projects/Published/effect-cli-tui/src/services/display/api.ts:24](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/services/display/api.ts#L24)

Display a single-line message with optional styling

#### Parameters

##### message

`string`

The message to display

##### options?

[`DisplayOptions`](../../index/interfaces/DisplayOptions.md)

Display options

#### Returns

`Effect`\<`void`\>

Effect that displays the message

#### Example

```ts
const display = yield* DisplayService
yield* display.output('Hello, world!', { type: 'success' })
```

#### Inherited from

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).output

***

### success()

> **success**: (`message`, `options?`) => `Effect`\<`void`\>

Defined in: [Projects/Published/effect-cli-tui/src/services/display/api.ts:63](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/services/display/api.ts#L63)

Display a success message

#### Parameters

##### message

`string`

Success message

##### options?

`Omit`\<[`DisplayOptions`](../../index/interfaces/DisplayOptions.md), `"type"`\>

Display options (type is set to 'success')

#### Returns

`Effect`\<`void`\>

Effect that displays the message

#### Inherited from

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).success

***

### \_op

> `readonly` `static` **\_op**: `"Tag"`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:33

#### Inherited from

[`TUIHandler`](../../index/classes/TUIHandler.md).[`_op`](../../index/classes/TUIHandler.md#_op)

***

### \[ChannelTypeId\]

> `readonly` `static` **\[ChannelTypeId\]**: `VarianceStruct`\<`never`, `unknown`, `never`, `unknown`, `DisplayService`, `unknown`, `DisplayService`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Channel.d.ts:108

#### Inherited from

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).\[ChannelTypeId\]

***

### \[EffectTypeId\]

> `readonly` `static` **\[EffectTypeId\]**: `VarianceStruct`\<`DisplayService`, `never`, `DisplayService`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:195

#### Inherited from

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).\[EffectTypeId\]

***

### \[ignoreSymbol\]?

> `static` `optional` **\[ignoreSymbol\]**: `TagUnifyIgnore`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:46

#### Inherited from

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).\[ignoreSymbol\]

***

### \[SinkTypeId\]

> `readonly` `static` **\[SinkTypeId\]**: `VarianceStruct`\<`DisplayService`, `unknown`, `never`, `never`, `DisplayService`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Sink.d.ts:82

#### Inherited from

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).\[SinkTypeId\]

***

### \[STMTypeId\]

> `readonly` `static` **\[STMTypeId\]**: `object`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/STM.d.ts:136

#### \_A

> `readonly` **\_A**: `Covariant`\<`DisplayService`\>

#### \_E

> `readonly` **\_E**: `Covariant`\<`never`\>

#### \_R

> `readonly` **\_R**: `Covariant`\<`DisplayService`\>

#### Inherited from

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).\[STMTypeId\]

***

### \[StreamTypeId\]

> `readonly` `static` **\[StreamTypeId\]**: `VarianceStruct`\<`DisplayService`, `never`, `DisplayService`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Stream.d.ts:111

#### Inherited from

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).\[StreamTypeId\]

***

### \[TagTypeId\]

> `readonly` `static` **\[TagTypeId\]**: `object`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:36

#### \_Identifier

> `readonly` **\_Identifier**: `Invariant`\<`DisplayService`\>

#### \_Service

> `readonly` **\_Service**: `Invariant`\<`DisplayService`\>

#### Inherited from

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).\[TagTypeId\]

***

### \[typeSymbol\]?

> `static` `optional` **\[typeSymbol\]**: `unknown`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:44

#### Inherited from

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).\[typeSymbol\]

***

### \[unifySymbol\]?

> `static` `optional` **\[unifySymbol\]**: `TagUnify`\<`Class`\<`DisplayService`, `"app/DisplayService"`, \{ `scoped`: `Effect`\<[`DisplayServiceApi`](../interfaces/DisplayServiceApi.md), `never`, `never`\>; \}\>\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:45

#### Inherited from

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).\[unifySymbol\]

***

### Default

> `readonly` `static` **Default**: `Layer`\<`DisplayService`, `never`, `never`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:26571

#### Inherited from

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).Default

***

### Identifier

> `readonly` `static` **Identifier**: `DisplayService`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:35

#### Inherited from

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).Identifier

***

### key

> `readonly` `static` **key**: `"app/DisplayService"`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:43

#### Inherited from

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).key

***

### make()

> `readonly` `static` **make**: (`_`) => `DisplayService`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:26567

#### Parameters

##### \_

[`DisplayServiceApi`](../interfaces/DisplayServiceApi.md)

#### Returns

`DisplayService`

#### Inherited from

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).make

***

### Service

> `readonly` `static` **Service**: `DisplayService`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:34

#### Inherited from

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).Service

***

### stack?

> `readonly` `static` `optional` **stack**: `string`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:42

#### Inherited from

[`TUIHandler`](../../index/classes/TUIHandler.md).[`stack`](../../index/classes/TUIHandler.md#stack)

***

### use()

> `readonly` `static` **use**: \<`X`\>(`body`) => \[`X`\] *extends* \[`Effect`\<`A`, `E`, `R`\>\] ? `Effect`\<`A`, `E`, `DisplayService` \| `R`\> : \[`X`\] *extends* \[`PromiseLike`\<`A`\>\] ? `Effect`\<`A`, `UnknownException`, `DisplayService`\> : `Effect`\<`X`, `never`, `DisplayService`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:26566

#### Type Parameters

##### X

`X`

#### Parameters

##### body

(`_`) => `X`

#### Returns

\[`X`\] *extends* \[`Effect`\<`A`, `E`, `R`\>\] ? `Effect`\<`A`, `E`, `DisplayService` \| `R`\> : \[`X`\] *extends* \[`PromiseLike`\<`A`\>\] ? `Effect`\<`A`, `UnknownException`, `DisplayService`\> : `Effect`\<`X`, `never`, `DisplayService`\>

#### Inherited from

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).use

## Methods

### \[iterator\]()

> `static` **\[iterator\]**(): `EffectGenerator`\<`Tag`\<`DisplayService`, `DisplayService`\>\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:137

#### Returns

`EffectGenerator`\<`Tag`\<`DisplayService`, `DisplayService`\>\>

#### Inherited from

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).\[iterator\]

***

### \[NodeInspectSymbol\]()

> `static` **\[NodeInspectSymbol\]**(): `unknown`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Inspectable.d.ts:22

#### Returns

`unknown`

#### Inherited from

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).\[NodeInspectSymbol\]

***

### context()

> `static` **context**(`self`): `Context`\<`DisplayService`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:41

#### Parameters

##### self

`DisplayService`

#### Returns

`Context`\<`DisplayService`\>

#### Inherited from

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).context

***

### of()

> `static` **of**(`self`): `DisplayService`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:40

#### Parameters

##### self

`DisplayService`

#### Returns

`DisplayService`

#### Inherited from

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).of

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

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).pipe

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

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).pipe

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

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).pipe

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

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).pipe

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

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).pipe

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

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).pipe

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

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).pipe

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

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).pipe

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

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).pipe

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

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).pipe

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

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).pipe

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

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).pipe

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

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).pipe

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

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).pipe

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

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).pipe

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

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).pipe

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

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).pipe

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

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).pipe

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

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).pipe

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

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).pipe

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

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).pipe

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

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).pipe

***

### toJSON()

> `static` **toJSON**(): `unknown`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Inspectable.d.ts:21

#### Returns

`unknown`

#### Inherited from

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).toJSON

***

### toString()

> `static` **toString**(): `string`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Inspectable.d.ts:20

#### Returns

`string`

#### Inherited from

Effect.Service\<DisplayService\>()( "app/DisplayService", \{ scoped: Effect.sync( (): DisplayServiceApi =\> (\{ output: ( message: string, options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, type, restOptions, theme ); // Route error messages to stderr for better CLI practices yield\* type === "error" ? Console.error(output) : Console.log(output); \}); \}, lines: ( lines: string\[\], options: DisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, ...restOptions \} = options; const useStderr = type === "error"; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; for (const line of lines) \{ const output = formatDisplayOutput( line, type, \{ ...restOptions, newline: true, \}, theme ); yield\* useStderr ? Console.error(output) : Console.log(output); \} \}); \}, json: ( data: unknown, options: JsonDisplayOptions = \{\} ): Effect.Effect\<void\> =\> \{ const \{ type = DEFAULT\_DISPLAY\_TYPE, spaces = 2, showPrefix = true, customPrefix, \} = options; return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const jsonString = JSON.stringify(data, null, spaces); if (!(showPrefix \|\| customPrefix)) \{ const output = options.newline !== false ? \`\n$\{jsonString\}\` : jsonString; yield\* Console.log(output); return; \} const prefix = customPrefix ?? (showPrefix ? getDisplayIcon(type, theme) : ""); const styledPrefix = options.style && prefix ? applyChalkStyle(prefix, options.style) : prefix; const prefixedJson = jsonString .split("\n") .map((line, index) =\> index === 0 ? \`$\{styledPrefix\} $\{line\}\` : \`$\{" ".repeat(String(styledPrefix).length + 1)\}$\{line\}\` ) .join("\n"); const output = options.newline !== false ? \`\n$\{prefixedJson\}\` : prefixedJson; yield\* Console.log(output); \}); \}, success: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "success", options, theme ); yield\* Console.log(output); \}), error: ( message: string, options: Omit\<DisplayOptions, "type"\> = \{\} ): Effect.Effect\<void\> =\> \{ return Effect.gen(function\* () \{ const themeOption = yield\* Effect.serviceOption(ThemeService); const theme = themeOption.\_tag === "Some" ? themeOption.value.getTheme() : undefined; const output = formatDisplayOutput( message, "error", options, theme ); // Route error messages to stderr for better CLI practices yield\* Console.error(output); \}); \}, \}) as const ), \} ).toString
