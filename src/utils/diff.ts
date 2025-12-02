/**
 * Simple unified diff generator
 *
 * Creates a basic unified diff format string from before/after content.
 * This is a minimal implementation for preview purposes.
 */

/**
 * Generate a unified diff string
 *
 * @param oldContent - The original content
 * @param newContent - The new content
 * @param filePath - The file path (for diff header)
 * @returns Unified diff string
 */
export function makeUnifiedDiff(
  oldContent: string,
  newContent: string,
  filePath: string
): string {
  const oldLines = oldContent.split("\n");
  const newLines = newContent.split("\n");

  // Simple line-by-line comparison
  const diff: string[] = [];
  diff.push(`--- ${filePath} (original)`);
  diff.push(`+++ ${filePath} (modified)`);
  diff.push("@@ -1,0 +1,0 @@");

  // Find differences
  const maxLen = Math.max(oldLines.length, newLines.length);
  for (let i = 0; i < maxLen; i++) {
    const oldLine = oldLines[i];
    const newLine = newLines[i];

    if (oldLine === undefined && newLine !== undefined) {
      diff.push(`+${newLine}`);
    } else if (oldLine !== undefined && newLine === undefined) {
      diff.push(`-${oldLine}`);
    } else if (oldLine !== newLine) {
      diff.push(`-${oldLine}`);
      diff.push(`+${newLine}`);
    } else {
      diff.push(` ${oldLine}`);
    }
  }

  return diff.join("\n");
}
