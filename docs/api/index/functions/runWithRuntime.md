[**effect-cli-tui**](../../README.md)

***

[effect-cli-tui](../../modules.md) / [index](../README.md) / runWithRuntime

# Function: runWithRuntime()

> **runWithRuntime**\<`A`, `E`\>(`effect`): `Promise`\<`A`\>

Defined in: [Projects/Published/effect-cli-tui/src/runtime.ts:169](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/runtime.ts#L169)

Convenience function to run an effect with the full CLI/TUI runtime

This is a shortcut for `EffectCLIRuntime.runPromise(effect)`.
Automatically disposes the runtime after execution.

## Type Parameters

### A

`A`

### E

`E`

## Parameters

### effect

`Effect`\<`A`, `E`, [`EffectCLI`](../classes/EffectCLI.md) \| [`DisplayService`](../../services/classes/DisplayService.md) \| [`InkService`](../../services/classes/InkService.md) \| [`Terminal`](../../services/classes/Terminal.md) \| [`TUIHandler`](../classes/TUIHandler.md)\>

## Returns

`Promise`\<`A`\>

## Example

```ts
const program = Effect.gen(function* () {
  const cli = yield* EffectCLI
  return yield* cli.run('echo', ['hello'])
})

const result = await runWithRuntime(program)
```
