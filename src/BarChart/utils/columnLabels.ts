import {
  CHAR_WIDTH_RATIO,
  COLUMN_TEXT_PADDING,
  COLUMNS_GAP,
  COLUMNS_GAP_RATIO,
  ELLIPSIS,
  LABEL_FONT_SIZE,
  MIN_COLUMNS_GAP,
} from '../constants';
import { ColumnTextAnchor } from '../ColumnTextAnchor';

export interface ColumnLabelPlanInput {
  labels: readonly string[];
  values: readonly string[];
  plotWidth: number;
}

export interface ColumnLabelPlan {
  step: number;
  gap: number;
  slotWidth: number;
  textWidth: number;
}

function longestLength(texts: readonly string[]): number {
  return texts.reduce((longest, text) => Math.max(longest, text.length), 0);
}

/** Which columns show their value and label (every `step`-th) so no text overlaps, and the gap to use. */
export function columnLabelPlan({ labels, values, plotWidth }: ColumnLabelPlanInput): ColumnLabelPlan {
  const longest = Math.max(longestLength(labels), longestLength(values));
  const textWidth = longest * LABEL_FONT_SIZE * CHAR_WIDTH_RATIO + COLUMN_TEXT_PADDING;
  const count = labels.length;
  if (plotWidth <= 0 || count === 0) return { gap: COLUMNS_GAP, slotWidth: 0, step: 1, textWidth };
  const naturalSlot = plotWidth / count;
  const gap = Math.min(COLUMNS_GAP, Math.max(MIN_COLUMNS_GAP, Math.floor(naturalSlot * COLUMNS_GAP_RATIO)));
  const slotWidth = (plotWidth + gap) / count;
  return { gap, slotWidth, step: Math.max(1, Math.ceil(textWidth / slotWidth)), textWidth };
}

/** Width of the box a shown value or label is centred in: its label slot (`step` columns), or the text width before layout. */
export function columnTextBoxWidth(plan: ColumnLabelPlan): number {
  return plan.slotWidth > 0 ? plan.slotWidth * plan.step : plan.textWidth;
}

export interface ColumnTextAnchorInput {
  index: number;
  count: number;
  plan: ColumnLabelPlan;
  plotWidth: number;
}

/** Where a value-mode text box sits on its column: start at the plot's left edge or end at its right edge when a centred box would pass it. */
export function columnTextAnchor({ index, count, plan, plotWidth }: ColumnTextAnchorInput): ColumnTextAnchor {
  if (plan.slotWidth <= 0 || plotWidth <= 0 || count < 2) return ColumnTextAnchor.Center;
  const boxWidth = columnTextBoxWidth(plan);
  const columnWidth = plan.slotWidth - plan.gap;
  const centre = index * plan.slotWidth + columnWidth / 2;
  if (centre - boxWidth / 2 < 0) return ColumnTextAnchor.Start;
  if (centre + boxWidth / 2 > plotWidth) return ColumnTextAnchor.End;
  return ColumnTextAnchor.Center;
}

/** True when column `index` shows its text under a plan of `step`. */
export function isColumnTextShown(index: number, step: number): boolean {
  return index % step === 0;
}

/** The label cut to `max` characters, ending with an ellipsis when cut. */
export function shortenLabel(label: string, max: number): string {
  return label.length <= max ? label : `${label.slice(0, max - 1)}${ELLIPSIS}`;
}
