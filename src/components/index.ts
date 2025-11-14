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

export { Input, type InputProps } from './Input'
export { Select, type SelectProps } from './Select'
export { MultiSelect, type MultiSelectProps } from './MultiSelect'
export { Confirm, type ConfirmProps } from './Confirm'
export { Password, type PasswordProps } from './Password'
export { SpinnerComponent, type SpinnerComponentProps } from './Spinner'
export { ProgressBar, type ProgressBarProps } from './ProgressBar'
export { Message, type MessageProps } from './Message'
