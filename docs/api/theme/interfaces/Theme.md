[**effect-cli-tui**](../../README.md)

***

[effect-cli-tui](../../modules.md) / [theme](../README.md) / Theme

# Interface: Theme

Defined in: [Projects/Published/effect-cli-tui/src/services/theme/types.ts:28](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/services/theme/types.ts#L28)

Theme configuration for display styling

Defines icons, colors, and optional styles for each display type.
Used by ThemeService to customize the appearance of CLI output.

## Example

```ts
const customTheme: Theme = {
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
    info: 'cyan',
    highlight: 'magenta'
  }
}
```

## Properties

### colors

> `readonly` **colors**: `object`

Defined in: [Projects/Published/effect-cli-tui/src/services/theme/types.ts:42](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/services/theme/types.ts#L42)

Colors for each display type

#### error

> `readonly` **error**: [`ChalkColor`](../../types/type-aliases/ChalkColor.md)

#### highlight

> `readonly` **highlight**: [`ChalkColor`](../../types/type-aliases/ChalkColor.md)

#### info

> `readonly` **info**: [`ChalkColor`](../../types/type-aliases/ChalkColor.md)

#### success

> `readonly` **success**: [`ChalkColor`](../../types/type-aliases/ChalkColor.md)

#### warning

> `readonly` **warning**: [`ChalkColor`](../../types/type-aliases/ChalkColor.md)

***

### icons

> `readonly` **icons**: `object`

Defined in: [Projects/Published/effect-cli-tui/src/services/theme/types.ts:32](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/services/theme/types.ts#L32)

Icons for each display type

#### error

> `readonly` **error**: `string`

#### info

> `readonly` **info**: `string`

#### success

> `readonly` **success**: `string`

#### warning

> `readonly` **warning**: `string`

***

### styles?

> `readonly` `optional` **styles**: `object`

Defined in: [Projects/Published/effect-cli-tui/src/services/theme/types.ts:54](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/services/theme/types.ts#L54)

Optional styles for each display type
Applied in addition to colors

#### error?

> `readonly` `optional` **error**: [`ChalkStyleOptions`](../../types/interfaces/ChalkStyleOptions.md)

#### info?

> `readonly` `optional` **info**: [`ChalkStyleOptions`](../../types/interfaces/ChalkStyleOptions.md)

#### success?

> `readonly` `optional` **success**: [`ChalkStyleOptions`](../../types/interfaces/ChalkStyleOptions.md)

#### warning?

> `readonly` `optional` **warning**: [`ChalkStyleOptions`](../../types/interfaces/ChalkStyleOptions.md)
