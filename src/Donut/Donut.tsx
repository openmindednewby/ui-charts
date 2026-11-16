import React, { useMemo } from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { DonutLegend } from './components/DonutLegend';
import { DonutRing } from './components/DonutRing';
import { BODY_GAP, ROOT_MIN_WIDTH, ROW_FONT_SIZE, TITLE_FONT_SIZE, TITLE_GAP } from './constants';
import type { DonutDatum, DonutValueFormatter } from '../internal/types';
import { categoricalPalette } from './utils/categoricalPalette';
import type { CategoricalTheme } from './utils/categoricalPalette';
import { defaultFormatValue, donutSummary } from '../internal/labels';
import { segmentColor } from '../internal/segmentColor';
import { toDonutSegments } from '../internal/segments';

const styles = StyleSheet.create({
  body: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: BODY_GAP },
  empty: { fontSize: ROW_FONT_SIZE },
  root: { flexBasis: ROOT_MIN_WIDTH, flexGrow: 1, gap: TITLE_GAP, minWidth: 0 },
  title: { fontSize: TITLE_FONT_SIZE, fontWeight: '600' },
});

export interface DonutProps {
  segments: readonly DonutDatum[];
  label: string;
  emptyText: string;
  formatValue?: DonutValueFormatter;
  palette?: readonly string[];
  hideLabel?: boolean;
  testID?: string;
}

/** A donut chart with a legend table; slice colours default to the theme's categorical palette. */
export const Donut = ({
  segments,
  label,
  emptyText,
  formatValue = defaultFormatValue,
  palette,
  hideLabel = false,
  testID = 'donut',
}: DonutProps): React.ReactElement => {
  const { theme } = useUi();
  const placed = useMemo(() => toDonutSegments(segments), [segments]);
  const fallbackPalette = palette ?? categoricalPalette(theme as CategoricalTheme);
  const colors = placed.map((segment) => segmentColor(segment.datum, segment.index, fallbackPalette));
  const summary = donutSummary(label, placed, formatValue);

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
        <View aria-label={summary} role="figure" style={styles.body}>
          <DonutRing colors={colors} segments={placed} trackColor={theme.colors.border} />
          <DonutLegend colors={colors} formatValue={formatValue} segments={placed} testID={testID} textColor={theme.colors.text} />
        </View>
      )}
    </View>
  );
};
