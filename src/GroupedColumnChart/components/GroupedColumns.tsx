import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { BARS_GAP, FULL_PERCENT, GROUP_PLOT_HEIGHT, GROUPED_FONT_SIZE, GROUPS_GAP, MIN_BAR_WIDTH, OUTLINE_WIDTH } from '../constants';
import { SeriesStyle } from '../SeriesStyle';
import type { ColumnGroup, ResolvedSeries } from '../types';
import { groupValue } from '../utils/groupedScale';

const styles = StyleSheet.create({
  bar: { flex: 1, minWidth: MIN_BAR_WIDTH },
  group: { alignItems: 'flex-end', flex: 1, flexDirection: 'row', gap: BARS_GAP, height: '100%', minWidth: 0 },
  label: { flex: 1, fontSize: GROUPED_FONT_SIZE, minWidth: 0, textAlign: 'center' },
  labels: { flexDirection: 'row', gap: GROUPS_GAP },
  outlined: { borderWidth: OUTLINE_WIDTH },
  plot: { alignItems: 'flex-end', flexDirection: 'row', gap: GROUPS_GAP, height: GROUP_PLOT_HEIGHT },
});

export interface GroupedColumnsProps {
  groups: readonly ColumnGroup[];
  series: readonly ResolvedSeries[];
  top: number;
  labelColor: string;
  testID: string;
}

const heightOf = (value: number, top: number): `${number}%` => `${Math.min(FULL_PERCENT, Math.round((value / top) * FULL_PERCENT))}%`;

/** One group of side-by-side bars per entry, filled or outlined per series, with the group labels below. */
export const GroupedColumns = ({ groups, series, top, labelColor, testID }: GroupedColumnsProps): React.ReactElement => (
  <View>
    <View role="list" style={styles.plot}>
      {groups.map((group) => (
        <View key={group.key} role="listitem" style={styles.group} testID={`${testID}-group-${group.key}`}>
          {series.map((one) => {
            const paint = one.style === SeriesStyle.Outlined ? [styles.outlined, { borderColor: one.color }] : { backgroundColor: one.color };
            const height = { height: heightOf(groupValue(group, one.series.key), top) };
            return <View key={one.series.key} style={[styles.bar, height, paint]} testID={`${testID}-bar-${group.key}-${one.series.key}`} />;
          })}
        </View>
      ))}
    </View>
    <View style={styles.labels}>
      {groups.map((group) => (
        <Text key={group.key} numberOfLines={1} style={[styles.label, { color: labelColor }]}>
          {group.label}
        </Text>
      ))}
    </View>
  </View>
);
