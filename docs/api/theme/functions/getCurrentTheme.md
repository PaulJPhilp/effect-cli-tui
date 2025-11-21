[**effect-cli-tui**](../../README.md)

***

[effect-cli-tui](../../modules.md) / [theme](../README.md) / getCurrentTheme

# Function: getCurrentTheme()

> **getCurrentTheme**(): `Effect`\<[`Theme`](../interfaces/Theme.md), `never`, [`ThemeService`](../classes/ThemeService.md)\>

Defined in: [Projects/Published/effect-cli-tui/src/services/theme/service.ts:83](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/services/theme/service.ts#L83)

Get the current theme from Effect context

Convenience function to access the current theme.

## Returns

`Effect`\<[`Theme`](../interfaces/Theme.md), `never`, [`ThemeService`](../classes/ThemeService.md)\>

Effect that resolves to the current theme

## Example

```ts
const theme = yield* getCurrentTheme()
console.log(theme.colors.success) // 'green'
```
