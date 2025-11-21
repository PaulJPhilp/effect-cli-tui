[**effect-cli-tui**](../../README.md)

***

[effect-cli-tui](../../modules.md) / [theme](../README.md) / setTheme

# Function: setTheme()

> **setTheme**(`theme`): `Effect`\<`void`, `never`, [`ThemeService`](../classes/ThemeService.md)\>

Defined in: [Projects/Published/effect-cli-tui/src/services/theme/service.ts:103](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/services/theme/service.ts#L103)

Set the current theme in Effect context

Convenience function to set the theme.

## Parameters

### theme

[`Theme`](../interfaces/Theme.md)

The theme to set

## Returns

`Effect`\<`void`, `never`, [`ThemeService`](../classes/ThemeService.md)\>

Effect that sets the theme

## Example

```ts
yield* setTheme(themes.emoji)
```
