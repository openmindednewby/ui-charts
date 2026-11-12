import type { DonutSegment } from '../types';

/** Turn data into ring segments, preserving input order. Empty when the total is not positive. */
export function toDonutSegments<T extends { value: number }>(data: readonly T[]): Array<DonutSegment<T>> {
  const total = data.reduce((sum, datum) => sum + Math.max(0, datum.value), 0);
  if (total <= 0) return [];

  const segments: Array<DonutSegment<T>> = [];
  let cursor = 0;
  data.forEach((datum, index) => {
    const fraction = Math.max(0, datum.value) / total;
    segments.push({ datum, index, fraction, startFraction: cursor });
    cursor += fraction;
  });
  return segments;
}
