export interface PanelGridOptions {
  minColumnWidth: number;
  maxColumns: number;
  gap: number;
}

/** Columns that fit in `width`, each at least `minColumnWidth` with `gap` between, capped at `maxColumns`, never below 1. */
export function panelGridColumns(width: number, { minColumnWidth, maxColumns, gap }: PanelGridOptions): number {
  const cap = Math.max(1, Math.floor(maxColumns));
  const measurable = width > 0 && minColumnWidth > 0;
  if (!measurable) return 1;
  const fit = Math.floor((width + gap) / (minColumnWidth + gap));
  return Math.min(cap, Math.max(1, fit));
}

/** One panel width in a row of `columns`; undefined before the container is measured, so the panel stretches. */
export function panelWidth(width: number, columns: number, gap: number): number | undefined {
  if (!(width > 0)) return undefined;
  const count = Math.max(1, columns);
  return Math.floor((width - gap * (count - 1)) / count);
}
