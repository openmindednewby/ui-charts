import React, { useMemo } from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { DonutLegend } from './components/DonutLegend';
import { DonutRing } from './components/DonutRing';
import { BODY_GAP, PALETTE_SHADE, ROOT_MIN_WIDTH, ROW_FONT_SIZE, TITLE_FONT_SIZE, TITLE_GAP } from './constants';
import type { DonutDatum, DonutValueFormatter } from './types';
import { defaultFormatValue, donutSummary } from './utils/donutLabels';
import { segmentColor } from './utils/donutPalette';
import { toDonutSegments } from './utils/donutSegments';

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
  testID?: string;
}

interface ThemePalette {
  primary?: Record<string, string | undefined>;
  secondary?: Record<string, string | undefined>;
  accent?: Record<string, string | undefined>;
}

function themePalette(palette: ThemePalette | undefined): string[] {
  const shades = [palette?.primary, palette?.secondary, palette?.accent].map((ramp) => ramp?.[PALETTE_SHADE]);
  return shades.filter((shade): shade is string => shade !== undefined && shade !== '');
}

/** A donut chart with a legend table; slice colours default to the theme palette. */
export const Donut = ({
  segments,
  label,
  emptyText,
  formatValue = defaultFormatValue,
  palette,
  testID = 'donut',
}: DonutProps): React.ReactElement => {
  const { theme } = useUi();
  const placed = useMemo(() => toDonutSegments(segments), [segments]);
  const fallbackPalette = palette ?? themePalette((theme as { palette?: ThemePalette }).palette);
  const colors = placed.map((segment) => segmentColor(segment.datum, segment.index, fallbackPalette));
  const summary = donutSummary(label, placed, formatValue);

  return (
    <View style={styles.root} testID={testID}>
      <Text role="heading" style={[styles.title, { color: theme.colors.text }]}>
        {label}
      </Text>
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
