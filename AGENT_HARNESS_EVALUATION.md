# Agent Harness Evaluation: effect-cli-tui

## Score Table

| #   | Feature                                         | Score (0–10) |
| --- | ----------------------------------------------- | ------------ |
| 1   | Workspace-aware conversational loop             | 4            |
| 2   | Command system (slash commands / palette)       | 9            |
| 3   | Mode / model management                         | 0            |
| 4   | Tool / MCP discovery & control                  | 5            |
| 5   | Safe execution & approval workflow              | 0            |
| 6   | Context & state visualization                   | 2            |
| 7   | History, logs, reproducibility                  | 5            |
| 8   | File-backed custom commands/modes               | 6            |
| 9   | Progress & phase feedback (plan → act → verify) | 4            |
| 10  | Help, config, onboarding                        | 5            |

**Overall Average: 4.0/10**

---

## Per-Feature Notes

### 1. Workspace-aware conversational loop — Score: 4

**Status: MVP**

**Evidence:**

- `SessionHistory` class exists in `src/tui-slash-commands.ts` (lines 31-67) with in-memory history tracking
- `/history`, `/save`, `/load` commands provide basic session persistence (`src/tui-slash-commands.ts:568-692`)
- History tracks user inputs across prompts with timestamps and prompt kinds
- No workspace/project context beyond `process.cwd()` usage in save/load commands
- No persistent workspace metadata (project name, git info, active kits per workspace)
- No concept of "resuming" a workspace session or workspace-specific state

**What's Missing:**

- Workspace-specific session files (currently saves to CWD)
- Project metadata tracking (git repo, package.json, etc.)
- Persistent context across restarts tied to workspace
- Multiple workspace support

**Files Referenced:**

- `src/tui-slash-commands.ts:31-67` (SessionHistory class)
- `src/tui-slash-commands.ts:568-692` (history/save/load commands)

---

### 2. First-class command system (slash commands / palette) — Score: 9

**Status: Strong**

**Evidence:**

- Well-structured `SlashCommandDefinition` interface with name, description, aliases, flags (`src/tui-slash-commands.ts:106-115`)
- `SlashCommandRegistry` with lookup map for efficient command resolution (`src/tui-slash-commands.ts:117-120`)
- Sophisticated command parsing supporting flags (`--key`, `--key=value`), short flags, negated flags (`--no-xyz`) (`src/tui-slash-commands.ts:143-253`)
- Autocomplete/suggestions via `getSlashCommandSuggestionsAsync()` with per-command completion support (`src/tui-slash-commands.ts:395-465`)
- Command history tracking separate from session history (`src/tui-slash-commands.ts:468-481`)
- Integrated into all TUI prompts (Input, Select, MultiSelect, Password) (`src/tui.ts:196-448`)
- Default commands include `/help`, `/quit`, `/clear`, `/history`, `/save`, `/load` (`src/tui-slash-commands.ts:526-693`)

**What's Missing:**

- No command palette UI (keyboard-driven search/filter interface)
- No visual command browser or categorized command list

**Files Referenced:**

- `src/tui-slash-commands.ts` (entire file - comprehensive command system)
- `src/tui.ts:196-448` (TUI integration)

---

### 3. Mode / model management — Score: 0

**Status: Missing**

**Evidence:**

- No mode definitions or mode switching in codebase
- `ThemeService` exists (`src/services/theme/service.ts`) but is for display styling, not behavioral modes
- No `/mode` command or mode selection UI
- No model/provider switching (e.g., different LLM providers)
- No mode-specific behavior or configuration

**What's Missing:**

- Mode definitions (e.g., Architect, Debug, Orchestrator modes)
- Model/provider selection (LLM switching)
- Mode switching commands or UI
- Per-mode behavior configuration
- Mode indicators in TUI

**Files Referenced:**

- `src/services/theme/service.ts` (theming only, not modes)

---

### 4. Tool / MCP discovery & control — Score: 5

**Status: MVP**

**Evidence:**

- `KitRegistryService` provides kit registration, enablement, listing (`src/kits/registry.ts:16-182`)
- Kit config persists to `~/.effect-cli-tui/kits.json` (`src/kits/config.ts:17-115`)
- `MemKit` includes `/mem-status` command showing connectivity and tool status (`src/kits/memkit.ts:61-156`)
- Can list available/enabled kits via registry methods (`src/kits/registry.ts:138-154`)
- No default `/kits` or `/tools` slash command to discover/enable tools from TUI
- No MCP server discovery or management
- No permissions/scopes per tool

**What's Missing:**

- Default `/kits` command to list and manage kits from TUI
- MCP server discovery and registration
- Tool permissions/scopes configuration
- Tool status dashboard or unified view
- Tool enable/disable from TUI (currently requires code)

**Files Referenced:**

- `src/kits/registry.ts` (KitRegistryService)
- `src/kits/config.ts` (config persistence)
- `src/kits/memkit.ts:61-156` (mem-status example)

---

### 5. Safe execution & approval workflow — Score: 0

**Status: Missing**

**Evidence:**

- `EffectCLI.run()` executes commands immediately without preview (`src/cli.ts`)
- No diff preview for file edits
- No command preview before execution
- No confirmation prompts for side-effect operations
- No undo/rollback mechanisms
- No git integration for safe file edits

**What's Missing:**

- Diff preview before applying file edits
- Command preview before execution
- Confirmation prompts for destructive operations
- Undo/rollback (e.g., git revert integration)
- Structured plan → preview → approve → apply workflow
- Configurable safety levels (auto-approve vs manual-approve)

**Files Referenced:**

- `src/cli.ts` (command execution - no safety layer)

---

### 6. Context & state visualization — Score: 2

**Status: Weak**

**Evidence:**

- No status panels or UI elements showing context
- No `/status` command in default commands
- No display of active kits, workspace, or current task
- `MemKit` has `/mem-status` but it's kit-specific, not general (`src/kits/memkit.ts:61-156`)
- No context indicators (badges, labels) in TUI

**What's Missing:**

- Status panel showing active workspace, kits, mode
- `/status` command showing current context
- Visual indicators (badges, status bar) for active state
- Context adjustment commands from TUI

**Files Referenced:**

- `src/kits/memkit.ts:61-156` (kit-specific status only)

---

### 7. History, logs, reproducibility — Score: 5

**Status: MVP**

**Evidence:**

- `SessionHistory` tracks all prompt inputs with timestamps (`src/tui-slash-commands.ts:31-67`)
- `/history` command displays session history (`src/tui-slash-commands.ts:568-593`)
- `/save` and `/load` commands for session persistence (`src/tui-slash-commands.ts:595-692`)
- Slash command history tracked separately (`src/tui-slash-commands.ts:468-481`)
- No tool call logs (no logging of what commands were executed)
- No git integration (no mapping of agent actions to git commits/diffs)
- No re-run capability for past commands

**What's Missing:**

- Tool call logs (what commands were executed, with what args)
- Git integration (tracking code edits via git commits/diffs)
- Re-run past commands with tweaks
- Structured logging to files
- Mapping between agent actions and repo state changes

**Files Referenced:**

- `src/tui-slash-commands.ts:31-67` (SessionHistory)
- `src/tui-slash-commands.ts:568-692` (history commands)

---

### 8. File-backed custom commands/modes — Score: 6

**Status: MVP+**

**Evidence:**

- Kit system allows custom commands via `createKit()` (`src/kits/index.ts:35-49`)
- Kit config persists to `~/.effect-cli-tui/kits.json` (`src/kits/config.ts`)
- Kits can be registered and enabled via `KitRegistryService` (`src/kits/registry.ts`)
- Kits are code-based (TypeScript), not file-based definitions
- No convention for loading kits from project directories (e.g., `.agents/kits/`)
- No hot-reload or dynamic kit discovery

**What's Missing:**

- File-based command definitions (e.g., YAML/JSON command files)
- Project-local kit discovery (e.g., `.effect-cli-tui/kits/` directory)
- Hot-reload of custom commands
- Documentation/UI for discovering custom commands
- Convention for file-backed kit definitions

**Files Referenced:**

- `src/kits/index.ts:35-49` (createKit helper)
- `src/kits/config.ts` (config persistence)
- `src/kits/registry.ts` (kit management)

---

### 9. Progress & phase feedback (plan → act → verify) — Score: 4

**Status: MVP**

**Evidence:**

- Spinner utilities exist (`spinnerEffect`, `startSpinner`, `updateSpinner`, `stopSpinner`) (`src/ui/progress/spinner.ts:31-109`)
- `ProgressBar` component available (`src/components/ProgressBar.tsx`)
- No structured phase-based workflow (plan → act → verify)
- No explicit phase labels or sections in UI
- Progress indicators are available but not integrated into agent workflows

**What's Missing:**

- Structured phase workflow (planning, acting, verifying)
- Phase labels/sections in UI
- Integration of progress indicators into agent action flows
- Clear visual distinction between phases

**Files Referenced:**

- `src/ui/progress/spinner.ts` (spinner utilities)
- `src/components/ProgressBar.tsx` (progress bar component)

---

### 10. Help, config, onboarding — Score: 5

**Status: MVP**

**Evidence:**

- `/help` command lists all available slash commands (`src/tui-slash-commands.ts:527-543`)
- Help shows command names, aliases, and descriptions
- No first-run onboarding or welcome screen
- No contextual hints or tooltips
- No `/config` command to view/change configuration
- Limited help content (just command list, no usage examples or detailed docs)

**What's Missing:**

- First-run welcome/onboarding flow
- Contextual help (e.g., help for specific commands)
- `/config` command to view/edit configuration
- Usage examples in help output
- Interactive tutorials or guided setup

**Files Referenced:**

- `src/tui-slash-commands.ts:527-543` (help command)

---

## Overall Summary

### Strongest Areas

1. **Slash Command System (9/10)** — Excellent foundation with registry, parsing, autocomplete, and integration. This is production-ready and extensible.

2. **Kit System Architecture (6-7/10)** — Well-designed extensibility system with registry, config persistence, and service-based architecture. Needs better TUI integration.

3. **Session History (5/10)** — Basic history tracking with save/load capabilities. Good foundation but needs workspace awareness.

### Weakest/Missing Features

1. **Mode/Model Management (0/10)** — Completely missing. No concept of modes or model switching.

2. **Safe Execution (0/10)** — No approval workflows, diffs, or safety mechanisms. Commands execute immediately.

3. **Context Visualization (2/10)** — No status panels, context indicators, or visibility into current state.

4. **Workspace Awareness (4/10)** — History exists but not tied to workspaces. No project context or multi-workspace support.

### Concrete Implementation Recommendations

**Priority 1: Safety Layer**

- Add diff preview before file edits (integrate with git or file comparison)
- Add command preview before execution (`/preview <command>`)
- Add confirmation prompts for destructive operations
- Implement structured plan → preview → approve → apply workflow

**Priority 2: Context & Discovery**

- Add `/status` command showing active workspace, kits, mode, selected files
- Add `/kits` command to list, enable, disable kits from TUI
- Add status panel or status bar showing current context
- Add workspace detection (git repo, package.json, etc.)

**Priority 3: Mode Management**

- Add mode definitions (e.g., Architect, Debug, Orchestrator)
- Add `/mode` command to switch modes
- Add mode indicators in TUI
- Implement per-mode behavior/configuration

**Priority 4: Enhanced Help & Onboarding**

- Add `/config` command to view/edit configuration
- Add first-run welcome screen with setup wizard
- Enhance `/help` with usage examples and command details
- Add contextual hints (e.g., "Type /help <command> for details")

**Priority 5: History & Reproducibility**

- Add tool call logging (what commands executed, with args)
- Integrate with git to track code changes as history
- Add re-run capability for past commands
- Add structured log files for sessions

---

## Conclusion

effect-cli-tui has a **strong foundation** in its slash command system and kit architecture, but is **missing critical agent harness features** around safety, context awareness, and mode management. The codebase is well-structured and extensible, making it feasible to add these features.

**Current State:** MVP-level agent harness with excellent command system
**Recommended Focus:** Safety layer and context visualization would provide the biggest improvements for agent harness use cases.
