/**
 * Spinner/Loading indicator component for Ink
 *
 * Provides an animated spinner with a message.
 */

import React from 'react'
import { Box, Text } from 'ink'
import Spinner from 'ink-spinner'

export interface SpinnerComponentProps {
    message: string
    type?: 'dots' | 'dots2' | 'dots3' | 'dots4' | 'dots5' | 'dots6' | 'dots7' | 'dots8' | 'dots9' | 'dots10' | 'line' | 'line2'
}

/**
 * Spinner component - Animated loading indicator
 *
 * Shows a spinning animation with a message to indicate processing.
 *
 * @param props - Component props
 * @returns React component
 *
 * @example
 * ```tsx
 * <Spinner message="Loading..." type="dots" />
 * ```
 */
export const SpinnerComponent: React.FC<SpinnerComponentProps> = ({
    message,
    type = 'dots'
}) => {
    return (
        <Box>
            <Box marginRight={1}>
                <Text color="cyan">
                    <Spinner type={type} />
                </Text>
            </Box>
            <Text>{message}</Text>
        </Box>
    )
}

export default SpinnerComponent
