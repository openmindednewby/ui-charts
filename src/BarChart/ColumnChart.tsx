import React, { useMemo, useState } from 'react';

import { type LayoutChangeEvent, StyleSheet, View } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { ChartFrame } from '../internal/ChartFrame';
import { defaultFormatValue } from '../internal/labels';
import { BarColumn } from './components/BarColumn';
import { MAX_COLUMN_LABEL_LENGTH } from './constants';
import { useBarItems } from './hooks/useBarItems';
import type { BarDatum, BarValueFormatter } from './types';
import { columnLabelPlan, isColumnTextShown, shortenLabel } from './utils/columnLabels';

const styles = StyleSheet.create({ columns: { alignItems: 'flex-end', flexDirection: 'row' } });

export interface ColumnChartProps {
  data: readonly BarDatum[];
  label: string;
  emptyText: string;
  heading?: React.ReactNode;
  formatValue?: BarValueFormatter;
  palette?: readonly string[];
  max?: number;
  minVisibleFraction?: number;
  maxLabelLength?: number;
  testID?: string;
}

/** One vertical column per datum, value above and label below on one line each; crowded text thins to every n-th column. */
export const ColumnChart = ({
  data,
  label,
  emptyText,
  heading,
  formatValue = defaultFormatValue,
  palette,
  max,
  minVisibleFraction,
  maxLabelLength = MAX_COLUMN_LABEL_LENGTH,
  testID = 'column-chart',
}: ColumnChartProps): React.ReactElement => {
  const { theme } = useUi();
  const { items, summary } = useBarItems({ data, formatValue, label, max, minVisibleFraction, palette });
  const [plotWidth, setPlotWidth] = useState(0);
  const labels = useMemo(() => items.map((item) => shortenLabel(item.label, maxLabelLength)), [items, maxLabelLength]);
  const plan = useMemo(
    () => columnLabelPlan({ labels, plotWidth, values: items.map((item) => item.valueText) }),
    [items, labels, plotWidth]
  );
  const handleLayout = (event: LayoutChangeEvent): void => setPlotWidth(event.nativeEvent.layout.width);
  return (
    <ChartFrame emptyText={emptyText} heading={heading} isEmpty={items.length === 0} summary={summary} testID={testID}>
      <View onLayout={handleLayout} role="list" style={[styles.columns, { gap: plan.gap }]}>
        {items.map((item, index) => (
          <BarColumn
            color={item.color}
            fraction={item.fraction}
            key={item.key}
            label={labels[index] ?? item.label}
            mutedColor={theme.colors.textSecondary}
            showText={isColumnTextShown(index, plan.step)}
            testID={`${testID}-bar-${item.key}`}
            textColor={theme.colors.text}
            textWidth={plan.textWidth}
            valueText={item.valueText}
          />
        ))}
      </View>
    </ChartFrame>
  );
};
