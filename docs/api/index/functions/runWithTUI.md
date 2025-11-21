[**effect-cli-tui**](../../README.md)

***

[effect-cli-tui](../../modules.md) / [index](../README.md) / runWithTUI

# Function: runWithTUI()

> **runWithTUI**\<`A`, `E`\>(`effect`): `Promise`\<`A`\>

Defined in: [Projects/Published/effect-cli-tui/src/runtime.ts:198](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/runtime.ts#L198)

Convenience function to run an effect with TUIHandler runtime

Automatically disposes the runtime after execution.

## Type Parameters

### A

`A`

### E

`E`

## Parameters

### effect

`Effect`\<`A`, `E`, [`DisplayService`](../../services/classes/DisplayService.md) \| [`InkService`](../../services/classes/InkService.md) \| [`Terminal`](../../services/classes/Terminal.md) \| [`TUIHandler`](../classes/TUIHandler.md)\>

## Returns

`Promise`\<`A`\>

## Example

```ts
const program = Effect.gen(function* () {
  const tui = yield* TUIHandler
  return yield* tui.prompt('Name:')
})

const name = await runWithTUI(program)
```
