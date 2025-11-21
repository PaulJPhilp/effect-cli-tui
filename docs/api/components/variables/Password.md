[**effect-cli-tui**](../../README.md)

***

[effect-cli-tui](../../modules.md) / [components](../README.md) / Password

# Variable: Password

> `const` **Password**: `React.FC`\<[`PasswordProps`](../interfaces/PasswordProps.md)\>

Defined in: [Projects/Published/effect-cli-tui/src/components/Password.tsx:35](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/components/Password.tsx#L35)

Password component - Hidden password input

Input is masked with dots while typing.

## Param

Component props

## Returns

React component

## Example

```tsx
<Password
  message="Enter password:"
  onSubmit={(password) => console.log('Got password')}
/>
```
