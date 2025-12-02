/**
 * Text input component for Ink
 *
 * Provides a simple text input with optional validation and default value.
 */

import { Box, Text, useInput } from "ink";
import TextInput from "ink-text-input";
import type React from "react";
import { useState } from "react";

export interface InputProps {
  message: string;
  defaultValue?: string;
  placeholder?: string;
  validate?: (value: string) => boolean | string;
  onSubmit: (value: string) => void;
  // Slash command enhancement props (optional)
  computeSlashSuggestions?: (
    value: string
  ) => ReadonlyArray<string> | Promise<ReadonlyArray<string>>; // Suggestion provider
  onHistoryPrev?: () => void; // Up arrow for slash command history
  onHistoryNext?: () => void; // Down arrow for slash command history
}

/**
 * Input component - Text input with optional validation
 *
 * @param props - Component props
 * @returns React component
 *
 * @example
 * ```tsx
 * <Input
 *   message="Enter your name:"
 *   onSubmit={(name) => console.log(name)}
 *   validate={(input) => input.length > 0 ? true : 'Name is required'}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Input
 *   message="Task:"
 *   placeholder="e.g., Summarize the text"
 *   onSubmit={(task) => console.log(task)}
 * />
 * ```
 */
export const Input: React.FC<InputProps> = ({
  message,
  defaultValue = "",
  placeholder = "",
  validate,
  onSubmit,
  computeSlashSuggestions,
  onHistoryPrev,
  onHistoryNext,
}) => {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<readonly string[]>([]);

  const handleSubmit = (input: string) => {
    if (validate) {
      const result = validate(input);
      if (result === true) {
        setError(null);
        onSubmit(input);
      } else {
        setError(String(result));
      }
    } else {
      onSubmit(input);
    }
  };

  const handleChange = (input: string) => {
    setValue(input);
    // Clear error on input change
    if (error) {
      setError(null);
    }
    // Recompute suggestions when value changes
    if (input.startsWith("/") && computeSlashSuggestions) {
      const res = computeSlashSuggestions(input);
      if (res instanceof Promise) {
        res
          .then((list) => setSuggestions(list ?? []))
          .catch(() => {
            setSuggestions([]);
          });
      } else {
        setSuggestions(res ?? []);
      }
    } else {
      setSuggestions([]);
    }
  };

  // Key handling for slash command features
  useInput((inputKey, key) => {
    if (!value.startsWith("/")) return; // Only active for slash commands
    if (key.tab) {
      // Auto-complete with first suggestion
      const top = suggestions[0];
      if (top) {
        setValue(`${top} `);
      }
    } else if (key.upArrow) {
      onHistoryPrev?.();
    } else if (key.downArrow) {
      onHistoryNext?.();
    }
  });

  return (
    <Box flexDirection="column">
      <Box>
        <Text>{message} </Text>
        <TextInput
          onChange={handleChange}
          onSubmit={handleSubmit}
          placeholder={placeholder}
          value={value}
        />
      </Box>
      {value.startsWith("/") && suggestions && suggestions.length > 0 && (
        <Box flexDirection="column" marginTop={0}>
          <Text color="cyan">Suggestions: {suggestions.join(", ")}</Text>
          <Text dimColor>Tab to auto-complete, ↑/↓ to navigate history</Text>
        </Box>
      )}
      {error && (
        <Box marginTop={0}>
          <Text color="red">{error}</Text>
        </Box>
      )}
    </Box>
  );
};

export default Input;
