[**effect-cli-tui**](../../README.md)

***

[effect-cli-tui](../../modules.md) / [services](../README.md) / EffectCLIOnlyRuntime

# Variable: EffectCLIOnlyRuntime

> `const` **EffectCLIOnlyRuntime**: `ManagedRuntime`\<[`EffectCLI`](../../index/classes/EffectCLI.md), `never`\>

Defined in: [Projects/Published/effect-cli-tui/src/runtime.ts:130](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/runtime.ts#L130)

Runtime with only EffectCLI

Use this when you only need command execution.

## Example

```ts
const program = Effect.gen(function* () {
  const cli = yield* EffectCLI
  const result = yield* cli.run('npm', ['install'])
  return result
})

await EffectCLIRuntime.runPromise(program)
```
