[**effect-cli-tui**](../../README.md)

***

[effect-cli-tui](../../modules.md) / [services](../README.md) / Terminal

# Class: Terminal

Defined in: [Projects/Published/effect-cli-tui/src/core/terminal.ts:24](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/core/terminal.ts#L24)

Terminal service for writing to stdout/stderr.
Provides methods for terminal output operations.

Usage:
```ts
const program = Effect.gen(function* () {
  const terminal = yield* Terminal
  yield* terminal.stdout('Hello, world!')
  yield* terminal.line('Line 2')
}).pipe(Effect.provide(Terminal.Default))

await Effect.runPromise(program)
```

## Extends

- `object` & `object`

## Constructors

### Constructor

> **new Terminal**(`_`): `Terminal`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:26563

#### Parameters

##### \_

###### carriageReturn

() => `Effect`\<`void`\> = `...`

Move cursor to start of line (carriage return)

###### clearLine

() => `Effect`\<`void`\> = `...`

Clear the current line (ANSI escape sequence)

###### hideCursor

() => `Effect`\<`void`\> = `...`

Hide cursor (ANSI escape sequence)

###### line

(`text`) => `Effect`\<`void`\> = `...`

Write a line to standard output (adds newline via console.log)

###### showCursor

() => `Effect`\<`void`\> = `...`

Show cursor (ANSI escape sequence)

###### stderr

(`text`) => `Effect`\<`void`\> = `...`

Write to standard error without newline

###### stdout

(`text`) => `Effect`\<`void`\> = `...`

Write to standard output without newline

#### Returns

`Terminal`

#### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).constructor`

## Properties

### \_tag

> `readonly` **\_tag**: `"app/Terminal"`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:26564

#### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), })._tag`

***

### carriageReturn()

> `readonly` **carriageReturn**: () => `Effect`\<`void`\>

Defined in: [Projects/Published/effect-cli-tui/src/core/terminal.ts:63](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/core/terminal.ts#L63)

Move cursor to start of line (carriage return)

#### Returns

`Effect`\<`void`\>

#### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).carriageReturn`

***

### clearLine()

> `readonly` **clearLine**: () => `Effect`\<`void`\>

Defined in: [Projects/Published/effect-cli-tui/src/core/terminal.ts:55](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/core/terminal.ts#L55)

Clear the current line (ANSI escape sequence)

#### Returns

`Effect`\<`void`\>

#### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).clearLine`

***

### hideCursor()

> `readonly` **hideCursor**: () => `Effect`\<`void`\>

Defined in: [Projects/Published/effect-cli-tui/src/core/terminal.ts:71](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/core/terminal.ts#L71)

Hide cursor (ANSI escape sequence)

#### Returns

`Effect`\<`void`\>

#### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).hideCursor`

***

### line()

> `readonly` **line**: (`text`) => `Effect`\<`void`\>

Defined in: [Projects/Published/effect-cli-tui/src/core/terminal.ts:47](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/core/terminal.ts#L47)

Write a line to standard output (adds newline via console.log)

#### Parameters

##### text

`string`

#### Returns

`Effect`\<`void`\>

#### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).line`

***

### showCursor()

> `readonly` **showCursor**: () => `Effect`\<`void`\>

Defined in: [Projects/Published/effect-cli-tui/src/core/terminal.ts:79](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/core/terminal.ts#L79)

Show cursor (ANSI escape sequence)

#### Returns

`Effect`\<`void`\>

#### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).showCursor`

***

### stderr()

> `readonly` **stderr**: (`text`) => `Effect`\<`void`\>

Defined in: [Projects/Published/effect-cli-tui/src/core/terminal.ts:39](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/core/terminal.ts#L39)

Write to standard error without newline

#### Parameters

##### text

`string`

#### Returns

`Effect`\<`void`\>

#### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).stderr`

***

### stdout()

> `readonly` **stdout**: (`text`) => `Effect`\<`void`\>

Defined in: [Projects/Published/effect-cli-tui/src/core/terminal.ts:31](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/core/terminal.ts#L31)

Write to standard output without newline

#### Parameters

##### text

`string`

#### Returns

`Effect`\<`void`\>

#### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).stdout`

***

### \_op

> `readonly` `static` **\_op**: `"Tag"`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:33

#### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), })._op`

***

### \[ChannelTypeId\]

> `readonly` `static` **\[ChannelTypeId\]**: `VarianceStruct`\<`never`, `unknown`, `never`, `unknown`, `Terminal`, `unknown`, `Terminal`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Channel.d.ts:108

#### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).[ChannelTypeId]`

***

### \[EffectTypeId\]

> `readonly` `static` **\[EffectTypeId\]**: `VarianceStruct`\<`Terminal`, `never`, `Terminal`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:195

#### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).[EffectTypeId]`

***

### \[ignoreSymbol\]?

> `static` `optional` **\[ignoreSymbol\]**: `TagUnifyIgnore`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:46

#### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).[ignoreSymbol]`

***

### \[SinkTypeId\]

> `readonly` `static` **\[SinkTypeId\]**: `VarianceStruct`\<`Terminal`, `unknown`, `never`, `never`, `Terminal`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Sink.d.ts:82

#### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).[SinkTypeId]`

***

### \[STMTypeId\]

> `readonly` `static` **\[STMTypeId\]**: `object`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/STM.d.ts:136

#### \_A

> `readonly` **\_A**: `Covariant`\<`Terminal`\>

#### \_E

> `readonly` **\_E**: `Covariant`\<`never`\>

#### \_R

> `readonly` **\_R**: `Covariant`\<`Terminal`\>

#### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).[STMTypeId]`

***

### \[StreamTypeId\]

> `readonly` `static` **\[StreamTypeId\]**: `VarianceStruct`\<`Terminal`, `never`, `Terminal`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Stream.d.ts:111

#### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).[StreamTypeId]`

***

### \[TagTypeId\]

> `readonly` `static` **\[TagTypeId\]**: `object`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:36

#### \_Identifier

> `readonly` **\_Identifier**: `Invariant`\<`Terminal`\>

#### \_Service

> `readonly` **\_Service**: `Invariant`\<`Terminal`\>

#### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).[TagTypeId]`

***

### \[typeSymbol\]?

> `static` `optional` **\[typeSymbol\]**: `unknown`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:44

#### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).[typeSymbol]`

***

### \[unifySymbol\]?

> `static` `optional` **\[unifySymbol\]**: `TagUnify`\<`Class`\<`Terminal`, `"app/Terminal"`, \{ `effect`: `Effect`\<\{ `carriageReturn`: () => `Effect`\<`void`\>; `clearLine`: () => `Effect`\<`void`\>; `hideCursor`: () => `Effect`\<`void`\>; `line`: (`text`) => `Effect`\<`void`\>; `showCursor`: () => `Effect`\<`void`\>; `stderr`: (`text`) => `Effect`\<`void`\>; `stdout`: (`text`) => `Effect`\<`void`\>; \}, `never`, `never`\>; \}\>\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:45

#### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).[unifySymbol]`

***

### Default

> `readonly` `static` **Default**: `Layer`\<`Terminal`, `never`, `never`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:26571

#### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).Default`

***

### Identifier

> `readonly` `static` **Identifier**: `Terminal`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:35

#### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).Identifier`

***

### key

> `readonly` `static` **key**: `"app/Terminal"`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:43

#### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).key`

***

### make()

> `readonly` `static` **make**: (`_`) => `Terminal`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:26567

#### Parameters

##### \_

###### carriageReturn

() => `Effect`\<`void`\> = `...`

Move cursor to start of line (carriage return)

###### clearLine

() => `Effect`\<`void`\> = `...`

Clear the current line (ANSI escape sequence)

###### hideCursor

() => `Effect`\<`void`\> = `...`

Hide cursor (ANSI escape sequence)

###### line

(`text`) => `Effect`\<`void`\> = `...`

Write a line to standard output (adds newline via console.log)

###### showCursor

() => `Effect`\<`void`\> = `...`

Show cursor (ANSI escape sequence)

###### stderr

(`text`) => `Effect`\<`void`\> = `...`

Write to standard error without newline

###### stdout

(`text`) => `Effect`\<`void`\> = `...`

Write to standard output without newline

#### Returns

`Terminal`

#### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).make`

***

### Service

> `readonly` `static` **Service**: `Terminal`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:34

#### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).Service`

***

### stack?

> `readonly` `static` `optional` **stack**: `string`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:42

#### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).stack`

***

### use()

> `readonly` `static` **use**: \<`X`\>(`body`) => \[`X`\] *extends* \[`Effect`\<`A`, `E`, `R`\>\] ? `Effect`\<`A`, `E`, `Terminal` \| `R`\> : \[`X`\] *extends* \[`PromiseLike`\<`A`\>\] ? `Effect`\<`A`, `UnknownException`, `Terminal`\> : `Effect`\<`X`, `never`, `Terminal`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:26566

#### Type Parameters

##### X

`X`

#### Parameters

##### body

(`_`) => `X`

#### Returns

\[`X`\] *extends* \[`Effect`\<`A`, `E`, `R`\>\] ? `Effect`\<`A`, `E`, `Terminal` \| `R`\> : \[`X`\] *extends* \[`PromiseLike`\<`A`\>\] ? `Effect`\<`A`, `UnknownException`, `Terminal`\> : `Effect`\<`X`, `never`, `Terminal`\>

#### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).use`

## Methods

### \[iterator\]()

> `static` **\[iterator\]**(): `EffectGenerator`\<`Tag`\<`Terminal`, `Terminal`\>\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:137

#### Returns

`EffectGenerator`\<`Tag`\<`Terminal`, `Terminal`\>\>

#### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).[iterator]`

***

### \[NodeInspectSymbol\]()

> `static` **\[NodeInspectSymbol\]**(): `unknown`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Inspectable.d.ts:22

#### Returns

`unknown`

#### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).[NodeInspectSymbol]`

***

### context()

> `static` **context**(`self`): `Context`\<`Terminal`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:41

#### Parameters

##### self

`Terminal`

#### Returns

`Context`\<`Terminal`\>

#### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).context`

***

### of()

> `static` **of**(`self`): `Terminal`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:40

#### Parameters

##### self

`Terminal`

#### Returns

`Terminal`

#### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).of`

***

### pipe()

#### Call Signature

> `static` **pipe**\<`A`\>(`this`): `A`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:10

##### Type Parameters

###### A

`A`

##### Parameters

###### this

`A`

##### Returns

`A`

##### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`\>(`this`, `ab`): `B`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:11

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

##### Returns

`B`

##### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`\>(`this`, `ab`, `bc`): `C`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:12

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

##### Returns

`C`

##### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`\>(`this`, `ab`, `bc`, `cd`): `D`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:13

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

##### Returns

`D`

##### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`\>(`this`, `ab`, `bc`, `cd`, `de`): `E`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:14

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

##### Returns

`E`

##### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`): `F`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:15

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

##### Returns

`F`

##### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`): `G`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:16

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

##### Returns

`G`

##### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`): `H`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:17

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

##### Returns

`H`

##### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`): `I`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:18

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

##### Returns

`I`

##### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`): `J`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:19

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

##### Returns

`J`

##### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`): `K`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:20

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

##### Returns

`K`

##### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`, `kl`): `L`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:21

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

###### L

`L` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

###### kl

(`_`) => `L`

##### Returns

`L`

##### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`, `kl`, `lm`): `M`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:22

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

###### L

`L` = `never`

###### M

`M` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

###### kl

(`_`) => `L`

###### lm

(`_`) => `M`

##### Returns

`M`

##### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`, `kl`, `lm`, `mn`): `N`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:23

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

###### L

`L` = `never`

###### M

`M` = `never`

###### N

`N` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

###### kl

(`_`) => `L`

###### lm

(`_`) => `M`

###### mn

(`_`) => `N`

##### Returns

`N`

##### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`, `kl`, `lm`, `mn`, `no`): `O`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:24

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

###### L

`L` = `never`

###### M

`M` = `never`

###### N

`N` = `never`

###### O

`O` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

###### kl

(`_`) => `L`

###### lm

(`_`) => `M`

###### mn

(`_`) => `N`

###### no

(`_`) => `O`

##### Returns

`O`

##### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`, `kl`, `lm`, `mn`, `no`, `op`): `P`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:25

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

###### L

`L` = `never`

###### M

`M` = `never`

###### N

`N` = `never`

###### O

`O` = `never`

###### P

`P` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

###### kl

(`_`) => `L`

###### lm

(`_`) => `M`

###### mn

(`_`) => `N`

###### no

(`_`) => `O`

###### op

(`_`) => `P`

##### Returns

`P`

##### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`, `Q`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`, `kl`, `lm`, `mn`, `no`, `op`, `pq`): `Q`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:26

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

###### L

`L` = `never`

###### M

`M` = `never`

###### N

`N` = `never`

###### O

`O` = `never`

###### P

`P` = `never`

###### Q

`Q` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

###### kl

(`_`) => `L`

###### lm

(`_`) => `M`

###### mn

(`_`) => `N`

###### no

(`_`) => `O`

###### op

(`_`) => `P`

###### pq

(`_`) => `Q`

##### Returns

`Q`

##### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`, `Q`, `R`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`, `kl`, `lm`, `mn`, `no`, `op`, `pq`, `qr`): `R`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:27

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

###### L

`L` = `never`

###### M

`M` = `never`

###### N

`N` = `never`

###### O

`O` = `never`

###### P

`P` = `never`

###### Q

`Q` = `never`

###### R

`R` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

###### kl

(`_`) => `L`

###### lm

(`_`) => `M`

###### mn

(`_`) => `N`

###### no

(`_`) => `O`

###### op

(`_`) => `P`

###### pq

(`_`) => `Q`

###### qr

(`_`) => `R`

##### Returns

`R`

##### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`, `Q`, `R`, `S`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`, `kl`, `lm`, `mn`, `no`, `op`, `pq`, `qr`, `rs`): `S`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:28

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

###### L

`L` = `never`

###### M

`M` = `never`

###### N

`N` = `never`

###### O

`O` = `never`

###### P

`P` = `never`

###### Q

`Q` = `never`

###### R

`R` = `never`

###### S

`S` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

###### kl

(`_`) => `L`

###### lm

(`_`) => `M`

###### mn

(`_`) => `N`

###### no

(`_`) => `O`

###### op

(`_`) => `P`

###### pq

(`_`) => `Q`

###### qr

(`_`) => `R`

###### rs

(`_`) => `S`

##### Returns

`S`

##### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`, `Q`, `R`, `S`, `T`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`, `kl`, `lm`, `mn`, `no`, `op`, `pq`, `qr`, `rs`, `st`): `T`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:29

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

###### L

`L` = `never`

###### M

`M` = `never`

###### N

`N` = `never`

###### O

`O` = `never`

###### P

`P` = `never`

###### Q

`Q` = `never`

###### R

`R` = `never`

###### S

`S` = `never`

###### T

`T` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

###### kl

(`_`) => `L`

###### lm

(`_`) => `M`

###### mn

(`_`) => `N`

###### no

(`_`) => `O`

###### op

(`_`) => `P`

###### pq

(`_`) => `Q`

###### qr

(`_`) => `R`

###### rs

(`_`) => `S`

###### st

(`_`) => `T`

##### Returns

`T`

##### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`, `Q`, `R`, `S`, `T`, `U`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`, `kl`, `lm`, `mn`, `no`, `op`, `pq`, `qr`, `rs`, `st`, `tu`): `U`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:30

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

###### L

`L` = `never`

###### M

`M` = `never`

###### N

`N` = `never`

###### O

`O` = `never`

###### P

`P` = `never`

###### Q

`Q` = `never`

###### R

`R` = `never`

###### S

`S` = `never`

###### T

`T` = `never`

###### U

`U` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

###### kl

(`_`) => `L`

###### lm

(`_`) => `M`

###### mn

(`_`) => `N`

###### no

(`_`) => `O`

###### op

(`_`) => `P`

###### pq

(`_`) => `Q`

###### qr

(`_`) => `R`

###### rs

(`_`) => `S`

###### st

(`_`) => `T`

###### tu

(`_`) => `U`

##### Returns

`U`

##### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`, `Q`, `R`, `S`, `T`, `U`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`, `kl`, `lm`, `mn`, `no`, `op`, `pq`, `qr`, `rs`, `st`, `tu`): `U`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Pipeable.d.ts:31

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

###### L

`L` = `never`

###### M

`M` = `never`

###### N

`N` = `never`

###### O

`O` = `never`

###### P

`P` = `never`

###### Q

`Q` = `never`

###### R

`R` = `never`

###### S

`S` = `never`

###### T

`T` = `never`

###### U

`U` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

###### kl

(`_`) => `L`

###### lm

(`_`) => `M`

###### mn

(`_`) => `N`

###### no

(`_`) => `O`

###### op

(`_`) => `P`

###### pq

(`_`) => `Q`

###### qr

(`_`) => `R`

###### rs

(`_`) => `S`

###### st

(`_`) => `T`

###### tu

(`_`) => `U`

##### Returns

`U`

##### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).pipe`

***

### toJSON()

> `static` **toJSON**(): `unknown`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Inspectable.d.ts:21

#### Returns

`unknown`

#### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).toJSON`

***

### toString()

> `static` **toString**(): `string`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Inspectable.d.ts:20

#### Returns

`string`

#### Inherited from

`Effect.Service<Terminal>()("app/Terminal", { effect: Effect.sync( () => ({ /** * Write to standard output without newline */ stdout: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(text); }), /** * Write to standard error without newline */ stderr: (text: string): Effect.Effect<void> => Effect.sync(() => { process.stderr.write(text); }), /** * Write a line to standard output (adds newline via console.log) */ line: (text: string): Effect.Effect<void> => Effect.sync(() => { console.log(text); }), /** * Clear the current line (ANSI escape sequence) */ clearLine: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CLEAR_LINE); }), /** * Move cursor to start of line (carriage return) */ carriageReturn: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_CARRIAGE_RETURN); }), /** * Hide cursor (ANSI escape sequence) */ hideCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_HIDE_CURSOR); }), /** * Show cursor (ANSI escape sequence) */ showCursor: (): Effect.Effect<void> => Effect.sync(() => { process.stdout.write(ANSI_SHOW_CURSOR); }), }) as const ), }).toString`
