import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { GROUPED_FONT_SIZE, LEGEND_COLUMN_GAP, LEGEND_KEY_GAP, LEGEND_ROW_GAP, OUTLINE_WIDTH, SWATCH_SIZE } from '../constants';
import { SeriesStyle } from '../SeriesStyle';
import type { ResolvedSeries, SeriesLegendText } from '../types';
import { markerRadius, useChartText } from '../../ChartText';

const styles = StyleSheet.create({
  key: { alignItems: 'center', flexDirection: 'row', gap: LEGEND_KEY_GAP, maxWidth: '100%' },
  legend: { columnGap: LEGEND_COLUMN_GAP, flexDirection: 'row', flexWrap: 'wrap', rowGap: LEGEND_ROW_GAP },
  swatch: { borderWidth: OUTLINE_WIDTH, height: SWATCH_SIZE, width: SWATCH_SIZE },
  text: { flexShrink: 1, fontSize: GROUPED_FONT_SIZE },
});

export interface SeriesLegendProps {
  series: readonly ResolvedSeries[];
  legendText: SeriesLegendText;
  textColor: string;
  testID: string;
}

/** One key per series: a filled or outlined swatch and the series label with its total. */
export const SeriesLegend = ({ series, legendText, textColor, testID }: SeriesLegendProps): React.ReactElement => {
  const { legendMarker } = useChartText();
  return (
  <View role="list" style={styles.legend} testID={`${testID}-legend`}>
    {series.map((one) => (
      <View key={one.series.key} role="listitem" style={styles.key}>
        <View
          style={[styles.swatch, { borderColor: one.color, borderRadius: markerRadius(legendMarker, SWATCH_SIZE, 0) }, one.style === SeriesStyle.Filled ? { backgroundColor: one.color } : null]}
          testID={`${testID}-swatch-${one.series.key}`}
        />
        <Text style={[styles.text, { color: textColor }]} testID={`${testID}-legend-${one.series.key}`}>
          {legendText(one.series, one.totalText)}
        </Text>
      </View>
    ))}
  </View>
  );
};
