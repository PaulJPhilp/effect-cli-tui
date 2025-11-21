[**effect-cli-tui**](../../README.md)

***

[effect-cli-tui](../../modules.md) / [services](../README.md) / InkService

# Class: InkService

Defined in: [Projects/Published/effect-cli-tui/src/services/ink/service.ts:25](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/services/ink/service.ts#L25)

Ink service for rendering React/Ink components

Provides methods for rendering Ink components with proper resource management
and Effect composition.

## Example

```ts
const program = Effect.gen(function* () {
  const ink = yield* InkService
  const selected = yield* ink.renderWithResult<string>((onComplete) =>
    <SelectComponent choices={items} onSubmit={onComplete} />
  )
  return selected
}).pipe(Effect.provide(InkService.Default))
```

## Extends

- [`InkServiceApi`](../interfaces/InkServiceApi.md) & `object`

## Constructors

### Constructor

> **new InkService**(`_`): `InkService`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:26563

#### Parameters

##### \_

[`InkServiceApi`](../interfaces/InkServiceApi.md)

#### Returns

`InkService`

#### Inherited from

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).constructor

## Properties

### \_tag

> `readonly` **\_tag**: `"app/InkService"`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:26564

#### Inherited from

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).\_tag

***

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

#### Inherited from

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).renderComponent

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

#### Inherited from

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).renderWithResult

***

### \_op

> `readonly` `static` **\_op**: `"Tag"`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:33

#### Inherited from

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).\_op

***

### \[ChannelTypeId\]

> `readonly` `static` **\[ChannelTypeId\]**: `VarianceStruct`\<`never`, `unknown`, `never`, `unknown`, `InkService`, `unknown`, `InkService`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Channel.d.ts:108

#### Inherited from

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).\[ChannelTypeId\]

***

### \[EffectTypeId\]

> `readonly` `static` **\[EffectTypeId\]**: `VarianceStruct`\<`InkService`, `never`, `InkService`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:195

#### Inherited from

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).\[EffectTypeId\]

***

### \[ignoreSymbol\]?

> `static` `optional` **\[ignoreSymbol\]**: `TagUnifyIgnore`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:46

#### Inherited from

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).\[ignoreSymbol\]

***

### \[SinkTypeId\]

> `readonly` `static` **\[SinkTypeId\]**: `VarianceStruct`\<`InkService`, `unknown`, `never`, `never`, `InkService`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Sink.d.ts:82

#### Inherited from

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).\[SinkTypeId\]

***

### \[STMTypeId\]

> `readonly` `static` **\[STMTypeId\]**: `object`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/STM.d.ts:136

#### \_A

> `readonly` **\_A**: `Covariant`\<`InkService`\>

#### \_E

> `readonly` **\_E**: `Covariant`\<`never`\>

#### \_R

> `readonly` **\_R**: `Covariant`\<`InkService`\>

#### Inherited from

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).\[STMTypeId\]

***

### \[StreamTypeId\]

> `readonly` `static` **\[StreamTypeId\]**: `VarianceStruct`\<`InkService`, `never`, `InkService`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Stream.d.ts:111

#### Inherited from

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).\[StreamTypeId\]

***

### \[TagTypeId\]

> `readonly` `static` **\[TagTypeId\]**: `object`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:36

#### \_Identifier

> `readonly` **\_Identifier**: `Invariant`\<`InkService`\>

#### \_Service

> `readonly` **\_Service**: `Invariant`\<`InkService`\>

#### Inherited from

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).\[TagTypeId\]

***

### \[typeSymbol\]?

> `static` `optional` **\[typeSymbol\]**: `unknown`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:44

#### Inherited from

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).\[typeSymbol\]

***

### \[unifySymbol\]?

> `static` `optional` **\[unifySymbol\]**: `TagUnify`\<`Class`\<`InkService`, `"app/InkService"`, \{ `effect`: `Effect`\<[`InkServiceApi`](../interfaces/InkServiceApi.md), `never`, `never`\>; \}\>\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:45

#### Inherited from

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).\[unifySymbol\]

***

### Default

> `readonly` `static` **Default**: `Layer`\<`InkService`, `never`, `never`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:26571

#### Inherited from

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).Default

***

### Identifier

> `readonly` `static` **Identifier**: `InkService`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:35

#### Inherited from

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).Identifier

***

### key

> `readonly` `static` **key**: `"app/InkService"`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:43

#### Inherited from

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).key

***

### make()

> `readonly` `static` **make**: (`_`) => `InkService`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:26567

#### Parameters

##### \_

[`InkServiceApi`](../interfaces/InkServiceApi.md)

#### Returns

`InkService`

#### Inherited from

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).make

***

### Service

> `readonly` `static` **Service**: `InkService`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:34

#### Inherited from

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).Service

***

### stack?

> `readonly` `static` `optional` **stack**: `string`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:42

#### Inherited from

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).stack

***

### use()

> `readonly` `static` **use**: \<`X`\>(`body`) => \[`X`\] *extends* \[`Effect`\<`A`, `E`, `R`\>\] ? `Effect`\<`A`, `E`, `InkService` \| `R`\> : \[`X`\] *extends* \[`PromiseLike`\<`A`\>\] ? `Effect`\<`A`, `UnknownException`, `InkService`\> : `Effect`\<`X`, `never`, `InkService`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:26566

#### Type Parameters

##### X

`X`

#### Parameters

##### body

(`_`) => `X`

#### Returns

\[`X`\] *extends* \[`Effect`\<`A`, `E`, `R`\>\] ? `Effect`\<`A`, `E`, `InkService` \| `R`\> : \[`X`\] *extends* \[`PromiseLike`\<`A`\>\] ? `Effect`\<`A`, `UnknownException`, `InkService`\> : `Effect`\<`X`, `never`, `InkService`\>

#### Inherited from

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).use

## Methods

### \[iterator\]()

> `static` **\[iterator\]**(): `EffectGenerator`\<`Tag`\<`InkService`, `InkService`\>\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:137

#### Returns

`EffectGenerator`\<`Tag`\<`InkService`, `InkService`\>\>

#### Inherited from

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).\[iterator\]

***

### \[NodeInspectSymbol\]()

> `static` **\[NodeInspectSymbol\]**(): `unknown`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Inspectable.d.ts:22

#### Returns

`unknown`

#### Inherited from

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).\[NodeInspectSymbol\]

***

### context()

> `static` **context**(`self`): `Context`\<`InkService`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:41

#### Parameters

##### self

`InkService`

#### Returns

`Context`\<`InkService`\>

#### Inherited from

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).context

***

### of()

> `static` **of**(`self`): `InkService`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:40

#### Parameters

##### self

`InkService`

#### Returns

`InkService`

#### Inherited from

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).of

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

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).pipe

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

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).pipe

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

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).pipe

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

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).pipe

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

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).pipe

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

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).pipe

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

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).pipe

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

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).pipe

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

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).pipe

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

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).pipe

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

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).pipe

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

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).pipe

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

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).pipe

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

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).pipe

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

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).pipe

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

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).pipe

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

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).pipe

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

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).pipe

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

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).pipe

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

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).pipe

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

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).pipe

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

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).pipe

***

### toJSON()

> `static` **toJSON**(): `unknown`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Inspectable.d.ts:21

#### Returns

`unknown`

#### Inherited from

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).toJSON

***

### toString()

> `static` **toString**(): `string`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Inspectable.d.ts:20

#### Returns

`string`

#### Inherited from

Effect.Service\<InkService\>()("app/InkService", \{ effect: Effect.sync( (): InkServiceApi =\> (\{ renderComponent: ( component: React.ReactElement ): Effect.Effect\<void, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance Effect.try(\{ try: () =\> render(component), catch: (err: unknown) =\> new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ), \}), // Use: Wait for component to exit (instance) =\> Effect.tryPromise(\{ try: () =\> instance.waitUntilExit(), catch: (err: unknown) =\> new InkError( "RenderError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount, even on error/interruption (instance) =\> Effect.sync(() =\> \{ if (instance) \{ instance.unmount(); \} \}) ), renderWithResult: \<T\>( component: (onComplete: (value: T) =\> void) =\> React.ReactElement ): Effect.Effect\<T, InkError\> =\> Effect.acquireUseRelease( // Acquire: Create Ink instance and promise with cancellation support Effect.gen(function\* () \{ let resolve: (value: T) =\> void; let reject: (err: unknown) =\> void; let completed = false; let sigintHandler: (() =\> void) \| null = null; const promise = new Promise\<T\>((res, rej) =\> \{ resolve = res; reject = rej; \}); const handleComplete = (value: T) =\> \{ if (!completed) \{ completed = true; // Remove SIGINT handler before resolving if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} resolve(value); \} \}; // Set up cancellation handler for SIGINT (Ctrl+C) sigintHandler = () =\> \{ if (!completed) \{ completed = true; // Remove handler before rejecting if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); sigintHandler = null; \} // Prevent default SIGINT behavior (don't exit immediately) // The error will be handled by the Effect error channel reject( new InkError( "TerminalError", "Operation cancelled by user (Ctrl+C)" ) ); \} \}; // Register SIGINT handler for cancellation // Use prependListener to ensure our handler runs first process.prependListener("SIGINT", sigintHandler); const instance = yield\* Effect.try(\{ try: () =\> render(component(handleComplete)), catch: (err: unknown) =\> \{ // Clean up handler on render error if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} return new InkError( "RenderError", \`Unable to display the interactive component. $\{isError(err) ? err.message : String(err)\}\n\nThis may be due to terminal compatibility issues. Please try again or check your terminal settings.\` ); \}, \}); return \{ instance, promise, completed, sigintHandler \}; \}), // Use: Wait for component to complete (\{ promise \}) =\> Effect.tryPromise(\{ try: () =\> promise, catch: (err: unknown) =\> err instanceof InkError ? err : new InkError( "ComponentError", \`Component execution failed. $\{isError(err) ? err.message : String(err)\}\` ), \}), // Release: ALWAYS unmount and clean up SIGINT handler (\{ instance, sigintHandler \}) =\> Effect.sync(() =\> \{ // Remove SIGINT handler if (sigintHandler) \{ process.removeListener("SIGINT", sigintHandler); \} // Unmount instance if (instance) \{ instance.unmount(); \} \}) ), \}) as const ), \}).toString
