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
  /** Denominator for each share in place of the sum of the shown rows (e.g. a grand total). */
  shareTotal?: number;
  /** Vertical gap between rows in px. Default 6. */
  rowGap?: number;
  /** Fixed track width in px; the label takes the remaining space. Default: the track fills the row. */
  trackWidth?: number;
  /** Value column width in px. Default 64. */
  valueWidth?: number;
  /** Gap between the row columns in px. Default 10. */
  valueGap?: number;
  /** Bar and track corner radius in px. Default: half the thickness. */
  barRadius?: number;
  /** Label font size in px. Default 13. */
  labelFontSize?: number;
  /** Value font size in px. Default 13. */
  valueFontSize?: number;
  /** Fixed label column width in px; the track flexes. Default 96. */
  labelWidth?: number;
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
  shareTotal,
  rowGap,
  trackWidth,
  valueWidth,
  valueGap,
  barRadius,
  labelFontSize,
  valueFontSize,
  labelWidth,
  testID = 'horizontal-bar-chart',
}: HorizontalBarChartProps): React.ReactElement => {
  const { theme } = useUi();
  const { items, summary } = useBarItems({ data, formatValue, label, max, minVisibleFraction, palette, shareTotal, showShare });
  return (
    <ChartFrame emptyText={emptyText} heading={heading} isEmpty={items.length === 0} meta={meta} summary={summary} testID={testID}>
      <View role="list" style={[styles.rows, rowGap === undefined ? undefined : { gap: rowGap }]}>
        {items.map((item) => (
          <BarRow
            barRadius={barRadius}
            color={item.color}
            fraction={item.fraction}
            key={item.key}
            label={item.label}
            labelFontSize={labelFontSize}
            labelWidth={labelWidth}
            mutedColor={theme.colors.textSecondary}
            shareText={item.shareText}
            testID={`${testID}-bar-${item.key}`}
            textColor={theme.colors.text}
            thickness={barThickness}
            trackColor={theme.colors.border}
            trackWidth={trackWidth}
            valueGap={valueGap}
            valueFontSize={valueFontSize}
            valueText={item.valueText}
            valueWidth={valueWidth}
          />
        ))}
      </View>
    </ChartFrame>
  );
};
