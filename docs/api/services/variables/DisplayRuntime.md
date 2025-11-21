[**effect-cli-tui**](../../README.md)

***

[effect-cli-tui](../../modules.md) / [services](../README.md) / DisplayRuntime

# Variable: DisplayRuntime

> `const` **DisplayRuntime**: `ManagedRuntime`\<[`ThemeService`](../../theme/classes/ThemeService.md) \| [`DisplayService`](../classes/DisplayService.md), `never`\>

Defined in: [Projects/Published/effect-cli-tui/src/runtime.ts:149](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/runtime.ts#L149)

Runtime with only DisplayService

Use this when you only need display output utilities.

## Example

```ts
import { display, displaySuccess } from 'effect-cli-tui'

const program = Effect.gen(function* () {
  yield* display('Processing...')
  yield* displaySuccess('Complete!')
})

await DisplayRuntime.runPromise(program)
```
