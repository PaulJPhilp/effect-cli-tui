[**effect-cli-tui**](../../README.md)

***

[effect-cli-tui](../../modules.md) / [index](../README.md) / EffectCLI

# Class: EffectCLI

Defined in: [Projects/Published/effect-cli-tui/src/cli.ts:10](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/cli.ts#L10)

Service for running and streaming CLI commands.
Uses Effect.Service pattern for dependency injection.

## Extends

- `object` & `object`

## Constructors

### Constructor

> **new EffectCLI**(`_`): `EffectCLI`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:26563

#### Parameters

##### \_

###### run

(`command`, `args`, `options`) => `Effect`\<[`CLIResult`](../../types/interfaces/CLIResult.md), [`CLIError`](../../types/classes/CLIError.md), `never`\> = `...`

Run a CLI command and capture output.

###### stream

(`command`, `args`, `options`) => `Effect`\<`void`, [`CLIError`](../../types/classes/CLIError.md), `never`\> = `...`

Stream a CLI command with inherited stdio.

#### Returns

`EffectCLI`

#### Inherited from

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).constructor

## Properties

### \_tag

> `readonly` **\_tag**: `"app/EffectCLI"`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:26564

#### Inherited from

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).\_tag

***

### run()

> `readonly` **run**: (`command`, `args`, `options`) => `Effect`\<[`CLIResult`](../../types/interfaces/CLIResult.md), [`CLIError`](../../types/classes/CLIError.md), `never`\>

Defined in: [Projects/Published/effect-cli-tui/src/cli.ts:21](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/cli.ts#L21)

Run a CLI command and capture output.

#### Parameters

##### command

`string`

The command to execute

##### args

`string`[] = `[]`

Command arguments

##### options

[`CLIRunOptions`](../../types/interfaces/CLIRunOptions.md) = `{}`

Run options (cwd, env, timeout)

#### Returns

`Effect`\<[`CLIResult`](../../types/interfaces/CLIResult.md), [`CLIError`](../../types/classes/CLIError.md), `never`\>

Effect with CLIResult or CLIError

#### Inherited from

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).run

***

### stream()

> `readonly` **stream**: (`command`, `args`, `options`) => `Effect`\<`void`, [`CLIError`](../../types/classes/CLIError.md), `never`\>

Defined in: [Projects/Published/effect-cli-tui/src/cli.ts:133](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/cli.ts#L133)

Stream a CLI command with inherited stdio.

#### Parameters

##### command

`string`

The command to execute

##### args

`string`[] = `[]`

Command arguments

##### options

[`CLIRunOptions`](../../types/interfaces/CLIRunOptions.md) = `{}`

Run options (cwd, env, timeout)

#### Returns

`Effect`\<`void`, [`CLIError`](../../types/classes/CLIError.md), `never`\>

Effect<void, CLIError>

#### Inherited from

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).stream

***

### \_op

> `readonly` `static` **\_op**: `"Tag"`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:33

#### Inherited from

[`TUIHandler`](TUIHandler.md).[`_op`](TUIHandler.md#_op)

***

### \[ChannelTypeId\]

> `readonly` `static` **\[ChannelTypeId\]**: `VarianceStruct`\<`never`, `unknown`, `never`, `unknown`, `EffectCLI`, `unknown`, `EffectCLI`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Channel.d.ts:108

#### Inherited from

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).\[ChannelTypeId\]

***

### \[EffectTypeId\]

> `readonly` `static` **\[EffectTypeId\]**: `VarianceStruct`\<`EffectCLI`, `never`, `EffectCLI`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:195

#### Inherited from

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).\[EffectTypeId\]

***

### \[ignoreSymbol\]?

> `static` `optional` **\[ignoreSymbol\]**: `TagUnifyIgnore`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:46

#### Inherited from

[`TUIHandler`](TUIHandler.md).[`[ignoreSymbol]`](TUIHandler.md#ignoresymbol)

***

### \[SinkTypeId\]

> `readonly` `static` **\[SinkTypeId\]**: `VarianceStruct`\<`EffectCLI`, `unknown`, `never`, `never`, `EffectCLI`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Sink.d.ts:82

#### Inherited from

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).\[SinkTypeId\]

***

### \[STMTypeId\]

> `readonly` `static` **\[STMTypeId\]**: `object`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/STM.d.ts:136

#### \_A

> `readonly` **\_A**: `Covariant`\<`EffectCLI`\>

#### \_E

> `readonly` **\_E**: `Covariant`\<`never`\>

#### \_R

> `readonly` **\_R**: `Covariant`\<`EffectCLI`\>

#### Inherited from

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).\[STMTypeId\]

***

### \[StreamTypeId\]

> `readonly` `static` **\[StreamTypeId\]**: `VarianceStruct`\<`EffectCLI`, `never`, `EffectCLI`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Stream.d.ts:111

#### Inherited from

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).\[StreamTypeId\]

***

### \[TagTypeId\]

> `readonly` `static` **\[TagTypeId\]**: `object`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:36

#### \_Identifier

> `readonly` **\_Identifier**: `Invariant`\<`EffectCLI`\>

#### \_Service

> `readonly` **\_Service**: `Invariant`\<`EffectCLI`\>

#### Inherited from

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).\[TagTypeId\]

***

### \[typeSymbol\]?

> `static` `optional` **\[typeSymbol\]**: `unknown`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:44

#### Inherited from

[`TUIHandler`](TUIHandler.md).[`[typeSymbol]`](TUIHandler.md#typesymbol)

***

### \[unifySymbol\]?

> `static` `optional` **\[unifySymbol\]**: `TagUnify`\<`Class`\<`EffectCLI`, `"app/EffectCLI"`, \{ `effect`: `Effect`\<\{ `run`: (`command`, `args`, `options`) => `Effect`\<[`CLIResult`](../../types/interfaces/CLIResult.md), [`CLIError`](../../types/classes/CLIError.md), `never`\>; `stream`: (`command`, `args`, `options`) => `Effect`\<`void`, [`CLIError`](../../types/classes/CLIError.md), `never`\>; \}, `never`, `never`\>; \}\>\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:45

#### Inherited from

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).\[unifySymbol\]

***

### Default

> `readonly` `static` **Default**: `Layer`\<`EffectCLI`, `never`, `never`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:26571

#### Inherited from

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).Default

***

### Identifier

> `readonly` `static` **Identifier**: `EffectCLI`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:35

#### Inherited from

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).Identifier

***

### key

> `readonly` `static` **key**: `"app/EffectCLI"`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:43

#### Inherited from

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).key

***

### make()

> `readonly` `static` **make**: (`_`) => `EffectCLI`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:26567

#### Parameters

##### \_

###### run

(`command`, `args`, `options`) => `Effect`\<[`CLIResult`](../../types/interfaces/CLIResult.md), [`CLIError`](../../types/classes/CLIError.md), `never`\> = `...`

Run a CLI command and capture output.

###### stream

(`command`, `args`, `options`) => `Effect`\<`void`, [`CLIError`](../../types/classes/CLIError.md), `never`\> = `...`

Stream a CLI command with inherited stdio.

#### Returns

`EffectCLI`

#### Inherited from

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).make

***

### Service

> `readonly` `static` **Service**: `EffectCLI`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:34

#### Inherited from

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).Service

***

### stack?

> `readonly` `static` `optional` **stack**: `string`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:42

#### Inherited from

[`TUIHandler`](TUIHandler.md).[`stack`](TUIHandler.md#stack)

***

### use()

> `readonly` `static` **use**: \<`X`\>(`body`) => \[`X`\] *extends* \[`Effect`\<`A`, `E`, `R`\>\] ? `Effect`\<`A`, `E`, `EffectCLI` \| `R`\> : \[`X`\] *extends* \[`PromiseLike`\<`A`\>\] ? `Effect`\<`A`, `UnknownException`, `EffectCLI`\> : `Effect`\<`X`, `never`, `EffectCLI`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:26566

#### Type Parameters

##### X

`X`

#### Parameters

##### body

(`_`) => `X`

#### Returns

\[`X`\] *extends* \[`Effect`\<`A`, `E`, `R`\>\] ? `Effect`\<`A`, `E`, `EffectCLI` \| `R`\> : \[`X`\] *extends* \[`PromiseLike`\<`A`\>\] ? `Effect`\<`A`, `UnknownException`, `EffectCLI`\> : `Effect`\<`X`, `never`, `EffectCLI`\>

#### Inherited from

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).use

## Methods

### \[iterator\]()

> `static` **\[iterator\]**(): `EffectGenerator`\<`Tag`\<`EffectCLI`, `EffectCLI`\>\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Effect.d.ts:137

#### Returns

`EffectGenerator`\<`Tag`\<`EffectCLI`, `EffectCLI`\>\>

#### Inherited from

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).\[iterator\]

***

### \[NodeInspectSymbol\]()

> `static` **\[NodeInspectSymbol\]**(): `unknown`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Inspectable.d.ts:22

#### Returns

`unknown`

#### Inherited from

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).\[NodeInspectSymbol\]

***

### context()

> `static` **context**(`self`): `Context`\<`EffectCLI`\>

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:41

#### Parameters

##### self

`EffectCLI`

#### Returns

`Context`\<`EffectCLI`\>

#### Inherited from

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).context

***

### of()

> `static` **of**(`self`): `EffectCLI`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Context.d.ts:40

#### Parameters

##### self

`EffectCLI`

#### Returns

`EffectCLI`

#### Inherited from

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).of

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

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).pipe

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

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).pipe

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

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).pipe

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

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).pipe

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

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).pipe

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

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).pipe

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

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).pipe

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

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).pipe

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

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).pipe

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

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).pipe

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

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).pipe

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

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).pipe

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

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).pipe

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

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).pipe

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

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).pipe

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

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).pipe

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

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).pipe

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

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).pipe

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

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).pipe

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

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).pipe

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

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).pipe

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

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).pipe

***

### toJSON()

> `static` **toJSON**(): `unknown`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Inspectable.d.ts:21

#### Returns

`unknown`

#### Inherited from

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).toJSON

***

### toString()

> `static` **toString**(): `string`

Defined in: Projects/Published/effect-cli-tui/node\_modules/.pnpm/effect@3.19.4/node\_modules/effect/dist/dts/Inspectable.d.ts:20

#### Returns

`string`

#### Inherited from

Effect.Service\<EffectCLI\>()("app/EffectCLI", \{ effect: Effect.sync( () =\> (\{ /\*\* \* Run a CLI command and capture output. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect with CLIResult or CLIError \*/ run: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<CLIResult, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let stdout = ""; let stderr = ""; let hasResumed = false; const safeResume = (effect: Effect.Effect\<CLIResult, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: \["pipe", "pipe", "pipe"\], \}); if (!(child.stdout && child.stderr)) \{ safeResume( Effect.fail( new CLIError( "NotFound", "Unable to start the command. Please check that the command is available and try again." ) ) ); return; \} child.stdout.on("data", (data: Buffer) =\> \{ stdout += data.toString(); \}); child.stderr.on("data", (data: Buffer) =\> \{ stderr += data.toString(); \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume( Effect.succeed(\{ exitCode: exitCode ?? 0, stdout, stderr \}) ); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed (exit code $\{exitCode\}).\n\nError details:\n$\{stderr \|\| "No error details available"\}\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), /\*\* \* Stream a CLI command with inherited stdio. \* @param command - The command to execute \* @param args - Command arguments \* @param options - Run options (cwd, env, timeout) \* @returns Effect\<void, CLIError\> \*/ stream: ( command: string, args: string\[\] = \[\], options: CLIRunOptions = \{\} ) =\> Effect.async\<void, CLIError\>((resume) =\> \{ const cwd = options.cwd \|\| process.cwd(); let hasResumed = false; const safeResume = (effect: Effect.Effect\<void, CLIError\>) =\> \{ if (!hasResumed) \{ hasResumed = true; resume(effect); \} \}; const child = spawn(command, args, \{ cwd, env: \{ ...process.env, ...options.env \}, stdio: "inherit", \}); const timeout = options.timeout ? (() =\> \{ const timeoutMs = options.timeout; return setTimeout(() =\> \{ child.kill(); safeResume( Effect.fail( new CLIError( "Timeout", \`The command took too long to complete (timeout: $\{Math.round(timeoutMs / 1000)\}s). Please try again or increase the timeout.\` ) ) ); \}, timeoutMs); \})() : null; child.on("close", (exitCode) =\> \{ if (timeout) clearTimeout(timeout); if (exitCode === 0) \{ safeResume(Effect.succeed(undefined)); \} else \{ safeResume( Effect.fail( new CLIError( "CommandFailed", \`The command failed with exit code $\{exitCode\}. Please check the command output above for details.\`, exitCode ?? undefined ) ) ); \} \}); child.on("error", (err) =\> \{ if (timeout) clearTimeout(timeout); if (isErrnoException(err) && err.code === "ENOENT") \{ safeResume( Effect.fail( new CLIError( "NotFound", \`The command "$\{command\}" was not found. Please verify it is installed and available in your PATH.\` ) ) ); \} else \{ safeResume( Effect.fail( new CLIError( "ExecutionError", \`Unable to execute the command: $\{isError(err) ? err.message : String(err)\}\n\nPlease verify the command is installed and accessible in your PATH.\` ) ) ); \} \}); \}), \}) as const ), \}).toString
