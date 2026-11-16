import { LEGEND_SEPARATOR, SUMMARY_SEPARATOR } from '../../Donut/constants';
import type { BarDatum, BarScaleOptions, BarValueFormatter, ScaledBar } from '../types';

function safeValue(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function barFraction(value: number, max: number, minVisible: number): number {
  if (max <= 0 || value <= 0) return 0;
  return Math.max(minVisible, Math.min(1, value / max));
}

/** Each bar length as a fraction of the largest value (or `max`); a positive value never drops below `minVisibleFraction`. */
export function scaleBars<T extends { value: number }>(data: readonly T[], options: BarScaleOptions = {}): Array<ScaledBar<T>> {
  const values = data.map((datum) => safeValue(datum.value));
  const hasMax = options.max !== undefined && options.max > 0;
  const max = hasMax ? (options.max ?? 0) : Math.max(0, ...values);
  const minVisible = options.minVisibleFraction ?? 0;
  return data.map((datum, index) => ({ datum, index, fraction: barFraction(values[index] ?? 0, max, minVisible) }));
}

/** The accessible summary: the chart label followed by each bar label and formatted value. */
export function barSummary(label: string, bars: ReadonlyArray<ScaledBar<BarDatum>>, formatValue: BarValueFormatter): string {
  const lines = bars.map((bar) => [bar.datum.label, formatValue(bar.datum.value, bar.datum)].join(LEGEND_SEPARATOR));
  return [label, ...lines].join(SUMMARY_SEPARATOR);
}
