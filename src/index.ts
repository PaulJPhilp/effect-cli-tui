// Existing exports
export { EffectCLI } from "./cli";
export { TUIHandler } from "./tui";
export * from "./types";
export type { DisplayTypeColor } from "./types";

// Terminal service export
export { Terminal, TerminalTest, createCustomTerminal } from "./core/terminal";

// Ink service exports
export { InkService } from "./services/ink";
export type { InkServiceApi } from "./services/ink";

// Backward compatibility: convenience wrappers
export { renderInkComponent, renderInkWithResult } from "./effects/ink-wrapper";

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

// Display service exports
export { DisplayService } from "./services/display";
export type { DisplayServiceApi } from "./services/display";
export type {
  DisplayOptions,
  DisplayType,
  JsonDisplayOptions,
} from "./services/display/types";

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
  ThemeService,
  getCurrentTheme,
  setTheme,
  withTheme,
} from "./services/theme/service";
export type { PartialTheme, Theme } from "./services/theme/types";

// Display API exports (convenience wrappers)
export {
  display,
  displayError,
  displayJson,
  displayLines,
  displayOutput,
  displaySuccess,
} from "./core/display";

// Color and styling exports
export {
  applyChalkStyle,
  displayHighlight,
  displayInfo,
  displayListItem,
  displayMuted,
  displayWarning,
} from "./core/colors";

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
  ICON_ERROR,
  ICON_INFO,
  ICON_SUCCESS,
  ICON_WARNING,
  SPINNER_DEFAULT_INTERVAL,
  SPINNER_DEFAULT_TYPE,
  SPINNER_MESSAGE_DONE,
  SPINNER_MESSAGE_FAILED,
  SYMBOL_BULLET,
  getDisplayIcon,
} from "./core/icons";

// Tables
export { displayTable } from "./tables/table";
export type { TableColumn, TableOptions } from "./tables/table";

// Boxes
export { displayBox, displayPanel } from "./boxes/box";
export type { BoxStyle } from "./boxes/box";
export type { BorderStyle } from "./types";

// Progress & Spinners
export {
  spinnerEffect,
  startSpinner,
  stopSpinner,
  updateSpinner,
} from "./progress/spinner";
export type { SpinnerOptions } from "./progress/spinner";

// Runtime exports
export {
  DisplayRuntime,
  EffectCLIOnlyRuntime,
  EffectCLIRuntime,
  EffectCLITUILayer,
  TUIHandlerRuntime,
  runWithCLI,
  runWithRuntime,
  runWithTUI,
} from "./runtime";
