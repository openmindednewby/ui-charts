import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import {
  LEGEND_GAP,
  LEGEND_MIN_WIDTH,
  ROW_FONT_SIZE,
  ROW_GAP,
  ROW_PADDING,
  SWATCH_RADIUS,
  SWATCH_SIZE,
} from '../constants';
import type { DonutDatum, DonutSegment, DonutValueFormatter } from '../types';
import { legendLine } from '../utils/donutLabels';

const styles = StyleSheet.create({
  legend: { flexGrow: 1, flexShrink: 1, gap: LEGEND_GAP, minWidth: LEGEND_MIN_WIDTH },
  row: { alignItems: 'center', flexDirection: 'row', gap: ROW_GAP, paddingVertical: ROW_PADDING },
  swatch: { borderRadius: SWATCH_RADIUS, height: SWATCH_SIZE, width: SWATCH_SIZE },
  text: { flexShrink: 1, fontSize: ROW_FONT_SIZE },
});

export interface DonutLegendProps {
  segments: ReadonlyArray<DonutSegment<DonutDatum>>;
  colors: readonly string[];
  formatValue: DonutValueFormatter;
  textColor: string;
  testID: string;
}

/** The legend, rendered as a table (one row per slice) so it doubles as the chart's text fallback. */
export const DonutLegend = ({ segments, colors, formatValue, textColor, testID }: DonutLegendProps): React.ReactElement => (
  <View role="table" style={styles.legend} testID={`${testID}-legend`}>
    {segments.map((segment, i) => {
      const line = legendLine(segment, formatValue);
      return (
        <View key={segment.datum.key} role="row" style={styles.row} testID={`${testID}-legend-${segment.datum.key}`}>
          <View aria-hidden style={[styles.swatch, { backgroundColor: colors[i] }]} />
          <Text role="cell" style={[styles.text, { color: textColor }]}>
            {line}
          </Text>
        </View>
      );
    })}
  </View>
);
