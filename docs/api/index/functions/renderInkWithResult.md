[**effect-cli-tui**](../../README.md)

***

[effect-cli-tui](../../modules.md) / [index](../README.md) / renderInkWithResult

# ~~Function: renderInkWithResult()~~

> **renderInkWithResult**\<`T`\>(`component`): `Effect`\<`T`, [`InkError`](../../types/classes/InkError.md)\>

Defined in: [Projects/Published/effect-cli-tui/src/effects/ink-wrapper.ts:58](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/effects/ink-wrapper.ts#L58)

Wrap Ink component that returns a value with proper resource management

## Type Parameters

### T

`T`

## Parameters

### component

(`onComplete`) => `ReactElement`

## Returns

`Effect`\<`T`, [`InkError`](../../types/classes/InkError.md)\>

## Deprecated

Use `InkService.renderWithResult()` instead

## Example

```ts
// Old way (still works)
const selected = yield* renderInkWithResult<string>((onComplete) =>
  <SelectComponent choices={items} onSubmit={onComplete} />
)

// New way (preferred)
const ink = yield* InkService
const selected = yield* ink.renderWithResult<string>((onComplete) =>
  <SelectComponent choices={items} onSubmit={onComplete} />
)
```
