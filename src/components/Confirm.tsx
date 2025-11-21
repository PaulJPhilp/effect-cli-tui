/**
 * Yes/No confirmation component for Ink
 *
 * Provides a simple y/n confirmation dialog.
 */

import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import type React from "react";
import { useState } from "react";

export interface ConfirmProps {
  message: string;
  default?: boolean;
  onSubmit: (value: boolean) => void;
}

/**
 * Confirm component - Yes/No confirmation dialog
 *
 * Accepts: y/yes for true, n/no for false
 * Press Enter without input to use default value
 *
 * @param props - Component props
 * @returns React component
 *
 * @example
 * ```tsx
 * <Confirm
 *   message="Are you sure?"
 *   default={false}
 *   onSubmit={(confirmed) => {
 *     if (confirmed) console.log('Confirmed')
 *   }}
 * />
 * ```
 */
export const Confirm: React.FC<ConfirmProps> = ({
  message,
  default: defaultValue = true,
  onSubmit,
}) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (value: string) => {
    const trimmed = value.trim().toLowerCase();

    if (!trimmed) {
      // Use default if empty
      onSubmit(defaultValue);
      return;
    }

    if (trimmed === "y" || trimmed === "yes") {
      onSubmit(true);
    } else if (trimmed === "n" || trimmed === "no") {
      onSubmit(false);
    } else {
      setError("Please enter y/yes or n/no");
    }
  };

  const defaultStr = defaultValue ? "Y/n" : "y/N";

  return (
    <Box flexDirection="column">
      <Box>
        <Text>{message} </Text>
        <Text color="gray">({defaultStr}) </Text>
        <TextInput
          onChange={(val) => {
            setInput(val);
            if (error) {
              setError(null);
            }
          }}
          onSubmit={handleSubmit}
          value={input}
        />
      </Box>
      {error && (
        <Box marginTop={0}>
          <Text color="red">{error}</Text>
        </Box>
      )}
    </Box>
  );
};

export default Confirm;
