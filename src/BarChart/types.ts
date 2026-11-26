export interface BarDatum {
  key: string;
  label: string;
  value: number;
  color?: string;
}

export interface ScaledBar<T extends { value: number }> {
  datum: T;
  index: number;
  fraction: number;
}

export interface BarScaleOptions {
  max?: number;
  minVisibleFraction?: number;
}

export type BarValueFormatter = (value: number, datum: BarDatum) => string;

export interface ColumnAxis {
  tickCount?: number;
  plotHeight?: number;
}
