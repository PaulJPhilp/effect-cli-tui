[**effect-cli-tui**](../../README.md)

***

[effect-cli-tui](../../modules.md) / [services](../README.md) / TUIHandlerRuntime

# Variable: TUIHandlerRuntime

> `const` **TUIHandlerRuntime**: `ManagedRuntime`\<[`ThemeService`](../../theme/classes/ThemeService.md) \| [`DisplayService`](../classes/DisplayService.md) \| [`InkService`](../classes/InkService.md) \| [`Terminal`](../classes/Terminal.md) \| [`TUIHandler`](../../index/classes/TUIHandler.md), `never`\>

Defined in: [Projects/Published/effect-cli-tui/src/runtime.ts:104](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/runtime.ts#L104)

Runtime with only TUIHandler and its dependencies

Use this when you only need interactive prompts and display.

## Example

```ts
const program = Effect.gen(function* () {
  const tui = yield* TUIHandler
  const name = yield* tui.prompt('Name:')
  yield* tui.display(`Hello, ${name}!`, 'success')
})

await TUIHandlerRuntime.runPromise(program)
```
