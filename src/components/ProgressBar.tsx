/**
 * Progress bar component for Ink
 *
 * Provides a visual progress indicator.
 */

import { Box, Text } from 'ink'
import React from 'react'

export interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
}

/**
 * ProgressBar component - Visual progress indicator
 *
 * Displays a progress bar with optional label and percentage.
 *
 * @param props - Component props
 * @returns React component
 *
 * @example
 * ```tsx
 * <ProgressBar value={75} max={100} label="Processing" showPercentage />
 * ```
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
}) => {
  const percentage = Math.min(100, Math.round((value / max) * 100))
  const width = 30
  const filled = Math.round((percentage / 100) * width)
  const empty = width - filled

  const bar = '█'.repeat(filled) + '░'.repeat(empty)

  return (
    <Box flexDirection="column">
      {label && (
        <Box marginBottom={0}>
          <Text bold>{label}</Text>
        </Box>
      )}
      <Box>
        <Text color="cyan">[</Text>
        <Text>{bar}</Text>
        <Text color="cyan">]</Text>
        {showPercentage && (
          <Box marginLeft={1}>
            <Text>{percentage}%</Text>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default ProgressBar
