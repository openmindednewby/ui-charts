import { LEGEND_SEPARATOR, PERCENT_SCALE, SUMMARY_SEPARATOR } from './labelConstants';
import type { DonutDatum, DonutSegment, DonutValueFormatter } from './types';

/** The default formatter for every chart: the raw number as a string. */
export function defaultFormatValue(value: number): string {
  return String(value);
}

/** A segment's share of the total as a whole percent, e.g. "75%". */
export function percentLabel(fraction: number): string {
  return `${Math.round(fraction * PERCENT_SCALE)}%`;
}

/** The legend line for one segment: label, formatted value and percent. */
export function legendLine(segment: DonutSegment<DonutDatum>, formatValue: DonutValueFormatter): string {
  const value = formatValue(segment.datum.value, segment.datum);
  return [segment.datum.label, value, percentLabel(segment.fraction)].join(LEGEND_SEPARATOR);
}

/** The accessible summary of the whole chart: its label followed by every legend line. */
export function donutSummary(
  label: string,
  segments: ReadonlyArray<DonutSegment<DonutDatum>>,
  formatValue: DonutValueFormatter
): string {
  return [label, ...segments.map((segment) => legendLine(segment, formatValue))].join(SUMMARY_SEPARATOR);
}
