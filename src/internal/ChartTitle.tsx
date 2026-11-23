import React from 'react';

import { Text, type TextStyle } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { HEADER_TITLE_FONT_SIZE } from './ChartHeader';

const DEFAULT_TITLE_WEIGHT: TextStyle['fontWeight'] = '700';

export interface ChartTitleProps {
  text: string;
  weight?: TextStyle['fontWeight'];
  size?: number;
  testID?: string;
}

/** A chart heading in the theme text colour; pass it as a chart's `heading` to set its weight or size. */
export const ChartTitle = ({ text, weight = DEFAULT_TITLE_WEIGHT, size = HEADER_TITLE_FONT_SIZE, testID }: ChartTitleProps): React.ReactElement => {
  const { theme } = useUi();
  return (
    <Text style={{ color: theme.colors.text, flexShrink: 1, fontSize: size, fontWeight: weight }} testID={testID}>
      {text}
    </Text>
  );
};
