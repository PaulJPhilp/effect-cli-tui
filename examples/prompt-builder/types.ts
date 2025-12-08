/**
 * Shared types for prompt-builder example
 *
 * Defines the template system types with Effect Schema validation
 */

import { Schema } from "effect";

/**
 * Template field definition with validation
 */
export class TemplateField extends Schema.Class<TemplateField>("TemplateField")(
  {
    name: Schema.String.pipe(Schema.minLength(1)),
    label: Schema.String.pipe(Schema.minLength(1)),
    description: Schema.String.pipe(Schema.minLength(1)),
    type: Schema.Literal("text", "multiline", "boolean", "choice"),
    required: Schema.Boolean,
    choices: Schema.optional(Schema.Array(Schema.String)),
    placeholder: Schema.optional(Schema.String),
    validation: Schema.optional(Schema.String.pipe(Schema.minLength(1))),
  }
) {}

/**
 * Prompt template definition
 */
export class PromptTemplate extends Schema.Class<PromptTemplate>(
  "PromptTemplate"
)({
  id: Schema.String.pipe(Schema.minLength(1)),
  name: Schema.String.pipe(Schema.minLength(1)),
  description: Schema.String.pipe(Schema.minLength(1)),
  category: Schema.Literal(
    "zero-shot",
    "one-shot",
    "instruction-first",
    "contract-first",
    "chain-of-thought"
  ),
  fields: Schema.Array(TemplateField),
  generatePrompt: Schema.Any,
}) {}

/**
 * User responses to template fields
 */
export interface UserResponses {
  [fieldName: string]: string | boolean | string[];
}

/**
 * Built prompt result
 */
export interface BuiltPrompt {
  template: PromptTemplate;
  responses: UserResponses;
  promptText: string;
}

/**
 * Application state
 */
export interface AppState {
  selectedTemplate: PromptTemplate | null;
  responses: UserResponses;
  builtPrompt: BuiltPrompt | null;
  editing: boolean;
  exitRequested: boolean;
}
