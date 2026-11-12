export interface DonutDatum {
  key: string;
  label: string;
  value: number;
  color?: string;
}

export interface DonutSegment<T extends { value: number }> {
  datum: T;
  index: number;
  fraction: number;
  startFraction: number;
}

export type DonutValueFormatter = (value: number, datum: DonutDatum) => string;
