/**
 * Multi-select component for Ink
 *
 * Provides a checkbox-style list selection interface.
 */

import { Box, Text, useInput } from "ink";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SelectOption } from "../types";

export interface MultiSelectProps {
  message: string;
  choices: string[] | SelectOption[];
  onSubmit: (values: string[]) => void;
}

/**
 * MultiSelect component - Multiple selection from list
 *
 * Navigate with arrow keys, toggle with Space, submit with Enter.
 *
 * @param props - Component props
 * @returns React component
 *
 * @example
 * ```tsx
 * <MultiSelect
 *   message="Choose multiple:"
 *   choices={['Item 1', 'Item 2', 'Item 3']}
 *   onSubmit={(selected) => console.log(selected)}
 * />
 * ```
 */
export const MultiSelect: React.FC<MultiSelectProps> = ({
  message,
  choices,
  onSubmit: originalOnSubmit,
}) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  // Use ref to always have latest selected values for onSubmit
  const selectedRef = useRef<Set<string>>(new Set());
  // Flag to prevent onSubmit from being called except on Enter
  const isSubmittingRef = useRef(false);
  // Store original onSubmit in ref to prevent stale closures
  const onSubmitRef = useRef(originalOnSubmit);

  // Keep refs in sync
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  // Keep onSubmitRef pointing directly to originalOnSubmit
  // guardedOnSubmit already checks the flag, so we don't need a wrapper here
  useEffect(() => {
    onSubmitRef.current = originalOnSubmit;
  }, [originalOnSubmit]);

  // Create a guarded wrapper that prevents onSubmit from being called except on Enter
  const guardedOnSubmit = useCallback(
    (values: string[]) => {
      // CRITICAL: Only call original onSubmit if flag is set (Enter was pressed)
      // This prevents accidental submission when Space is pressed
      if (!isSubmittingRef.current) {
        // Silently ignore - Space should only toggle, not submit
        // This prevents the component from completing when Space is pressed
        return;
      }
      // Call original onSubmit, then reset flag
      // IMPORTANT: Call first, then reset, so the flag is still true during the call
      originalOnSubmit(values);
      // Reset flag after calling (though component will unmount anyway)
      isSubmittingRef.current = false;
    },
    [originalOnSubmit]
  );

  // Normalize choices to SelectOption format
  const normalizedChoices: SelectOption[] = choices.map((choice) =>
    typeof choice === "string" ? { label: choice, value: choice } : choice
  );

  const toggleItem = (index: number) => {
    const item = normalizedChoices[index];
    if (!item) return;

    // Ensure we're not submitting when toggling
    isSubmittingRef.current = false;

    setSelected((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(item.value)) {
        newSelected.delete(item.value);
      } else {
        newSelected.add(item.value);
      }
      // Update ref immediately
      selectedRef.current = newSelected;
      return newSelected;
    });
  };

  // Handle all keyboard input ourselves - no SelectInput dependency
  useInput(
    (input, key) => {
      // CRITICAL: Check Space FIRST and MOST DEFENSIVELY
      // If input is Space, ALWAYS treat it as Space, even if key.return is also true
      // This prevents Space from being misinterpreted as Enter
      if (input === " ") {
        // Space was pressed - toggle selection ONLY, NEVER submit
        // Explicitly ensure submit flag is false BEFORE toggling
        isSubmittingRef.current = false;
        // Toggle the item
        toggleItem(highlightedIndex);
        // CRITICAL: Return immediately to prevent any further processing
        // This prevents Enter handler from running, even if key.return is true
        return;
      }

      // Handle arrow keys for navigation
      if (key.upArrow) {
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : normalizedChoices.length - 1
        );
        return; // Prevent any other processing
      }

      if (key.downArrow) {
        setHighlightedIndex((prev) =>
          prev < normalizedChoices.length - 1 ? prev + 1 : 0
        );
        return; // Prevent any other processing
      }

      // Handle Enter - submit ONLY when Enter is explicitly pressed
      // CRITICAL: Check key.return AND ensure input is NOT Space
      // We already checked Space above, but be extra defensive
      if (key.return && input !== " ") {
        // It's Enter (not Space) - set flag and submit
        isSubmittingRef.current = true;
        // Call guardedOnSubmit synchronously (it will check the flag)
        guardedOnSubmit(Array.from(selectedRef.current));
        return;
      }
    },
    { isActive: true }
  );

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text>{message}</Text>
      </Box>
      {normalizedChoices.map((choice, index) => {
        const isHighlighted = index === highlightedIndex;
        const isSelected = selected.has(choice.value);
        return (
          <Box flexDirection="column" key={choice.value}>
            <Box>
              <Text
                bold={isHighlighted}
                color={isHighlighted ? "cyan" : "gray"}
              >
                {isSelected ? "☑ " : "☐ "}
              </Text>
              <Text
                bold={isHighlighted}
                color={isHighlighted ? "cyan" : "white"}
              >
                {choice.label}
              </Text>
            </Box>
            {choice.description && (
              <Box marginLeft={2}>
                <Text color="gray" dimColor>
                  {choice.description}
                </Text>
              </Box>
            )}
          </Box>
        );
      })}
      <Box marginTop={1}>
        <Text color="gray">
          {" "}
          (Space to toggle, Enter to submit) Selected: {selected.size}
        </Text>
      </Box>
    </Box>
  );
};

export default MultiSelect;
