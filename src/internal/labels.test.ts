import { defaultFormatValue, donutSummary, legendLine, percentLabel } from './labels';
import { toDonutSegments } from './segments';

describe('percentLabel', () => {
  it('with a fraction of 0.666, returns "67%"', () => {
    const fraction = 0.666;

    const label = percentLabel(fraction);

    expect(label).toBe('67%');
  });
});

describe('legendLine', () => {
  it('with a custom formatter, returns label, formatted value and percent', () => {
    const [segment] = toDonutSegments([{ key: 'eur', label: 'EUR', value: 1200 }]);
    const format = (value: number): string => `EUR ${value}.00`;

    const line = legendLine(segment, format);

    expect(line).toBe('EUR · EUR 1200.00 · 100%');
  });

  it('with the default formatter, prints the raw value', () => {
    const [segment] = toDonutSegments([{ key: 'ok', label: 'Paid', value: 7 }]);

    const line = legendLine(segment, defaultFormatValue);

    expect(line).toBe('Paid · 7 · 100%');
  });
});

describe('donutSummary', () => {
  it('with two segments, returns the chart label followed by each legend line', () => {
    const segments = toDonutSegments([
      { key: 'a', label: 'Paid', value: 3 },
      { key: 'b', label: 'Failed', value: 1 },
    ]);

    const summary = donutSummary('By status', segments, defaultFormatValue);

    expect(summary).toBe('By status, Paid · 3 · 75%, Failed · 1 · 25%');
  });
});
