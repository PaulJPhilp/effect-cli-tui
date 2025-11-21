[**effect-cli-tui**](../../README.md)

***

[effect-cli-tui](../../modules.md) / [components](../README.md) / Select

# Variable: Select

> `const` **Select**: `React.FC`\<[`SelectProps`](../interfaces/SelectProps.md)\>

Defined in: [Projects/Published/effect-cli-tui/src/components/Select.tsx:35](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/components/Select.tsx#L35)

Select component - Single selection from list

Navigate with arrow keys, select with Enter.

## Param

Component props

## Returns

React component

## Example

```tsx
<Select
  message="Choose one:"
  choices={['Option A', 'Option B', 'Option C']}
  onSubmit={(selected) => console.log(selected)}
/>
```
