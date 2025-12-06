import { Effect } from "effect";

import { withSlashCommands } from "@/tui-slash-commands";
import { KitRegistryService } from "./registry";
import type { Kit } from "./types";

/**
 * Enable a kit for the duration of an effect
 *
 * @param kit - The kit to enable
 * @param effect - The effect to run with the kit enabled
 * @returns Effect that runs with the kit enabled
 *
 * @example
 * ```ts
 * const program = Effect.gen(function* () {
 *   const tui = yield* TUIHandler
 *   const name = yield* tui.prompt('Name:') // /memkit-add works here
 *   return name
 * })
 *
 * await EffectCLIRuntime.runPromise(
 *   withKit(MemKit, program)
 * )
 * ```
 */
export function withKit<A, E, R>(
  kit: Kit,
  effect: Effect.Effect<A, E, R>
): Effect.Effect<A, E, R> {
  return withSlashCommands(kit.commands, effect);
}

/**
 * Enable multiple kits for the duration of an effect
 *
 * @param kits - Array of kits to enable
 * @param effect - The effect to run with the kits enabled
 * @returns Effect that runs with the kits enabled
 *
 * @example
 * ```ts
 * const program = Effect.gen(function* () {
 *   const tui = yield* TUIHandler
 *   const name = yield* tui.prompt('Name:')
 *   return name
 * })
 *
 * await EffectCLIRuntime.runPromise(
 *   withKits([MemKit, OtherKit], program)
 * )
 * ```
 */
export function withKits<A, E, R>(
  kits: readonly Kit[],
  effect: Effect.Effect<A, E, R>
): Effect.Effect<A, E, R> {
  const allCommands = kits.flatMap((kit) => kit.commands);
  return withSlashCommands(allCommands, effect);
}

/**
 * Enable a kit via the registry (persists to config)
 *
 * @param kitId - The ID of the kit to enable
 * @returns Effect that enables the kit
 *
 * @example
 * ```ts
 * const program = Effect.gen(function* () {
 *   const registry = yield* KitRegistryService
 *   yield* registry.register(MemKit)
 *   yield* enableKit('memkit') // Persists to config
 * })
 * ```
 */
export function enableKit(
  kitId: string
): Effect.Effect<
  void,
  import("./types").KitError,
  import("./registry").KitRegistryService
> {
  return Effect.gen(function* () {
    const registry = yield* KitRegistryService;
    yield* registry.enable(kitId);
  });
}

/**
 * Disable a kit via the registry (persists to config)
 *
 * @param kitId - The ID of the kit to disable
 * @returns Effect that disables the kit
 *
 * @example
 * ```ts
 * const program = Effect.gen(function* () {
 *   yield* disableKit('memkit') // Removes from config
 * })
 * ```
 */
export function disableKit(
  kitId: string
): Effect.Effect<
  void,
  import("./types").KitError,
  import("./registry").KitRegistryService
> {
  return Effect.gen(function* () {
    const registry = yield* KitRegistryService;
    yield* registry.disable(kitId);
  });
}
