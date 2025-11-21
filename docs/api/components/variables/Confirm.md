[**effect-cli-tui**](../../README.md)

***

[effect-cli-tui](../../modules.md) / [components](../README.md) / Confirm

# Variable: Confirm

> `const` **Confirm**: `React.FC`\<[`ConfirmProps`](../interfaces/ConfirmProps.md)\>

Defined in: [Projects/Published/effect-cli-tui/src/components/Confirm.tsx:38](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/components/Confirm.tsx#L38)

Confirm component - Yes/No confirmation dialog

Accepts: y/yes for true, n/no for false
Press Enter without input to use default value

## Param

Component props

## Returns

React component

## Example

```tsx
<Confirm
  message="Are you sure?"
  default={false}
  onSubmit={(confirmed) => {
    if (confirmed) console.log('Confirmed')
  }}
/>
```
