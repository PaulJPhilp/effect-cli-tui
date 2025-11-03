# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.6.0] - 2025-11-03

### Added
- **Display API**: New functions for console output (`display`, `displayLines`, `displayJson`, `displaySuccess`, `displayError`)
- **Dual Module Support**: Package now exports both ESM and CommonJS versions
- **TypeScript Strict Mode**: Full support for `noImplicitAny` and strict type checking
- **Comprehensive Tests**: Added tests for all display functions and module imports

### Changed
- **Build System**: Migrated from manual TypeScript compilation to `tsup` for better dual module support
- **Package Exports**: Updated `package.json` with conditional exports for ESM/CommonJS compatibility

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
