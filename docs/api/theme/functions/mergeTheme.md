[**effect-cli-tui**](../../README.md)

***

[effect-cli-tui](../../modules.md) / [theme](../README.md) / mergeTheme

# Function: mergeTheme()

> **mergeTheme**(`base`, `partial`): [`Theme`](../interfaces/Theme.md)

Defined in: [Projects/Published/effect-cli-tui/src/services/theme/helpers.ts:21](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/services/theme/helpers.ts#L21)

Merge a partial theme with a base theme

Creates a new theme by merging the partial theme over the base theme.
Useful for extending or customizing existing themes.

## Parameters

### base

[`Theme`](../interfaces/Theme.md)

The base theme to merge into

### partial

[`PartialTheme`](../type-aliases/PartialTheme.md)

The partial theme to merge over the base

## Returns

[`Theme`](../interfaces/Theme.md)

A new merged theme

## Example

```ts
const customTheme = mergeTheme(themes.default, {
  colors: { info: 'cyan' }
})
```
