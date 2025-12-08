import { Data, Effect } from "effect";
import { loadConfig } from "./config";

export class SupermemoryError extends Data.TaggedError("SupermemoryError")<{
  readonly message: string;
  readonly cause?: unknown;
}> {}

export class MissingSupermemoryApiKey extends Data.TaggedError(
  "MissingSupermemoryApiKey"
)<{
  readonly message: string;
}> {}

export type SupermemoryClientError =
  | SupermemoryError
  | MissingSupermemoryApiKey;

/**
 * Document metadata
 */
export interface Document {
  readonly id: string;
  readonly title: string | null;
  readonly content: string;
  readonly tags?: readonly string[];
  readonly userId?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

/**
 * Memory (chunk) from Supermemory
 */
export interface Memory {
  readonly id: string;
  readonly content: string;
  readonly documentId: string;
  readonly documentTitle?: string;
  readonly score?: number;
  readonly tags?: readonly string[];
  readonly metadata?: Readonly<Record<string, unknown>>;
}

/**
 * Document creation options
 */
export interface AddDocumentOptions {
  readonly title?: string;
  readonly tags?: readonly string[];
  readonly userId?: string;
}

/**
 * Search options
 */
export interface SearchOptions {
  readonly topK?: number;
  readonly threshold?: number;
  readonly tags?: readonly string[];
  readonly docId?: string;
}

/**
 * Search result from Supermemory
 */
export interface SearchResult {
  readonly id: string;
  readonly content: string;
  readonly score?: number;
}

/**
 * Supermemory client interface
 */
export interface SupermemoryClient {
  readonly addText: (
    text: string
  ) => Effect.Effect<void, SupermemoryClientError>;
  readonly search: (
    query: string,
    options?: { topK?: number; threshold?: number }
  ) => Effect.Effect<readonly SearchResult[], SupermemoryClientError>;
  readonly addDocument: (
    content: string,
    options?: AddDocumentOptions
  ) => Effect.Effect<Document, SupermemoryClientError>;
  readonly listDocuments: (options?: {
    limit?: number;
    offset?: number;
  }) => Effect.Effect<readonly Document[], SupermemoryClientError>;
  readonly getDocument: (
    docId: string
  ) => Effect.Effect<Document, SupermemoryClientError>;
  readonly getMemory: (
    memId: string
  ) => Effect.Effect<Memory, SupermemoryClientError>;
  readonly deleteDocument: (
    docId: string
  ) => Effect.Effect<void, SupermemoryClientError>;
  readonly searchMemories: (
    query: string,
    options?: SearchOptions
  ) => Effect.Effect<readonly Memory[], SupermemoryClientError>;
}

export class SupermemoryClientService extends Effect.Service<SupermemoryClientService>()(
  "SupermemoryClient",
  {
    effect: Effect.gen(function* () {
      const config = yield* loadConfig();

      if (!config.apiKey) {
        yield* Effect.fail(
          new MissingSupermemoryApiKey({
            message:
              "No Supermemory API key configured. Run '/supermemory api-key <key>' first.",
          })
        );
      }

      // TODO: Replace with actual effect-supermemory implementation
      // For now, return a mock implementation
      return {
        addText: (text: string) =>
          Effect.gen(function* () {
            yield* Effect.log(`Mock: Adding text: ${text}`);
            // Mock implementation - would use Ingest.addText
          }),

        search: (
          query: string,
          options: { topK?: number; threshold?: number } = {}
        ) =>
          Effect.gen(function* () {
            const { topK = 5, threshold = 0.5 } = options;
            yield* Effect.log(
              `Mock: Searching for: ${query} (topK: ${topK}, threshold: ${threshold})`
            );
            // Mock implementation - would use Search.searchMemories
            return [];
          }),

        addDocument: (
          content: string,
          options: AddDocumentOptions = {}
        ): Effect.Effect<Document, SupermemoryError> =>
          Effect.gen(function* () {
            yield* Effect.log(
              `Mock: Adding document: ${options.title ?? "Untitled"}`
            );
            const docId = `doc_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
            return {
              id: docId,
              title: options.title ?? null,
              content,
              tags: options.tags,
              userId: options.userId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
          }),

        listDocuments: (options?: {
          limit?: number;
          offset?: number;
        }): Effect.Effect<readonly Document[], SupermemoryError> =>
          Effect.gen(function* () {
            const opts = options ?? {};
            yield* Effect.log(
              `Mock: Listing documents (limit: ${opts.limit ?? 10}, offset: ${opts.offset ?? 0})`
            );
            return [];
          }),

        getDocument: (
          docId: string
        ): Effect.Effect<Document, SupermemoryError> =>
          Effect.gen(function* () {
            yield* Effect.log(`Mock: Getting document: ${docId}`);
            return {
              id: docId,
              title: "Mock Document",
              content: "Mock content",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
          }),

        getMemory: (memId: string): Effect.Effect<Memory, SupermemoryError> =>
          Effect.gen(function* () {
            yield* Effect.log(`Mock: Getting memory: ${memId}`);
            return {
              id: memId,
              content: "Mock memory content",
              documentId: "doc_mock",
              documentTitle: "Mock Document",
              score: 0.95,
            };
          }),

        deleteDocument: (
          docId: string
        ): Effect.Effect<void, SupermemoryError> =>
          Effect.gen(function* () {
            yield* Effect.log(`Mock: Deleting document: ${docId}`);
          }),

        searchMemories: (
          query: string,
          options?: SearchOptions
        ): Effect.Effect<readonly Memory[], SupermemoryError> =>
          Effect.gen(function* () {
            const opts = options ?? {};
            const { topK = 5, threshold = 0.5, tags, docId } = opts;
            yield* Effect.log(
              `Mock: Searching memories for: ${query} (topK: ${topK}, threshold: ${threshold}${tags ? `, tags: ${tags.join(",")}` : ""}${docId ? `, docId: ${docId}` : ""})`
            );
            return [];
          }),
      } as SupermemoryClient;
    }),
    dependencies: [],
  }
) {}
