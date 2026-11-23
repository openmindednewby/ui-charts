import { CHAR_WIDTH_RATIO, COLUMN_TEXT_PADDING, LABEL_FONT_SIZE } from '../constants';
import { ColumnTextAnchor } from '../ColumnTextAnchor';

export const DEFAULT_AXIS_TICKS = 3;

export interface AxisTickInput {
  count: number;
  tickCount: number;
  plotWidth: number;
  labels: readonly string[];
}

export interface AxisTickPlan {
  indices: ReadonlySet<number>;
  textWidth: number;
}

function labelWidth(labels: readonly string[]): number {
  const longest = labels.reduce((max, text) => Math.max(max, text.length), 0);
  return longest * LABEL_FONT_SIZE * CHAR_WIDTH_RATIO + COLUMN_TEXT_PADDING;
}

function evenIndices(count: number, ticks: number): Set<number> {
  if (ticks <= 1) return new Set([0]);
  return new Set(Array.from({ length: ticks }, (_, i) => Math.round((i * (count - 1)) / (ticks - 1))));
}

/** The columns that carry an x-axis label: `tickCount` evenly spaced (first and last included), fewer when they would not fit. */
export function axisTickPlan({ count, tickCount, plotWidth, labels }: AxisTickInput): AxisTickPlan {
  const textWidth = labelWidth(labels);
  if (count === 0) return { indices: new Set(), textWidth };
  const fit = plotWidth > 0 ? Math.max(1, Math.floor(plotWidth / (textWidth + COLUMN_TEXT_PADDING))) : tickCount;
  return { indices: evenIndices(count, Math.min(count, tickCount, fit)), textWidth };
}

/** Where an axis label sits on its column: the first starts at it, the last ends at it, the rest centre on it. */
export function axisTickAnchor(index: number, count: number): ColumnTextAnchor {
  if (count > 1 && index === 0) return ColumnTextAnchor.Start;
  if (count > 1 && index === count - 1) return ColumnTextAnchor.End;
  return ColumnTextAnchor.Center;
}
