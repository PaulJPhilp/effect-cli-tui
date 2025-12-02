import { Effect, Ref } from "effect";

/**
 * Mode type for agent harness behavior
 */
export type Mode = "default" | "architect" | "executor" | "explorer";

/**
 * Mode Service API
 *
 * Manages the current operational mode of the agent harness.
 * Different modes may influence command behavior and preferences.
 */
export interface ModeServiceApi {
  /**
   * Get the current mode
   */
  getMode: Effect.Effect<Mode>;

  /**
   * Set the current mode
   *
   * @param mode - The mode to set
   */
  setMode: (mode: Mode) => Effect.Effect<void>;

  /**
   * List all available modes
   */
  listModes: Effect.Effect<readonly Mode[]>;
}

/**
 * Available modes
 */
const AVAILABLE_MODES: readonly Mode[] = [
  "default",
  "architect",
  "executor",
  "explorer",
] as const;

/**
 * Mode Service
 *
 * Manages the current operational mode using a Ref for state.
 */
export class ModeService extends Effect.Service<ModeService>()(
  "app/ModeService",
  {
    effect: Effect.gen(function* () {
      const modeRef = yield* Ref.make<Mode>("default");

      return {
        getMode: Ref.get(modeRef),

        setMode: (mode: Mode): Effect.Effect<void> =>
          Effect.gen(function* () {
            // Validate mode - this should never fail if called correctly
            if (!AVAILABLE_MODES.includes(mode)) {
              // This is a programming error, not a runtime error
              throw new Error(
                `Invalid mode: ${mode}. Available: ${AVAILABLE_MODES.join(", ")}`
              );
            }
            yield* Ref.set(modeRef, mode);
          }),

        listModes: Effect.sync(() => [...AVAILABLE_MODES]),
      } as const satisfies ModeServiceApi;
    }),
    dependencies: [],
  }
) {}
