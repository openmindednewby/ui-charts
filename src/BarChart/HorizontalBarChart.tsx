import React from 'react';

import { StyleSheet, View } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { ChartFrame } from '../internal/ChartFrame';
import { defaultFormatValue } from '../internal/labels';
import { BarRow } from './components/BarRow';
import { ROWS_GAP } from './constants';
import { useBarItems } from './hooks/useBarItems';
import type { BarDatum, BarValueFormatter } from './types';

const styles = StyleSheet.create({ rows: { gap: ROWS_GAP } });

export interface HorizontalBarChartProps {
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

/** One labelled horizontal bar per datum, value as text at the end, so colour is never the only cue. */
export const HorizontalBarChart = ({
  data,
  label,
  emptyText,
  heading,
  formatValue = defaultFormatValue,
  palette,
  max,
  minVisibleFraction,
  testID = 'horizontal-bar-chart',
}: HorizontalBarChartProps): React.ReactElement => {
  const { theme } = useUi();
  const { items, summary } = useBarItems({ data, formatValue, label, max, minVisibleFraction, palette });
  return (
    <ChartFrame emptyText={emptyText} heading={heading} isEmpty={items.length === 0} summary={summary} testID={testID}>
      <View role="list" style={styles.rows}>
        {items.map((item) => (
          <BarRow
            color={item.color}
            fraction={item.fraction}
            key={item.key}
            label={item.label}
            testID={`${testID}-bar-${item.key}`}
            textColor={theme.colors.text}
            trackColor={theme.colors.border}
            valueText={item.valueText}
          />
        ))}
      </View>
    </ChartFrame>
  );
};
