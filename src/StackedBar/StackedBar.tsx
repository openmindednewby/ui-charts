import React, { useMemo } from 'react';

import { StyleSheet, View } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { categoricalPalette, DonutLegend, LegendVariant } from '../Donut';
import type { CategoricalTheme } from '../Donut';
import { ChartFrame } from '../internal/ChartFrame';
import { defaultFormatValue, donutSummary } from '../internal/labels';
import { segmentColor } from '../internal/segmentColor';
import { toDonutSegments } from '../internal/segments';
import { StripedFill } from './StripedFill';
import type { DonutDatum, DonutValueFormatter } from '../internal/types';

const STACK_HEIGHT = 14;
const STACK_RADIUS = 4;
const STACK_GAP = 2;
const BODY_GAP = 10;

const styles = StyleSheet.create({
  body: { gap: BODY_GAP },
  stack: { borderRadius: STACK_RADIUS, flexDirection: 'row', gap: STACK_GAP, height: STACK_HEIGHT, overflow: 'hidden' },
});

export interface StackedBarProps {
  segments: readonly DonutDatum[];
  label: string;
  emptyText: string;
  heading?: React.ReactNode;
  meta?: React.ReactNode;
  formatValue?: DonutValueFormatter;
  palette?: readonly string[];
  legendVariant?: LegendVariant;
  testID?: string;
}

/** One bar split into parts of a whole (a striped part draws hatched), with the Donut legend (table, or one wrapping inline row) as its text fallback. */
export const StackedBar = ({
  segments,
  label,
  emptyText,
  heading,
  meta,
  formatValue = defaultFormatValue,
  palette,
  legendVariant = LegendVariant.Table,
  testID = 'stacked-bar',
}: StackedBarProps): React.ReactElement => {
  const { theme } = useUi();
  const placed = useMemo(() => toDonutSegments(segments), [segments]);
  const fallbackPalette = palette ?? categoricalPalette(theme as CategoricalTheme);
  const colors = placed.map((segment) => segmentColor(segment.datum, segment.index, fallbackPalette));
  const summary = donutSummary(label, placed, formatValue);

  return (
    <ChartFrame
      bodyStyle={styles.body}
      emptyText={emptyText}
      heading={heading}
      isEmpty={placed.length === 0}
      meta={meta}
      summary={summary}
      testID={testID}
    >
      <View aria-hidden style={styles.stack}>
        {placed.map((segment, i) => (
          <View key={segment.datum.key} style={{ backgroundColor: segment.datum.striped === true ? undefined : colors[i], flexBasis: 0, flexGrow: segment.fraction, minWidth: 0 }}>
            {segment.datum.striped === true ? <StripedFill color={colors[i] ?? ''} id={`${testID}-stripes-${segment.datum.key}`} /> : null}
          </View>
        ))}
      </View>
      <DonutLegend
        colors={colors}
        formatValue={formatValue}
        mutedColor={theme.colors.textSecondary}
        segments={placed}
        testID={testID}
        textColor={theme.colors.text}
        variant={legendVariant}
      />
    </ChartFrame>
  );
};
