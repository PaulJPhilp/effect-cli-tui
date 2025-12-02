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
export {
  runWithCLI,
  runWithRuntime,
  runWithTUI,
  runWithTUIWithSlashCommands,
} from "./runtime";
export {
  DEFAULT_SLASH_COMMANDS,
  DEFAULT_SLASH_COMMAND_REGISTRY,
  addToHistory,
  configureDefaultSlashCommands,
  createEffectCliSlashCommand,
  createSlashCommandRegistry,
  getSessionHistory,
  getSlashCommandHistory,
  getSlashCommandSuggestions,
  getSlashCommandSuggestionsAsync,
  parseSlashCommand,
  setGlobalSlashCommandRegistry,
  withSlashCommands,
} from "./tui-slash-commands";
export type {
  ParsedSlashCommand,
  SessionHistoryEntry,
  SlashCommandContext,
  SlashCommandDefinition,
  SlashCommandRegistry,
  SlashCommandResult,
} from "./tui-slash-commands";
export { displayBox, displayPanel } from "./ui/boxes/box";
export { Title } from "./ui/boxes/box-style";
export type { BoxStyle } from "./ui/boxes/box-style";
// Panels
export {
  KeyValuePanel,
  Panel,
  TablePanel,
  renderKeyValuePanel,
  renderTablePanel,
} from "./ui/panels";
export type {
  KeyValueItem,
  KeyValuePanelProps,
  PanelProps,
  PanelTableColumn,
  TablePanelProps,
  TableRow,
} from "./ui/panels";
// Layout
export { TUILayout } from "./ui/layout/TUILayout";
export type { OutputItem, TUILayoutProps } from "./ui/layout/TUILayout";
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

// Supermemory integration
export * from "./supermemory";

// Kits system
export * from "./kits";

// Agent harness services
export { ApprovalService } from "./services/approval";
export type { OperationKind, OperationSummary } from "./services/approval";
export { ToolCallLogService } from "./services/logs";
export type { ToolCallLogEntry } from "./services/logs";
export { ModeService } from "./services/mode";
export type { Mode } from "./services/mode";

// Utilities
export { makeUnifiedDiff } from "./utils/diff";
export {
  getCurrentBranch,
  getGitRoot,
  getStatusSummary,
  isGitClean,
} from "./utils/git";
export { showOnboardingIfNeeded } from "./utils/onboarding";

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
