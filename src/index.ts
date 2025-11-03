// Existing exports
export { EffectCLI } from './cli'
export { TUIHandler } from './tui'
export * from './types'

// Effects exports
export { renderInkComponent, renderInkWithResult, InkError } from './effects/ink-wrapper'

// Display API exports (enhanced with styling support)
export {
    display,
    displayLines,
    displayJson,
    displaySuccess,
    displayError,
    displayOutput
} from './core/display'

// Color and styling exports
export {
    applyChalkStyle,
    displayHighlight,
    displayMuted,
    displayWarning,
    displayInfo,
    displayListItem
} from './core/colors'

// Tables
export type { TableColumn, TableOptions } from './tables/table';
export { displayTable } from './tables/table';

// Boxes
export type { BoxStyle } from './boxes/box';
export { displayBox, displayPanel } from './boxes/box';

// Progress & Spinners
export type { SpinnerOptions } from './progress/spinner';
export { spinnerEffect, startSpinner, updateSpinner, stopSpinner } from './progress/spinner';
