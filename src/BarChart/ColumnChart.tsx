import React from 'react';

import { StyleSheet, View } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { ChartFrame } from '../internal/ChartFrame';
import { defaultFormatValue } from '../internal/labels';
import { BarColumn } from './components/BarColumn';
import { COLUMNS_GAP } from './constants';
import { useBarItems } from './hooks/useBarItems';
import type { BarDatum, BarValueFormatter } from './types';

const styles = StyleSheet.create({ columns: { alignItems: 'flex-end', flexDirection: 'row', gap: COLUMNS_GAP } });

export interface ColumnChartProps {
  data: readonly BarDatum[];
  label: string;
  emptyText: string;
  heading?: React.ReactNode;
  formatValue?: BarValueFormatter;
  palette?: readonly string[];
  max?: number;
  minVisibleFraction?: number;
  testID?: string;
}

/** One vertical column per datum (a histogram), value above and label below, so colour is never the only cue. */
export const ColumnChart = ({
  data,
  label,
  emptyText,
  heading,
  formatValue = defaultFormatValue,
  palette,
  max,
  minVisibleFraction,
  testID = 'column-chart',
}: ColumnChartProps): React.ReactElement => {
  const { theme } = useUi();
  const { items, summary } = useBarItems({ data, formatValue, label, max, minVisibleFraction, palette });
  return (
    <ChartFrame emptyText={emptyText} heading={heading} isEmpty={items.length === 0} summary={summary} testID={testID}>
      <View role="list" style={styles.columns}>
        {items.map((item) => (
          <BarColumn
            color={item.color}
            fraction={item.fraction}
            key={item.key}
            label={item.label}
            mutedColor={theme.colors.textSecondary}
            testID={`${testID}-bar-${item.key}`}
            textColor={theme.colors.text}
            valueText={item.valueText}
          />
        ))}
      </View>
    </ChartFrame>
  );
};
