/**
 * Message display component for Ink
 *
 * Provides styled message output with different types.
 */

import { Box, Text } from "ink";
import type React from "react";
import { DEFAULT_DISPLAY_TYPE } from "../constants";
import {
  COLOR_DEFAULT,
  COLOR_ERROR,
  COLOR_INFO,
  COLOR_SUCCESS,
  COLOR_WARNING,
  ICON_ERROR,
  ICON_INFO,
  ICON_SUCCESS,
  ICON_WARNING,
} from "../core/icons";
import type { DisplayTypeColor } from "../types";

export interface MessageProps {
  message: string;
  type?: "info" | "success" | "error" | "warning";
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
export const Message: React.FC<MessageProps> = ({
  message,
  type = DEFAULT_DISPLAY_TYPE,
}) => {
  let icon = ICON_INFO;
  let colorConfig: DisplayTypeColor;

  switch (type) {
    case "success":
      icon = ICON_SUCCESS;
      colorConfig = { type: "success", color: COLOR_SUCCESS };
      break;
    case "error":
      icon = ICON_ERROR;
      colorConfig = { type: "error", color: COLOR_ERROR };
      break;
    case "warning":
      icon = ICON_WARNING;
      colorConfig = { type: "warning", color: COLOR_WARNING };
      break;
    case "info":
      icon = ICON_INFO;
      colorConfig = { type: "info", color: COLOR_INFO };
      break;
    default:
      icon = ICON_INFO;
      colorConfig = { type: "info", color: COLOR_DEFAULT };
      break;
  }

  const color = colorConfig.color;

  return (
    <Box marginY={0}>
      <Box marginRight={1}>
        <Text bold color={color}>
          {icon}
        </Text>
      </Box>
      <Text>{message}</Text>
    </Box>
  );
};
