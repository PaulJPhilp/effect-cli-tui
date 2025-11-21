# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.1] - 2025-11-21

### 🐛 Fixed

- **Prompt Tests**: Fixed test mocking by importing mocked functions directly from `@inquirer/prompts` module
- **Variable Shadowing**: Resolved linting errors by renaming validator function parameters to avoid shadowing imported functions
- **Regex Performance**: Moved regex patterns to top-level scope to avoid recreation on each function call
- **Empty Blocks**: Fixed linting errors for empty block statements in test files
- **Non-null Assertions**: Replaced non-null assertions with explicit null checks for better type safety
- **Async Functions**: Removed unnecessary `async` keywords from functions without `await` expressions
- **Test Configuration**: Removed missing setup file reference from vitest configs

### 🧪 Testing

- All 800 tests now passing (761 in main suite + 5 real CLI tests run separately with `test:real-cli`)
- Fixed prompt test suite - all 48 prompt tests passing
- Updated test configurations to properly exclude real CLI execution tests from main suite

## [2.0.0] - 2025-11-14

### 🎉 Major Release: Ink-Based Interactive Terminal UI

This is a **major breaking release** with significant architectural and UI framework changes. See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for detailed upgrade instructions.

### ✨ Added

#### Ink Components (React for Terminal)

- **Input.tsx** - Text input with validation and error feedback
- **Select.tsx** - Single-select list with keyboard navigation
- **MultiSelect.tsx** - Multi-select with checkbox interface
- **Confirm.tsx** - Yes/No confirmation dialog with smart defaults
- **Password.tsx** - Masked password input field
- **Spinner.tsx** - Animated loading indicator using ink-spinner
- **ProgressBar.tsx** - Visual progress indicator with percentage
- **Message.tsx** - Styled message display with type-based icons

#### Effect Integration

- `renderInkComponent()` - Wrap Ink components in Effect for composition
- `renderInkWithResult<T>()` - Component with callback-based result handling
- `InkError` - Tagged error type for Ink rendering failures
- Proper resource management with try-finally cleanup

#### Architecture

- **Effect.Service Pattern** - Modern dependency injection for TUIHandler and EffectCLI
- `TUIHandler.Default` layer for service provisioning
- Full Effect.gen() composition support
- Type-safe error handling with catchTag

#### Testing

- **ink-testing-library** integration for component testing
- 43+ test cases across 5 component test files
- Updated test fixtures with proper TUIError types
- Mock layers for TUIHandler and EffectCLI

#### Documentation & Examples

- **MIGRATION_GUIDE.md** - Comprehensive v1.x → v2.0.0 upgrade guide
- **examples/basic-prompts.ts** - User registration workflow
- **examples/progress-demo.ts** - Spinner and progress indicators
- **examples/multi-step-wizard.ts** - Complex multi-step form example
- Full JSDoc documentation for all components

#### Build Configuration

- JSX/TSX support in TypeScript (react-jsx mode)
- esbuild JSX transformation in tsup
- Vitest JSX configuration
- ESLint with React and JSX rules

### 🔄 Changed

#### Breaking Changes

**Service Instantiation**

- ❌ `const tui = new TUIHandler()` → ✅ `const tui = yield* TUIHandler`
- ❌ Direct instantiation → ✅ Dependency injection via Effect.provide()

**Interactive Prompts**

- ❌ `promptInput()`, `promptChoice()`, etc. (standalone functions)
- ✅ Ink components via `renderInkWithResult<T>()`
- ✅ Components integrated into TUIHandler methods

**Progress Indicators**

- ❌ `startSpinner()` / `stopSpinner()` (global state)
- ✅ `renderInkComponent(<Spinner />)` (composable)

**Dependencies Removed**

- Removed `@inquirer/prompts` - replaced with Ink components
- Removed `cli-spinners` - replaced with ink-spinner
- Removed global spinner state management

#### API Changes

- `TUIHandler.prompt()` - Now returns Ink-based component effect
- `TUIHandler.selectOption()` - Uses Select component
- `TUIHandler.multiSelect()` - Uses MultiSelect component
- `TUIHandler.confirm()` - Uses Confirm component
- `TUIHandler.password()` - Uses Password component

#### Version Update

- Package version bumped to 2.0.0
- Effect 3.9+ pattern adoption

### 🐛 Fixed

- Global spinner state management eliminated
- Resource cleanup guaranteed with try-finally
- Proper async handling in Ink wrappers
- **Critical**: Fixed timeout double-resume race condition in `EffectCLI.run()` and `EffectCLI.stream()` methods
- Fixed TypeScript compilation errors in CLI service
- Fixed all linting errors (unused imports, unsafe `any` usage, generator without yield)
- Improved type safety in theme-related display functions

### 📦 Dependencies

**Added:**

- `ink` ^4.4.1 - React renderer for terminal
- `react` ^18.3.1 - React library
- `ink-spinner` ^5.0.0 - Spinner component
- `ink-text-input` ^5.0.0 - Text input component
- `ink-select-input` ^6.0.0 - Select component
- `pastel` ^3.0.0 - Color support
- `ink-testing-library` ^4.0.0 (dev) - Component testing

**Removed:**

- `@inquirer/prompts` - Replaced with Ink components
- `cli-spinners` - Replaced with ink-spinner

### 📚 Documentation

- New comprehensive MIGRATION_GUIDE.md with before/after examples
- Full JSDoc on all exported functions and components
- 3 complete example workflows

### 🧪 Testing

- Added 43+ test cases with ink-testing-library
- Component tests for: Input, Select, MultiSelect, Confirm, Password, Spinner, ProgressBar, Message
- Updated mock fixtures with proper error handling
- All tests use Effect service pattern

### ⚠️ Deprecation Notes

- Standalone `promptInput`, `promptChoice` functions deprecated (use TUIHandler methods instead)
- Manual spinner management deprecated (use Spinner component)
- Old test patterns with `new` instantiation deprecated

### 🎯 Migration Path

Users upgrading from v1.x should:

1. Review MIGRATION_GUIDE.md for detailed steps
2. Update service instantiation to use Effect.provide()
3. Replace prompt function calls with Ink components
4. Update tests to use mock layers
5. Review examples for workflow patterns

---

## [0.6.0] - 2025-11-03

### Added

- **Display API**: New functions for console output (`display`, `displayLines`, `displayJson`, `displaySuccess`, `displayError`)
- **ESM-Native**: Pure ES modules for tree-shaking and optimal bundling
- **TypeScript Strict Mode**: Full support for `noImplicitAny` and strict type checking
- **Comprehensive Tests**: Added tests for all display functions and module imports

### Changed

- **Build System**: Migrated from manual TypeScript compilation to `tsup` for ESM-only output
- **Package Exports**: Updated `package.json` for ESM-native configuration

### Technical Improvements

- Added `tsup.config.ts` for unified build process
- Separate tsconfig files for different build targets
- Enhanced type definitions for display utilities

## [0.5.0] - 2024-10-XX

### Added

- Initial release with TUIHandler and EffectCLI
- Interactive prompts using @inquirer/prompts
- CLI command execution with Effect integration
- Basic error handling and types

### Features

- Text input prompts
- Selection dialogs (single and multi-select)
- Confirmation prompts
- Command execution with output capture
- Streaming command execution
