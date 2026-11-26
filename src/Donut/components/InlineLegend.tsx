import React from 'react';

import { StyleSheet, Text, View } from 'react-native';
import type { TextStyle } from 'react-native';

import { legendLine, legendParts } from '../../internal/labels';
import type { DonutDatum, DonutSegment, DonutValueFormatter } from '../../internal/types';
import { ROW_FONT_SIZE } from '../constants';
import { useChartText } from '../../ChartText';

const DOT_SIZE = 8;
const ITEM_GAP = 6;
const ROW_COLUMN_GAP = 16;
const ROW_ROW_GAP = 6;
const COUNT_TEXT: TextStyle = { fontWeight: '700' };

const styles = StyleSheet.create({
  count: { fontSize: ROW_FONT_SIZE, fontVariant: ['tabular-nums'] },
  dot: { borderRadius: DOT_SIZE / 2, height: DOT_SIZE, width: DOT_SIZE },
  item: { alignItems: 'center', flexDirection: 'row', gap: ITEM_GAP },
  label: { fontSize: ROW_FONT_SIZE },
  percent: { fontSize: ROW_FONT_SIZE, fontVariant: ['tabular-nums'] },
  row: { columnGap: ROW_COLUMN_GAP, flexDirection: 'row', flexWrap: 'wrap', rowGap: ROW_ROW_GAP },
});

export interface InlineLegendProps {
  segments: ReadonlyArray<DonutSegment<DonutDatum>>;
  colors: readonly string[];
  formatValue: DonutValueFormatter;
  textColor: string;
  mutedColor: string;
  testID: string;
}

/** The legend on one wrapping row: per item a dot, the datum icon if any, the label, a bold count and a muted percent. */
export const InlineLegend = ({ segments, colors, formatValue, textColor, mutedColor, testID }: InlineLegendProps): React.ReactElement => {
  const { numeral } = useChartText();
  return (
  <View role="list" style={styles.row} testID={`${testID}-legend`}>
    {segments.map((segment, i) => {
      const parts = legendParts(segment, formatValue);
      const id = `${testID}-legend-${segment.datum.key}`;
      return (
        <View aria-label={legendLine(segment, formatValue)} key={segment.datum.key} role="listitem" style={styles.item} testID={id}>
          <View aria-hidden style={[styles.dot, { backgroundColor: colors[i] }]} />
          {segment.datum.icon ?? null}
          <Text style={[styles.label, { color: textColor }]}>{parts.label}</Text>
          <Text style={[styles.count, numeral, COUNT_TEXT, { color: textColor }]} testID={`${id}-count`}>
            {parts.value}
          </Text>
          <Text style={[styles.percent, numeral, { color: mutedColor }]} testID={`${id}-percent`}>
            {parts.percent}
          </Text>
        </View>
      );
    })}
  </View>
  );
};
