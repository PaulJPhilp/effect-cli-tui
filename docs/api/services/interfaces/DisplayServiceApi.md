[**effect-cli-tui**](../../README.md)

***

[effect-cli-tui](../../modules.md) / [services](../README.md) / DisplayServiceApi

# Interface: DisplayServiceApi

Defined in: [Projects/Published/effect-cli-tui/src/services/display/api.ts:10](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/services/display/api.ts#L10)

Display service API interface

Provides methods for displaying messages, JSON, and lines
in the terminal with styling support.

## Properties

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
