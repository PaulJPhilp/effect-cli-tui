// biome-ignore assist/source/organizeImports: <>
import type { Kit } from "./types";
export { KitConfigError, loadKitConfig, saveKitConfig } from "./config";
export { MemKit } from "./memkit";
export { KitRegistryService } from "./registry";
export { disableKit, enableKit, withKit, withKits } from "./runtime";
export {
  KitError,
  type Kit,
  type KitConfig,
  type KitRegistry,
} from "./types";

/**
 * Helper function to create a kit
 *
 * @param id - Unique identifier for the kit
 * @param name - Display name of the kit
 * @param description - Description of what the kit provides
 * @param version - Version string (e.g., "1.0.0")
 * @param commands - Array of slash command definitions
 * @returns A Kit object
 *
 * @example
 * ```ts
 * const myKit = createKit('my-kit', 'My Kit', '1.0.0', 'Description', commands)
 * ```
 */
// biome-ignore lint/nursery/useMaxParams: public API with distinct parameters, changing to options object would be breaking
export function createKit(
  id: string,
  name: string,
  version: string,
  description: string,
  commands: readonly import("../tui-slash-commands").SlashCommandDefinition[]
): Kit {
  return {
    id,
    name,
    description,
    version,
    commands,
  };
}
