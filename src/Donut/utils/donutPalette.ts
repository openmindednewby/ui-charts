import type { DonutDatum } from '../types';

/** The colour for a slice: its own colour if set, else the palette colour at its index, cycling. */
export function segmentColor(datum: DonutDatum, index: number, palette: readonly string[]): string {
  if (datum.color !== undefined && datum.color !== '') return datum.color;
  const fallback = palette.length > 0 ? palette[index % palette.length] : undefined;
  return fallback ?? '';
}
