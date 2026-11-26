import type { SeriesStyle } from './SeriesStyle';

export interface ColumnSeries {
  key: string;
  label: string;
  color?: string;
  style?: SeriesStyle;
  total?: number;
}

export interface ColumnGroup {
  key: string;
  label: string;
  values: Readonly<Record<string, number | undefined>>;
}

export type GroupedValueFormatter = (value: number, series: ColumnSeries) => string;

export type SeriesLegendText = (series: ColumnSeries, totalText: string) => string;

export interface TableToggleLabels {
  showTable: string;
  showChart: string;
  hint: string;
}

export interface ResolvedSeries {
  series: ColumnSeries;
  color: string;
  style: SeriesStyle;
  totalText: string;
}
