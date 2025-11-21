[**effect-cli-tui**](../../README.md)

***

[effect-cli-tui](../../modules.md) / [theme](../README.md) / withTheme

# Function: withTheme()

> **withTheme**\<`A`, `E`, `R`\>(`theme`, `effect`): `Effect`\<`A`, `E`, [`ThemeService`](../classes/ThemeService.md) \| `R`\>

Defined in: [Projects/Published/effect-cli-tui/src/services/theme/service.ts:128](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/services/theme/service.ts#L128)

Run an effect with a temporary theme

Convenience function to scope a theme.

## Type Parameters

### A

`A`

### E

`E`

### R

`R`

## Parameters

### theme

[`Theme`](../interfaces/Theme.md)

The theme to use temporarily

### effect

`Effect`\<`A`, `E`, `R`\>

The effect to run with the theme

## Returns

`Effect`\<`A`, `E`, [`ThemeService`](../classes/ThemeService.md) \| `R`\>

Effect that runs with the temporary theme

## Example

```ts
yield* withTheme(themes.minimal, Effect.gen(function* () {
  yield* display('Uses minimal theme')
}))
```
