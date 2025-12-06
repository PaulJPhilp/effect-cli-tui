import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { Effect } from "effect";

const execFileAsync = promisify(execFile);

/**
 * Get the git root directory for the current workspace
 *
 * @returns Effect that resolves to the git root path, or null if not in a git repo
 */
export function getGitRoot(): Effect.Effect<string | null, never> {
  return Effect.tryPromise({
    try: async (): Promise<string> => {
      const { stdout } = await execFileAsync(
        "git",
        ["rev-parse", "--show-toplevel"],
        {
          cwd: process.cwd(),
          timeout: 5000,
        }
      );
      return stdout.trim();
    },
    catch: () => new Error("Git not available"),
  }).pipe(
    Effect.mapError(() => null),
    Effect.catchAll(() => Effect.succeed<string | null>(null))
  );
}

/**
 * Get the current git branch name
 *
 * @returns Effect that resolves to the branch name, or null if not in a git repo
 */
export function getCurrentBranch(): Effect.Effect<string | null, never> {
  return Effect.tryPromise({
    try: async (): Promise<string> => {
      const { stdout } = await execFileAsync(
        "git",
        ["rev-parse", "--abbrev-ref", "HEAD"],
        {
          cwd: process.cwd(),
          timeout: 5000,
        }
      );
      return stdout.trim();
    },
    catch: () => new Error("Git not available"),
  }).pipe(
    Effect.mapError(() => null),
    Effect.catchAll(() => Effect.succeed<string | null>(null))
  );
}

/**
 * Get a short git status summary
 *
 * @returns Effect that resolves to git status output, or null if not in a git repo
 */
export function getStatusSummary(): Effect.Effect<string | null, never> {
  return Effect.tryPromise({
    try: async (): Promise<string | null> => {
      const { stdout } = await execFileAsync("git", ["status", "--short"], {
        cwd: process.cwd(),
        timeout: 5000,
      });
      return stdout.trim() || null;
    },
    catch: () => new Error("Git not available"),
  }).pipe(
    Effect.mapError(() => null),
    Effect.catchAll(() => Effect.succeed<string | null>(null))
  );
}

/**
 * Check if the git working tree is clean (no uncommitted changes)
 *
 * @returns Effect that resolves to true if clean, false if dirty, null if not in a git repo
 */
export function isGitClean(): Effect.Effect<boolean | null> {
  return Effect.gen(function* () {
    const status = yield* getStatusSummary();
    if (status === null) {
      return null;
    }
    return status.length === 0;
  });
}
