import React, { useMemo, useState } from 'react';

import { type LayoutChangeEvent, StyleSheet, View } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { ChartFrame } from '../internal/ChartFrame';
import { defaultFormatValue } from '../internal/labels';
import { BarColumn } from './components/BarColumn';
import { ColumnYAxis } from './components/ColumnYAxis';
import { MAX_COLUMN_LABEL_LENGTH } from './constants';
import { useBarItems } from './hooks/useBarItems';
import { useColumnText } from './hooks/useColumnText';
import type { BarDatum, BarValueFormatter, ColumnAxis } from './types';
import { shortenLabel } from './utils/columnLabels';

const AXIS_GAP = 6;

const styles = StyleSheet.create({
  columns: { alignItems: 'flex-end', flexDirection: 'row' },
  plot: { flexGrow: 1, flexShrink: 1, minWidth: 0 },
  withAxis: { alignItems: 'flex-end', flexDirection: 'row', gap: AXIS_GAP },
});

export interface ColumnChartProps {
  data: readonly BarDatum[];
  label: string;
  emptyText: string;
  heading?: React.ReactNode;
  meta?: React.ReactNode;
  formatValue?: BarValueFormatter;
  palette?: readonly string[];
  max?: number;
  minVisibleFraction?: number;
  maxLabelLength?: number;
  axis?: ColumnAxis;
  testID?: string;
}

/** One vertical column per datum. Value mode: value above, label below. Axis mode (`axis`): a 0..max y-axis and a few even x ticks. */
export const ColumnChart = ({
  data,
  label,
  emptyText,
  heading,
  meta,
  formatValue = defaultFormatValue,
  palette,
  max,
  minVisibleFraction,
  maxLabelLength = MAX_COLUMN_LABEL_LENGTH,
  axis,
  testID = 'column-chart',
}: ColumnChartProps): React.ReactElement => {
  const { theme } = useUi();
  const { items, summary } = useBarItems({ data, formatValue, label, max, minVisibleFraction, palette });
  const [plotWidth, setPlotWidth] = useState(0);
  const labels = useMemo(() => items.map((item) => shortenLabel(item.label, maxLabelLength)), [items, maxLabelLength]);
  const values = useMemo(() => items.map((item) => item.valueText), [items]);
  const layout = useColumnText({ axis, labels, plotWidth, values });
  const handleLayout = (event: LayoutChangeEvent): void => setPlotWidth(event.nativeEvent.layout.width);
  const top = max ?? data.reduce((most, datum) => Math.max(most, datum.value), 0);
  const columns = (
    <View onLayout={handleLayout} role="list" style={[styles.columns, axis === undefined ? null : styles.plot, { gap: layout.gap }]}>
      {items.map((item, index) => (
        <BarColumn
          {...layout.textAt(index)}
          color={item.color}
          fraction={item.fraction}
          key={item.key}
          label={labels[index] ?? item.label}
          mutedColor={theme.colors.textSecondary}
          showValue={axis === undefined}
          testID={`${testID}-bar-${item.key}`}
          textColor={theme.colors.text}
          valueText={item.valueText}
        />
      ))}
    </View>
  );
  return (
    <ChartFrame emptyText={emptyText} heading={heading} isEmpty={items.length === 0} meta={meta} summary={summary} testID={testID}>
      {axis === undefined ? columns : (
        <View style={styles.withAxis}>
          <ColumnYAxis color={theme.colors.textSecondary} maxText={formatValue(top, { key: 'axis-max', label: '', value: top })} testID={testID} zeroText={formatValue(0, { key: 'axis-zero', label: '', value: 0 })} />
          {columns}
        </View>
      )}
    </ChartFrame>
  );
};
