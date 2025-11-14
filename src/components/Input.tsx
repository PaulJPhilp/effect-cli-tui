/**
 * Text input component for Ink
 *
 * Provides a simple text input with optional validation and default value.
 */

import React, { useState, useEffect } from 'react'
import { Box, Text } from 'ink'
import TextInput from 'ink-text-input'

export interface InputProps {
    message: string
    defaultValue?: string
    validate?: (value: string) => boolean | string
    onSubmit: (value: string) => void
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
 */
export const Input: React.FC<InputProps> = ({
    message,
    defaultValue = '',
    validate,
    onSubmit
}) => {
    const [value, setValue] = useState(defaultValue)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = (input: string) => {
        if (validate) {
            const result = validate(input)
            if (result === true) {
                setError(null)
                onSubmit(input)
            } else {
                setError(String(result))
            }
        } else {
            onSubmit(input)
        }
    }

    const handleChange = (input: string) => {
        setValue(input)
        // Clear error on input change
        if (error) {
            setError(null)
        }
    }

    return (
        <Box flexDirection="column">
            <Box>
                <Text>{message} </Text>
                <TextInput value={value} onChange={handleChange} onSubmit={handleSubmit} />
            </Box>
            {error && (
                <Box marginTop={0}>
                    <Text color="red">{error}</Text>
                </Box>
            )}
        </Box>
    )
}

export default Input
