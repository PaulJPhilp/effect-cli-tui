import { Console, Effect } from "effect";

import type {
  SlashCommandContext,
  SlashCommandResult,
} from "@/tui-slash-commands";
import { TUIError } from "@/types";
import {
  API_KEY_MIN_VISIBLE_LENGTH,
  API_KEY_VISIBLE_CHARS,
  CONTENT_TRUNCATION_LENGTH,
  DEFAULT_SEARCH_THRESHOLD,
  DEFAULT_SEARCH_TOP_K,
  SCORE_PERCENTAGE_MULTIPLIER,
  SUPERMEMORY_API_KEY_PREFIX,
} from "../constants";
import {
  type MissingSupermemoryApiKey,
  SupermemoryClientService,
  type SupermemoryError,
} from "./client";
import { type ConfigError, updateApiKey } from "./config";

/**
 * Mask API key for display - show only first and last 4 characters
 */
function maskApiKey(apiKey: string): string {
  if (apiKey.length <= API_KEY_MIN_VISIBLE_LENGTH) {
    return "*".repeat(apiKey.length);
  }
  return `${apiKey.slice(0, API_KEY_VISIBLE_CHARS)}${"*".repeat(apiKey.length - API_KEY_MIN_VISIBLE_LENGTH)}${apiKey.slice(-API_KEY_VISIBLE_CHARS)}`;
}

/**
 * Handle /supermemory api-key <key> command
 */
export function handleApiKeyCommand(
  context: SlashCommandContext
): Effect.Effect<SlashCommandResult, ConfigError | TUIError> {
  return Effect.gen(function* () {
    const apiKey = context.args[0];

    if (!apiKey) {
      yield* Console.log("[Supermemory] Error: API key is required.");
      yield* Console.log(
        "[Supermemory] Usage: /supermemory api-key <your-api-key>"
      );
      return { kind: "continue" } as const;
    }

    // Basic validation for API key format (starts with sk_)
    if (!apiKey.startsWith(SUPERMEMORY_API_KEY_PREFIX)) {
      yield* Console.log(
        `[Supermemory] Warning: API key should typically start with '${SUPERMEMORY_API_KEY_PREFIX}'`
      );
    }

    yield* updateApiKey(apiKey);
    const maskedKey = maskApiKey(apiKey);
    yield* Console.log(`[Supermemory] API key saved: ${maskedKey}`);

    return { kind: "continue" } as const;
  });
}

/**
 * Handle /supermemory add <text> command
 */
export function handleAddCommand(
  context: SlashCommandContext
): Effect.Effect<SlashCommandResult, TUIError, SupermemoryClientService> {
  return Effect.gen(function* () {
    const text = context.args.join(" ");

    if (!text.trim()) {
      yield* Console.log("[Supermemory] Error: No text provided to add.");
      yield* Console.log(
        "[Supermemory] Usage: /supermemory add <text-to-remember>"
      );
      return { kind: "continue" } as const;
    }

    const supermemoryClient = yield* SupermemoryClientService;
    yield* supermemoryClient.addText(text);

    yield* Console.log("[Supermemory] Memory added successfully.");

    return { kind: "continue" } as const;
  }).pipe(
    Effect.catchAll((error) => {
      const unknownError = error as unknown;

      if (
        typeof unknownError === "object" &&
        unknownError !== null &&
        "_tag" in unknownError &&
        unknownError._tag === "MissingSupermemoryApiKey" &&
        "message" in unknownError
      ) {
        const apiKeyError = unknownError as MissingSupermemoryApiKey;
        return Effect.gen(function* () {
          yield* Console.log(`[Supermemory] ${apiKeyError.message}`);
          return { kind: "continue" } as const;
        });
      }

      if (
        typeof unknownError === "object" &&
        unknownError !== null &&
        "_tag" in unknownError &&
        unknownError._tag === "SupermemoryError" &&
        "message" in unknownError
      ) {
        const supermemoryError = unknownError as SupermemoryError;
        return Effect.gen(function* () {
          yield* Console.log(
            `[Supermemory] Error: ${supermemoryError.message}`
          );
          return { kind: "continue" } as const;
        });
      }

      return Effect.fail(new TUIError("RenderError", String(error)));
    })
  );
}

/**
 * Handle /supermemory search <query> command
 */
export function handleSearchCommand(
  context: SlashCommandContext
): Effect.Effect<SlashCommandResult, TUIError, SupermemoryClientService> {
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: command handler combines validation, API call, and formatted output
  return Effect.gen(function* () {
    const query = context.args.join(" ");

    if (!query.trim()) {
      yield* Console.log("[Supermemory] Error: No search query provided.");
      yield* Console.log("[Supermemory] Usage: /supermemory search <query>");
      return { kind: "continue" } as const;
    }

    const supermemoryClient = yield* SupermemoryClientService;
    const memories = yield* supermemoryClient.search(query, {
      topK: DEFAULT_SEARCH_TOP_K,
      threshold: DEFAULT_SEARCH_THRESHOLD,
    });

    yield* Console.log(`[Supermemory] Results for "${query}":`);

    if (memories.length === 0) {
      yield* Console.log("  No memories found matching your query.");
    } else {
      for (let i = 0; i < memories.length; i++) {
        const memory = memories[i];
        const score = memory.score
          ? (memory.score * SCORE_PERCENTAGE_MULTIPLIER).toFixed(1)
          : "N/A";
        const snippet =
          memory.content.length > CONTENT_TRUNCATION_LENGTH
            ? `${memory.content.slice(0, CONTENT_TRUNCATION_LENGTH)}...`
            : memory.content;

        yield* Console.log(`  ${i + 1}. "${snippet}" (score: ${score})`);
      }
    }

    return { kind: "continue" } as const;
  }).pipe(
    Effect.catchAll((error) => {
      const unknownError = error as unknown;

      if (
        typeof unknownError === "object" &&
        unknownError !== null &&
        "_tag" in unknownError &&
        unknownError._tag === "MissingSupermemoryApiKey" &&
        "message" in unknownError
      ) {
        const apiKeyError = unknownError as MissingSupermemoryApiKey;
        return Effect.gen(function* () {
          yield* Console.log(`[Supermemory] ${apiKeyError.message}`);
          return { kind: "continue" } as const;
        });
      }

      if (
        typeof unknownError === "object" &&
        unknownError !== null &&
        "_tag" in unknownError &&
        unknownError._tag === "SupermemoryError" &&
        "message" in unknownError
      ) {
        const supermemoryError = unknownError as SupermemoryError;
        return Effect.gen(function* () {
          yield* Console.log(
            `[Supermemory] Error: ${supermemoryError.message}`
          );
          return { kind: "continue" } as const;
        });
      }

      return Effect.fail(new TUIError("RenderError", String(error)));
    })
  );
}
