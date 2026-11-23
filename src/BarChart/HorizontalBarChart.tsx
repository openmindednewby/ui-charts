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
  meta?: React.ReactNode;
  formatValue?: BarValueFormatter;
  palette?: readonly string[];
  max?: number;
  minVisibleFraction?: number;
  /** Bar height in px. Default 10. */
  barThickness?: number;
  /** Show each bar's share of the total after a bold count. Default false. */
  showShare?: boolean;
  testID?: string;
}

/** One labelled horizontal bar per datum, value as text at the end, so colour is never the only cue. */
export const HorizontalBarChart = ({
  data,
  label,
  emptyText,
  heading,
  meta,
  formatValue = defaultFormatValue,
  palette,
  max,
  minVisibleFraction,
  barThickness,
  showShare,
  testID = 'horizontal-bar-chart',
}: HorizontalBarChartProps): React.ReactElement => {
  const { theme } = useUi();
  const { items, summary } = useBarItems({ data, formatValue, label, max, minVisibleFraction, palette, showShare });
  return (
    <ChartFrame emptyText={emptyText} heading={heading} isEmpty={items.length === 0} meta={meta} summary={summary} testID={testID}>
      <View role="list" style={styles.rows}>
        {items.map((item) => (
          <BarRow
            color={item.color}
            fraction={item.fraction}
            key={item.key}
            label={item.label}
            mutedColor={theme.colors.textSecondary}
            shareText={item.shareText}
            testID={`${testID}-bar-${item.key}`}
            textColor={theme.colors.text}
            thickness={barThickness}
            trackColor={theme.colors.border}
            valueText={item.valueText}
          />
        ))}
      </View>
    </ChartFrame>
  );
};
