import { ColumnTextAnchor } from '../ColumnTextAnchor';
import { axisTickAnchor, axisTickPlan } from './columnAxis';

const LABELS = Array.from({ length: 7 }, (_, i) => `${15 + i} Nov`);

describe('axisTickPlan', () => {
  it('with seven days, three ticks and room, labels the first, middle and last day', () => {
    const input = { count: 7, labels: LABELS, plotWidth: 400, tickCount: 3 };

    const plan = axisTickPlan(input);

    expect([...plan.indices]).toEqual([0, 3, 6]);
  });

  it('with thirty days and four ticks, spreads the ticks evenly from first to last', () => {
    const labels = Array.from({ length: 30 }, () => '23 Nov');

    const plan = axisTickPlan({ count: 30, labels, plotWidth: 600, tickCount: 4 });

    expect([...plan.indices]).toEqual([0, 10, 19, 29]);
  });

  it('with a plot too narrow for three labels, drops to the ticks that fit', () => {
    const input = { count: 7, labels: LABELS, plotWidth: 120, tickCount: 3 };

    const plan = axisTickPlan(input);

    expect([...plan.indices]).toEqual([0, 6]);
  });

  it('with no columns, labels nothing', () => {
    const input = { count: 0, labels: [], plotWidth: 400, tickCount: 3 };

    const plan = axisTickPlan(input);

    expect(plan.indices.size).toBe(0);
  });
});

describe('axisTickAnchor', () => {
  it('with the first, a middle and the last column, anchors start, centre and end', () => {
    const count = 7;

    const anchors = [0, 3, 6].map((index) => axisTickAnchor(index, count));

    expect(anchors).toEqual([ColumnTextAnchor.Start, ColumnTextAnchor.Center, ColumnTextAnchor.End]);
  });
});
