[**effect-cli-tui**](../../README.md)

***

[effect-cli-tui](../../modules.md) / [index](../README.md) / runWithCLI

# Function: runWithCLI()

> **runWithCLI**\<`A`, `E`\>(`effect`): `Promise`\<`A`\>

Defined in: [Projects/Published/effect-cli-tui/src/runtime.ts:227](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/runtime.ts#L227)

Convenience function to run an effect with EffectCLI runtime

Automatically disposes the runtime after execution.

## Type Parameters

### A

`A`

### E

`E`

## Parameters

### effect

`Effect`\<`A`, `E`, [`EffectCLI`](../classes/EffectCLI.md)\>

## Returns

`Promise`\<`A`\>

## Example

```ts
const program = Effect.gen(function* () {
  const cli = yield* EffectCLI
  return yield* cli.run('build')
})

const result = await runWithCLI(program)
```
