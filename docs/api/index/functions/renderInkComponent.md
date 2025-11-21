[**effect-cli-tui**](../../README.md)

***

[effect-cli-tui](../../modules.md) / [index](../README.md) / renderInkComponent

# ~~Function: renderInkComponent()~~

> **renderInkComponent**(`component`): `Effect`\<`void`, [`InkError`](../../types/classes/InkError.md)\>

Defined in: [Projects/Published/effect-cli-tui/src/effects/ink-wrapper.ts:30](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/effects/ink-wrapper.ts#L30)

Wrap Ink component rendering in Effect with proper resource management

## Parameters

### component

`ReactElement`

## Returns

`Effect`\<`void`, [`InkError`](../../types/classes/InkError.md)\>

## Deprecated

Use `InkService.renderComponent()` instead

## Example

```ts
// Old way (still works)
yield* renderInkComponent(<MyComponent />)

// New way (preferred)
const ink = yield* InkService
yield* ink.renderComponent(<MyComponent />)
```
