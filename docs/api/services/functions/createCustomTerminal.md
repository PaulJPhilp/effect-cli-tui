[**effect-cli-tui**](../../README.md)

***

[effect-cli-tui](../../modules.md) / [services](../README.md) / createCustomTerminal

# Function: createCustomTerminal()

> **createCustomTerminal**(`stdoutFn`, `stderrFn?`): `Layer`\<[`Terminal`](../classes/Terminal.md)\>

Defined in: [Projects/Published/effect-cli-tui/src/core/terminal.ts:170](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/core/terminal.ts#L170)

Create a custom terminal service that writes to a provided stream

## Parameters

### stdoutFn

(`text`) => `void`

Function to call for stdout writes

### stderrFn?

(`text`) => `void`

Function to call for stderr writes

## Returns

`Layer`\<[`Terminal`](../classes/Terminal.md)\>

Layer providing Terminal service

## Example

```ts
const lines: string[] = []

const CustomTerminal = createCustomTerminal(
  (text) => lines.push(text),
  (text) => lines.push(`[ERROR] ${text}`)
)

const program = Effect.gen(function* () {
  const terminal = yield* Terminal
  yield* terminal.stdout('Test output')
}).pipe(Effect.provide(CustomTerminal))

await Effect.runPromise(program)
console.log(lines) // ['Test output']
```
