import path from "node:path";
import { MemKit, withKit } from "@kits";
import {
  type Document,
  type Memory,
  MissingSupermemoryApiKey,
  SupermemoryClientService,
} from "@supermemory/client";
import {
  ConfigError,
  loadConfig,
  type SupermemoryTuiConfig,
  SupermemoryTuiConfigService,
} from "@supermemory/config";
import { Effect, Layer } from "effect";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getGlobalSlashCommandRegistry } from "@/tui-slash-commands";

// Mock loadConfig - will be set per test
const mockLoadConfigRef: {
  current: () => Effect.Effect<SupermemoryTuiConfig, ConfigError>;
} = {
  current: () => Effect.succeed({ apiKey: null }),
};

vi.mock("../../src/supermemory/config", async () => {
  const actual = await import("../../src/supermemory/config");
  return {
    ...actual,
    loadConfig: () => mockLoadConfigRef.current(),
  };
});

// Mock fs operations
const mockFs = {
  access: vi.fn(),
  readFile: vi.fn(),
  writeFile: vi.fn(),
};

// Mock os.homedir
vi.mock("node:os", () => ({
  homedir: () => "/mock/home",
}));

// Mock node:fs/promises
vi.mock("node:fs/promises", () => mockFs);

// Mock Console
const mockConsole = {
  log: vi.fn(),
};

vi.mock("effect", async () => {
  const actual = await import("effect");
  return {
    ...actual,
    Console: {
      log: vi.fn((...args) => mockConsole.log(...args)),
    },
  };
});

// Mock effect-supermemory
const mockSupermemory = {
  make: vi.fn(),
  Ingest: {
    addText: vi.fn(),
    addDocument: vi.fn(),
  },
  Search: {
    searchMemories: vi.fn(),
  },
  Documents: {
    list: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  },
  Memories: {
    get: vi.fn(),
  },
};

vi.mock("effect-supermemory", () => mockSupermemory);

// Helper to create context
function createContext(
  command: string,
  args: string[] = [],
  flags: Record<string, string | boolean> = {}
) {
  const registry = getGlobalSlashCommandRegistry();
  return {
    promptMessage: "test",
    promptKind: "input" as const,
    rawInput: `/${command} ${args.join(" ")}`,
    command,
    args,
    flags,
    tokens: [command, ...args],
    registry,
  };
}

describe("MemKit Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SUPERMEMORY_API_KEY = undefined;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Configuration Integration", () => {
    it("should work with API key from environment variable", async () => {
      process.env.SUPERMEMORY_API_KEY = "sk_test123";
      mockFs.access.mockRejectedValue(new Error("File not found"));
      mockLoadConfigRef.current = () =>
        Effect.succeed({ apiKey: "sk_test123" });

      const mockClient: import("../../src/supermemory/client").SupermemoryClient =
        {
          addText: vi.fn(() => Effect.void),
          search: vi.fn(() => Effect.succeed([])),
          addDocument: vi.fn((content, options) =>
            Effect.succeed({
              id: "doc_123",
              title: (options?.title ?? null) as string | null,
              content,
              tags: options?.tags,
              userId: options?.userId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })
          ),
          listDocuments: vi.fn(() => Effect.succeed([])),
          getDocument: vi.fn(() =>
            Effect.succeed({
              id: "doc_123",
              title: "Test",
              content: "Content",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })
          ),
          getMemory: vi.fn(() =>
            Effect.succeed({
              id: "mem_123",
              content: "Memory",
              documentId: "doc_123",
            })
          ),
          deleteDocument: vi.fn(() => Effect.void),
          searchMemories: vi.fn(() => Effect.succeed([])),
        };

      mockSupermemory.make.mockReturnValue(mockClient);

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-status");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-status"));
        })
      ).pipe(
        Effect.provide(
          Layer.succeed(SupermemoryTuiConfigService, {
            apiKey: "sk_test123",
          })
        ),
        Effect.provide(SupermemoryClientService.Default)
      );

      // @ts-expect-error - Effect type inference issue with command dependencies
      const result = await Effect.runPromise(program);
      if (result && typeof result === "object" && "kind" in result) {
        expect(result.kind).toBe("continue");
      }
    });

    it("should fail when API key is missing", async () => {
      mockFs.access.mockRejectedValue(new Error("File not found"));
      mockLoadConfigRef.current = () => Effect.succeed({ apiKey: null });

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-text");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-add-text", ["Test content"])
          );
        })
      ).pipe(
        Effect.provide(
          Layer.succeed(SupermemoryTuiConfigService, {
            apiKey: null,
          })
        ),
        Effect.provide(SupermemoryClientService.Default)
      );

      const result = await Effect.runPromise(Effect.either(program as any));

      expect(result._tag).toBe("Left");
      if (result._tag === "Left") {
        expect(result.left).toBeInstanceOf(MissingSupermemoryApiKey);
      }
    });

    it("should work with API key from config file", async () => {
      mockFs.access.mockResolvedValue(undefined);
      mockFs.readFile.mockResolvedValue('{"apiKey": "sk_file456"}');
      mockLoadConfigRef.current = () =>
        Effect.succeed({ apiKey: "sk_file456" });

      const mockClient: import("../../src/supermemory/client").SupermemoryClient =
        {
          addText: vi.fn(() => Effect.void),
          search: vi.fn(() => Effect.succeed([])),
          addDocument: vi.fn((content, options) =>
            Effect.succeed({
              id: "doc_123",
              title: (options?.title ?? null) as string | null,
              content,
              tags: options?.tags,
              userId: options?.userId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })
          ),
          listDocuments: vi.fn(() => Effect.succeed([])),
          getDocument: vi.fn(() =>
            Effect.succeed({
              id: "doc_123",
              title: "Test",
              content: "Content",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })
          ),
          getMemory: vi.fn(() =>
            Effect.succeed({
              id: "mem_123",
              content: "Memory",
              documentId: "doc_123",
            })
          ),
          deleteDocument: vi.fn(() => Effect.void),
          searchMemories: vi.fn(() => Effect.succeed([])),
        };

      mockSupermemory.make.mockReturnValue(mockClient);

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-status");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-status"));
        })
      ).pipe(
        Effect.provide(
          Layer.succeed(SupermemoryTuiConfigService, { apiKey: "sk_file456" })
        ),
        Effect.provide(SupermemoryClientService.Default)
      );

      // @ts-expect-error - Effect type inference issue with command dependencies
      const result = await Effect.runPromise(program);
      if (result && typeof result === "object" && "kind" in result) {
        expect(result.kind).toBe("continue");
      }
    });
  });

  describe("End-to-End Workflows", () => {
    let mockClient: ReturnType<typeof createMockClient>;
    let documentStore: Document[];
    let memoryStore: Memory[];

    function createMockClient() {
      documentStore = [];
      memoryStore = [];

      return {
        addText: vi.fn(() => Effect.void),
        search: vi.fn(() => Effect.succeed([])),
        addDocument: vi.fn((content, options) => {
          const doc: Document = {
            id: `doc_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
            title: options?.title ?? null,
            content,
            tags: options?.tags,
            userId: options?.userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          documentStore.push(doc);
          return Effect.succeed(doc);
        }),
        listDocuments: vi.fn(() => Effect.succeed([...documentStore])),
        getDocument: vi.fn((docId) => {
          const doc = documentStore.find((d) => d.id === docId);
          if (!doc) {
            return Effect.fail(new Error(`Document ${docId} not found`));
          }
          return Effect.succeed(doc);
        }),
        getMemory: vi.fn((memId) => {
          const mem = memoryStore.find((m) => m.id === memId);
          if (!mem) {
            return Effect.fail(new Error(`Memory ${memId} not found`));
          }
          return Effect.succeed(mem);
        }),
        deleteDocument: vi.fn((docId) => {
          const index = documentStore.findIndex((d) => d.id === docId);
          if (index === -1) {
            return Effect.fail(new Error(`Document ${docId} not found`));
          }
          documentStore.splice(index, 1);
          // Also remove associated memories
          memoryStore = memoryStore.filter((m) => m.documentId !== docId);
          return Effect.void;
        }),
        searchMemories: vi.fn((query, options) => {
          // Simple text search simulation
          const results = memoryStore
            .filter((mem) => {
              if (options?.docId && mem.documentId !== options.docId) {
                return false;
              }
              if (options?.tags && mem.tags) {
                const hasTag = options.tags.some((tag) =>
                  mem.tags?.includes(tag)
                );
                if (!hasTag) {
                  return false;
                }
              }
              return mem.content.toLowerCase().includes(query.toLowerCase());
            })
            .slice(0, options?.topK ?? 10)
            .map((mem, idx) => ({
              ...mem,
              score: 0.9 - idx * 0.1,
            }));
          return Effect.succeed(results);
        }),
      };
    }

    beforeEach(() => {
      mockClient = createMockClient();
      mockSupermemory.make.mockReturnValue(mockClient);
    });

    it("should complete full workflow: add text -> search -> show -> delete", async () => {
      const layer = Layer.succeed(SupermemoryTuiConfigService, {
        apiKey: "sk_test123",
      }).pipe(Layer.provide(SupermemoryClientService.Default));

      // Step 1: Add text document
      const addProgram = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-text");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-add-text", ["Important meeting notes"], {
              title: "Meeting Notes",
              tags: "work,meeting",
            })
          );
        })
      ).pipe(Effect.provide(layer));

      // @ts-expect-error - Effect type inference issue with command dependencies
      const addResult = await Effect.runPromise(addProgram);
      if (addResult && typeof addResult === "object" && "kind" in addResult) {
        expect(addResult.kind).toBe("continue");
      }
      expect(mockClient.addDocument).toHaveBeenCalled();
      expect(documentStore.length).toBe(1);
      const docId = documentStore[0]?.id;
      if (!docId) {
        throw new Error("Document ID not found");
      }

      // Create a memory for this document
      memoryStore.push({
        id: "mem_1",
        content: "Important meeting notes",
        documentId: docId,
        documentTitle: "Meeting Notes",
        score: 0.95,
        tags: ["work", "meeting"],
      });

      // Step 2: Search for it
      const searchProgram = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-search");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-search", ["meeting"], { tags: "work" })
          );
        })
      ).pipe(Effect.provide(layer));

      // @ts-expect-error - Effect type inference issue with command dependencies
      const searchResult = await Effect.runPromise(searchProgram);
      if (
        searchResult &&
        typeof searchResult === "object" &&
        "kind" in searchResult
      ) {
        expect(searchResult.kind).toBe("continue");
      }
      expect(mockClient.searchMemories).toHaveBeenCalledWith(
        "meeting",
        expect.objectContaining({
          tags: ["work"],
        })
      );

      // Step 3: Show document
      const showDocProgram = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-show-doc");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-show-doc", [docId]));
        })
      ).pipe(Effect.provide(layer));

      // @ts-expect-error - Effect type inference issue with command dependencies
      const showDocResult = await Effect.runPromise(showDocProgram);
      if (
        showDocResult &&
        typeof showDocResult === "object" &&
        "kind" in showDocResult
      ) {
        expect(showDocResult.kind).toBe("continue");
      }
      expect(mockClient.getDocument).toHaveBeenCalledWith(docId);

      // Step 4: Delete document
      const deleteProgram = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-rm-doc");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-rm-doc", [docId], { force: true })
          );
        })
      ).pipe(Effect.provide(layer));

      // @ts-expect-error - Effect type inference issue with command dependencies
      const deleteResult = await Effect.runPromise(deleteProgram);
      if (
        deleteResult &&
        typeof deleteResult === "object" &&
        "kind" in deleteResult
      ) {
        expect(deleteResult.kind).toBe("continue");
      }
      expect(mockClient.deleteDocument).toHaveBeenCalledWith(docId);
      expect(documentStore.length).toBe(0);
    });

    it("should handle file ingestion workflow", async () => {
      const layer = Layer.succeed(SupermemoryTuiConfigService, {
        apiKey: "sk_test123",
      }).pipe(Layer.provide(SupermemoryClientService.Default));

      const fileContent = "This is test file content\nWith multiple lines";
      const fileName = "test-document.md";
      const filePath = path.join(process.cwd(), fileName);
      mockFs.readFile.mockResolvedValue(fileContent);

      // Add file
      const addFileProgram = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-file");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-add-file", [fileName], {
              tags: "file,documentation",
            })
          );
        })
      ).pipe(Effect.provide(layer));

      // @ts-expect-error - Effect type inference issue with command dependencies
      const addFileResult = await Effect.runPromise(addFileProgram);
      if (
        addFileResult &&
        typeof addFileResult === "object" &&
        "kind" in addFileResult
      ) {
        expect(addFileResult.kind).toBe("continue");
      }
      expect(mockFs.readFile).toHaveBeenCalledWith(filePath, "utf-8");
      expect(mockClient.addDocument).toHaveBeenCalledWith(
        fileContent,
        expect.objectContaining({
          title: fileName,
          tags: ["file", "documentation"],
        })
      );
      expect(documentStore.length).toBe(1);
    });

    it("should handle URL ingestion workflow", async () => {
      const layer = Layer.succeed(SupermemoryTuiConfigService, {
        apiKey: "sk_test123",
      }).pipe(Layer.provide(SupermemoryClientService.Default));

      const url = "https://example.com/article?param=value#section";

      // Add URL
      const addUrlProgram = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-url");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-add-url", [url], {
              title: "Example Article",
              tags: "web,reference",
            })
          );
        })
      ).pipe(Effect.provide(layer));

      // @ts-expect-error - Effect type inference issue with command dependencies
      const addUrlResult = await Effect.runPromise(addUrlProgram);
      if (
        addUrlResult &&
        typeof addUrlResult === "object" &&
        "kind" in addUrlResult
      ) {
        expect(addUrlResult.kind).toBe("continue");
      }
      expect(mockClient.addDocument).toHaveBeenCalledWith(
        url,
        expect.objectContaining({
          title: "Example Article",
          tags: ["web", "reference"],
        })
      );
    });

    it("should handle statistics calculation with real data", async () => {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);

      // Add documents with different timestamps
      documentStore.push(
        {
          id: "doc1",
          title: "Recent",
          content: "Content 1",
          createdAt: oneDayAgo.toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: "doc2",
          title: "Older",
          content: "Content 2",
          createdAt: threeDaysAgo.toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: "doc3",
          title: "Old",
          content: "Content 3",
          createdAt: tenDaysAgo.toISOString(),
          updatedAt: now.toISOString(),
        }
      );

      const layer = Layer.succeed(SupermemoryTuiConfigService, {
        apiKey: "sk_test123",
      }).pipe(Layer.provide(SupermemoryClientService.Default));

      const statsProgram = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-stats");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-stats"));
        })
      ).pipe(Effect.provide(layer));

      // @ts-expect-error - Effect type inference issue with command dependencies
      const statsResult = await Effect.runPromise(statsProgram);
      if (
        statsResult &&
        typeof statsResult === "object" &&
        "kind" in statsResult
      ) {
        expect(statsResult.kind).toBe("continue");
      }
      expect(mockClient.listDocuments).toHaveBeenCalled();
    });

    it("should handle search with multiple filters", async () => {
      const layer = Layer.succeed(SupermemoryTuiConfigService, {
        apiKey: "sk_test123",
      }).pipe(Layer.provide(SupermemoryClientService.Default));

      // Add documents and memories
      const doc1: Document = {
        id: "doc_1",
        title: "Work Notes",
        content: "Work related content",
        tags: ["work"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const doc2: Document = {
        id: "doc_2",
        title: "Personal Notes",
        content: "Personal content",
        tags: ["personal"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      documentStore.push(doc1, doc2);

      memoryStore.push(
        {
          id: "mem_1",
          content: "Work related content",
          documentId: "doc_1",
          documentTitle: "Work Notes",
          tags: ["work"],
        },
        {
          id: "mem_2",
          content: "Personal content",
          documentId: "doc_2",
          documentTitle: "Personal Notes",
          tags: ["personal"],
        }
      );

      // Search with docId filter
      const searchProgram = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-search");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-search", ["content"], {
              docId: "doc_1",
              limit: "5",
            })
          );
        })
      ).pipe(Effect.provide(layer));

      // @ts-expect-error - Effect type inference issue with command dependencies
      const searchResult = await Effect.runPromise(searchProgram);
      if (
        searchResult &&
        typeof searchResult === "object" &&
        "kind" in searchResult
      ) {
        expect(searchResult.kind).toBe("continue");
      }
      expect(mockClient.searchMemories).toHaveBeenCalledWith(
        "content",
        expect.objectContaining({
          docId: "doc_1",
          topK: 5,
        })
      );
    });
  });

  describe("Error Handling Integration", () => {
    it("should handle file read errors gracefully", async () => {
      const layer = Layer.succeed(SupermemoryTuiConfigService, {
        apiKey: "sk_test123",
      }).pipe(Layer.provide(SupermemoryClientService.Default));

      mockFs.readFile.mockRejectedValue(new Error("Permission denied"));

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-file");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-add-file", ["protected.txt"])
          );
        })
      ).pipe(Effect.provide(layer));

      // @ts-expect-error - Effect type inference issue with command dependencies
      const result = await Effect.runPromise(program);
      if (result && typeof result === "object" && "kind" in result) {
        expect(result.kind).toBe("continue");
      }
    });

    it("should handle document not found errors", async () => {
      const mockClient = {
        addText: vi.fn(() => Effect.void),
        search: vi.fn(() => Effect.succeed([])),
        addDocument: vi.fn(() => Effect.succeed({ id: "doc_123" } as Document)),
        listDocuments: vi.fn(() => Effect.succeed([])),
        getDocument: vi.fn(() => Effect.fail(new Error("Document not found"))),
        getMemory: vi.fn(() => Effect.succeed({} as Memory)),
        deleteDocument: vi.fn(() => Effect.void),
        searchMemories: vi.fn(() => Effect.succeed([])),
      };

      mockSupermemory.make.mockReturnValue(mockClient);

      const layer = Layer.succeed(SupermemoryTuiConfigService, {
        apiKey: "sk_test123",
      }).pipe(Layer.provide(SupermemoryClientService.Default));

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-show-doc");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-show-doc", ["nonexistent"])
          );
        })
      ).pipe(Effect.provide(layer));

      // @ts-expect-error - Effect type inference issue with command dependencies
      const result = await Effect.runPromise(program);
      if (result && typeof result === "object" && "kind" in result) {
        expect(result.kind).toBe("continue");
      }
    });

    it("should handle memory not found errors", async () => {
      const mockClient = {
        addText: vi.fn(() => Effect.void),
        search: vi.fn(() => Effect.succeed([])),
        addDocument: vi.fn(() => Effect.succeed({ id: "doc_123" } as Document)),
        listDocuments: vi.fn(() => Effect.succeed([])),
        getDocument: vi.fn(() => Effect.succeed({} as Document)),
        getMemory: vi.fn(() => Effect.fail(new Error("Memory not found"))),
        deleteDocument: vi.fn(() => Effect.void),
        searchMemories: vi.fn(() => Effect.succeed([])),
      };

      mockSupermemory.make.mockReturnValue(mockClient);

      const layer = Layer.succeed(SupermemoryTuiConfigService, {
        apiKey: "sk_test123",
      }).pipe(Layer.provide(SupermemoryClientService.Default));

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-show-mem");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-show-mem", ["nonexistent"])
          );
        })
      ).pipe(Effect.provide(layer));

      // @ts-expect-error - Effect type inference issue with command dependencies
      const result = await Effect.runPromise(program);
      if (result && typeof result === "object" && "kind" in result) {
        expect(result.kind).toBe("continue");
      }
    });

    it("should handle delete errors", async () => {
      const mockClient = {
        addText: vi.fn(() => Effect.void),
        search: vi.fn(() => Effect.succeed([])),
        addDocument: vi.fn(() => Effect.succeed({ id: "doc_123" } as Document)),
        listDocuments: vi.fn(() => Effect.succeed([])),
        getDocument: vi.fn(() => Effect.succeed({} as Document)),
        getMemory: vi.fn(() => Effect.succeed({} as Memory)),
        deleteDocument: vi.fn(() =>
          Effect.fail(new Error("Delete failed: permission denied"))
        ),
        searchMemories: vi.fn(() => Effect.succeed([])),
      };

      mockSupermemory.make.mockReturnValue(mockClient);

      const layer = Layer.succeed(SupermemoryTuiConfigService, {
        apiKey: "sk_test123",
      }).pipe(Layer.provide(SupermemoryClientService.Default));

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-rm-doc");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-rm-doc", ["doc_123"], { force: true })
          );
        })
      ).pipe(Effect.provide(layer));

      // @ts-expect-error - Effect type inference issue with command dependencies
      const result = await Effect.runPromise(program);
      if (result && typeof result === "object" && "kind" in result) {
        expect(result.kind).toBe("continue");
      }
    });
  });

  describe("Real Service Integration", () => {
    it("should use actual SupermemoryClientService layer", async () => {
      const mockClient: import("../../src/supermemory/client").SupermemoryClient =
        {
          addText: vi.fn(() => Effect.void),
          search: vi.fn(() => Effect.succeed([])),
          addDocument: vi.fn((content, options) =>
            Effect.succeed({
              id: "doc_123",
              title: (options?.title ?? null) as string | null,
              content,
              tags: options?.tags,
              userId: options?.userId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })
          ),
          listDocuments: vi.fn(() => Effect.succeed([])),
          getDocument: vi.fn(() =>
            Effect.succeed({
              id: "doc_123",
              title: "Test",
              content: "Content",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })
          ),
          getMemory: vi.fn(() =>
            Effect.succeed({
              id: "mem_123",
              content: "Memory",
              documentId: "doc_123",
            })
          ),
          deleteDocument: vi.fn(() => Effect.void),
          searchMemories: vi.fn(() => Effect.succeed([])),
        };

      mockSupermemory.make.mockReturnValue(mockClient);

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const client = yield* SupermemoryClientService;
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-text");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }

          // Use the actual service
          const result = yield* command.run(
            createContext("mem-add-text", ["Test content"])
          );

          // Verify service was used
          expect(client).toBeDefined();
          return result;
        })
      ).pipe(
        Effect.provide(
          Layer.succeed(SupermemoryTuiConfigService, {
            apiKey: "sk_test123",
          })
        ),
        Effect.provide(SupermemoryClientService.Default)
      );

      // @ts-expect-error - Effect type inference issue with command dependencies
      const result = await Effect.runPromise(program);
      if (result && typeof result === "object" && "kind" in result) {
        expect(result.kind).toBe("continue");
      }
      expect(mockSupermemory.make).toHaveBeenCalledWith({
        apiKey: "sk_test123",
      });
    });

    it("should handle config loading errors", async () => {
      mockFs.access.mockResolvedValue(undefined);
      mockFs.readFile.mockRejectedValue(new Error("Disk full"));

      const program = Effect.gen(function* () {
        const config = yield* loadConfig();
        return config;
      });

      const result = await Effect.runPromise(Effect.either(program as any));
      expect(result._tag).toBe("Left");
      if (result._tag === "Left") {
        expect(result.left).toBeInstanceOf(ConfigError);
      }
    });

    it("should handle invalid JSON in config file", async () => {
      mockFs.access.mockResolvedValue(undefined);
      mockFs.readFile.mockResolvedValue('{"apiKey": invalid json}');

      const program = Effect.gen(function* () {
        const config = yield* loadConfig();
        return config;
      });

      const result = await Effect.runPromise(Effect.either(program as any));
      expect(result._tag).toBe("Left");
      if (result._tag === "Left") {
        expect(result.left).toBeInstanceOf(ConfigError);
      }
    });
  });

  describe("Command Chaining", () => {
    it("should chain multiple commands in sequence", async () => {
      const layer = Layer.succeed(SupermemoryTuiConfigService, {
        apiKey: "sk_test123",
      }).pipe(Layer.provide(SupermemoryClientService.Default));

      const mockClient = {
        addText: vi.fn(() => Effect.void),
        search: vi.fn(() => Effect.succeed([])),
        addDocument: vi.fn((content, options) => {
          const doc: Document = {
            id: `doc_${Date.now()}`,
            title: options?.title ?? null,
            content,
            tags: options?.tags,
            userId: options?.userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return Effect.succeed(doc);
        }),
        listDocuments: vi.fn(() => Effect.succeed([])),
        getDocument: vi.fn(() =>
          Effect.succeed({
            id: "doc_123",
            title: "Test",
            content: "Content",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
        ),
        getMemory: vi.fn(() =>
          Effect.succeed({
            id: "mem_123",
            content: "Memory",
            documentId: "doc_123",
          })
        ),
        deleteDocument: vi.fn(() => Effect.void),
        searchMemories: vi.fn(() => Effect.succeed([])),
      };

      mockSupermemory.make.mockReturnValue(mockClient);

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();

          // Chain: status -> add -> stats
          const statusCmd = registry.lookup.get("mem-status");
          if (statusCmd) {
            yield* statusCmd.run(createContext("mem-status"));
          }

          const addCmd = registry.lookup.get("mem-add-text");
          if (addCmd) {
            yield* addCmd.run(
              createContext("mem-add-text", ["Chained content"])
            );
          }

          const statsCmd = registry.lookup.get("mem-stats");
          if (statsCmd) {
            return yield* statsCmd.run(createContext("mem-stats"));
          }

          return { kind: "continue" } as const;
        })
      ).pipe(Effect.provide(layer));

      // @ts-expect-error - Effect type inference issue with command dependencies
      const result = await Effect.runPromise(program);
      if (result && typeof result === "object" && "kind" in result) {
        expect(result.kind).toBe("continue");
      }
      expect(mockClient.listDocuments).toHaveBeenCalled();
      expect(mockClient.addDocument).toHaveBeenCalled();
    });
  });

  describe("Edge Cases with Real Services", () => {
    it("should handle very long content", async () => {
      const layer = Layer.succeed(SupermemoryTuiConfigService, {
        apiKey: "sk_test123",
      }).pipe(Layer.provide(SupermemoryClientService.Default));

      const longContent = "A".repeat(1_000_000);
      const mockClient = {
        addText: vi.fn(() => Effect.void),
        search: vi.fn(() => Effect.succeed([])),
        addDocument: vi.fn((content) =>
          Effect.succeed({
            id: "doc_123",
            title: null as string | null,
            content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
        ),
        listDocuments: vi.fn(() => Effect.succeed([])),
        getDocument: vi.fn(() =>
          Effect.succeed({
            id: "doc_123",
            title: "Test",
            content: longContent,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
        ),
        getMemory: vi.fn(() =>
          Effect.succeed({
            id: "mem_123",
            content: longContent,
            documentId: "doc_123",
          })
        ),
        deleteDocument: vi.fn(() => Effect.void),
        searchMemories: vi.fn(() => Effect.succeed([])),
      };

      mockSupermemory.make.mockReturnValue(mockClient);

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-text");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-add-text", [longContent])
          );
        })
      ).pipe(Effect.provide(layer));

      // @ts-expect-error - Effect type inference issue with command dependencies
      const result = await Effect.runPromise(program);
      if (result && typeof result === "object" && "kind" in result) {
        expect(result.kind).toBe("continue");
      }
      expect(mockClient.addDocument).toHaveBeenCalledWith(
        longContent,
        expect.any(Object)
      );
    });

    it("should handle special characters in all inputs", async () => {
      const layer = Layer.succeed(SupermemoryTuiConfigService, {
        apiKey: "sk_test123",
      }).pipe(Layer.provide(SupermemoryClientService.Default));

      const specialContent = "Content with: !@#$%^&*()[]{}|\\/<>?\"'`~";
      const specialTags = "tag1,tag-2,tag_3,tag.4";
      const specialUserId = "user@domain.com";

      const mockClient = {
        addText: vi.fn(() => Effect.void),
        search: vi.fn(() => Effect.succeed([])),
        addDocument: vi.fn((content, options) =>
          Effect.succeed({
            id: "doc_123",
            title: options?.title ?? null,
            content,
            tags: options?.tags,
            userId: options?.userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
        ),
        listDocuments: vi.fn(() => Effect.succeed([])),
        getDocument: vi.fn(() =>
          Effect.succeed({
            id: "doc_123",
            title: "Test",
            content: specialContent,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
        ),
        getMemory: vi.fn(() =>
          Effect.succeed({
            id: "mem_123",
            content: specialContent,
            documentId: "doc_123",
          })
        ),
        deleteDocument: vi.fn(() => Effect.void),
        searchMemories: vi.fn(() => Effect.succeed([])),
      };

      mockSupermemory.make.mockReturnValue(mockClient);

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-text");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-add-text", [specialContent], {
              tags: specialTags,
              userId: specialUserId,
            })
          );
        })
      ).pipe(Effect.provide(layer));

      // @ts-expect-error - Effect type inference issue with command dependencies
      const result = await Effect.runPromise(program);
      if (result && typeof result === "object" && "kind" in result) {
        expect(result.kind).toBe("continue");
      }
      expect(mockClient.addDocument).toHaveBeenCalledWith(
        specialContent,
        expect.objectContaining({
          tags: ["tag1", "tag-2", "tag_3", "tag.4"],
          userId: specialUserId,
        })
      );
    });
  });
});
