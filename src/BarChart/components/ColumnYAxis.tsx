import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { COLUMN_AREA_HEIGHT, LABEL_LINE_HEIGHT } from '../constants';
import { useChartText } from '../../ChartText';

const AXIS_FONT_SIZE = 12;
const AXIS_LINE_HEIGHT = 14;

const styles = StyleSheet.create({
  axis: { height: COLUMN_AREA_HEIGHT, justifyContent: 'space-between', marginBottom: LABEL_LINE_HEIGHT },
  tick: { fontSize: AXIS_FONT_SIZE, fontVariant: ['tabular-nums'], lineHeight: AXIS_LINE_HEIGHT, textAlign: 'right' },
});

export interface ColumnYAxisProps {
  maxText: string;
  zeroText: string;
  color: string;
  testID: string;
  height?: number;
}

/** The y-axis of a column chart in axis mode: the top value at the top of the plot and zero at its base. */
export const ColumnYAxis = ({ maxText, zeroText, color, testID, height = COLUMN_AREA_HEIGHT }: ColumnYAxisProps): React.ReactElement => {
  const { numeral } = useChartText();
  return (
  <View aria-hidden style={[styles.axis, { height }]} testID={`${testID}-y-axis`}>
    <Text numberOfLines={1} style={[styles.tick, numeral, { color }]} testID={`${testID}-y-max`}>
      {maxText}
    </Text>
    <Text numberOfLines={1} style={[styles.tick, numeral, { color }]} testID={`${testID}-y-zero`}>
      {zeroText}
    </Text>
  </View>
  );
};
