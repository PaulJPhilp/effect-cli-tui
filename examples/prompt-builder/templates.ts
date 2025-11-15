/**
 * Prompt templates for the prompt-builder example
 *
 * Provides pre-built templates for different LLM prompting strategies:
 * - Zero-shot: Direct instruction without examples
 * - One-shot: Instruction with a single example
 * - Instruction-first: Goal, constraints, and format specification
 * - Contract-first: Explicit input/output contracts
 * - Chain-of-thought: Step-by-step reasoning prompts
 */

import { PromptTemplate, UserResponses } from './types'

/**
 * Zero-shot template - Direct instruction without examples
 */
export const zeroShotTemplate: PromptTemplate = {
  id: 'zero-shot',
  name: 'Zero-Shot',
  description: 'Direct instruction to the LLM without examples',
  category: 'zero-shot',
  fields: [
    {
      name: 'task',
      label: 'Task',
      description: 'What do you want the LLM to do?',
      type: 'multiline',
      required: true,
      placeholder: 'e.g., Summarize the following text...'
    },
    {
      name: 'format',
      label: 'Output Format',
      description: 'How should the response be formatted?',
      type: 'text',
      required: true,
      placeholder: 'e.g., Bullet points, JSON, paragraph...'
    },
    {
      name: 'style',
      label: 'Style/Tone',
      description: 'What style or tone should be used?',
      type: 'choice',
      required: false,
      choices: ['Professional', 'Casual', 'Technical', 'Creative', 'Concise'],
      placeholder: 'Select a style...'
    }
  ],
  generatePrompt: (responses: UserResponses): string => {
    const task = responses['task'] as string
    const format = responses['format'] as string
    const style = responses['style'] as string || 'Professional'

    return `Task: ${task}

Output Format: ${format}

Style/Tone: ${style}

Please complete this task.`
  }
}

/**
 * One-shot template - Instruction with a single example
 */
export const oneShotTemplate: PromptTemplate = {
  id: 'one-shot',
  name: 'One-Shot',
  description: 'Instruction with a single example to guide the LLM',
  category: 'one-shot',
  fields: [
    {
      name: 'task',
      label: 'Task',
      description: 'What do you want the LLM to do?',
      type: 'multiline',
      required: true,
      placeholder: 'e.g., Classify the sentiment of reviews...'
    },
    {
      name: 'exampleInput',
      label: 'Example Input',
      description: 'Provide an example input',
      type: 'multiline',
      required: true,
      placeholder: 'e.g., "This product is amazing! I love it."'
    },
    {
      name: 'exampleOutput',
      label: 'Example Output',
      description: 'What should the output for the example be?',
      type: 'text',
      required: true,
      placeholder: 'e.g., Positive'
    },
    {
      name: 'format',
      label: 'Output Format',
      description: 'How should responses be formatted?',
      type: 'text',
      required: true,
      placeholder: 'e.g., Single word classification'
    }
  ],
  generatePrompt: (responses: UserResponses): string => {
    const task = responses['task'] as string
    const exampleInput = responses['exampleInput'] as string
    const exampleOutput = responses['exampleOutput'] as string
    const format = responses['format'] as string

    return `Task: ${task}

Example:
Input: ${exampleInput}
Output: ${exampleOutput}

Output Format: ${format}

Now complete the task for new inputs.`
  }
}

/**
 * Instruction-first template - Goal, constraints, format
 */
export const instructionFirstTemplate: PromptTemplate = {
  id: 'instruction-first',
  name: 'Instruction-First',
  description: 'Specify goal, constraints, and format upfront',
  category: 'instruction-first',
  fields: [
    {
      name: 'goal',
      label: 'Primary Goal',
      description: 'What is the main objective?',
      type: 'multiline',
      required: true,
      placeholder: 'e.g., Translate English to Spanish accurately'
    },
    {
      name: 'constraints',
      label: 'Constraints',
      description: 'What constraints should be applied?',
      type: 'multiline',
      required: false,
      placeholder: 'e.g., Keep cultural context, preserve idioms'
    },
    {
      name: 'format',
      label: 'Output Format',
      description: 'Required output structure',
      type: 'multiline',
      required: true,
      placeholder: 'e.g., JSON with source and translation fields'
    },
    {
      name: 'audience',
      label: 'Target Audience',
      description: 'Who is the output for?',
      type: 'text',
      required: false,
      placeholder: 'e.g., Native Spanish speakers, business users'
    }
  ],
  generatePrompt: (responses: UserResponses): string => {
    const goal = responses['goal'] as string
    const constraints = responses['constraints'] as string || 'None specified'
    const format = responses['format'] as string
    const audience = responses['audience'] as string || 'General'

    return `Goal: ${goal}

Constraints:
${constraints}

Output Format:
${format}

Target Audience: ${audience}`
  }
}

/**
 * Contract-first template - Explicit input/output contracts
 */
export const contractFirstTemplate: PromptTemplate = {
  id: 'contract-first',
  name: 'Contract-First',
  description: 'Define explicit input and output specifications',
  category: 'contract-first',
  fields: [
    {
      name: 'description',
      label: 'What should the LLM do?',
      description: 'Brief description of the task',
      type: 'text',
      required: true,
      placeholder: 'e.g., Extract entities from text'
    },
    {
      name: 'inputSpec',
      label: 'Input Specification',
      description: 'What format will inputs be in?',
      type: 'multiline',
      required: true,
      placeholder: 'e.g., Plain text strings containing entities'
    },
    {
      name: 'outputSpec',
      label: 'Output Specification',
      description: 'What exact format should outputs be?',
      type: 'multiline',
      required: true,
      placeholder: 'e.g., JSON with entities array [{type, value}]'
    },
    {
      name: 'requirements',
      label: 'Additional Requirements',
      description: 'Any special handling needed?',
      type: 'multiline',
      required: false,
      placeholder: 'e.g., Case-insensitive matching, deduplicate'
    }
  ],
  generatePrompt: (responses: UserResponses): string => {
    const description = responses['description'] as string
    const inputSpec = responses['inputSpec'] as string
    const outputSpec = responses['outputSpec'] as string
    const requirements = responses['requirements'] as string || 'None'

    return `Task: ${description}

Input Specification:
${inputSpec}

Output Specification:
${outputSpec}

Additional Requirements:
${requirements}

Strictly adhere to the input and output specifications provided.`
  }
}

/**
 * Chain-of-thought template - Step-by-step reasoning
 */
export const chainOfThoughtTemplate: PromptTemplate = {
  id: 'chain-of-thought',
  name: 'Chain-of-Thought',
  description: 'Encourage step-by-step reasoning and explanation',
  category: 'chain-of-thought',
  fields: [
    {
      name: 'problem',
      label: 'Problem Statement',
      description: 'What problem should be solved?',
      type: 'multiline',
      required: true,
      placeholder: 'e.g., Design a data validation system'
    },
    {
      name: 'context',
      label: 'Context/Background',
      description: 'Relevant context for the problem',
      type: 'multiline',
      required: false,
      placeholder: 'e.g., Using TypeScript with Effect library'
    },
    {
      name: 'steps',
      label: 'Required Reasoning Steps',
      description: 'What steps should be shown?',
      type: 'multiline',
      required: true,
      placeholder: 'e.g., 1. Analyze requirements 2. Design schema 3. Implement...'
    },
    {
      name: 'finalAnswer',
      label: 'Final Answer Format',
      description: 'How should the conclusion be formatted?',
      type: 'text',
      required: true,
      placeholder: 'e.g., Code implementation with explanation'
    }
  ],
  generatePrompt: (responses: UserResponses): string => {
    const problem = responses['problem'] as string
    const context = responses['context'] as string || 'No additional context'
    const steps = responses['steps'] as string
    const finalAnswer = responses['finalAnswer'] as string

    return `Problem: ${problem}

Context:
${context}

Please think through this step-by-step:
${steps}

For your final answer:
${finalAnswer}

Show your reasoning at each step clearly.`
  }
}

/**
 * Get all available templates
 */
export const templates: PromptTemplate[] = [
  zeroShotTemplate,
  oneShotTemplate,
  instructionFirstTemplate,
  contractFirstTemplate,
  chainOfThoughtTemplate
]

/**
 * Get template by ID
 */
export function getTemplate(id: string): PromptTemplate | undefined {
  return templates.find(t => t.id === id)
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: string): PromptTemplate[] {
  return templates.filter(t => t.category === category)
}
