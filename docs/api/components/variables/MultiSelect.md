[**effect-cli-tui**](../../README.md)

***

[effect-cli-tui](../../modules.md) / [components](../README.md) / MultiSelect

# Variable: MultiSelect

> `const` **MultiSelect**: `React.FC`\<[`MultiSelectProps`](../interfaces/MultiSelectProps.md)\>

Defined in: [Projects/Published/effect-cli-tui/src/components/MultiSelect.tsx:35](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/components/MultiSelect.tsx#L35)

MultiSelect component - Multiple selection from list

Navigate with arrow keys, toggle with Space, submit with Enter.

## Param

Component props

## Returns

React component

## Example

```tsx
<MultiSelect
  message="Choose multiple:"
  choices={['Item 1', 'Item 2', 'Item 3']}
  onSubmit={(selected) => console.log(selected)}
/>
```
