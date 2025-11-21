[**effect-cli-tui**](../../README.md)

***

[effect-cli-tui](../../modules.md) / [index](../README.md) / TableColumn

# Interface: TableColumn\<T\>

Defined in: [Projects/Published/effect-cli-tui/src/tables/table.ts:8](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/tables/table.ts#L8)

## Type Parameters

### T

`T` = `Record`\<`string`, `unknown`\>

## Properties

### align?

> `optional` **align**: [`TableAlignment`](../../types/type-aliases/TableAlignment.md)

Defined in: [Projects/Published/effect-cli-tui/src/tables/table.ts:12](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/tables/table.ts#L12)

***

### formatter()?

> `optional` **formatter**: (`value`) => `string`

Defined in: [Projects/Published/effect-cli-tui/src/tables/table.ts:14](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/tables/table.ts#L14)

#### Parameters

##### value

`unknown`

#### Returns

`string`

***

### header

> **header**: `string`

Defined in: [Projects/Published/effect-cli-tui/src/tables/table.ts:10](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/tables/table.ts#L10)

***

### key

> **key**: `string` \| keyof `T`

Defined in: [Projects/Published/effect-cli-tui/src/tables/table.ts:9](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/tables/table.ts#L9)

***

### truncate?

> `optional` **truncate**: `boolean`

Defined in: [Projects/Published/effect-cli-tui/src/tables/table.ts:13](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/tables/table.ts#L13)

***

### width?

> `optional` **width**: `number`

Defined in: [Projects/Published/effect-cli-tui/src/tables/table.ts:11](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/tables/table.ts#L11)
