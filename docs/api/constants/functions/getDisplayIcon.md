[**effect-cli-tui**](../../README.md)

***

[effect-cli-tui](../../modules.md) / [constants](../README.md) / getDisplayIcon

# Function: getDisplayIcon()

> **getDisplayIcon**(`type`, `theme?`): `string`

Defined in: [Projects/Published/effect-cli-tui/src/core/icons.ts:112](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/core/icons.ts#L112)

Get the display icon for a given type

Uses the provided theme if available, otherwise uses the current theme if available,
otherwise falls back to default icons.

## Parameters

### type

The display type

`"info"` | `"success"` | `"error"` | `"warning"`

### theme?

[`Theme`](../../theme/interfaces/Theme.md)

Optional theme to use

## Returns

`string`

The corresponding icon symbol
