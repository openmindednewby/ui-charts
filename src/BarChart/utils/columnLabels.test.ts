import { columnLabelPlan, columnTextBoxWidth, shortenLabel } from './columnLabels';

describe('columnLabelPlan', () => {
  it('with an unmeasured plot, shows every label', () => {
    const labels = ['11-01', '11-02', '11-03'];

    const plan = columnLabelPlan({ labels, plotWidth: 0, values: ['1', '2', '3'] });

    expect(plan.step).toBe(1);
  });

  it('with wide columns, shows every label', () => {
    const labels = ['Mon', 'Tue', 'Wed'];

    const plan = columnLabelPlan({ labels, plotWidth: 600, values: ['1', '2', '3'] });

    expect(plan.step).toBe(1);
  });

  it('with 30 date labels in a 440 px plot, shows every 3rd or fewer so no label overlaps', () => {
    const labels = Array.from({ length: 30 }, (_, index) => `11-${String(index + 1).padStart(2, '0')}`);

    const plan = columnLabelPlan({ labels, plotWidth: 440, values: labels.map(() => '205') });

    expect(plan.step).toBeGreaterThanOrEqual(3);
    expect(plan.slotWidth * plan.step).toBeGreaterThanOrEqual(plan.textWidth);
  });

  it('with a crowded plot, shrinks the gap below the default', () => {
    const labels = Array.from({ length: 30 }, () => 'x');

    const plan = columnLabelPlan({ labels, plotWidth: 300, values: labels.map(() => '1') });

    expect(plan.gap).toBeLessThan(8);
  });
});

describe('shortenLabel', () => {
  it('with a label within the limit, returns it unchanged', () => {
    const label = 'Not stated';

    const result = shortenLabel(label, 12);

    expect(result).toBe('Not stated');
  });

  it('with a label over the limit, cuts it and ends with an ellipsis', () => {
    const label = 'United Kingdom of Great Britain';

    const result = shortenLabel(label, 8);

    expect(result).toBe('United …');
  });
});

describe('columnTextBoxWidth', () => {
  it('with a measured plot showing every 3rd column, returns the width of three slots', () => {
    const plan = { gap: 2, slotWidth: 16, step: 3, textWidth: 37 };

    const width = columnTextBoxWidth(plan);

    expect(width).toBe(48);
  });

  it('with an unmeasured plot, returns the text width', () => {
    const plan = { gap: 8, slotWidth: 0, step: 1, textWidth: 37 };

    const width = columnTextBoxWidth(plan);

    expect(width).toBe(37);
  });
});
