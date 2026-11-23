import type { ReactNode } from 'react';

export interface DonutDatum {
  key: string;
  label: string;
  value: number;
  color?: string;
  icon?: ReactNode;
}

export interface DonutSegment<T extends { value: number }> {
  datum: T;
  index: number;
  fraction: number;
  startFraction: number;
}

export type DonutValueFormatter = (value: number, datum: DonutDatum) => string;
