// This file is the entry point for the theme system.
/** biome-ignore-all assist/source/organizeImports: <> */
export { createTheme, mergeTheme } from "./services/theme/helpers";
export {
  darkTheme,
  defaultTheme,
  emojiTheme,
  minimalTheme,
  themes,
} from "./services/theme/presets";
export {
  ThemeService,
  getCurrentTheme,
  setTheme,
  withTheme,
} from "./services/theme/service";
export type { PartialTheme, Theme } from "./services/theme/types";
