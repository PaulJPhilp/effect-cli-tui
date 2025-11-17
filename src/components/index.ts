/**
 * Ink React components for terminal UI
 *
 * This module exports all interactive Ink components for use with
 * effect-cli-tui's TUIHandler and renderInkWithResult wrapper.
 *
 * @example
 * ```ts
 * import { Input, Select, Confirm } from 'effect-cli-tui/components'
 * import { renderInkWithResult } from 'effect-cli-tui'
 *
 * const program = Effect.gen(function* (_) {
 *   const name = yield* _(
 *     renderInkWithResult<string>((onComplete) =>
 *       <Input message="Name:" onSubmit={onComplete} />
 *     )
 *   )
 *   return name
 * })
 * ```
 */

export { Confirm, type ConfirmProps } from './Confirm'
export { Input, type InputProps } from './Input'
export { Message, type MessageProps } from './Message'
export { MultiSelect, type MultiSelectProps } from './MultiSelect'
export { Password, type PasswordProps } from './Password'
export { ProgressBar, type ProgressBarProps } from './ProgressBar'
export { Select, type SelectProps } from './Select'
export { SpinnerComponent, type SpinnerComponentProps } from './Spinner'
