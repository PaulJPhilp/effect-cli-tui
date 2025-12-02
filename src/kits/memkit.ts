import * as fs from "node:fs/promises";
import * as path from "node:path";
import { Console, Effect } from "effect";
import { redactSecrets } from "../core/redact";
import {
  SupermemoryClientService,
  type SupermemoryError,
} from "../supermemory/client";
import { loadConfig } from "../supermemory/config";
import {
  createEffectCliSlashCommand,
  type SlashCommandDefinition,
} from "../tui-slash-commands";
import { TUIError } from "../types";
import type { Kit } from "./types";

/**
 * Parse comma-separated tags string into array
 */
function parseTags(tagsStr: string | undefined): readonly string[] | undefined {
  if (!tagsStr) return;
  return tagsStr
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

/**
 * Derive a short title from text content
 */
function deriveTitle(text: string, maxLength = 50): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength - 3)}...`;
}

/**
 * Format date for display
 */
function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "N/A";
  try {
    const date = new Date(dateStr);
    return date.toLocaleString();
  } catch {
    return dateStr;
  }
}

/**
 * Truncate text for display
 */
function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}

/**
 * Handle /mem-status command
 */
function handleMemStatus(
  context: import("../tui-slash-commands").SlashCommandContext
): Effect.Effect<
  import("../tui-slash-commands").SlashCommandResult,
  TUIError,
  SupermemoryClientService
> {
  return Effect.gen(function* () {
    const client = yield* SupermemoryClientService;
    const config = yield* loadConfig();

    // Test connectivity by attempting to list documents
    const connectivityTest = yield* Effect.either(
      client.listDocuments({ limit: 1 })
    );

    const isConnected = connectivityTest._tag === "Right";
    const statusIcon = isConnected ? "✅" : "❌";

    yield* Console.log("\n📊 MemKit Status");
    yield* Console.log("─".repeat(40));
    yield* Console.log(
      `Connectivity: ${statusIcon} ${isConnected ? "Connected" : "Disconnected"}`
    );

    // Show active profile/configuration
    if (config.apiKey) {
      const maskedKey = redactSecrets(config.apiKey);
      yield* Console.log(`Active Profile: ${maskedKey.slice(0, 20)}...`);
    } else {
      yield* Console.log("Active Profile: Not configured");
    }

    // Get document count
    if (isConnected) {
      const docsResult = yield* Effect.either(
        client.listDocuments({ limit: 1000 })
      );
      if (docsResult._tag === "Right") {
        const docCount = docsResult.right.length;
        yield* Console.log(`Documents: ${docCount}`);
      }
    } else {
      yield* Console.log("Documents: N/A (not connected)");
    }

    yield* Console.log("─".repeat(40));
    yield* Console.log("");

    return { kind: "continue" } as const;
  }).pipe(
    Effect.catchAll((error) => {
      const unknownError = error as unknown;
      if (
        typeof unknownError === "object" &&
        unknownError !== null &&
        "_tag" in unknownError
      ) {
        if (unknownError._tag === "MissingSupermemoryApiKey") {
          return Effect.gen(function* () {
            yield* Console.log("\n❌ MemKit Status: Not configured");
            yield* Console.log("─".repeat(40));
            yield* Console.log("Connectivity: ❌ Disconnected");
            yield* Console.log("Active Profile: Not configured");
            yield* Console.log("Documents: N/A");
            yield* Console.log("─".repeat(40));
            yield* Console.log("");
            yield* Console.log(
              "Configure Supermemory API key: /supermemory api-key <key>"
            );
            yield* Console.log("");
            return { kind: "continue" } as const;
          });
        }
        if (unknownError._tag === "SupermemoryError") {
          return Effect.gen(function* () {
            const smError = unknownError as SupermemoryError;
            yield* Console.log("\n❌ MemKit Status: Error");
            yield* Console.log("─".repeat(40));
            yield* Console.log(`Connectivity: ❌ Error: ${smError.message}`);
            yield* Console.log("─".repeat(40));
            yield* Console.log("");
            return { kind: "continue" } as const;
          });
        }
      }
      return Effect.gen(function* () {
        yield* Console.log(
          `\n❌ MemKit Status: Unexpected error - ${String(error)}`
        );
        yield* Console.log("");
        return { kind: "continue" } as const;
      });
    })
  );
}

/**
 * Handle /mem-add-text command
 */
function handleMemAddText(
  context: import("../tui-slash-commands").SlashCommandContext
): Effect.Effect<
  import("../tui-slash-commands").SlashCommandResult,
  TUIError,
  SupermemoryClientService
> {
  return Effect.gen(function* () {
    const text = context.args.join(" ").trim();
    const title = context.flags.title as string | undefined;
    const tagsStr = context.flags.tags as string | undefined;
    const userId = context.flags.userId as string | undefined;

    if (!text) {
      yield* Console.log("Error: Text content is required.");
      yield* Console.log(
        "Usage: /mem-add-text <text> [--title=<title>] [--tags=<tags>] [--userId=<userId>]"
      );
      return { kind: "continue" } as const;
    }

    const client = yield* SupermemoryClientService;
    const tags = parseTags(tagsStr);

    const doc = yield* client.addDocument(text, {
      title: title ?? deriveTitle(text),
      tags,
      userId,
    });

    yield* Console.log(`✓ Added document ${doc.id}`);
    if (doc.title) {
      yield* Console.log(`  Title: ${doc.title}`);
    }

    return { kind: "continue" } as const;
  }).pipe(
    Effect.catchAll((error) => {
      const unknownError = error as unknown;
      if (
        typeof unknownError === "object" &&
        unknownError !== null &&
        "_tag" in unknownError
      ) {
        if (unknownError._tag === "MissingSupermemoryApiKey") {
          return Effect.gen(function* () {
            yield* Console.log(
              "Error: Supermemory API key not configured. Run '/supermemory api-key <key>' first."
            );
            return { kind: "continue" } as const;
          });
        }
        if (unknownError._tag === "SupermemoryError") {
          return Effect.gen(function* () {
            const smError = unknownError as SupermemoryError;
            yield* Console.log(`Error: ${smError.message}`);
            return { kind: "continue" } as const;
          });
        }
      }
      return Effect.gen(function* () {
        yield* Console.log(`Error: Failed to add document - ${String(error)}`);
        return { kind: "continue" } as const;
      });
    })
  );
}

/**
 * Handle /mem-add-file command
 */
function handleMemAddFile(
  context: import("../tui-slash-commands").SlashCommandContext
): Effect.Effect<
  import("../tui-slash-commands").SlashCommandResult,
  TUIError,
  SupermemoryClientService
> {
  return Effect.gen(function* () {
    const filePath = context.args[0];
    const title = context.flags.title as string | undefined;
    const tagsStr = context.flags.tags as string | undefined;
    const userId = context.flags.userId as string | undefined;

    if (!filePath) {
      yield* Console.log("Error: File path is required.");
      yield* Console.log(
        "Usage: /mem-add-file <path> [--title=<title>] [--tags=<tags>] [--userId=<userId>]"
      );
      return { kind: "continue" } as const;
    }

    // Resolve path relative to current working directory
    const resolvedPath = path.isAbsolute(filePath)
      ? filePath
      : path.join(process.cwd(), filePath);

    // Read file
    const fileContent = yield* Effect.tryPromise({
      try: () => fs.readFile(resolvedPath, "utf-8"),
      catch: (error) => new Error(`Failed to read file: ${String(error)}`),
    }).pipe(
      Effect.mapError((error) => new TUIError("RenderError", String(error)))
    );

    const client = yield* SupermemoryClientService;
    const tags = parseTags(tagsStr);
    const fileName = path.basename(resolvedPath);
    const docTitle = title ?? fileName;

    const doc = yield* client.addDocument(fileContent, {
      title: docTitle,
      tags,
      userId,
    });

    yield* Console.log(`✓ Added document ${doc.id} from ${resolvedPath}`);
    if (doc.title) {
      yield* Console.log(`  Title: ${doc.title}`);
    }

    return { kind: "continue" } as const;
  }).pipe(
    Effect.catchAll((error) => {
      const unknownError = error as unknown;
      if (
        typeof unknownError === "object" &&
        unknownError !== null &&
        "_tag" in unknownError
      ) {
        if (unknownError._tag === "MissingSupermemoryApiKey") {
          return Effect.gen(function* () {
            yield* Console.log(
              "Error: Supermemory API key not configured. Run '/supermemory api-key <key>' first."
            );
            return { kind: "continue" } as const;
          });
        }
        if (unknownError._tag === "SupermemoryError") {
          return Effect.gen(function* () {
            const smError = unknownError as SupermemoryError;
            yield* Console.log(`Error: ${smError.message}`);
            return { kind: "continue" } as const;
          });
        }
        if (unknownError._tag === "TUIError") {
          return Effect.gen(function* () {
            const tuiError = unknownError as TUIError;
            yield* Console.log(`Error: ${tuiError.message}`);
            return { kind: "continue" } as const;
          });
        }
      }
      return Effect.gen(function* () {
        yield* Console.log(`Error: Failed to add file - ${String(error)}`);
        return { kind: "continue" } as const;
      });
    })
  );
}

/**
 * Handle /mem-add-url command
 */
function handleMemAddUrl(
  context: import("../tui-slash-commands").SlashCommandContext
): Effect.Effect<
  import("../tui-slash-commands").SlashCommandResult,
  TUIError,
  SupermemoryClientService
> {
  return Effect.gen(function* () {
    const url = context.args[0];
    const title = context.flags.title as string | undefined;
    const tagsStr = context.flags.tags as string | undefined;
    const userId = context.flags.userId as string | undefined;

    if (!url) {
      yield* Console.log("Error: URL is required.");
      yield* Console.log(
        "Usage: /mem-add-url <url> [--title=<title>] [--tags=<tags>] [--userId=<userId>]"
      );
      return { kind: "continue" } as const;
    }

    // Basic URL validation
    if (!(url.startsWith("http://") || url.startsWith("https://"))) {
      yield* Console.log("Error: URL must start with http:// or https://");
      return { kind: "continue" } as const;
    }

    const client = yield* SupermemoryClientService;
    const tags = parseTags(tagsStr);

    // Add URL as document content (Supermemory will handle extraction)
    const doc = yield* client.addDocument(url, {
      title: title ?? undefined,
      tags,
      userId,
    });

    yield* Console.log(`✓ Added document ${doc.id} (content: ${url})`);
    if (doc.title) {
      yield* Console.log(`  Title: ${doc.title}`);
    }

    return { kind: "continue" } as const;
  }).pipe(
    Effect.catchAll((error) => {
      const unknownError = error as unknown;
      if (
        typeof unknownError === "object" &&
        unknownError !== null &&
        "_tag" in unknownError
      ) {
        if (unknownError._tag === "MissingSupermemoryApiKey") {
          return Effect.gen(function* () {
            yield* Console.log(
              "Error: Supermemory API key not configured. Run '/supermemory api-key <key>' first."
            );
            return { kind: "continue" } as const;
          });
        }
        if (unknownError._tag === "SupermemoryError") {
          return Effect.gen(function* () {
            const smError = unknownError as SupermemoryError;
            yield* Console.log(`Error: ${smError.message}`);
            return { kind: "continue" } as const;
          });
        }
      }
      return Effect.gen(function* () {
        yield* Console.log(`Error: Failed to add URL - ${String(error)}`);
        return { kind: "continue" } as const;
      });
    })
  );
}

/**
 * Handle /mem-search command
 */
function handleMemSearch(
  context: import("../tui-slash-commands").SlashCommandContext
): Effect.Effect<
  import("../tui-slash-commands").SlashCommandResult,
  TUIError,
  SupermemoryClientService
> {
  return Effect.gen(function* () {
    const query = context.args.join(" ").trim();
    const limit = context.flags.limit
      ? Number.parseInt(String(context.flags.limit), 10)
      : undefined;
    const tagsStr = context.flags.tags as string | undefined;
    const docId = context.flags.docId as string | undefined;

    if (!query) {
      yield* Console.log("Error: Search query is required.");
      yield* Console.log(
        "Usage: /mem-search <query> [--limit=<n>] [--tags=<tags>] [--docId=<id>]"
      );
      return { kind: "continue" } as const;
    }

    const client = yield* SupermemoryClientService;
    const tags = parseTags(tagsStr);

    const memories = yield* client.searchMemories(query, {
      topK: limit ?? 10,
      tags,
      docId,
    });

    yield* Console.log(`\n🔍 Search results for "${query}":`);
    yield* Console.log("─".repeat(60));

    if (memories.length === 0) {
      yield* Console.log("  No memories found matching your query.");
    } else {
      for (let i = 0; i < memories.length; i++) {
        const mem = memories[i]!;
        const snippet = truncate(mem.content, 80);
        const score = mem.score
          ? ` (score: ${(mem.score * 100).toFixed(1)}%)`
          : "";
        yield* Console.log(`\n  ${i + 1}. ${snippet}${score}`);
        yield* Console.log(`     Memory ID: ${mem.id}`);
        yield* Console.log(`     Document: ${mem.documentId}`);
        if (mem.documentTitle) {
          yield* Console.log(`     Title: ${mem.documentTitle}`);
        }
      }
    }

    yield* Console.log("─".repeat(60));
    yield* Console.log("");
    yield* Console.log("Tip: Use /mem-show-mem <id> to view full memory");
    yield* Console.log("");

    return { kind: "continue" } as const;
  }).pipe(
    Effect.catchAll((error) => {
      const unknownError = error as unknown;
      if (
        typeof unknownError === "object" &&
        unknownError !== null &&
        "_tag" in unknownError
      ) {
        if (unknownError._tag === "MissingSupermemoryApiKey") {
          return Effect.gen(function* () {
            yield* Console.log(
              "Error: Supermemory API key not configured. Run '/supermemory api-key <key>' first."
            );
            return { kind: "continue" } as const;
          });
        }
        if (unknownError._tag === "SupermemoryError") {
          return Effect.gen(function* () {
            const smError = unknownError as SupermemoryError;
            yield* Console.log(`Error: ${smError.message}`);
            return { kind: "continue" } as const;
          });
        }
      }
      return Effect.gen(function* () {
        yield* Console.log(`Error: Search failed - ${String(error)}`);
        return { kind: "continue" } as const;
      });
    })
  );
}

/**
 * Handle /mem-show-doc command
 */
function handleMemShowDoc(
  context: import("../tui-slash-commands").SlashCommandContext
): Effect.Effect<
  import("../tui-slash-commands").SlashCommandResult,
  TUIError,
  SupermemoryClientService
> {
  return Effect.gen(function* () {
    const docId = context.args[0];

    if (!docId) {
      yield* Console.log("Error: Document ID is required.");
      yield* Console.log("Usage: /mem-show-doc <docId>");
      return { kind: "continue" } as const;
    }

    const client = yield* SupermemoryClientService;
    const doc = yield* client.getDocument(docId);

    yield* Console.log(`\n📄 Document: ${doc.id}`);
    yield* Console.log("─".repeat(60));
    yield* Console.log(`Title: ${doc.title ?? "Untitled"}`);
    yield* Console.log(`Created: ${formatDate(doc.createdAt)}`);
    yield* Console.log(`Updated: ${formatDate(doc.updatedAt)}`);
    if (doc.tags && doc.tags.length > 0) {
      yield* Console.log(`Tags: ${doc.tags.join(", ")}`);
    }
    if (doc.userId) {
      yield* Console.log(`User ID: ${doc.userId}`);
    }
    yield* Console.log("─".repeat(60));
    yield* Console.log("\nContent:");
    yield* Console.log("─".repeat(60));
    yield* Console.log(doc.content);
    yield* Console.log("─".repeat(60));
    yield* Console.log("");

    // Try to get some sample memories from this document
    const sampleMemories = yield* Effect.either(
      client.searchMemories("", { topK: 3, docId })
    );
    if (sampleMemories._tag === "Right" && sampleMemories.right.length > 0) {
      yield* Console.log("Sample memories:");
      for (const mem of sampleMemories.right) {
        yield* Console.log(`  - ${mem.id}: ${truncate(mem.content, 60)}`);
      }
      yield* Console.log("");
    }

    return { kind: "continue" } as const;
  }).pipe(
    Effect.catchAll((error) => {
      const unknownError = error as unknown;
      if (
        typeof unknownError === "object" &&
        unknownError !== null &&
        "_tag" in unknownError
      ) {
        if (unknownError._tag === "MissingSupermemoryApiKey") {
          return Effect.gen(function* () {
            yield* Console.log(
              "Error: Supermemory API key not configured. Run '/supermemory api-key <key>' first."
            );
            return { kind: "continue" } as const;
          });
        }
        if (unknownError._tag === "SupermemoryError") {
          return Effect.gen(function* () {
            const smError = unknownError as SupermemoryError;
            yield* Console.log(`Error: ${smError.message}`);
            return { kind: "continue" } as const;
          });
        }
      }
      return Effect.gen(function* () {
        yield* Console.log(`Error: Failed to get document - ${String(error)}`);
        return { kind: "continue" } as const;
      });
    })
  );
}

/**
 * Handle /mem-show-mem command
 */
function handleMemShowMem(
  context: import("../tui-slash-commands").SlashCommandContext
): Effect.Effect<
  import("../tui-slash-commands").SlashCommandResult,
  TUIError,
  SupermemoryClientService
> {
  return Effect.gen(function* () {
    const memId = context.args[0];

    if (!memId) {
      yield* Console.log("Error: Memory ID is required.");
      yield* Console.log("Usage: /mem-show-mem <memId>");
      return { kind: "continue" } as const;
    }

    const client = yield* SupermemoryClientService;
    const mem = yield* client.getMemory(memId);

    yield* Console.log(`\n💭 Memory: ${mem.id}`);
    yield* Console.log("─".repeat(60));
    yield* Console.log(`Document ID: ${mem.documentId}`);
    if (mem.documentTitle) {
      yield* Console.log(`Document Title: ${mem.documentTitle}`);
    }
    if (mem.score !== undefined) {
      yield* Console.log(`Score: ${(mem.score * 100).toFixed(1)}%`);
    }
    if (mem.tags && mem.tags.length > 0) {
      yield* Console.log(`Tags: ${mem.tags.join(", ")}`);
    }
    yield* Console.log("─".repeat(60));
    yield* Console.log("\nContent:");
    yield* Console.log("─".repeat(60));
    yield* Console.log(mem.content);
    yield* Console.log("─".repeat(60));
    yield* Console.log("");

    return { kind: "continue" } as const;
  }).pipe(
    Effect.catchAll((error) => {
      const unknownError = error as unknown;
      if (
        typeof unknownError === "object" &&
        unknownError !== null &&
        "_tag" in unknownError
      ) {
        if (unknownError._tag === "MissingSupermemoryApiKey") {
          return Effect.gen(function* () {
            yield* Console.log(
              "Error: Supermemory API key not configured. Run '/supermemory api-key <key>' first."
            );
            return { kind: "continue" } as const;
          });
        }
        if (unknownError._tag === "SupermemoryError") {
          return Effect.gen(function* () {
            const smError = unknownError as SupermemoryError;
            yield* Console.log(`Error: ${smError.message}`);
            return { kind: "continue" } as const;
          });
        }
      }
      return Effect.gen(function* () {
        yield* Console.log(`Error: Failed to get memory - ${String(error)}`);
        return { kind: "continue" } as const;
      });
    })
  );
}

/**
 * Handle /mem-rm-doc command
 */
function handleMemRmDoc(
  context: import("../tui-slash-commands").SlashCommandContext
): Effect.Effect<
  import("../tui-slash-commands").SlashCommandResult,
  TUIError,
  SupermemoryClientService
> {
  return Effect.gen(function* () {
    const docId = context.args[0];
    const force = context.flags.force === true || context.flags.f === true;

    if (!docId) {
      yield* Console.log("Error: Document ID is required.");
      yield* Console.log("Usage: /mem-rm-doc <docId> [--force]");
      return { kind: "continue" } as const;
    }

    // If not forced, we'd prompt for confirmation, but in a slash command context
    // we can't easily do interactive prompts. For now, we'll just proceed.
    // In a real implementation with TUIHandler, we could use tui.confirm()
    if (!force) {
      yield* Console.log(
        `⚠️  This will delete document ${docId} and all its memories.`
      );
      yield* Console.log("   Use --force flag to skip this warning.");
      yield* Console.log(
        "   (In interactive mode, you would be prompted for confirmation)"
      );
      return { kind: "continue" } as const;
    }

    const client = yield* SupermemoryClientService;
    yield* client.deleteDocument(docId);

    yield* Console.log(`✓ Deleted document ${docId}`);

    return { kind: "continue" } as const;
  }).pipe(
    Effect.catchAll((error) => {
      const unknownError = error as unknown;
      if (
        typeof unknownError === "object" &&
        unknownError !== null &&
        "_tag" in unknownError
      ) {
        if (unknownError._tag === "MissingSupermemoryApiKey") {
          return Effect.gen(function* () {
            yield* Console.log(
              "Error: Supermemory API key not configured. Run '/supermemory api-key <key>' first."
            );
            return { kind: "continue" } as const;
          });
        }
        if (unknownError._tag === "SupermemoryError") {
          return Effect.gen(function* () {
            const smError = unknownError as SupermemoryError;
            yield* Console.log(`Error: ${smError.message}`);
            return { kind: "continue" } as const;
          });
        }
      }
      return Effect.gen(function* () {
        yield* Console.log(
          `Error: Failed to delete document - ${String(error)}`
        );
        return { kind: "continue" } as const;
      });
    })
  );
}

/**
 * Handle /mem-stats command
 */
function handleMemStats(
  context: import("../tui-slash-commands").SlashCommandContext
): Effect.Effect<
  import("../tui-slash-commands").SlashCommandResult,
  TUIError,
  SupermemoryClientService
> {
  return Effect.gen(function* () {
    const client = yield* SupermemoryClientService;

    // Get all documents
    const allDocs = yield* client.listDocuments({ limit: 10_000 });

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    let docsLastDay = 0;
    let docsLastWeek = 0;

    for (const doc of allDocs) {
      if (doc.createdAt) {
        const created = new Date(doc.createdAt);
        if (created >= oneDayAgo) {
          docsLastDay++;
        }
        if (created >= oneWeekAgo) {
          docsLastWeek++;
        }
      }
    }

    yield* Console.log("\n📊 MemKit Statistics");
    yield* Console.log("─".repeat(40));
    yield* Console.log(`Total Documents: ${allDocs.length}`);
    yield* Console.log(`Documents (last 24h): ${docsLastDay}`);
    yield* Console.log(`Documents (last 7d): ${docsLastWeek}`);
    yield* Console.log("─".repeat(40));
    yield* Console.log("");

    return { kind: "continue" } as const;
  }).pipe(
    Effect.catchAll((error) => {
      const unknownError = error as unknown;
      if (
        typeof unknownError === "object" &&
        unknownError !== null &&
        "_tag" in unknownError
      ) {
        if (unknownError._tag === "MissingSupermemoryApiKey") {
          return Effect.gen(function* () {
            yield* Console.log(
              "Error: Supermemory API key not configured. Run '/supermemory api-key <key>' first."
            );
            return { kind: "continue" } as const;
          });
        }
        if (unknownError._tag === "SupermemoryError") {
          return Effect.gen(function* () {
            const smError = unknownError as SupermemoryError;
            yield* Console.log(`Error: ${smError.message}`);
            return { kind: "continue" } as const;
          });
        }
      }
      return Effect.gen(function* () {
        yield* Console.log(
          `Error: Failed to get statistics - ${String(error)}`
        );
        return { kind: "continue" } as const;
      });
    })
  );
}

/**
 * MemKit slash commands
 */
const MEMKIT_COMMANDS: readonly SlashCommandDefinition[] = [
  createEffectCliSlashCommand({
    name: "mem-status",
    description: "Check Supermemory connectivity and status",
    effect: handleMemStatus,
  }),
  createEffectCliSlashCommand({
    name: "mem-add-text",
    description: "Add a text note as a Supermemory document",
    effect: handleMemAddText,
  }),
  createEffectCliSlashCommand({
    name: "mem-add-file",
    description: "Ingest a local file as a Supermemory document",
    effect: handleMemAddFile,
  }),
  createEffectCliSlashCommand({
    name: "mem-add-url",
    description: "Ingest a URL as a Supermemory document",
    effect: handleMemAddUrl,
  }),
  createEffectCliSlashCommand({
    name: "mem-search",
    description: "Semantic search over memories",
    effect: handleMemSearch,
  }),
  createEffectCliSlashCommand({
    name: "mem-show-doc",
    description: "Inspect a single document in detail",
    effect: handleMemShowDoc,
  }),
  createEffectCliSlashCommand({
    name: "mem-show-mem",
    description: "Inspect a single memory (chunk)",
    effect: handleMemShowMem,
  }),
  createEffectCliSlashCommand({
    name: "mem-rm-doc",
    description: "Delete a document (and its memories)",
    effect: handleMemRmDoc,
  }),
  createEffectCliSlashCommand({
    name: "mem-stats",
    description: "Provide a dashboard of memory usage",
    effect: handleMemStats,
  }),
];

/**
 * MemKit - Memory management kit
 *
 * Provides commands for adding, searching, inspecting, and tidying Supermemory-backed memories:
 * - /mem-status - Quick health + context check
 * - /mem-add-text - Add a text note as a document
 * - /mem-add-file - Ingest a local file as a document
 * - /mem-add-url - Ingest a URL as a document
 * - /mem-search - Semantic search over memories
 * - /mem-show-doc - Inspect a single document
 * - /mem-show-mem - Inspect a single memory
 * - /mem-rm-doc - Delete a document
 * - /mem-stats - Memory usage dashboard
 */
export const MemKit: Kit = {
  id: "memkit",
  name: "Memory Kit",
  description:
    "Commands for adding, searching, inspecting, and tidying Supermemory-backed memories.",
  version: "1.0.0",
  commands: MEMKIT_COMMANDS,
};
