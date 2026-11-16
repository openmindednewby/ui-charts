import { barSummary, scaleBars } from './barScale';

describe('scaleBars', () => {
  it('with mixed values, scales each against the largest value', () => {
    const data = [{ value: 50 }, { value: 100 }, { value: 25 }];

    const bars = scaleBars(data);

    expect(bars.map((bar) => bar.fraction)).toEqual([0.5, 1, 0.25]);
  });

  it('with a given max, scales against that max and caps at 1', () => {
    const data = [{ value: 30 }, { value: 120 }];

    const bars = scaleBars(data, { max: 60 });

    expect(bars.map((bar) => bar.fraction)).toEqual([0.5, 1]);
  });

  it('with a tiny positive value and a minimum visible fraction, raises it to the minimum', () => {
    const data = [{ value: 7210 }, { value: 96 }, { value: 0 }];

    const bars = scaleBars(data, { minVisibleFraction: 0.03 });

    expect(bars.map((bar) => bar.fraction)).toEqual([1, 0.03, 0]);
  });

  it('with all zero values, returns zero fractions', () => {
    const data = [{ value: 0 }, { value: 0 }];

    const bars = scaleBars(data);

    expect(bars.map((bar) => bar.fraction)).toEqual([0, 0]);
  });

  it('with negative and non-finite values, treats them as zero', () => {
    const data = [{ value: -5 }, { value: Number.NaN }, { value: 10 }];

    const bars = scaleBars(data);

    expect(bars.map((bar) => bar.fraction)).toEqual([0, 0, 1]);
  });

  it('with input order, keeps each datum and its index', () => {
    const data = [{ value: 2 }, { value: 1 }];

    const bars = scaleBars(data);

    expect(bars.map((bar) => [bar.index, bar.datum.value])).toEqual([[0, 2], [1, 1]]);
  });

  it('with an empty list, returns no bars', () => {
    const data: { value: number }[] = [];

    const bars = scaleBars(data);

    expect(bars).toEqual([]);
  });
});

describe('barSummary', () => {
  it('with two bars, joins the label and each formatted value into one sentence', () => {
    const data = [
      { key: 'a', label: 'API', value: 7210 },
      { key: 'b', label: 'Batch', value: 2150 },
    ];

    const summary = barSummary('Volume', scaleBars(data), (value) => `${value}`);

    expect(summary).toBe('Volume, API · 7210, Batch · 2150');
  });
});
