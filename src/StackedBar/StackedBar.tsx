import React, { useMemo } from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { DonutLegend } from '../Donut/components/DonutLegend';
import type { DonutDatum, DonutValueFormatter } from '../Donut/types';
import { categoricalPalette } from '../Donut/utils/categoricalPalette';
import type { CategoricalTheme } from '../Donut/utils/categoricalPalette';
import { defaultFormatValue, donutSummary } from '../Donut/utils/donutLabels';
import { segmentColor } from '../Donut/utils/donutPalette';
import { toDonutSegments } from '../Donut/utils/donutSegments';

const STACK_HEIGHT = 14;
const STACK_RADIUS = 4;
const STACK_GAP = 2;
const BODY_GAP = 10;
const TITLE_FONT_SIZE = 16;
const EMPTY_FONT_SIZE = 13;

const styles = StyleSheet.create({
  empty: { fontSize: EMPTY_FONT_SIZE },
  root: { gap: BODY_GAP, minWidth: 0 },
  stack: { borderRadius: STACK_RADIUS, flexDirection: 'row', gap: STACK_GAP, height: STACK_HEIGHT, overflow: 'hidden' },
  title: { fontSize: TITLE_FONT_SIZE, fontWeight: '600' },
});

export interface StackedBarProps {
  segments: readonly DonutDatum[];
  label: string;
  emptyText: string;
  formatValue?: DonutValueFormatter;
  palette?: readonly string[];
  hideLabel?: boolean;
  testID?: string;
}

/** One bar split into parts of a whole, with the Donut legend table as its text fallback. */
export const StackedBar = ({
  segments,
  label,
  emptyText,
  formatValue = defaultFormatValue,
  palette,
  hideLabel = false,
  testID = 'stacked-bar',
}: StackedBarProps): React.ReactElement => {
  const { theme } = useUi();
  const placed = useMemo(() => toDonutSegments(segments), [segments]);
  const fallbackPalette = palette ?? categoricalPalette(theme as CategoricalTheme);
  const colors = placed.map((segment) => segmentColor(segment.datum, segment.index, fallbackPalette));

  return (
    <View style={styles.root} testID={testID}>
      {hideLabel ? null : (
        <Text role="heading" style={[styles.title, { color: theme.colors.text }]} testID={`${testID}-label`}>
          {label}
        </Text>
      )}
      {placed.length === 0 ? (
        <Text style={[styles.empty, { color: theme.colors.textSecondary }]} testID={`${testID}-empty`}>
          {emptyText}
        </Text>
      ) : (
        <View aria-label={donutSummary(label, placed, formatValue)} role="figure" style={styles.root}>
          <View aria-hidden style={styles.stack}>
            {placed.map((segment, i) => (
              <View key={segment.datum.key} style={{ backgroundColor: colors[i], flexGrow: segment.fraction }} />
            ))}
          </View>
          <DonutLegend colors={colors} formatValue={formatValue} segments={placed} testID={testID} textColor={theme.colors.text} />
        </View>
      )}
    </View>
  );
};
