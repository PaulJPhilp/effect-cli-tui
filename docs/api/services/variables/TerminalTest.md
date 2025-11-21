[**effect-cli-tui**](../../README.md)

***

[effect-cli-tui](../../modules.md) / [services](../README.md) / TerminalTest

# Variable: TerminalTest

> `const` **TerminalTest**: `Layer.Layer`\<[`Terminal`](../classes/Terminal.md)\>

Defined in: [Projects/Published/effect-cli-tui/src/core/terminal.ts:102](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/core/terminal.ts#L102)

Test terminal service - collects output in memory for assertions

## Example

```ts
const program = Effect.gen(function* () {
  const terminal = yield* Terminal
  yield* terminal.stdout('Line 1\n')
  yield* terminal.line('Line 2')
}).pipe(Effect.provide(TerminalTest))

await Effect.runPromise(program)
// No actual console output, can verify output in tests
```
