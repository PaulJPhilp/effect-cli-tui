[**effect-cli-tui**](../../README.md)

***

[effect-cli-tui](../../modules.md) / [components](../README.md) / ConfirmProps

# Interface: ConfirmProps

Defined in: [Projects/Published/effect-cli-tui/src/components/Confirm.tsx:12](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/components/Confirm.tsx#L12)

Ink React components for terminal UI

This module exports all interactive Ink components for use with
effect-cli-tui's TUIHandler and renderInkWithResult wrapper.

## Example

```ts
import { Input, Select, Confirm } from 'effect-cli-tui/components'
import { renderInkWithResult } from 'effect-cli-tui'

const program = Effect.gen(function* (_) {
  const name = yield* _(
    renderInkWithResult<string>((onComplete) =>
      <Input message="Name:" onSubmit={onComplete} />
    )
  )
  return name
})
```

## Properties

### default?

> `optional` **default**: `boolean`

Defined in: [Projects/Published/effect-cli-tui/src/components/Confirm.tsx:14](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/components/Confirm.tsx#L14)

***

### message

> **message**: `string`

Defined in: [Projects/Published/effect-cli-tui/src/components/Confirm.tsx:13](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/components/Confirm.tsx#L13)

***

### onSubmit()

> **onSubmit**: (`value`) => `void`

Defined in: [Projects/Published/effect-cli-tui/src/components/Confirm.tsx:15](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/components/Confirm.tsx#L15)

#### Parameters

##### value

`boolean`

#### Returns

`void`
