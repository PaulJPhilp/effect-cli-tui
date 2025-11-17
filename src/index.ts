// Existing exports

export type { BoxStyle } from "./boxes/box";
// Boxes
export { displayBox, displayPanel } from "./boxes/box";
export { EffectCLI } from "./cli";
export type {
  ConfirmProps,
  InputProps,
  MessageProps,
  MultiSelectProps,
  PasswordProps,
  ProgressBarProps,
  SelectProps,
  SpinnerComponentProps,
} from "./components";
// Ink components exports
export {
  Confirm,
  Input,
  Message,
  MultiSelect,
  Password,
  ProgressBar,
  Select,
  SpinnerComponent,
} from "./components";
// Color and styling exports
export {
  applyChalkStyle,
  displayHighlight,
  displayInfo,
  displayListItem,
  displayMuted,
  displayWarning,
} from "./core/colors";
// Display API exports (convenience wrappers)
export {
  display,
  displayError,
  displayJson,
  displayLines,
  displayOutput,
  displaySuccess,
} from "./core/display";
// Icon constants
export {
  ANSI_CARRIAGE_RETURN,
  ANSI_CARRIAGE_RETURN_CLEAR,
  ANSI_CLEAR_LINE,
  ANSI_HIDE_CURSOR,
  ANSI_SHOW_CURSOR,
  COLOR_DEFAULT,
  COLOR_ERROR,
  COLOR_HIGHLIGHT,
  COLOR_INFO,
  COLOR_SUCCESS,
  COLOR_WARNING,
  DEFAULT_DISPLAY_TYPE,
  EXIT_CODE_SIGINT,
  EXIT_CODE_SIGTERM,
  getDisplayIcon,
  ICON_ERROR,
  ICON_INFO,
  ICON_SUCCESS,
  ICON_WARNING,
  SPINNER_DEFAULT_INTERVAL,
  SPINNER_DEFAULT_TYPE,
  SPINNER_MESSAGE_DONE,
  SPINNER_MESSAGE_FAILED,
  SYMBOL_BULLET,
} from "./core/icons";
// Terminal service export
export { createCustomTerminal, Terminal, TerminalTest } from "./core/terminal";
// Backward compatibility: convenience wrappers
export { renderInkComponent, renderInkWithResult } from "./effects/ink-wrapper";
export type { SpinnerOptions } from "./progress/spinner";
// Progress & Spinners
export {
  spinnerEffect,
  startSpinner,
  stopSpinner,
  updateSpinner,
} from "./progress/spinner";
// Runtime exports
export {
  DisplayRuntime,
  EffectCLIOnlyRuntime,
  EffectCLIRuntime,
  EffectCLITUILayer,
  runWithCLI,
  runWithRuntime,
  runWithTUI,
  TUIHandlerRuntime,
} from "./runtime";
export type { DisplayServiceApi } from "./services/display";
// Display service exports
export { DisplayService } from "./services/display";
export type {
  DisplayOptions,
  DisplayType,
  JsonDisplayOptions,
} from "./services/display/types";
export type { InkServiceApi } from "./services/ink";
// Ink service exports
export { InkService } from "./services/ink";
// Theme service exports
export { createTheme, mergeTheme } from "./services/theme/helpers";
export {
  darkTheme,
  defaultTheme,
  emojiTheme,
  minimalTheme,
  themes,
} from "./services/theme/presets";
export {
  getCurrentTheme,
  setTheme,
  ThemeService,
  withTheme,
} from "./services/theme/service";
export type { PartialTheme, Theme } from "./services/theme/types";
export type { TableColumn, TableOptions } from "./tables/table";
// Tables
export { displayTable } from "./tables/table";
export { TUIHandler } from "./tui";
export type { BorderStyle, DisplayTypeColor } from "./types";
export * from "./types";
