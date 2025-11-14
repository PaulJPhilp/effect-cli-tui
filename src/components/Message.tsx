/**
 * Message display component for Ink
 *
 * Provides styled message output with different types.
 */

import React from 'react'
import { Box, Text } from 'ink'

export interface MessageProps {
    message: string
    type?: 'info' | 'success' | 'error' | 'warning'
}

/**
 * Message component - Display styled message
 *
 * Renders a message with type-based styling and icon.
 *
 * @param props - Component props
 * @returns React component
 *
 * @example
 * ```tsx
 * <Message message="Operation successful!" type="success" />
 * ```
 */
export const Message: React.FC<MessageProps> = ({ message, type = 'info' }) => {
    let icon = 'ℹ'
    let color: 'blue' | 'green' | 'red' | 'yellow' = 'blue'

    switch (type) {
        case 'success':
            icon = '✓'
            color = 'green'
            break
        case 'error':
            icon = '✗'
            color = 'red'
            break
        case 'warning':
            icon = '⚠'
            color = 'yellow'
            break
        case 'info':
        default:
            icon = 'ℹ'
            color = 'blue'
            break
    }

    return (
        <Box marginY={0}>
            <Box marginRight={1}>
                <Text color={color} bold>
                    {icon}
                </Text>
            </Box>
            <Text>{message}</Text>
        </Box>
    )
}

export default Message
