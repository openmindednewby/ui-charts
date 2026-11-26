import { SUMMARY_SEPARATOR } from '../../internal/labelConstants';
import { segmentColor } from '../../internal/segmentColor';
import { SeriesStyle } from '../SeriesStyle';
import type { ColumnGroup, ColumnSeries, GroupedValueFormatter, ResolvedSeries } from '../types';

const LABEL_SEPARATOR = ': ';
const PART_SEPARATOR = ' ';
const GROUP_SEPARATOR = '; ';

/** The value of one series in one group; a missing or negative value counts as 0. */
export function groupValue(group: ColumnGroup, seriesKey: string): number {
  return Math.max(0, group.values[seriesKey] ?? 0);
}

/** The top of the scale: `max` when given, else the largest value in any group, never below 1. */
export function groupedMax(groups: readonly ColumnGroup[], series: readonly ColumnSeries[], max?: number): number {
  if (max !== undefined && max > 0) return max;
  const values = groups.flatMap((group) => series.map((one) => groupValue(group, one.key)));
  return Math.max(1, ...values);
}

/** The legend total: the series' own `total` when given, else its sum over all groups. */
export function seriesTotal(series: ColumnSeries, groups: readonly ColumnGroup[]): number {
  return series.total ?? groups.reduce((sum, group) => sum + groupValue(group, series.key), 0);
}

/** Each series with its colour (own, else palette by index), style (filled by default) and formatted total. */
export function resolveSeries(
  series: readonly ColumnSeries[],
  groups: readonly ColumnGroup[],
  palette: readonly string[],
  formatValue: GroupedValueFormatter
): ResolvedSeries[] {
  return series.map((one, index) => ({
    color: segmentColor({ color: one.color, key: one.key, label: one.label, value: 0 }, index, palette),
    series: one,
    style: one.style ?? SeriesStyle.Filled,
    totalText: formatValue(seriesTotal(one, groups), one),
  }));
}

/** The accessible summary: the chart label, then per group its label and every series value. */
export function groupedSummary(
  label: string,
  groups: readonly ColumnGroup[],
  series: readonly ColumnSeries[],
  formatValue: GroupedValueFormatter
): string {
  const lines = groups.map((group) => {
    const parts = series.map((one) => [one.label, formatValue(groupValue(group, one.key), one)].join(PART_SEPARATOR));
    return `${group.label}${LABEL_SEPARATOR}${parts.join(SUMMARY_SEPARATOR)}`;
  });
  return [label, ...lines].join(GROUP_SEPARATOR);
}
