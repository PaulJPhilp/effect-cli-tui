/**
 * Effect Runtime for effect-cli-tui
 *
 * Provides a pre-configured ManagedRuntime with all services (TUIHandler, EffectCLI, DisplayService, etc.)
 * This simplifies usage by eliminating the need to manually provide layers.
 *
 * @example
 * ```ts
 * import { EffectCLIRuntime } from 'effect-cli-tui'
 *
 * const program = Effect.gen(function* () {
 *   const cli = yield* EffectCLI
 *   const result = yield* cli.run('echo', ['hello'])
 *   return result
 * })
 *
 * await EffectCLIRuntime.runPromise(program)
 * ```
 *
 * @example
 * ```ts
 * import { TUIHandlerRuntime } from 'effect-cli-tui'
 *
 * const program = Effect.gen(function* () {
 *   const tui = yield* TUIHandler
 *   const name = yield* tui.prompt('Enter your name:')
 *   return name
 * })
 *
 * await TUIHandlerRuntime.runPromise(program)
 * ```
 */

import { type Effect, Layer, ManagedRuntime } from "effect";
import { EffectCLI } from "./cli";
import { Terminal } from "./core/terminal";
import { ApprovalService } from "./services/approval";
import { DisplayService } from "./services/display";
import { InkService } from "./services/ink";
import { ToolCallLogService } from "./services/logs";
import { ModeService } from "./services/mode";
import { ThemeService } from "./services/theme/service";
import { TUIHandler } from "./tui";
import type { SlashCommandDefinition } from "./tui-slash-commands";
import { withSlashCommands } from "./tui-slash-commands";

/**
 * Combined layer providing all CLI/TUI services
 *
 * This layer includes:
 * - EffectCLI (command execution)
 * - TUIHandler (interactive prompts) - automatically includes InkService via dependencies
 * - DisplayService (display output)
 * - ThemeService (theme management)
 * - InkService (React/Ink rendering)
 * - Terminal (terminal I/O)
 * - ApprovalService (safety layer for operations)
 * - ModeService (mode management)
 * - ToolCallLogService (tool call history)
 *
 * TUIHandler declares InkService as a dependency, so InkService.Default is automatically
 * included when TUIHandler.Default is provided. We explicitly include it here for clarity
 * and to ensure it's available for other services that might need it directly.
 */
export const EffectCLITUILayer = Layer.mergeAll(
  EffectCLI.Default,
  InkService.Default, // Explicitly included (also provided via TUIHandler dependencies)
  TUIHandler.Default, // Automatically includes InkService via dependencies
  DisplayService.Default,
  ThemeService.Default,
  Terminal.Default,
  ApprovalService.Default, // Safety layer
  ModeService.Default, // Mode management
  ToolCallLogService.Default // Tool call logging
);

/**
 * ManagedRuntime with all CLI/TUI services
 *
 * Use this runtime to execute effects that require any of the CLI/TUI services.
 * The runtime manages the lifecycle of all services automatically.
 *
 * @example
 * ```ts
 * const program = Effect.gen(function* () {
 *   const cli = yield* EffectCLI
 *   const tui = yield* TUIHandler
 *   const result = yield* cli.run('build')
 *   yield* tui.display('Build complete!', 'success')
 *   return result
 * })
 *
 * await EffectCLIRuntime.runPromise(program)
 * await EffectCLIRuntime.dispose() // Clean up resources
 * ```
 */
export const EffectCLIRuntime = ManagedRuntime.make(
  EffectCLITUILayer as Layer.Layer<
    | EffectCLI
    | InkService
    | TUIHandler
    | DisplayService
    | ThemeService
    | Terminal
    | ApprovalService
    | ModeService
    | ToolCallLogService,
    never,
    never
  >
);

/**
 * Runtime with only TUIHandler and its dependencies
 *
 * Use this when you only need interactive prompts and display.
 *
 * @example
 * ```ts
 * const program = Effect.gen(function* () {
 *   const tui = yield* TUIHandler
 *   const name = yield* tui.prompt('Name:')
 *   yield* tui.display(`Hello, ${name}!`, 'success')
 * })
 *
 * await TUIHandlerRuntime.runPromise(program)
 * ```
 */
export const TUIHandlerRuntime = ManagedRuntime.make(
  Layer.mergeAll(
    TUIHandler.Default,
    DisplayService.Default,
    InkService.Default,
    ThemeService.Default,
    Terminal.Default,
    ApprovalService.Default,
    ModeService.Default,
    ToolCallLogService.Default
  )
);

/**
 * Runtime with only EffectCLI
 *
 * Use this when you only need command execution.
 *
 * @example
 * ```ts
 * const program = Effect.gen(function* () {
 *   const cli = yield* EffectCLI
 *   const result = yield* cli.run('npm', ['install'])
 *   return result
 * })
 *
 * await EffectCLIRuntime.runPromise(program)
 * ```
 */
export const EffectCLIOnlyRuntime = ManagedRuntime.make<EffectCLI, never>(
  EffectCLI.Default as Layer.Layer<EffectCLI, never, never>
);

/**
 * Runtime with only DisplayService
 *
 * Use this when you only need display output utilities.
 *
 * @example
 * ```ts
 * import { display, displaySuccess } from 'effect-cli-tui'
 *
 * const program = Effect.gen(function* () {
 *   yield* display('Processing...')
 *   yield* displaySuccess('Complete!')
 * })
 *
 * await DisplayRuntime.runPromise(program)
 * ```
 */
export const DisplayRuntime = ManagedRuntime.make(
  Layer.mergeAll(DisplayService.Default, ThemeService.Default)
);

/**
 * Convenience function to run an effect with the full CLI/TUI runtime
 *
 * This is a shortcut for `EffectCLIRuntime.runPromise(effect)`.
 * Automatically disposes the runtime after execution.
 *
 * @example
 * ```ts
 * const program = Effect.gen(function* () {
 *   const cli = yield* EffectCLI
 *   return yield* cli.run('echo', ['hello'])
 * })
 *
 * const result = await runWithRuntime(program)
 * ```
 */
export async function runWithRuntime<A, E>(
  effect: Effect.Effect<
    A,
    E,
    EffectCLI | TUIHandler | DisplayService | InkService | Terminal
  >
): Promise<A> {
  try {
    return await EffectCLIRuntime.runPromise(effect);
  } finally {
    await EffectCLIRuntime.dispose();
  }
}

/**
 * Convenience function to run an effect with TUIHandler runtime
 *
 * Automatically disposes the runtime after execution.
 *
 * @example
 * ```ts
 * const program = Effect.gen(function* () {
 *   const tui = yield* TUIHandler
 *   return yield* tui.prompt('Name:')
 * })
 *
 * const name = await runWithTUI(program)
 * ```
 */
export async function runWithTUI<A, E>(
  effect: Effect.Effect<
    A,
    E,
    TUIHandler | DisplayService | InkService | Terminal
  >
): Promise<A> {
  try {
    return await TUIHandlerRuntime.runPromise(effect);
  } finally {
    await TUIHandlerRuntime.dispose();
  }
}

/**
 * Convenience function to run an effect with TUIHandler runtime and a custom
 * slash-command registry.
 *
 * This helper temporarily configures the global slash-command registry for the
 * duration of the provided Effect, restoring the previous registry afterwards.
 */
export function runWithTUIWithSlashCommands<A, E>(
  effect: Effect.Effect<
    A,
    E,
    TUIHandler | DisplayService | InkService | Terminal
  >,
  commands: readonly SlashCommandDefinition[]
): Promise<A> {
  return runWithTUI(withSlashCommands(commands, effect));
}

/**
 * Convenience function to run an effect with EffectCLI runtime
 *
 * Automatically disposes the runtime after execution.
 *
 * @example
 * ```ts
 * const program = Effect.gen(function* () {
 *   const cli = yield* EffectCLI
 *   return yield* cli.run('build')
 * })
 *
 * const result = await runWithCLI(program)
 * ```
 */
export async function runWithCLI<A, E>(
  effect: Effect.Effect<A, E, EffectCLI>
): Promise<A> {
  try {
    return await EffectCLIOnlyRuntime.runPromise(effect);
  } finally {
    await EffectCLIOnlyRuntime.dispose();
  }
}
