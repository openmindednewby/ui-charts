import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { GROUPED_FONT_SIZE, OUTLINE_WIDTH, TABLE_ROW_PADDING } from '../constants';
import type { ColumnGroup, GroupedValueFormatter, ResolvedSeries } from '../types';
import { groupValue } from '../utils/groupedScale';
import { useChartText } from '../../ChartText';

const styles = StyleSheet.create({
  cell: { flex: 1, fontSize: GROUPED_FONT_SIZE, fontVariant: ['tabular-nums'], minWidth: 0, textAlign: 'right' },
  head: { fontWeight: '700' },
  lead: { textAlign: 'left' },
  row: { borderTopWidth: OUTLINE_WIDTH, flexDirection: 'row', gap: TABLE_ROW_PADDING, paddingVertical: TABLE_ROW_PADDING },
});

export interface GroupedTableProps {
  groups: readonly ColumnGroup[];
  series: readonly ResolvedSeries[];
  formatValue: GroupedValueFormatter;
  textColor: string;
  borderColor: string;
  testID: string;
}

/** The chart's numbers as a table: a header of series labels, then one row per group. */
export const GroupedTable = ({ groups, series, formatValue, textColor, borderColor, testID }: GroupedTableProps): React.ReactElement => {
  const { numeral } = useChartText();
  const cell = [styles.cell, numeral, { color: textColor }];
  const row = [styles.row, { borderTopColor: borderColor }];
  return (
    <View role="table" testID={`${testID}-table`}>
      <View role="row" style={row}>
        <Text role="columnheader" style={[cell, styles.head, styles.lead]} />
        {series.map((one) => (
          <Text key={one.series.key} numberOfLines={1} role="columnheader" style={[cell, styles.head]}>
            {one.series.label}
          </Text>
        ))}
      </View>
      {groups.map((group) => (
        <View key={group.key} role="row" style={row} testID={`${testID}-row-${group.key}`}>
          <Text numberOfLines={1} role="rowheader" style={[cell, styles.lead]}>
            {group.label}
          </Text>
          {series.map((one) => (
            <Text key={one.series.key} numberOfLines={1} role="cell" style={cell}>
              {formatValue(groupValue(group, one.series.key), one.series)}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
};
