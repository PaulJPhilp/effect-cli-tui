[**effect-cli-tui**](../../README.md)

***

[effect-cli-tui](../../modules.md) / [services](../README.md) / EffectCLITUILayer

# Variable: EffectCLITUILayer

> `const` **EffectCLITUILayer**: `Layer`\<[`EffectCLI`](../../index/classes/EffectCLI.md) \| [`ThemeService`](../../theme/classes/ThemeService.md) \| [`DisplayService`](../classes/DisplayService.md) \| [`InkService`](../classes/InkService.md) \| [`Terminal`](../classes/Terminal.md) \| [`TUIHandler`](../../index/classes/TUIHandler.md), `never`, `never`\>

Defined in: [Projects/Published/effect-cli-tui/src/runtime.ts:57](https://github.com/PaulJPhilp/effect-cli-tui/blob/aa147251d5ae83d3a9b8e78ec31fb58f1419a00b/src/runtime.ts#L57)

Combined layer providing all CLI/TUI services

This layer includes:
- EffectCLI (command execution)
- TUIHandler (interactive prompts) - automatically includes InkService via dependencies
- DisplayService (display output)
- ThemeService (theme management)
- InkService (React/Ink rendering)
- Terminal (terminal I/O)

TUIHandler declares InkService as a dependency, so InkService.Default is automatically
included when TUIHandler.Default is provided. We explicitly include it here for clarity
and to ensure it's available for other services that might need it directly.
