[**effect-cli-tui**](../../README.md)

***

[effect-cli-tui](../../modules.md) / [theme](../README.md) / createTheme

# Function: createTheme()

> **createTheme**(`partial`): [`Theme`](../interfaces/Theme.md)

Defined in: [Projects/Published/effect-cli-tui/src/services/theme/helpers.ts:54](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/services/theme/helpers.ts#L54)

Create a theme from a partial theme

Merges the partial theme with the default theme.

## Parameters

### partial

[`PartialTheme`](../type-aliases/PartialTheme.md)

The partial theme to create from

## Returns

[`Theme`](../interfaces/Theme.md)

A complete theme

## Example

```ts
const customTheme = createTheme({
  icons: { success: '✅' },
  colors: { info: 'cyan' }
})
```
