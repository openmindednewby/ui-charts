import { useMemo } from 'react';

import { useUi } from '@dloizides/ui-feedback';

import { segmentColor } from '../../internal/segmentColor';
import { PRIMARY_SHADE } from '../constants';
import type { BarDatum, BarValueFormatter } from '../types';
import { barSummary, scaleBars } from '../utils/barScale';

export interface BarItem {
  key: string;
  label: string;
  valueText: string;
  fraction: number;
  color: string;
}

export interface UseBarItemsInput {
  data: readonly BarDatum[];
  label: string;
  formatValue: BarValueFormatter;
  palette?: readonly string[];
  max?: number;
  minVisibleFraction?: number;
}

/** Scales the data and resolves each bar colour (own colour, else palette, else theme primary) and value text. */
export function useBarItems({ data, label, formatValue, palette, max, minVisibleFraction }: UseBarItemsInput): {
  items: BarItem[];
  summary: string;
} {
  const { theme } = useUi();
  const primary = theme.palette.primary[PRIMARY_SHADE];
  return useMemo(() => {
    const bars = scaleBars(data, { max, minVisibleFraction });
    const colors = palette ?? [primary];
    const items = bars.map((bar) => ({
      color: segmentColor(bar.datum, bar.index, colors),
      fraction: bar.fraction,
      key: bar.datum.key,
      label: bar.datum.label,
      valueText: formatValue(bar.datum.value, bar.datum),
    }));
    return { items, summary: barSummary(label, bars, formatValue) };
  }, [data, label, formatValue, palette, max, minVisibleFraction, primary]);
}
