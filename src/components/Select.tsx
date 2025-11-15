/**
 * Single-select component for Ink
 *
 * Provides a list selection interface with keyboard navigation.
 */

import React from 'react'
import { Box, Text } from 'ink'
import SelectInput from 'ink-select-input'

export interface SelectProps {
    message: string
    choices: string[]
    onSubmit: (value: string) => void
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
export const Select: React.FC<SelectProps> = ({ message, choices, onSubmit }) => {
    const items = choices.map((choice) => ({
        label: choice,
        value: choice
    }))

    return (
        <Box flexDirection="column">
            <Box marginBottom={1}>
                <Text>{message}</Text>
            </Box>
            <SelectInput
                items={items}
                onSelect={(item) => {
                    onSubmit(item.value)
                }}
                indicatorComponent={(props: { isSelected?: boolean }) => (
                    <Text
                        color={props.isSelected ? 'cyan' : 'gray'}
                        bold={props.isSelected}
                    >
                        {props.isSelected ? '> ' : '  '}
                    </Text>
                )}
                itemComponent={({ label }) => (
                    <Text color="white">
                        {label}
                    </Text>
                )}
            />
        </Box>
    )
}

export default Select
