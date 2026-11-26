import { SeriesStyle } from '../SeriesStyle';
import type { ColumnGroup, ColumnSeries } from '../types';
import { groupedMax, groupedSummary, resolveSeries, seriesTotal } from './groupedScale';

const series: ColumnSeries[] = [
  { key: 'a', label: 'Alpha' },
  { key: 'b', label: 'Beta', style: SeriesStyle.Outlined, total: 99 },
];
const groups: ColumnGroup[] = [
  { key: 'g1', label: 'G1', values: { a: 10, b: 4 } },
  { key: 'g2', label: 'G2', values: { a: 30, b: -5 } },
];
const plain = (value: number): string => String(value);

describe('groupedMax', () => {
  it('with no max, returns the largest value in any group', () => {
    const top = groupedMax(groups, series);

    expect(top).toBe(30);
  });

  it('with every value missing, returns 1', () => {
    const top = groupedMax([{ key: 'z', label: 'Z', values: {} }], series);

    expect(top).toBe(1);
  });

  it('with a max of 50, returns 50', () => {
    const top = groupedMax(groups, series, 50);

    expect(top).toBe(50);
  });
});

describe('seriesTotal', () => {
  it('with no own total, sums the series over all groups', () => {
    const total = seriesTotal(series[0], groups);

    expect(total).toBe(40);
  });

  it('with an own total of 99, returns 99', () => {
    const total = seriesTotal(series[1], groups);

    expect(total).toBe(99);
  });
});

describe('resolveSeries', () => {
  it('with no colour or style, takes the palette colour by index and the filled style', () => {
    const resolved = resolveSeries(series, groups, ['red', 'blue'], plain);

    expect(resolved.map((one) => ({ color: one.color, style: one.style, total: one.totalText }))).toEqual([
      { color: 'red', style: SeriesStyle.Filled, total: '40' },
      { color: 'blue', style: SeriesStyle.Outlined, total: '99' },
    ]);
  });
});

describe('groupedSummary', () => {
  it('with two groups, names each group with every series value and counts a negative as 0', () => {
    const summary = groupedSummary('Totals', groups, series, plain);

    expect(summary).toBe('Totals; G1: Alpha 10, Beta 4; G2: Alpha 30, Beta 0');
  });
});
