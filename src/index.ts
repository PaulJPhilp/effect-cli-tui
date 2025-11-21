// biome-ignore lint/performance/noBarrelFile: <>
// biome-ignore assist/source/organizeImports: <>
export { EffectCLI } from "./cli";
export {
  applyChalkStyle,
  displayHighlight,
  displayInfo,
  displayListItem,
  displayMuted,
  displayWarning,
} from "./core/colors";
export {
  display,
  displayError,
  displayJson,
  displayLines,
  displayOutput,
  displaySuccess,
} from "./core/display";
// Runtimes
export { runWithCLI, runWithRuntime, runWithTUI } from "./runtime";
export { displayBox, displayPanel } from "./ui/boxes/box";
export { Title } from "./ui/boxes/box-style";
export type { BoxStyle } from "./ui/boxes/box-style";
export type { SpinnerOptions } from "./ui/progress/spinner";
// Progress indicators
export {
  spinnerEffect,
  startSpinner,
  stopSpinner,
  updateSpinner,
} from "./ui/progress/spinner";
export type { TableColumn, TableOptions } from "./ui/tables/table";
// Tables
export { displayTable } from "./ui/tables/table";

// TUI
export { TUIHandler } from "./tui";

// Core types
export type {
  CLIResult,
  CLIRunOptions,
  DisplayOptions,
  DisplayType,
  JsonDisplayOptions,
  PromptOptions,
  SelectOption,
} from "./types";

// Error types
export { CLIError, InkError, TUIError } from "./types";
