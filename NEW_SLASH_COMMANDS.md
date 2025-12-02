# New Slash Commands Implementation

## Summary

Successfully implemented 4 new built-in slash commands for the effect-cli-tui library:

### ✅ Implemented Commands

1. **`/clear` (alias: `/cls`)** - Clear the terminal screen

   - Uses ANSI escape codes (`\x1b[2J\x1b[H`)
   - Returns `continue` to allow prompt to resume

2. **`/history` (alias: `/h`)** - Show session command history

   - Displays timestamp, prompt type, and input for each history entry
   - Automatically masks password inputs as `********`
   - Shows friendly message if history is empty

3. **`/save`** - Save session history to a JSON file

   - Creates timestamped file: `session-YYYY-MM-DDTHH-MM-SS.json`
   - Saves in current working directory
   - Includes all session metadata and entries

4. **`/load`** - Load and display previous session from file
   - Lists all available `session-*.json` files
   - Loads and displays the most recent session
   - Shows formatted history with timestamps

### 🏗️ Infrastructure Added

- **SessionHistory class** - Manages command history tracking

  - `add()` - Add new history entry
  - `getAll()` - Retrieve all entries
  - `clear()` - Reset history
  - `toJSON()` - Serialize to JSON string
  - `fromJSON()` - Deserialize from JSON string

- **Exported Functions**
  - `getSessionHistory()` - Access global history instance
  - `addToHistory()` - Add entry to history (for integration)

### 📝 History Entry Structure

```typescript
interface SessionHistoryEntry {
  readonly timestamp: string; // ISO 8601 timestamp
  readonly promptKind: string; // "input" | "password" | "select" | "multiSelect"
  readonly promptMessage: string; // The prompt shown to user
  readonly input: string; // User's input/selection
}
```

### 🧪 Tests

Added comprehensive test coverage (15 tests total):

- ✅ Command parsing tests
- ✅ Registry tests
- ✅ All 6 default commands tested (help, quit, clear, history, save, load)
- ✅ Password masking in history
- ✅ Session history tracking
- ✅ JSON serialization/deserialization
- ✅ Error handling

All tests passing: **15/15** ✓

### 📚 Documentation

Updated:

- ✅ README.md - Added new commands to built-in commands list
- ✅ examples/slash-commands.tsx - Updated example with new commands
- ✅ src/index.ts - Exported new functions and types

### 🔧 Technical Details

**Dependencies Added:**

- `node:fs/promises` - For file I/O operations
- `node:path` - For file path handling

**Type Safety:**

- Changed `TUIError` import from `import type` to regular import
- Added proper error mapping from `Error` to `TUIError`
- All type checks pass

**Integration:**

- Commands work in all TUIHandler methods: `prompt()`, `password()`, `selectOption()`, `multiSelect()`
- Session history is global and persistent across the session
- File operations use Effect's `tryPromise` with proper error handling

### 📋 Usage Example

```typescript
import { TUIHandler, addToHistory } from "effect-cli-tui";
import { Effect } from "effect";

const program = Effect.gen(function* () {
  const tui = yield* TUIHandler;

  // User can type /clear, /history, /save, /load, or /quit
  const name = yield* tui.prompt("Enter your name:");

  // History is automatically tracked
  // Use /history to view it
  // Use /save to save it to file
  // Use /load to load previous session
});
```

### 🎯 Features

- **Password Protection**: Passwords are automatically masked in history output
- **Persistence**: History can be saved and loaded between sessions
- **Timestamps**: All entries include ISO 8601 timestamps
- **User-Friendly**: Clear error messages and helpful output
- **Type-Safe**: Full TypeScript support with proper error types

## Files Modified

1. `src/tui-slash-commands.ts` - Added commands and session history
2. `src/index.ts` - Exported new functions
3. `src/types.ts` - No changes needed (already had error types)
4. `__tests__/unit/tui-slash-commands.test.ts` - Added tests
5. `README.md` - Updated documentation
6. `examples/slash-commands.tsx` - Updated example

## Next Steps (Optional Enhancements)

- [ ] Add command argument parsing (e.g., `/save custom-name.json`)
- [ ] Add `/save --format=csv` for different export formats
- [ ] Add `/load <filename>` to load specific files
- [ ] Add configuration for history limit (max entries)
- [ ] Add `/history --clear` to clear history inline
- [ ] Add auto-save on session exit
