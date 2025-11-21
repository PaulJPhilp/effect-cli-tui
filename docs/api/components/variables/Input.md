[**effect-cli-tui**](../../README.md)

***

[effect-cli-tui](../../modules.md) / [components](../README.md) / Input

# Variable: Input

> `const` **Input**: `React.FC`\<[`InputProps`](../interfaces/InputProps.md)\>

Defined in: [Projects/Published/effect-cli-tui/src/components/Input.tsx:44](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/components/Input.tsx#L44)

Input component - Text input with optional validation

## Param

Component props

## Returns

React component

## Examples

```tsx
<Input
  message="Enter your name:"
  onSubmit={(name) => console.log(name)}
  validate={(input) => input.length > 0 ? true : 'Name is required'}
/>
```

```tsx
<Input
  message="Task:"
  placeholder="e.g., Summarize the text"
  onSubmit={(task) => console.log(task)}
/>
```
