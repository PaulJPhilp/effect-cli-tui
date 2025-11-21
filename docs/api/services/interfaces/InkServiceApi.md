[**effect-cli-tui**](../../README.md)

***

[effect-cli-tui](../../modules.md) / [services](../README.md) / InkServiceApi

# Interface: InkServiceApi

Defined in: [Projects/Published/effect-cli-tui/src/services/ink/api.ts:11](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/services/ink/api.ts#L11)

Ink service API interface

Provides methods for rendering Ink/React components with proper
resource management and Effect composition.

## Properties

### renderComponent()

> **renderComponent**: (`component`) => `Effect`\<`void`, [`InkError`](../../types/classes/InkError.md)\>

Defined in: [Projects/Published/effect-cli-tui/src/services/ink/api.ts:26](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/services/ink/api.ts#L26)

Render an Ink component and wait for it to unmount

Guarantees cleanup of Ink instance even if the effect fails or is interrupted.

#### Parameters

##### component

`ReactElement`

React component to render

#### Returns

`Effect`\<`void`, [`InkError`](../../types/classes/InkError.md)\>

Effect that resolves when component unmounts

#### Example

```ts
const ink = yield* InkService
yield* ink.renderComponent(<MyComponent />)
```

***

### renderWithResult()

> **renderWithResult**: \<`T`\>(`component`) => `Effect`\<`T`, [`InkError`](../../types/classes/InkError.md)\>

Defined in: [Projects/Published/effect-cli-tui/src/services/ink/api.ts:47](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/services/ink/api.ts#L47)

Render an Ink component that returns a value

Component receives onComplete callback to pass result and unmount.
Guarantees cleanup of Ink instance.

#### Type Parameters

##### T

`T`

#### Parameters

##### component

(`onComplete`) => `ReactElement`

Function that returns a component receiving onComplete

#### Returns

`Effect`\<`T`, [`InkError`](../../types/classes/InkError.md)\>

Effect that resolves with the component's return value

#### Example

```ts
const ink = yield* InkService
const selected = yield* ink.renderWithResult<string>((onComplete) =>
  <SelectComponent choices={items} onSubmit={onComplete} />
)
```
