import React, { useMemo } from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { segmentColor } from '../Donut/utils/donutPalette';
import { BarOrientation } from './BarOrientation';
import { BarColumn } from './components/BarColumn';
import { BarRow } from './components/BarRow';
import { COLUMNS_GAP, LABEL_FONT_SIZE, PRIMARY_SHADE, ROWS_GAP, TITLE_FONT_SIZE, TITLE_GAP } from './constants';
import type { BarDatum, BarValueFormatter } from './types';
import { barSummary, scaleBars } from './utils/barScale';

const styles = StyleSheet.create({
  columns: { alignItems: 'flex-end', flexDirection: 'row', gap: COLUMNS_GAP },
  empty: { fontSize: LABEL_FONT_SIZE },
  root: { gap: TITLE_GAP, minWidth: 0 },
  rows: { gap: ROWS_GAP },
  title: { fontSize: TITLE_FONT_SIZE, fontWeight: '600' },
});

const defaultFormatValue: BarValueFormatter = (value) => String(value);

export interface BarChartProps {
  data: readonly BarDatum[];
  label: string;
  emptyText: string;
  orientation?: BarOrientation;
  formatValue?: BarValueFormatter;
  palette?: readonly string[];
  max?: number;
  minVisibleFraction?: number;
  hideLabel?: boolean;
  testID?: string;
}

/** Horizontal rows or vertical columns; every bar shows its value as text, so colour is never the only cue. */
export const BarChart = ({
  data,
  label,
  emptyText,
  orientation = BarOrientation.Horizontal,
  formatValue = defaultFormatValue,
  palette,
  max,
  minVisibleFraction,
  hideLabel = false,
  testID = 'bar-chart',
}: BarChartProps): React.ReactElement => {
  const { theme } = useUi();
  const bars = useMemo(() => scaleBars(data, { max, minVisibleFraction }), [data, max, minVisibleFraction]);
  const colors = palette ?? [theme.palette.primary[PRIMARY_SHADE]];
  const isVertical = orientation === BarOrientation.Vertical;

  return (
    <View style={styles.root} testID={testID}>
      {hideLabel ? null : (
        <Text role="heading" style={[styles.title, { color: theme.colors.text }]} testID={`${testID}-label`}>
          {label}
        </Text>
      )}
      {bars.length === 0 ? (
        <Text style={[styles.empty, { color: theme.colors.textSecondary }]} testID={`${testID}-empty`}>
          {emptyText}
        </Text>
      ) : (
        <View aria-label={barSummary(label, bars, formatValue)} role="figure" style={isVertical ? styles.columns : styles.rows}>
          {bars.map((bar) => {
            const shared = {
              color: segmentColor(bar.datum, bar.index, colors),
              fraction: bar.fraction,
              label: bar.datum.label,
              testID: `${testID}-bar-${bar.datum.key}`,
              textColor: theme.colors.text,
              valueText: formatValue(bar.datum.value, bar.datum),
            };
            return isVertical ? (
              <BarColumn key={bar.datum.key} mutedColor={theme.colors.textSecondary} {...shared} />
            ) : (
              <BarRow key={bar.datum.key} trackColor={theme.colors.border} {...shared} />
            );
          })}
        </View>
      )}
    </View>
  );
};
