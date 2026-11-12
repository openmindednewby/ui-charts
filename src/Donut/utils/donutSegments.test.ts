import { toDonutSegments } from './donutSegments';

describe('toDonutSegments', () => {
  it('with two values, assigns each its fraction of the total and a running start offset', () => {
    const data = [{ value: 30 }, { value: 10 }];

    const segments = toDonutSegments(data);

    expect(segments).toHaveLength(2);
    expect(segments[0].fraction).toBeCloseTo(0.75);
    expect(segments[0].startFraction).toBeCloseTo(0);
    expect(segments[1].fraction).toBeCloseTo(0.25);
    expect(segments[1].startFraction).toBeCloseTo(0.75);
  });

  it('with three values, fractions sum to 1', () => {
    const data = [{ value: 1 }, { value: 2 }, { value: 3 }];

    const segments = toDonutSegments(data);

    expect(segments.reduce((sum, s) => sum + s.fraction, 0)).toBeCloseTo(1);
  });

  it('with equal values, preserves input order and index', () => {
    const data = [{ value: 5 }, { value: 5 }];

    const segments = toDonutSegments(data);

    expect(segments.map((s) => s.index)).toEqual([0, 1]);
  });

  it('with a zero total, returns no segments', () => {
    const data = [{ value: 0 }, { value: 0 }];

    const segments = toDonutSegments(data);

    expect(segments).toEqual([]);
  });

  it('with an empty list, returns no segments', () => {
    const data: Array<{ value: number }> = [];

    const segments = toDonutSegments(data);

    expect(segments).toEqual([]);
  });

  it('with a negative value, treats it as zero rather than skewing the ring', () => {
    const data = [{ value: 10 }, { value: -5 }];

    const segments = toDonutSegments(data);

    expect(segments).toHaveLength(2);
    expect(segments[0].fraction).toBeCloseTo(1);
    expect(segments[1].fraction).toBeCloseTo(0);
  });
});
