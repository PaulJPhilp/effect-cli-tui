[**effect-cli-tui**](../../README.md)

***

[effect-cli-tui](../../modules.md) / [theme](../README.md) / ThemeService

# Class: ThemeService

Defined in: [Projects/Published/effect-cli-tui/src/services/theme/service.ts:31](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/services/theme/service.ts#L31)

Theme service for managing display themes

Provides methods to get, set, and scope themes.
Note: Theme is stored in a global Ref, so it's shared across all fibers.
Use `withTheme()` for scoped theme changes.

## Example

```ts
const program = Effect.gen(function* () {
  const theme = yield* ThemeService
  yield* theme.setTheme(themes.emoji)
  yield* display('Success!', { type: 'success' })
}).pipe(Effect.provide(ThemeService.Default))
```

## Extends

- `object` & `object`

## Constructors

### Constructor

> **new ThemeService**(`_`): `ThemeService`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:26563

#### Parameters

##### \_

###### getTheme

() => [`Theme`](../interfaces/Theme.md) = `...`

###### setTheme

(`theme`) => `Effect`\<`void`\> = `...`

###### withTheme

\<`A`, `E`, `R`\>(`theme`, `effect`) => `Effect`\<`A`, `E`, `R`\> = `...`

#### Returns

`ThemeService`

#### Inherited from

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).constructor`

## Properties

### \_tag

> `readonly` **\_tag**: `"app/ThemeService"`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:26564

#### Inherited from

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } )._tag`

***

### getTheme()

> `readonly` **getTheme**: () => [`Theme`](../interfaces/Theme.md)

Defined in: [Projects/Published/effect-cli-tui/src/services/theme/service.ts:37](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/services/theme/service.ts#L37)

#### Returns

[`Theme`](../interfaces/Theme.md)

#### Inherited from

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).getTheme`

***

### setTheme()

> `readonly` **setTheme**: (`theme`) => `Effect`\<`void`\>

Defined in: [Projects/Published/effect-cli-tui/src/services/theme/service.ts:39](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/services/theme/service.ts#L39)

#### Parameters

##### theme

[`Theme`](../interfaces/Theme.md)

#### Returns

`Effect`\<`void`\>

#### Inherited from

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).setTheme`

***

### withTheme()

> `readonly` **withTheme**: \<`A`, `E`, `R`\>(`theme`, `effect`) => `Effect`\<`A`, `E`, `R`\>

Defined in: [Projects/Published/effect-cli-tui/src/services/theme/service.ts:42](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/services/theme/service.ts#L42)

#### Type Parameters

##### A

`A`

##### E

`E`

##### R

`R`

#### Parameters

##### theme

[`Theme`](../interfaces/Theme.md)

##### effect

`Effect`\<`A`, `E`, `R`\>

#### Returns

`Effect`\<`A`, `E`, `R`\>

#### Inherited from

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).withTheme`

***

### \_op

> `readonly` `static` **\_op**: `"Tag"`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:33

#### Inherited from

[`TUIHandler`](../../index/classes/TUIHandler.md).[`_op`](../../index/classes/TUIHandler.md#_op)

***

### \[ChannelTypeId\]

> `readonly` `static` **\[ChannelTypeId\]**: `VarianceStruct`\<`never`, `unknown`, `never`, `unknown`, `ThemeService`, `unknown`, `ThemeService`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Channel.d.ts:108

#### Inherited from

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).[ChannelTypeId]`

***

### \[EffectTypeId\]

> `readonly` `static` **\[EffectTypeId\]**: `VarianceStruct`\<`ThemeService`, `never`, `ThemeService`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:195

#### Inherited from

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).[EffectTypeId]`

***

### \[ignoreSymbol\]?

> `static` `optional` **\[ignoreSymbol\]**: `TagUnifyIgnore`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:46

#### Inherited from

[`TUIHandler`](../../index/classes/TUIHandler.md).[`[ignoreSymbol]`](../../index/classes/TUIHandler.md#ignoresymbol)

***

### \[SinkTypeId\]

> `readonly` `static` **\[SinkTypeId\]**: `VarianceStruct`\<`ThemeService`, `unknown`, `never`, `never`, `ThemeService`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Sink.d.ts:82

#### Inherited from

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).[SinkTypeId]`

***

### \[STMTypeId\]

> `readonly` `static` **\[STMTypeId\]**: `object`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/STM.d.ts:136

#### \_A

> `readonly` **\_A**: `Covariant`\<`ThemeService`\>

#### \_E

> `readonly` **\_E**: `Covariant`\<`never`\>

#### \_R

> `readonly` **\_R**: `Covariant`\<`ThemeService`\>

#### Inherited from

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).[STMTypeId]`

***

### \[StreamTypeId\]

> `readonly` `static` **\[StreamTypeId\]**: `VarianceStruct`\<`ThemeService`, `never`, `ThemeService`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Stream.d.ts:111

#### Inherited from

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).[StreamTypeId]`

***

### \[TagTypeId\]

> `readonly` `static` **\[TagTypeId\]**: `object`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:36

#### \_Identifier

> `readonly` **\_Identifier**: `Invariant`\<`ThemeService`\>

#### \_Service

> `readonly` **\_Service**: `Invariant`\<`ThemeService`\>

#### Inherited from

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).[TagTypeId]`

***

### \[typeSymbol\]?

> `static` `optional` **\[typeSymbol\]**: `unknown`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:44

#### Inherited from

[`TUIHandler`](../../index/classes/TUIHandler.md).[`[typeSymbol]`](../../index/classes/TUIHandler.md#typesymbol)

***

### \[unifySymbol\]?

> `static` `optional` **\[unifySymbol\]**: `TagUnify`\<`Class`\<`ThemeService`, `"app/ThemeService"`, \{ `effect`: `Effect`\<\{ `getTheme`: () => [`Theme`](../interfaces/Theme.md); `setTheme`: (`theme`) => `Effect`\<`void`\>; `withTheme`: \<`A`, `E`, `R`\>(`theme`, `effect`) => `Effect`\<`A`, `E`, `R`\>; \}, `never`, `never`\>; \}\>\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:45

#### Inherited from

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).[unifySymbol]`

***

### Default

> `readonly` `static` **Default**: `Layer`\<`ThemeService`, `never`, `never`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:26571

#### Inherited from

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).Default`

***

### Identifier

> `readonly` `static` **Identifier**: `ThemeService`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:35

#### Inherited from

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).Identifier`

***

### key

> `readonly` `static` **key**: `"app/ThemeService"`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:43

#### Inherited from

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).key`

***

### make()

> `readonly` `static` **make**: (`_`) => `ThemeService`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:26567

#### Parameters

##### \_

###### getTheme

() => [`Theme`](../interfaces/Theme.md) = `...`

###### setTheme

(`theme`) => `Effect`\<`void`\> = `...`

###### withTheme

\<`A`, `E`, `R`\>(`theme`, `effect`) => `Effect`\<`A`, `E`, `R`\> = `...`

#### Returns

`ThemeService`

#### Inherited from

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).make`

***

### Service

> `readonly` `static` **Service**: `ThemeService`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:34

#### Inherited from

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).Service`

***

### stack?

> `readonly` `static` `optional` **stack**: `string`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:42

#### Inherited from

[`TUIHandler`](../../index/classes/TUIHandler.md).[`stack`](../../index/classes/TUIHandler.md#stack)

***

### use()

> `readonly` `static` **use**: \<`X`\>(`body`) => \[`X`\] *extends* \[`Effect`\<`A`, `E`, `R`\>\] ? `Effect`\<`A`, `E`, `ThemeService` \| `R`\> : \[`X`\] *extends* \[`PromiseLike`\<`A`\>\] ? `Effect`\<`A`, `UnknownException`, `ThemeService`\> : `Effect`\<`X`, `never`, `ThemeService`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:26566

#### Type Parameters

##### X

`X`

#### Parameters

##### body

(`_`) => `X`

#### Returns

\[`X`\] *extends* \[`Effect`\<`A`, `E`, `R`\>\] ? `Effect`\<`A`, `E`, `ThemeService` \| `R`\> : \[`X`\] *extends* \[`PromiseLike`\<`A`\>\] ? `Effect`\<`A`, `UnknownException`, `ThemeService`\> : `Effect`\<`X`, `never`, `ThemeService`\>

#### Inherited from

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).use`

## Methods

### \[iterator\]()

> `static` **\[iterator\]**(): `EffectGenerator`\<`Tag`\<`ThemeService`, `ThemeService`\>\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:137

#### Returns

`EffectGenerator`\<`Tag`\<`ThemeService`, `ThemeService`\>\>

#### Inherited from

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).[iterator]`

***

### \[NodeInspectSymbol\]()

> `static` **\[NodeInspectSymbol\]**(): `unknown`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Inspectable.d.ts:22

#### Returns

`unknown`

#### Inherited from

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).[NodeInspectSymbol]`

***

### context()

> `static` **context**(`self`): `Context`\<`ThemeService`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:41

#### Parameters

##### self

`ThemeService`

#### Returns

`Context`\<`ThemeService`\>

#### Inherited from

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).context`

***

### of()

> `static` **of**(`self`): `ThemeService`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:40

#### Parameters

##### self

`ThemeService`

#### Returns

`ThemeService`

#### Inherited from

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).of`

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

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).pipe`

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

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).pipe`

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

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).pipe`

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

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).pipe`

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

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).pipe`

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

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).pipe`

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

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).pipe`

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

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).pipe`

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

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).pipe`

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

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).pipe`

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

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).pipe`

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

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).pipe`

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

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).pipe`

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

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).pipe`

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

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).pipe`

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

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).pipe`

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

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).pipe`

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

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).pipe`

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

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).pipe`

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

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).pipe`

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

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).pipe`

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

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).pipe`

***

### toJSON()

> `static` **toJSON**(): `unknown`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Inspectable.d.ts:21

#### Returns

`unknown`

#### Inherited from

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).toJSON`

***

### toString()

> `static` **toString**(): `string`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Inspectable.d.ts:20

#### Returns

`string`

#### Inherited from

`Effect.Service<ThemeService>()( "app/ThemeService", { effect: Effect.sync( () => ({ getTheme: (): Theme => Effect.runSync(Ref.get(ThemeRef)), setTheme: (theme: Theme): Effect.Effect<void> => Ref.set(ThemeRef, theme), withTheme: <A, E, R>( theme: Theme, effect: Effect.Effect<A, E, R> ): Effect.Effect<A, E, R> => Effect.gen(function* () { const currentTheme: Theme = yield* Ref.get(ThemeRef); yield* Ref.set(ThemeRef, theme); const result = yield* effect; yield* Ref.set(ThemeRef, currentTheme); return result; }), }) as const satisfies ThemeServiceApi ), } ).toString`
