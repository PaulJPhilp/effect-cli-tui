/**
 * Password input component for Ink
 *
 * Provides hidden password input field.
 */

import React, { useState } from 'react'
import { Box, Text } from 'ink'
import TextInput from 'ink-text-input'

export interface PasswordProps {
    message: string
    validate?: (value: string) => boolean | string
    onSubmit: (value: string) => void
}

/**
 * Password component - Hidden password input
 *
 * Input is masked with dots while typing.
 *
 * @param props - Component props
 * @returns React component
 *
 * @example
 * ```tsx
 * <Password
 *   message="Enter password:"
 *   onSubmit={(password) => console.log('Got password')}
 * />
 * ```
 */
export const Password: React.FC<PasswordProps> = ({ message, validate, onSubmit }) => {
    const [value, setValue] = useState('')
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
        if (error) {
            setError(null)
        }
    }

    return (
        <Box flexDirection="column">
            <Box>
                <Text>{message} </Text>
                <TextInput
                    value={value}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    mask="•"
                />
            </Box>
            {error && (
                <Box marginTop={0}>
                    <Text color="red">{error}</Text>
                </Box>
            )}
        </Box>
    )
}

export default Password
