/**
 * Single-select component for Ink
 *
 * Provides a list selection interface with keyboard navigation.
 */

import { Box, Text } from "ink";
import SelectInput from "ink-select-input";
import type React from "react";

import type { SelectOption } from "@/types";

export interface SelectProps {
  message: string;
  choices: string[] | SelectOption[];
  onSubmit: (value: string) => void;
}

/**
 * Select component - Single selection from list
 *
 * Navigate with arrow keys, select with Enter.
 *
 * @param props - Component props
 * @returns React component
 *
 * @example
 * ```tsx
 * <Select
 *   message="Choose one:"
 *   choices={['Option A', 'Option B', 'Option C']}
 *   onSubmit={(selected) => console.log(selected)}
 * />
 * ```
 */
export const Select: React.FC<SelectProps> = ({
  message,
  choices,
  onSubmit,
}) => {
  // Normalize choices to SelectOption format
  const normalizedChoices: SelectOption[] = choices.map((choice) =>
    typeof choice === "string" ? { label: choice, value: choice } : choice
  );

  const items = normalizedChoices.map((choice) => ({
    label: choice.label,
    value: choice.value,
    description: choice.description,
  }));

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text>{message}</Text>
      </Box>
      <SelectInput
        indicatorComponent={(props: { isSelected?: boolean }) => (
          <Text
            bold={props.isSelected}
            color={props.isSelected ? "cyan" : "gray"}
          >
            {props.isSelected ? "> " : "  "}
          </Text>
        )}
        itemComponent={(props: {
          label: string;
          description?: string;
          isSelected?: boolean;
        }) => (
          <Box flexDirection="column">
            <Text
              bold={props.isSelected}
              color={props.isSelected ? "cyan" : "white"}
            >
              {props.label}
            </Text>
            {props.description && (
              <Text color="gray" dimColor>
                {"  "}
                {props.description}
              </Text>
            )}
          </Box>
        )}
        items={items}
        onSelect={(item) => {
          onSubmit(item.value);
        }}
      />
    </Box>
  );
};

export default Select;
