/**
 * Multi-select component for Ink
 *
 * Provides a checkbox-style list selection interface.
 */

import React, { useState } from 'react'
import { Box, Text } from 'ink'
import SelectInput from 'ink-select-input'

export interface MultiSelectProps {
    message: string
    choices: string[]
    onSubmit: (values: string[]) => void
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
export const MultiSelect: React.FC<MultiSelectProps> = ({ message, choices, onSubmit }) => {
    const [selected, setSelected] = useState<Set<string>>(new Set())

    const items = choices.map((choice) => ({
        label: choice,
        value: choice
    }))

    const handleSelect = (item: { label: string; value: string }) => {
        const newSelected = new Set(selected)
        if (newSelected.has(item.value)) {
            newSelected.delete(item.value)
        } else {
            newSelected.add(item.value)
        }
        setSelected(newSelected)
    }

    const handleSubmit = () => {
        onSubmit(Array.from(selected))
    }

    return (
        <Box flexDirection="column">
            <Box marginBottom={1}>
                <Text>{message}</Text>
            </Box>
            <SelectInput
                items={items}
                onSelect={handleSelect}
                onHighlight={() => {
                    // Handle highlight if needed
                }}
                indicatorComponent={(props) => (
                    <Text color={props.isSelected ? 'cyan' : 'gray'} bold={props.isSelected}>
                        {selected.has(props.item?.value ?? '')
                            ? '☑ '
                            : '☐ '}
                    </Text>
                )}
                itemComponent={({ isSelected, label }) => (
                    <Text color={isSelected ? 'cyan' : 'white'} bold={isSelected}>
                        {label}
                    </Text>
                )}
            />
            <Box marginTop={1}>
                <Text color="gray">
                    {' '}
                    (Space to toggle, Enter to submit) Selected: {selected.size}
                </Text>
            </Box>
            {selected.size > 0 && (
                <Box marginTop={0}>
                    <Text color="green">
                        Press Enter to confirm selection of {selected.size} item(s)
                    </Text>
                </Box>
            )}
        </Box>
    )
}

export default MultiSelect
