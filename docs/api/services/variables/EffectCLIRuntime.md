[**effect-cli-tui**](../../README.md)

***

[effect-cli-tui](../../modules.md) / [services](../README.md) / EffectCLIRuntime

# Variable: EffectCLIRuntime

> `const` **EffectCLIRuntime**: `ManagedRuntime`\<[`EffectCLI`](../../index/classes/EffectCLI.md) \| [`ThemeService`](../../theme/classes/ThemeService.md) \| [`DisplayService`](../classes/DisplayService.md) \| [`InkService`](../classes/InkService.md) \| [`Terminal`](../classes/Terminal.md) \| [`TUIHandler`](../../index/classes/TUIHandler.md), `never`\>

Defined in: [Projects/Published/effect-cli-tui/src/runtime.ts:86](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/runtime.ts#L86)

ManagedRuntime with all CLI/TUI services

Use this runtime to execute effects that require any of the CLI/TUI services.
The runtime manages the lifecycle of all services automatically.

## Example

```ts
const program = Effect.gen(function* () {
  const cli = yield* EffectCLI
  const tui = yield* TUIHandler
  const result = yield* cli.run('build')
  yield* tui.display('Build complete!', 'success')
  return result
})

await EffectCLIRuntime.runPromise(program)
await EffectCLIRuntime.dispose() // Clean up resources
```
