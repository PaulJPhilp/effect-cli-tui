import { KitRegistryService } from "@kits/registry";
import { InkService } from "@services/ink";
import { ToolCallLogService } from "@services/logs";
import { ModeService } from "@services/mode";
import { defaultTheme } from "@services/theme/presets";
import { ThemeService } from "@services/theme/service";
import {
  type AddDocumentOptions,
  SupermemoryClientService,
} from "@supermemory/client";
import { Effect, Layer } from "effect";
import { EffectCLI } from "@/cli";
import { TUIHandler } from "@/tui";
import { CLIError, type CLIResult, type SelectOption, TUIError } from "@/types";

/**
 * Mock layer for EffectCLI service.
 * Returns successful dummy results without actually spawning processes.
 */
export const MockCLI = Layer.succeed(
  EffectCLI,
  EffectCLI.of({
    run: (): Effect.Effect<CLIResult, CLIError> =>
      Effect.succeed({
        exitCode: 0,
        stdout: "Mock command executed successfully",
        stderr: "",
      }),

    stream: (): Effect.Effect<void, CLIError> => Effect.void,
  } as unknown as EffectCLI)
);

/**
 * Helper to create a custom Mock CLI layer with specific results
 */
export const createMockCLI = (response: Partial<CLIResult>) =>
  Layer.succeed(
    EffectCLI,
    EffectCLI.of({
      run: (): Effect.Effect<CLIResult, CLIError> =>
        Effect.succeed({
          exitCode: 0,
          stdout: "",
          stderr: "",
          ...response,
        } as CLIResult),

      stream: (): Effect.Effect<void, CLIError> => Effect.void,
    } as unknown as EffectCLI)
  );

/**
 * Mock layer for EffectCLI that simulates command failures
 */
export const MockCLIFailure = Layer.succeed(
  EffectCLI,
  EffectCLI.of({
    run: (): Effect.Effect<CLIResult, CLIError> =>
      Effect.fail(
        new CLIError(
          "CommandFailed",
          "Mock command failed with exit code 1.\nError output"
        )
      ),

    stream: (): Effect.Effect<void, CLIError> =>
      Effect.fail(new CLIError("CommandFailed", "Mock stream command failed")),
  } as unknown as EffectCLI)
);

/**
 * Mock layer for EffectCLI that simulates command timeout
 */
export const MockCLITimeout = Layer.succeed(
  EffectCLI,
  EffectCLI.of({
    run: (): Effect.Effect<CLIResult, CLIError> =>
      Effect.fail(new CLIError("Timeout", "Command timed out after 1000ms")),
    stream: (): Effect.Effect<void, CLIError> =>
      Effect.fail(new CLIError("Timeout", "Stream timed out")),
  } as unknown as EffectCLI)
);

/**
 * Mock layer for TUIHandler service.
 * Provides in-memory mocking of all prompts without actual terminal interaction.
 */
export const MockTUI = Layer.succeed(
  TUIHandler,
  TUIHandler.of({
    display: (_message: string): Effect.Effect<void> => Effect.void,

    prompt: (_message: string): Effect.Effect<string> =>
      Effect.succeed("mock-input"),

    selectOption: (
      _message: string,
      choices: string[] | SelectOption[]
    ): Effect.Effect<string> => {
      const first = choices[0];
      const value = typeof first === "string" ? first : first?.value;
      return Effect.succeed(value ?? "default-choice");
    },

    multiSelect: (
      _message: string,
      choices: string[] | SelectOption[]
    ): Effect.Effect<string[]> => {
      const all = choices.map((c) => (typeof c === "string" ? c : c.value));
      return Effect.succeed(all);
    },

    confirm: (_message: string): Effect.Effect<boolean> => Effect.succeed(true),

    password: (_message: string): Effect.Effect<string> =>
      Effect.succeed("mock-password-12345"),
  } as unknown as TUIHandler)
).pipe(Layer.provide(InkService.Default));

/**
 * Helper to create a custom Mock TUI layer with specific responses
 */
export const createMockTUI = (responses: {
  prompt?: string;
  selectOption?: string;
  multiSelect?: string[];
  confirm?: boolean;
  password?: string;
}) =>
  Layer.succeed(
    TUIHandler,
    TUIHandler.of({
      display: (_message: string): Effect.Effect<void> => Effect.void,

      prompt: (_message: string): Effect.Effect<string> =>
        Effect.succeed(responses.prompt ?? "mock-input"),

      selectOption: (
        _message: string,
        choices: string[] | SelectOption[]
      ): Effect.Effect<string> => {
        if (responses.selectOption) {
          return Effect.succeed(responses.selectOption);
        }
        const first = choices[0];
        const value = typeof first === "string" ? first : first?.value;
        return Effect.succeed(value ?? "default-choice");
      },

      multiSelect: (
        _message: string,
        choices: string[] | SelectOption[]
      ): Effect.Effect<string[]> => {
        if (responses.multiSelect) {
          return Effect.succeed(responses.multiSelect);
        }
        const all = choices.map((c) => (typeof c === "string" ? c : c.value));
        return Effect.succeed(all);
      },

      confirm: (_message: string): Effect.Effect<boolean> =>
        Effect.succeed(responses.confirm ?? true),

      password: (_message: string): Effect.Effect<string> =>
        Effect.succeed(responses.password ?? "mock-password-12345"),
    } as unknown as TUIHandler)
  ).pipe(Layer.provide(InkService.Default));

/**
 * Mock layer for TUIHandler that simulates user cancellation
 */
export const MockTUICancelled = Layer.succeed(
  TUIHandler,
  TUIHandler.of({
    display: (): Effect.Effect<void> => Effect.void,
    prompt: (): Effect.Effect<string, TUIError> =>
      Effect.fail(new TUIError("Cancelled", "User cancelled the prompt")),
    selectOption: (): Effect.Effect<string, TUIError> =>
      Effect.fail(new TUIError("Cancelled", "User cancelled the selection")),
    multiSelect: (): Effect.Effect<string[], TUIError> =>
      Effect.fail(new TUIError("Cancelled", "User cancelled the multi-select")),
    confirm: (): Effect.Effect<boolean, TUIError> =>
      Effect.fail(new TUIError("Cancelled", "User cancelled the confirmation")),
    password: (): Effect.Effect<string, TUIError> =>
      Effect.fail(
        new TUIError("Cancelled", "User cancelled the password prompt")
      ),
  } as unknown as TUIHandler)
).pipe(Layer.provide(InkService.Default));

/**
 * Mock for ToolCallLogService
 */
export const MockToolCallLogService = Layer.succeed(
  ToolCallLogService,
  ToolCallLogService.of({
    log: () => Effect.void,
    getRecent: () => Effect.succeed([]),
  } as unknown as ToolCallLogService)
);

/**
 * Mock for ModeService
 */
export const MockModeService = Layer.succeed(
  ModeService,
  ModeService.of({
    getMode: Effect.succeed("default"),
    setMode: () => Effect.void,
    listModes: Effect.succeed(["default", "architect", "executor", "explorer"]),
  } as unknown as ModeService)
);

/**
 * Mock for KitRegistryService
 */
export const MockKitRegistryService = Layer.succeed(
  KitRegistryService,
  KitRegistryService.of({
    register: () => Effect.void,
    enable: () => Effect.void,
    disable: () => Effect.void,
    listAvailable: () => Effect.succeed([]),
    listEnabled: () => Effect.succeed([]),
    isEnabled: () => Effect.succeed(false),
    getKit: () => Effect.die("Kit not found"),
  } as unknown as KitRegistryService)
);

/**
 * Mock for SupermemoryClientService
 */
export const MockSupermemoryClientService = Layer.succeed(
  SupermemoryClientService,
  SupermemoryClientService.of({
    addText: () => Effect.void,
    search: () => Effect.succeed([]),
    addDocument: (content: string, options?: AddDocumentOptions) =>
      Effect.succeed({
        id: "mock-doc-id",
        title: options?.title ?? null,
        content,
        createdAt: new Date().toISOString(),
      }),
    listDocuments: () => Effect.succeed([]),
    getDocument: (id: string) =>
      Effect.succeed({
        id,
        title: "Mock Doc",
        content: "Mock content",
        createdAt: new Date().toISOString(),
      }),
    getMemory: (id: string) =>
      Effect.succeed({
        id,
        content: "Mock memory",
        documentId: "mock-doc",
      }),
    deleteDocument: () => Effect.void,
    searchMemories: () => Effect.succeed([]),
  } as unknown as SupermemoryClientService)
);

/**
 * Mock layer for ThemeService with isolated state
 */
export const MockThemeService = Layer.succeed(
  ThemeService,
  ThemeService.of({
    getTheme: () => defaultTheme,
    getThemeSync: () => defaultTheme,
    setTheme: () => Effect.void,
    withTheme: <A, E, R>(_theme: unknown, effect: Effect.Effect<A, E, R>) =>
      effect,
  } as unknown as ThemeService)
);

/**
 * Mock Slash Dependencies
 */
export const MockSlashDependencies = Layer.mergeAll(
  MockToolCallLogService,
  MockModeService,
  MockKitRegistryService,
  MockSupermemoryClientService
);

/**
 * Unified Mock Test Layer containing all required services.
 * Use this in tests to satisfy SlashCommandRequirements.
 */
export const MockGlobalTestLayer = Layer.mergeAll(
  MockTUI,
  MockCLI,
  MockSlashDependencies,
  MockThemeService
);
