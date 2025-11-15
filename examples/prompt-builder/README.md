# Prompt Builder - Interactive LLM Prompt Engineering CLI

A comprehensive example demonstrating advanced features of `effect-cli-tui`:

- **Template System** with Effect Schema validation
- **Interactive TUIHandler** for guided workflows
- **Display Utilities** (panels, boxes, tables) for rich output formatting
- **Effect.Service Pattern** with dependency injection
- **Error Handling** with `Effect.catchTag` and validation
- **Clipboard Integration** for copying prompts to the system clipboard
- **Edit/Regenerate Workflow** for iterative prompt refinement

## Overview

Prompt Builder helps users create effective LLM prompts by guiding them through a structured interview process based on proven prompting strategies:

1. **Zero-shot** — Direct instruction without examples
2. **One-shot** — Instruction with a single example
3. **Instruction-first** — Goal, constraints, and format specification
4. **Contract-first** — Explicit input/output specifications
5. **Chain-of-thought** — Step-by-step reasoning prompts

## Running the Application

```bash
bun run examples/prompt-builder.ts
```

## Architecture

### Core Files

```
examples/prompt-builder/
├── README.md              # This file
├── types.ts              # Effect Schema type definitions
├── templates.ts          # 5 LLM prompting strategy templates
├── validation.ts         # Input validation utilities
├── clipboard.ts          # Cross-platform clipboard integration
└── prompt-builder.ts     # Main application (in examples/ directory)
```

### Types System (`types.ts`)

Defines validation schemas using Effect Schema:

```typescript
// Template field with validation
class TemplateField extends Schema.Class<TemplateField>('TemplateField')({
  name: Schema.String.pipe(Schema.minLength(1)),
  label: Schema.String.pipe(Schema.minLength(1)),
  type: Schema.Literal('text', 'multiline', 'boolean', 'choice'),
  required: Schema.Boolean,
  choices: Schema.optional(Schema.Array(Schema.String)),
  // ... more fields
}) {}

// Prompt template definition
class PromptTemplate extends Schema.Class<PromptTemplate>('PromptTemplate')({
  id: Schema.String.pipe(Schema.minLength(1)),
  name: Schema.String.pipe(Schema.minLength(1)),
  fields: Schema.Array(TemplateField),
  generatePrompt: Schema.Function,
  // ... more fields
}) {}

// User responses
interface UserResponses {
  [fieldName: string]: string | boolean | string[]
}

// Application state
interface AppState {
  selectedTemplate: PromptTemplate | null
  responses: UserResponses
  builtPrompt: BuiltPrompt | null
  editing: boolean
  exitRequested: boolean
}
```

### Template System (`templates.ts`)

Each template includes:
- **id** — Unique identifier
- **name** — Display name
- **description** — User-facing description
- **category** — Template classification
- **fields** — Input parameters with types and validation
- **generatePrompt()** — Function to build final prompt from responses

Example:

```typescript
export const zeroShotTemplate: PromptTemplate = {
  id: 'zero-shot',
  name: 'Zero-Shot',
  description: 'Direct instruction to the LLM without examples',
  fields: [
    {
      name: 'task',
      label: 'Task',
      description: 'What do you want the LLM to do?',
      type: 'multiline',
      required: true,
      placeholder: 'e.g., Summarize the following text...'
    },
    // ... more fields
  ],
  generatePrompt: (responses: UserResponses): string => {
    // Build and return final prompt
  }
}
```

### Validation System (`validation.ts`)

Provides input validation using Effect Schema:

```typescript
// Validate single field
validateField(field: TemplateField, value: unknown): Effect<boolean, string>

// Validate all responses
validateResponses(fields: TemplateField[], responses: UserResponses): Effect<UserResponses, string>

// Create validation function for prompts
createInputValidator(fieldDef: TemplateField): (input: string) => boolean | string

// Validate generated prompt
validateGeneratedPrompt(promptText: string): Effect<string, Error>
```

### Clipboard Integration (`clipboard.ts`)

Cross-platform clipboard support using native OS commands:

- **macOS** — `pbcopy`
- **Linux** — `xclip` or `xsel`
- **Windows** — `clip`

```typescript
// Copy text to system clipboard
copyToClipboard(text: string): Effect<void, Error>
```

Automatically detects available clipboard command on the system.

### Main Application (`prompt-builder.ts`)

Orchestrates the complete workflow:

1. **Welcome Screen** — Display overview with `displayPanel()`
2. **Template Selection** — Interactive selection with descriptions
3. **Guided Interview** — Collect user responses with validation
4. **Prompt Generation** — Generate prompt using selected template
5. **Display Result** — Show generated prompt in formatted panel
6. **Review Table** — Display user responses in table format
7. **Accept/Edit Loop** — Copy to clipboard or edit and regenerate

Key Effect functions:

```typescript
// Select template from available options
selectTemplate(tui: TUIHandler): Effect<PromptTemplate>

// Collect validated responses through interactive prompts
collectResponses(tui: TUIHandler, template: PromptTemplate): Effect<UserResponses>

// Display generated prompt in formatted panel
displayGeneratedPrompt(builtPrompt: BuiltPrompt): Effect<void>

// Show review table of responses
displayReview(builtPrompt: BuiltPrompt): Effect<void>

// Accept/edit loop with clipboard support
acceptOrEdit(tui: TUIHandler, builtPrompt: Ref<BuiltPrompt>): Effect<BuiltPrompt>

// Main application workflow
promptBuilderApp(): Effect<void>
```

## Key Features Demonstrated

### 1. Effect.Service Pattern

Uses modern Effect 3.9+ `Effect.Service` for dependency injection:

```typescript
const main = promptBuilderApp().pipe(
  Effect.provide(TUIHandler.Default),
  Effect.provide(EffectCLI.Default)
)
```

### 2. Display Utilities

Demonstrates all major display functions:

```typescript
// Panels with type-based styling
yield* displayPanel('Title', ['Line 1', 'Line 2'], 'success')

// Tables with column definitions
yield* displayTable([['Field', 'Value'], ...data], { style: 'compact' })

// Styled messages
yield* display('Message', { type: 'info' })
yield* displaySuccess('Success message!')
yield* displayError('Error message!')
```

### 3. Effect Schema Validation

Type-safe input validation at every step:

```typescript
// Field-level validation
yield* validateField(field, value).pipe(
  Effect.catchAll((err) => {
    yield* displayError(`Validation error: ${err}`)
    return Effect.fail(new Error(err))
  })
)

// Response-level validation
yield* validateResponses(template.fields, responses)

// Prompt validation
yield* validateGeneratedPrompt(promptText)
```

### 4. Error Handling

Comprehensive error handling with `Effect.catchTag` and `catchAll`:

```typescript
yield* selectTemplate(tui).pipe(
  Effect.catchTag('TUIError', (err) => {
    yield* displayError(`Failed: ${err.message}`)
    return yield* Effect.fail(err)
  })
)

yield* copyToClipboard(promptText).pipe(
  Effect.catchAll((err) => {
    yield* displayError(`Clipboard failed: ${err.message}`)
    yield* display('You can still manually copy the prompt above.')
    return Effect.succeed(undefined)
  })
)
```

### 5. Interactive Workflows

Guided user experience with multi-step workflows:

```typescript
// Field collection with type-specific prompts
if (field.type === 'choice') {
  const choice = yield* tui.selectOption(...)
} else if (field.type === 'boolean') {
  const confirmed = yield* tui.confirm(...)
} else {
  const input = yield* tui.prompt(..., {
    validate: createInputValidator(field)
  })
}
```

### 6. Clipboard Integration

Cross-platform clipboard with graceful fallback:

```typescript
yield* copyToClipboard(promptText).pipe(
  Effect.catchAll((err) => {
    // Fallback if clipboard unavailable
    yield* displayError(`Failed to copy: ${err.message}`)
    return Effect.succeed(undefined)
  })
)
```

## Workflow

```
Welcome Screen
      ↓
Template Selection
      ↓
Guided Interview (Field Collection)
      ↓
Prompt Generation + Validation
      ↓
Display Generated Prompt
      ↓
Display Review Table
      ↓
Accept/Edit Decision
  ├→ Accept: Copy to Clipboard → Done
  ├→ Edit: Select Field → Update Value → Regenerate → Loop back to Review
  └→ Exit: Cancel
```

## Example Interaction

```
Welcome to Prompt Builder
Interactive CLI tool for crafting effective LLM prompts

Choose from 5 proven prompting strategies:
  • Zero-shot: Direct instruction
  • One-shot: With example
  • Instruction-first: Goal & constraints
  • Contract-first: Input/output specs
  • Chain-of-thought: Step-by-step reasoning

Select a prompt engineering strategy:
? Choose template: › Zero-Shot

Answer questions to generate your Zero-Shot prompt:

[Required] Task: Summarize the following text in 2-3 sentences
[Required] Output Format: Bullet points
[Optional] Style/Tone: Professional

Generated Zero-Shot Prompt

Task: Summarize the following text in 2-3 sentences

Output Format: Bullet points

Style/Tone: Professional

Please complete this task.

Your Responses:
┌──────────────────┬─────────────────────────────────────────┐
│ Field            │ Value                                   │
├──────────────────┼─────────────────────────────────────────┤
│ Task             │ Summarize the following text in 2-3 s…  │
│ Output Format    │ Bullet points                           │
│ Style/Tone       │ Professional                            │
└──────────────────┴─────────────────────────────────────────┘

What would you like to do?
? › Accept & Copy to Clipboard
  Edit Answers
  Exit

✓ Prompt copied to clipboard!

Thank you for using Prompt Builder!
```

## Phase 1 Features (Complete)

✅ Template selection from 5 strategies
✅ Guided interview with field validation
✅ Prompt generation and display
✅ Review table of responses
✅ Accept/edit workflow
✅ Clipboard integration
✅ Error handling with recovery
✅ Cross-platform support

## Future Phases

### Phase 2: Custom Template Creation
- Save custom templates to local storage
- Template builder wizard
- Import/export template definitions
- Template sharing

### Phase 3: Prompt Library Management
- Store and organize saved prompts
- Search and filter by template/date
- Prompt analytics (usage, effectiveness)
- Integration with version control

## Testing

To test the application:

```bash
# Build first
bun run build

# Run the application
bun run examples/prompt-builder.ts

# Or run type-check and lint
bun run type-check
bun run lint
```

The application handles:
- ✅ Cancelled selections (`TUIError`)
- ✅ Invalid input validation
- ✅ Missing clipboard commands (with fallback)
- ✅ Empty/invalid template responses
- ✅ Edit workflow with data persistence

## Code Quality

- **No TypeScript Errors** — Strict mode with full type safety
- **ESLint Clean** — Follows project style guide
- **Well Documented** — JSDoc comments on all functions
- **Effect Pattern** — Uses modern Effect 3.9+ standards
- **Schema Validation** — All inputs validated with Effect Schema

## Learning Resources

This example demonstrates:

1. **Building with Effect** — How to structure complex Effect workflows
2. **Schema Validation** — Type-safe input validation patterns
3. **Service Pattern** — Using `Effect.Service` for dependency injection
4. **Display System** — Creating rich terminal UIs with multiple utilities
5. **Error Handling** — Practical error recovery strategies
6. **Clipboard Integration** — Cross-platform system integration
7. **Interactive Workflows** — Multi-step user-guided processes

## Files

| File | Purpose | Lines |
|------|---------|-------|
| `prompt-builder.ts` | Main application | ~380 |
| `types.ts` | Type definitions with Schema | ~60 |
| `templates.ts` | 5 template implementations | ~330 |
| `validation.ts` | Validation utilities | ~120 |
| `clipboard.ts` | Clipboard integration | ~100 |
| `README.md` | Documentation (this file) | ~350 |

**Total: ~1,340 lines of code + documentation**

## References

- [Effect Documentation](https://effect.ts/)
- [Effect Schema Guide](https://effect.ts/docs/schema/overview)
- [effect-cli-tui API](../../README.md)
- [Node.js Child Process API](https://nodejs.org/api/child_process.html)
