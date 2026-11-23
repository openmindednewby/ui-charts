import React from 'react';

import { View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { chartCardStyle } from './utils/chartCardStyle';

export interface ChartCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** A card surface for one chart or figure panel, coloured from the theme `surfaceElevated` and `border` tokens. */
export const ChartCard = ({ children, style, testID = 'chart-card' }: ChartCardProps): React.ReactElement => {
  const { theme } = useUi();
  const card = chartCardStyle({ border: theme.colors.border, surface: theme.colors.surfaceElevated });
  return (
    <View style={[card, style]} testID={testID}>
      {children}
    </View>
  );
};
