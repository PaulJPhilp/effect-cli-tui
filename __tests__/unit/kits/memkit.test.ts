import * as fs from "node:fs/promises";
import * as path from "node:path";
import { Effect, Layer } from "effect";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemKit, withKit } from "../../../src/kits";
import {
  type Document,
  type Memory,
  MissingSupermemoryApiKey,
  type SupermemoryClient,
  SupermemoryClientService,
  SupermemoryError,
} from "../../../src/supermemory/client";
import { getGlobalSlashCommandRegistry } from "../../../src/tui-slash-commands";

// Mock fs operations
vi.mock("node:fs/promises", () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
  access: vi.fn(),
}));

// Helper to create mock client
function createMockClient(): SupermemoryClient {
  return {
    addText: vi.fn(() => Effect.void),
    search: vi.fn(() => Effect.succeed([])),
    addDocument: vi.fn((content, options) =>
      Effect.succeed({
        id: `doc_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        title: options?.title ?? null,
        content,
        tags: options?.tags,
        userId: options?.userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    ),
    listDocuments: vi.fn(() => Effect.succeed([])),
    getDocument: vi.fn((docId) =>
      Effect.succeed({
        id: docId,
        title: "Test Document",
        content: "Test content",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    ),
    getMemory: vi.fn((memId) =>
      Effect.succeed({
        id: memId,
        content: "Test memory content",
        documentId: "doc_123",
        documentTitle: "Test Document",
        score: 0.95,
      })
    ),
    deleteDocument: vi.fn(() => Effect.void),
    searchMemories: vi.fn(() => Effect.succeed([])),
  };
}

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

describe("MemKit", () => {
  describe("Kit Definition", () => {
    it("should have correct metadata", () => {
      expect(MemKit.id).toBe("memkit");
      expect(MemKit.name).toBe("Memory Kit");
      expect(MemKit.description).toBe(
        "Commands for adding, searching, inspecting, and tidying Supermemory-backed memories."
      );
      expect(MemKit.version).toBe("1.0.0");
      expect(MemKit.commands.length).toBe(9);
    });

    it("should have all expected commands", () => {
      const commandNames = MemKit.commands.map((cmd) => cmd.name);
      expect(commandNames).toContain("mem-status");
      expect(commandNames).toContain("mem-add-text");
      expect(commandNames).toContain("mem-add-file");
      expect(commandNames).toContain("mem-add-url");
      expect(commandNames).toContain("mem-search");
      expect(commandNames).toContain("mem-show-doc");
      expect(commandNames).toContain("mem-show-mem");
      expect(commandNames).toContain("mem-rm-doc");
      expect(commandNames).toContain("mem-stats");
    });

    it("should have command descriptions", () => {
      const statusCmd = MemKit.commands.find((c) => c.name === "mem-status");
      expect(statusCmd?.description).toBe(
        "Check Supermemory connectivity and status"
      );

      const addTextCmd = MemKit.commands.find((c) => c.name === "mem-add-text");
      expect(addTextCmd?.description).toBe(
        "Add a text note as a Supermemory document"
      );
    });
  });

  describe("Commands with Kit Enabled", () => {
    it("should make all commands available when kit is enabled", async () => {
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          return {
            hasStatus: registry.lookup.has("mem-status"),
            hasAddText: registry.lookup.has("mem-add-text"),
            hasAddFile: registry.lookup.has("mem-add-file"),
            hasAddUrl: registry.lookup.has("mem-add-url"),
            hasSearch: registry.lookup.has("mem-search"),
            hasShowDoc: registry.lookup.has("mem-show-doc"),
            hasShowMem: registry.lookup.has("mem-show-mem"),
            hasRmDoc: registry.lookup.has("mem-rm-doc"),
            hasStats: registry.lookup.has("mem-stats"),
          };
        })
      );

      const result = await Effect.runPromise(program);
      expect(result.hasStatus).toBe(true);
      expect(result.hasAddText).toBe(true);
      expect(result.hasAddFile).toBe(true);
      expect(result.hasAddUrl).toBe(true);
      expect(result.hasSearch).toBe(true);
      expect(result.hasShowDoc).toBe(true);
      expect(result.hasShowMem).toBe(true);
      expect(result.hasRmDoc).toBe(true);
      expect(result.hasStats).toBe(true);
    });
  });

  describe("/mem-status command", () => {
    const mockClient = createMockClient();
    const mockLayer = Layer.succeed(SupermemoryClientService, mockClient);

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should show connected status when client works", async () => {
      mockClient.listDocuments = vi.fn(() =>
        Effect.succeed([
          {
            id: "doc1",
            title: "Doc 1",
            content: "Content",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ])
      );

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
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.listDocuments).toHaveBeenCalled();
    });

    it("should show disconnected status when client fails", async () => {
      mockClient.listDocuments = vi.fn(() =>
        Effect.fail(new SupermemoryError({ message: "Connection failed" }))
      );

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
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
    });

    it("should handle MissingSupermemoryApiKey error", async () => {
      mockClient.listDocuments = vi.fn(() =>
        Effect.fail(
          new MissingSupermemoryApiKey({
            message: "No Supermemory API key configured",
          })
        )
      );

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
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
    });

    it("should display document count when connected", async () => {
      const docs: Document[] = [
        {
          id: "doc1",
          title: "Doc 1",
          content: "Content 1",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "doc2",
          title: "Doc 2",
          content: "Content 2",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      mockClient.listDocuments = vi.fn(() => Effect.succeed(docs));

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
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.listDocuments).toHaveBeenCalledWith({ limit: 1000 });
    });

    it("should handle large document lists", async () => {
      const docs: Document[] = Array.from({ length: 500 }, (_, i) => ({
        id: `doc${i}`,
        title: `Doc ${i}`,
        content: `Content ${i}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      mockClient.listDocuments = vi.fn(() => Effect.succeed(docs));

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
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
    });
  });

  describe("/mem-add-text command", () => {
    const mockClient = createMockClient();
    const mockLayer = Layer.succeed(SupermemoryClientService, mockClient);

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should add text document with default title", async () => {
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-text");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-add-text", ["This is test content"])
          );
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.addDocument).toHaveBeenCalledWith(
        "This is test content",
        expect.objectContaining({
          title: expect.any(String),
        })
      );
    });

    it("should derive title from short text", async () => {
      const shortText = "Short text";
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-text");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-add-text", [shortText]));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.addDocument).toHaveBeenCalledWith(
        shortText,
        expect.objectContaining({
          title: shortText,
        })
      );
    });

    it("should truncate long title", async () => {
      const longText = "A".repeat(100);
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-text");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-add-text", [longText]));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      const call = (mockClient.addDocument as ReturnType<typeof vi.fn>).mock
        .calls[0];
      expect(call[1]?.title?.length).toBeLessThanOrEqual(53); // 50 + "..."
    });

    it("should add text document with custom title", async () => {
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-text");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-add-text", ["Content"], {
              title: "My Custom Title",
            })
          );
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.addDocument).toHaveBeenCalledWith(
        "Content",
        expect.objectContaining({
          title: "My Custom Title",
        })
      );
    });

    it("should add text document with tags", async () => {
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-text");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-add-text", ["Content"], {
              tags: "tag1,tag2,tag3",
            })
          );
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.addDocument).toHaveBeenCalledWith(
        "Content",
        expect.objectContaining({
          tags: ["tag1", "tag2", "tag3"],
        })
      );
    });

    it("should add text document with userId", async () => {
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-text");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-add-text", ["Content"], {
              userId: "user123",
            })
          );
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.addDocument).toHaveBeenCalledWith(
        "Content",
        expect.objectContaining({
          userId: "user123",
        })
      );
    });

    it("should handle multi-word text content", async () => {
      const words = ["This", "is", "a", "multi-word", "text", "content"];
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-text");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-add-text", words));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.addDocument).toHaveBeenCalledWith(
        words.join(" "),
        expect.any(Object)
      );
    });

    it("should handle special characters in content", async () => {
      const specialText = "Content with special chars: !@#$%^&*()[]{}|\\/<>?";
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-text");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-add-text", [specialText])
          );
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.addDocument).toHaveBeenCalledWith(
        specialText,
        expect.any(Object)
      );
    });

    it("should handle empty text gracefully", async () => {
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-text");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-add-text", []));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.addDocument).not.toHaveBeenCalled();
    });

    it("should handle whitespace-only text", async () => {
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-text");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-add-text", ["   ", "  "])
          );
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.addDocument).not.toHaveBeenCalled();
    });

    it("should handle tags with whitespace", async () => {
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-text");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-add-text", ["Content"], {
              tags: " tag1 , tag2 , tag3 ",
            })
          );
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.addDocument).toHaveBeenCalledWith(
        "Content",
        expect.objectContaining({
          tags: ["tag1", "tag2", "tag3"],
        })
      );
    });

    it("should handle empty tags string", async () => {
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-text");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-add-text", ["Content"], { tags: "" })
          );
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      const call = (mockClient.addDocument as ReturnType<typeof vi.fn>).mock
        .calls[0];
      expect(call[1]?.tags).toBeUndefined();
    });

    it("should handle single tag", async () => {
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-text");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-add-text", ["Content"], {
              tags: "singletag",
            })
          );
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.addDocument).toHaveBeenCalledWith(
        "Content",
        expect.objectContaining({
          tags: ["singletag"],
        })
      );
    });

    it("should handle all options together", async () => {
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-text");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-add-text", ["Content"], {
              title: "Title",
              tags: "tag1,tag2",
              userId: "user123",
            })
          );
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.addDocument).toHaveBeenCalledWith(
        "Content",
        expect.objectContaining({
          title: "Title",
          tags: ["tag1", "tag2"],
          userId: "user123",
        })
      );
    });

    it("should handle MissingSupermemoryApiKey error", async () => {
      mockClient.addDocument = vi.fn(() =>
        Effect.fail(
          new MissingSupermemoryApiKey({
            message: "No Supermemory API key configured",
          })
        )
      );

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
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
    });

    it("should handle SupermemoryError", async () => {
      mockClient.addDocument = vi.fn(() =>
        Effect.fail(new SupermemoryError({ message: "Rate limit exceeded" }))
      );

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
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
    });
  });

  describe("/mem-add-file command", () => {
    const mockClient = createMockClient();
    const mockLayer = Layer.succeed(SupermemoryClientService, mockClient);

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should add file as document", async () => {
      const fileContent = "File content here";
      const filePath = path.join(process.cwd(), "test.txt");
      (fs.readFile as ReturnType<typeof vi.fn>).mockResolvedValue(fileContent);

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-file");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-add-file", ["test.txt"])
          );
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(fs.readFile).toHaveBeenCalledWith(filePath, "utf-8");
      expect(mockClient.addDocument).toHaveBeenCalledWith(
        fileContent,
        expect.objectContaining({
          title: "test.txt",
        })
      );
    });

    it("should add file with custom title", async () => {
      const fileContent = "File content";
      const filePath = path.join(process.cwd(), "test.txt");
      (fs.readFile as ReturnType<typeof vi.fn>).mockResolvedValue(fileContent);

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-file");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-add-file", ["test.txt"], {
              title: "Custom Title",
            })
          );
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(fs.readFile).toHaveBeenCalledWith(filePath, "utf-8");
      expect(mockClient.addDocument).toHaveBeenCalledWith(
        fileContent,
        expect.objectContaining({
          title: "Custom Title",
        })
      );
    });

    it("should handle absolute paths", async () => {
      const fileContent = "Content";
      const absPath = "/absolute/path/to/file.txt";
      (fs.readFile as ReturnType<typeof vi.fn>).mockResolvedValue(fileContent);

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-file");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-add-file", [absPath]));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(fs.readFile).toHaveBeenCalledWith(absPath, "utf-8");
    });

    it("should handle relative paths", async () => {
      const fileContent = "Content";
      const relPath = "relative/file.txt";
      const expectedPath = path.join(process.cwd(), relPath);
      (fs.readFile as ReturnType<typeof vi.fn>).mockResolvedValue(fileContent);

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-file");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-add-file", [relPath]));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(fs.readFile).toHaveBeenCalledWith(expectedPath, "utf-8");
    });

    it("should handle file read errors", async () => {
      (fs.readFile as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error("File not found")
      );

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-file");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-add-file", ["nonexistent.txt"])
          );
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.addDocument).not.toHaveBeenCalled();
    });

    it("should handle missing file path", async () => {
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-file");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-add-file", []));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(fs.readFile).not.toHaveBeenCalled();
      expect(mockClient.addDocument).not.toHaveBeenCalled();
    });

    it("should add file with tags and userId", async () => {
      const fileContent = "Content";
      const filePath = path.join(process.cwd(), "test.txt");
      (fs.readFile as ReturnType<typeof vi.fn>).mockResolvedValue(fileContent);

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-file");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-add-file", ["test.txt"], {
              tags: "file,document",
              userId: "user123",
            })
          );
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(fs.readFile).toHaveBeenCalledWith(filePath, "utf-8");
      expect(mockClient.addDocument).toHaveBeenCalledWith(
        fileContent,
        expect.objectContaining({
          tags: ["file", "document"],
          userId: "user123",
        })
      );
    });

    it("should handle large files", async () => {
      const largeContent = "A".repeat(100_000);
      const _filePath = path.join(process.cwd(), "large.txt");
      (fs.readFile as ReturnType<typeof vi.fn>).mockResolvedValue(largeContent);

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-file");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-add-file", ["large.txt"])
          );
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.addDocument).toHaveBeenCalledWith(
        largeContent,
        expect.any(Object)
      );
    });

    it("should handle files with special characters in name", async () => {
      const fileContent = "Content";
      const fileName = "file with spaces & special chars.txt";
      const filePath = path.join(process.cwd(), fileName);
      (fs.readFile as ReturnType<typeof vi.fn>).mockResolvedValue(fileContent);

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-file");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-add-file", [fileName]));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(fs.readFile).toHaveBeenCalledWith(filePath, "utf-8");
    });
  });

  describe("/mem-add-url command", () => {
    const mockClient = createMockClient();
    const mockLayer = Layer.succeed(SupermemoryClientService, mockClient);

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should add http URL as document", async () => {
      const url = "http://example.com/page";
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-url");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-add-url", [url]));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.addDocument).toHaveBeenCalledWith(
        url,
        expect.any(Object)
      );
    });

    it("should add https URL as document", async () => {
      const url = "https://example.com/page";
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-url");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-add-url", [url]));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.addDocument).toHaveBeenCalledWith(
        url,
        expect.any(Object)
      );
    });

    it("should handle URLs with ports", async () => {
      const url = "http://example.com:8080/page";
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-url");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-add-url", [url]));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.addDocument).toHaveBeenCalled();
    });

    it("should handle URLs with query parameters", async () => {
      const url = "https://example.com/page?param=value&other=123";
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-url");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-add-url", [url]));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.addDocument).toHaveBeenCalled();
    });

    it("should handle URLs with fragments", async () => {
      const url = "https://example.com/page#section";
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-url");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-add-url", [url]));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.addDocument).toHaveBeenCalled();
    });

    it("should reject non-http/https URLs", async () => {
      const url = "ftp://example.com/file";
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-url");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-add-url", [url]));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.addDocument).not.toHaveBeenCalled();
    });

    it("should reject invalid URL format", async () => {
      const url = "not-a-url";
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-url");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-add-url", [url]));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.addDocument).not.toHaveBeenCalled();
    });

    it("should handle missing URL", async () => {
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-url");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-add-url", []));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.addDocument).not.toHaveBeenCalled();
    });

    it("should add URL with title and tags", async () => {
      const url = "https://example.com";
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-url");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-add-url", [url], {
              title: "Example Site",
              tags: "web,reference",
            })
          );
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.addDocument).toHaveBeenCalledWith(
        url,
        expect.objectContaining({
          title: "Example Site",
          tags: ["web", "reference"],
        })
      );
    });

    it("should handle URL without title (null)", async () => {
      const url = "https://example.com";
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-url");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-add-url", [url]));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      const call = (mockClient.addDocument as ReturnType<typeof vi.fn>).mock
        .calls[0];
      expect(call[1]?.title).toBeUndefined();
    });
  });

  describe("/mem-search command", () => {
    const mockClient = createMockClient();
    const mockLayer = Layer.succeed(SupermemoryClientService, mockClient);

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should search with default limit", async () => {
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-search");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-search", ["test query"])
          );
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.searchMemories).toHaveBeenCalledWith(
        "test query",
        expect.objectContaining({
          topK: 10,
        })
      );
    });

    it("should search with custom limit", async () => {
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-search");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-search", ["query"], { limit: "5" })
          );
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.searchMemories).toHaveBeenCalledWith(
        "query",
        expect.objectContaining({
          topK: 5,
        })
      );
    });

    it("should search with tags filter", async () => {
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-search");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-search", ["query"], { tags: "tag1,tag2" })
          );
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.searchMemories).toHaveBeenCalledWith(
        "query",
        expect.objectContaining({
          tags: ["tag1", "tag2"],
        })
      );
    });

    it("should search with docId filter", async () => {
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-search");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-search", ["query"], { docId: "doc_123" })
          );
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.searchMemories).toHaveBeenCalledWith(
        "query",
        expect.objectContaining({
          docId: "doc_123",
        })
      );
    });

    it("should search with all filters combined", async () => {
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-search");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-search", ["query"], {
              limit: "20",
              tags: "tag1,tag2",
              docId: "doc_123",
            })
          );
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.searchMemories).toHaveBeenCalledWith(
        "query",
        expect.objectContaining({
          topK: 20,
          tags: ["tag1", "tag2"],
          docId: "doc_123",
        })
      );
    });

    it("should handle empty query", async () => {
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-search");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-search", []));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.searchMemories).not.toHaveBeenCalled();
    });

    it("should handle multi-word query", async () => {
      const words = ["multi", "word", "search", "query"];
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-search");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-search", words));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.searchMemories).toHaveBeenCalledWith(
        words.join(" "),
        expect.any(Object)
      );
    });

    it("should display search results", async () => {
      const memories: Memory[] = [
        {
          id: "mem1",
          content: "First memory content",
          documentId: "doc1",
          documentTitle: "Doc 1",
          score: 0.95,
        },
        {
          id: "mem2",
          content: "Second memory content",
          documentId: "doc2",
          score: 0.85,
        },
      ];
      mockClient.searchMemories = vi.fn(() => Effect.succeed(memories));

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-search");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-search", ["test"]));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
    });

    it("should handle empty search results", async () => {
      mockClient.searchMemories = vi.fn(() => Effect.succeed([]));

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-search");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-search", ["nonexistent"])
          );
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
    });

    it("should handle memories with long content (truncation)", async () => {
      const longContent = "A".repeat(200);
      const memories: Memory[] = [
        {
          id: "mem1",
          content: longContent,
          documentId: "doc1",
          score: 0.9,
        },
      ];
      mockClient.searchMemories = vi.fn(() => Effect.succeed(memories));

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-search");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-search", ["test"]));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
    });

    it("should handle memories without scores", async () => {
      const memories: Memory[] = [
        {
          id: "mem1",
          content: "Content",
          documentId: "doc1",
        },
      ];
      mockClient.searchMemories = vi.fn(() => Effect.succeed(memories));

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-search");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-search", ["test"]));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
    });
  });

  describe("/mem-show-doc command", () => {
    const mockClient = createMockClient();
    const mockLayer = Layer.succeed(SupermemoryClientService, mockClient);

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should display document details", async () => {
      const doc: Document = {
        id: "doc_123",
        title: "Test Document",
        content: "Document content here",
        tags: ["tag1", "tag2"],
        userId: "user123",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-02T00:00:00Z",
      };
      mockClient.getDocument = vi.fn(() => Effect.succeed(doc));

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-show-doc");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-show-doc", ["doc_123"]));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.getDocument).toHaveBeenCalledWith("doc_123");
    });

    it("should display document without title", async () => {
      const doc: Document = {
        id: "doc_123",
        title: null,
        content: "Content",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockClient.getDocument = vi.fn(() => Effect.succeed(doc));

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-show-doc");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-show-doc", ["doc_123"]));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
    });

    it("should display document without tags", async () => {
      const doc: Document = {
        id: "doc_123",
        title: "Test",
        content: "Content",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockClient.getDocument = vi.fn(() => Effect.succeed(doc));

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-show-doc");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-show-doc", ["doc_123"]));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
    });

    it("should display document without userId", async () => {
      const doc: Document = {
        id: "doc_123",
        title: "Test",
        content: "Content",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockClient.getDocument = vi.fn(() => Effect.succeed(doc));

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-show-doc");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-show-doc", ["doc_123"]));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
    });

    it("should handle missing docId", async () => {
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-show-doc");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-show-doc", []));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.getDocument).not.toHaveBeenCalled();
    });

    it("should handle document not found error", async () => {
      mockClient.getDocument = vi.fn(() =>
        Effect.fail(new SupermemoryError({ message: "Document not found" }))
      );

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
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
    });

    it("should show sample memories when available", async () => {
      const doc: Document = {
        id: "doc_123",
        title: "Test",
        content: "Content",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const memories: Memory[] = [
        {
          id: "mem1",
          content: "Memory 1",
          documentId: "doc_123",
        },
      ];
      mockClient.getDocument = vi.fn(() => Effect.succeed(doc));
      mockClient.searchMemories = vi.fn(() => Effect.succeed(memories));

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-show-doc");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-show-doc", ["doc_123"]));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
    });

    it("should handle invalid date strings", async () => {
      const doc: Document = {
        id: "doc_123",
        title: "Test",
        content: "Content",
        createdAt: "invalid-date",
        updatedAt: "also-invalid",
      };
      mockClient.getDocument = vi.fn(() => Effect.succeed(doc));

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-show-doc");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-show-doc", ["doc_123"]));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
    });

    it("should handle long document content", async () => {
      const longContent = "A".repeat(5000);
      const doc: Document = {
        id: "doc_123",
        title: "Test",
        content: longContent,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockClient.getDocument = vi.fn(() => Effect.succeed(doc));

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-show-doc");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-show-doc", ["doc_123"]));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
    });
  });

  describe("/mem-show-mem command", () => {
    const mockClient = createMockClient();
    const mockLayer = Layer.succeed(SupermemoryClientService, mockClient);

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should display memory details", async () => {
      const memory: Memory = {
        id: "mem_123",
        content: "Memory content here",
        documentId: "doc_123",
        documentTitle: "Test Document",
        score: 0.95,
        tags: ["tag1"],
      };
      mockClient.getMemory = vi.fn(() => Effect.succeed(memory));

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-show-mem");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-show-mem", ["mem_123"]));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.getMemory).toHaveBeenCalledWith("mem_123");
    });

    it("should display memory without documentTitle", async () => {
      const memory: Memory = {
        id: "mem_123",
        content: "Content",
        documentId: "doc_123",
      };
      mockClient.getMemory = vi.fn(() => Effect.succeed(memory));

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-show-mem");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-show-mem", ["mem_123"]));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
    });

    it("should display memory without score", async () => {
      const memory: Memory = {
        id: "mem_123",
        content: "Content",
        documentId: "doc_123",
      };
      mockClient.getMemory = vi.fn(() => Effect.succeed(memory));

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-show-mem");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-show-mem", ["mem_123"]));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
    });

    it("should display memory without tags", async () => {
      const memory: Memory = {
        id: "mem_123",
        content: "Content",
        documentId: "doc_123",
        score: 0.9,
      };
      mockClient.getMemory = vi.fn(() => Effect.succeed(memory));

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-show-mem");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-show-mem", ["mem_123"]));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
    });

    it("should handle missing memId", async () => {
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-show-mem");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-show-mem", []));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.getMemory).not.toHaveBeenCalled();
    });

    it("should handle memory not found error", async () => {
      mockClient.getMemory = vi.fn(() =>
        Effect.fail(new SupermemoryError({ message: "Memory not found" }))
      );

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
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
    });

    it("should handle long memory content", async () => {
      const longContent = "A".repeat(5000);
      const memory: Memory = {
        id: "mem_123",
        content: longContent,
        documentId: "doc_123",
      };
      mockClient.getMemory = vi.fn(() => Effect.succeed(memory));

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-show-mem");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-show-mem", ["mem_123"]));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
    });
  });

  describe("/mem-rm-doc command", () => {
    const mockClient = createMockClient();
    const mockLayer = Layer.succeed(SupermemoryClientService, mockClient);

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should delete document with force flag", async () => {
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
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.deleteDocument).toHaveBeenCalledWith("doc_123");
    });

    it("should delete document with 'f' flag", async () => {
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-rm-doc");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-rm-doc", ["doc_123"], { f: true })
          );
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.deleteDocument).toHaveBeenCalledWith("doc_123");
    });

    it("should not delete without force flag", async () => {
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-rm-doc");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-rm-doc", ["doc_123"]));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.deleteDocument).not.toHaveBeenCalled();
    });

    it("should handle missing docId", async () => {
      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-rm-doc");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-rm-doc", []));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.deleteDocument).not.toHaveBeenCalled();
    });

    it("should handle delete errors", async () => {
      mockClient.deleteDocument = vi.fn(() =>
        Effect.fail(new SupermemoryError({ message: "Delete failed" }))
      );

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
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
    });
  });

  describe("/mem-stats command", () => {
    const mockClient = createMockClient();
    const mockLayer = Layer.succeed(SupermemoryClientService, mockClient);

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should display statistics", async () => {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);

      const docs: Document[] = [
        {
          id: "doc1",
          title: "Recent",
          content: "Content",
          createdAt: oneDayAgo.toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: "doc2",
          title: "Older",
          content: "Content",
          createdAt: threeDaysAgo.toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: "doc3",
          title: "Old",
          content: "Content",
          createdAt: tenDaysAgo.toISOString(),
          updatedAt: now.toISOString(),
        },
      ];
      mockClient.listDocuments = vi.fn(() => Effect.succeed(docs));

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-stats");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-stats"));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
      expect(mockClient.listDocuments).toHaveBeenCalled();
    });

    it("should calculate statistics correctly", async () => {
      const now = new Date();
      const halfDayAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
      const eightDaysAgo = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000);

      const docs: Document[] = [
        {
          id: "doc1",
          title: "Last 24h",
          content: "Content",
          createdAt: halfDayAgo.toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: "doc2",
          title: "Last 7d",
          content: "Content",
          createdAt: twoDaysAgo.toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: "doc3",
          title: "Older",
          content: "Content",
          createdAt: eightDaysAgo.toISOString(),
          updatedAt: now.toISOString(),
        },
      ];
      mockClient.listDocuments = vi.fn(() => Effect.succeed(docs));

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-stats");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-stats"));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
    });

    it("should handle empty document list", async () => {
      mockClient.listDocuments = vi.fn(() => Effect.succeed([]));

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-stats");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-stats"));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
    });

    it("should handle documents without createdAt", async () => {
      const docs: Document[] = [
        {
          id: "doc1",
          title: "Test",
          content: "Content",
          updatedAt: new Date().toISOString(),
        },
      ];
      mockClient.listDocuments = vi.fn(() => Effect.succeed(docs));

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-stats");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-stats"));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
    });

    it("should handle errors gracefully", async () => {
      mockClient.listDocuments = vi.fn(() =>
        Effect.fail(new SupermemoryError({ message: "Failed" }))
      );

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-stats");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-stats"));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
    });

    it("should handle large document lists", async () => {
      const docs: Document[] = Array.from({ length: 500 }, (_, i) => ({
        id: `doc${i}`,
        title: `Doc ${i}`,
        content: `Content ${i}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      mockClient.listDocuments = vi.fn(() => Effect.succeed(docs));

      const program = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-stats");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-stats"));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(program);
      expect(result.kind).toBe("continue");
    });
  });

  describe("Error Handling", () => {
    it("should handle MissingSupermemoryApiKey for all commands", async () => {
      const errorClient: SupermemoryClient = {
        addText: vi.fn(() => Effect.void),
        search: vi.fn(() => Effect.succeed([])),
        addDocument: vi.fn(() =>
          Effect.fail(
            new MissingSupermemoryApiKey({
              message: "No Supermemory API key configured",
            })
          )
        ),
        listDocuments: vi.fn(() =>
          Effect.fail(
            new MissingSupermemoryApiKey({
              message: "No Supermemory API key configured",
            })
          )
        ),
        getDocument: vi.fn(() =>
          Effect.fail(
            new MissingSupermemoryApiKey({
              message: "No Supermemory API key configured",
            })
          )
        ),
        getMemory: vi.fn(() =>
          Effect.fail(
            new MissingSupermemoryApiKey({
              message: "No Supermemory API key configured",
            })
          )
        ),
        deleteDocument: vi.fn(() =>
          Effect.fail(
            new MissingSupermemoryApiKey({
              message: "No Supermemory API key configured",
            })
          )
        ),
        searchMemories: vi.fn(() =>
          Effect.fail(
            new MissingSupermemoryApiKey({
              message: "No Supermemory API key configured",
            })
          )
        ),
      };

      const errorLayer = Layer.succeed(SupermemoryClientService, errorClient);
      const commands = [
        "mem-add-text",
        "mem-add-file",
        "mem-add-url",
        "mem-search",
        "mem-show-doc",
        "mem-show-mem",
        "mem-rm-doc",
        "mem-stats",
      ];

      for (const cmdName of commands) {
        const program = withKit(
          MemKit,
          Effect.gen(function* () {
            const registry = getGlobalSlashCommandRegistry();
            const command = registry.lookup.get(cmdName);
            if (!command) {
              return Effect.fail(new Error("Command not found"));
            }
            return yield* command.run(createContext(cmdName, ["test"]));
          })
        ).pipe(Effect.provide(errorLayer));

        const result = await Effect.runPromise(program);
        expect(result.kind).toBe("continue");
      }
    });

    it("should handle SupermemoryError for all commands", async () => {
      const errorClient: SupermemoryClient = {
        addText: vi.fn(() => Effect.void),
        search: vi.fn(() => Effect.succeed([])),
        addDocument: vi.fn(() =>
          Effect.fail(new SupermemoryError({ message: "Operation failed" }))
        ),
        listDocuments: vi.fn(() => Effect.succeed([])),
        getDocument: vi.fn(() =>
          Effect.fail(new SupermemoryError({ message: "Not found" }))
        ),
        getMemory: vi.fn(() =>
          Effect.fail(new SupermemoryError({ message: "Not found" }))
        ),
        deleteDocument: vi.fn(() =>
          Effect.fail(new SupermemoryError({ message: "Delete failed" }))
        ),
        searchMemories: vi.fn(() => Effect.succeed([])),
      };

      const errorLayer = Layer.succeed(SupermemoryClientService, errorClient);

      const testCases = [
        { cmd: "mem-add-text", args: ["content"] },
        { cmd: "mem-add-url", args: ["https://example.com"] },
        { cmd: "mem-search", args: ["query"] },
        { cmd: "mem-show-doc", args: ["doc_123"] },
        { cmd: "mem-show-mem", args: ["mem_123"] },
        { cmd: "mem-rm-doc", args: ["doc_123"], flags: { force: true } },
      ];

      for (const { cmd, args, flags = {} } of testCases) {
        const program = withKit(
          MemKit,
          Effect.gen(function* () {
            const registry = getGlobalSlashCommandRegistry();
            const command = registry.lookup.get(cmd);
            if (!command) {
              return Effect.fail(new Error("Command not found"));
            }
            return yield* command.run(createContext(cmd, args, flags));
          })
        ).pipe(Effect.provide(errorLayer));

        const result = await Effect.runPromise(program);
        expect(result.kind).toBe("continue");
      }
    });
  });

  describe("Integration Scenarios", () => {
    const mockClient = createMockClient();
    const mockLayer = Layer.succeed(SupermemoryClientService, mockClient);

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should handle workflow: add -> search -> show", async () => {
      const docId = "doc_123";
      const memId = "mem_456";
      mockClient.addDocument = vi.fn(() =>
        Effect.succeed({
          id: docId,
          title: "Test Doc",
          content: "Content",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      );
      mockClient.searchMemories = vi.fn(() =>
        Effect.succeed([
          {
            id: memId,
            content: "Found memory",
            documentId: docId,
            documentTitle: "Test Doc",
            score: 0.9,
          },
        ])
      );
      mockClient.getMemory = vi.fn(() =>
        Effect.succeed({
          id: memId,
          content: "Found memory",
          documentId: docId,
          documentTitle: "Test Doc",
          score: 0.9,
        })
      );

      // Add document
      const addProgram = withKit(
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
      ).pipe(Effect.provide(mockLayer));

      await Effect.runPromise(addProgram);
      expect(mockClient.addDocument).toHaveBeenCalled();

      // Search
      const searchProgram = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-search");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-search", ["Test"]));
        })
      ).pipe(Effect.provide(mockLayer));

      await Effect.runPromise(searchProgram);
      expect(mockClient.searchMemories).toHaveBeenCalled();

      // Show memory
      const showProgram = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-show-mem");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-show-mem", [memId]));
        })
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(showProgram);
      expect(result.kind).toBe("continue");
      expect(mockClient.getMemory).toHaveBeenCalledWith(memId);
    });

    it("should handle workflow: add file -> show doc -> delete", async () => {
      const docId = "doc_file_123";
      const fileContent = "File content";
      const _filePath = path.join(process.cwd(), "test.txt");
      (fs.readFile as ReturnType<typeof vi.fn>).mockResolvedValue(fileContent);

      mockClient.addDocument = vi.fn(() =>
        Effect.succeed({
          id: docId,
          title: "test.txt",
          content: fileContent,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      );
      mockClient.getDocument = vi.fn(() =>
        Effect.succeed({
          id: docId,
          title: "test.txt",
          content: fileContent,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      );

      // Add file
      const addProgram = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-add-file");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(
            createContext("mem-add-file", ["test.txt"])
          );
        })
      ).pipe(Effect.provide(mockLayer));

      await Effect.runPromise(addProgram);
      expect(mockClient.addDocument).toHaveBeenCalled();

      // Show doc
      const showProgram = withKit(
        MemKit,
        Effect.gen(function* () {
          const registry = getGlobalSlashCommandRegistry();
          const command = registry.lookup.get("mem-show-doc");
          if (!command) {
            return Effect.fail(new Error("Command not found"));
          }
          return yield* command.run(createContext("mem-show-doc", [docId]));
        })
      ).pipe(Effect.provide(mockLayer));

      await Effect.runPromise(showProgram);
      expect(mockClient.getDocument).toHaveBeenCalledWith(docId);

      // Delete
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
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(deleteProgram);
      expect(result.kind).toBe("continue");
      expect(mockClient.deleteDocument).toHaveBeenCalledWith(docId);
    });

    it("should handle multiple operations in sequence", async () => {
      let docCounter = 0;
      mockClient.addDocument = vi.fn(() => {
        docCounter++;
        return Effect.succeed({
          id: `doc_${docCounter}`,
          title: `Doc ${docCounter}`,
          content: `Content ${docCounter}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      });
      mockClient.listDocuments = vi.fn(() =>
        Effect.succeed(
          Array.from({ length: docCounter }, (_, i) => ({
            id: `doc_${i + 1}`,
            title: `Doc ${i + 1}`,
            content: `Content ${i + 1}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }))
        )
      );

      // Add multiple documents
      for (let i = 0; i < 3; i++) {
        const program = withKit(
          MemKit,
          Effect.gen(function* () {
            const registry = getGlobalSlashCommandRegistry();
            const command = registry.lookup.get("mem-add-text");
            if (!command) {
              return Effect.fail(new Error("Command not found"));
            }
            return yield* command.run(
              createContext("mem-add-text", [`Content ${i + 1}`])
            );
          })
        ).pipe(Effect.provide(mockLayer));

        await Effect.runPromise(program);
      }

      expect(mockClient.addDocument).toHaveBeenCalledTimes(3);

      // Check stats
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
      ).pipe(Effect.provide(mockLayer));

      const result = await Effect.runPromise(statsProgram);
      expect(result.kind).toBe("continue");
      expect(mockClient.listDocuments).toHaveBeenCalled();
    });
  });
});
