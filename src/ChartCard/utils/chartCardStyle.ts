import type { ViewStyle } from 'react-native';

export const CARD_BORDER_WIDTH = 1;
export const CARD_RADIUS = 12;
export const CARD_PADDING = 16;

export interface ChartCardColors {
  surface: string;
  border: string;
}

/** The card surface around a chart panel: a theme border, rounded corners and inner padding. */
export function chartCardStyle(colors: ChartCardColors): ViewStyle {
  return {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: CARD_RADIUS,
    borderWidth: CARD_BORDER_WIDTH,
    padding: CARD_PADDING,
  };
}
