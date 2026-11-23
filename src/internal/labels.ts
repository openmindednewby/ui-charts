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

export interface LegendParts {
  label: string;
  value: string;
  percent: string;
}

/** The three legend parts of one segment: its label, formatted value and percent of the whole. */
export function legendParts(segment: DonutSegment<DonutDatum>, formatValue: DonutValueFormatter): LegendParts {
  return {
    label: segment.datum.label,
    percent: percentLabel(segment.fraction),
    value: formatValue(segment.datum.value, segment.datum),
  };
}

/** The legend line for one segment: label, formatted value and percent. */
export function legendLine(segment: DonutSegment<DonutDatum>, formatValue: DonutValueFormatter): string {
  const parts = legendParts(segment, formatValue);
  return [parts.label, parts.value, parts.percent].join(LEGEND_SEPARATOR);
}

/** The accessible summary of the whole chart: its label followed by every legend line. */
export function donutSummary(
  label: string,
  segments: ReadonlyArray<DonutSegment<DonutDatum>>,
  formatValue: DonutValueFormatter
): string {
  return [label, ...segments.map((segment) => legendLine(segment, formatValue))].join(SUMMARY_SEPARATOR);
}
