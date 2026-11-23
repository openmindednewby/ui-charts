import { act } from 'react';

import { createRoot } from 'react-dom/client';

import { defaultFormatValue } from '../../internal/labels';
import { toDonutSegments } from '../../internal/segments';
import { InlineLegend } from './InlineLegend';

function renderLegend(): HTMLElement {
  const segments = toDonutSegments([
    { icon: <span data-testid="icon-pass">ok</span>, key: 'pass', label: 'Pass', value: 3 },
    { key: 'fail', label: 'Fail', value: 1 },
  ]);
  const container = document.createElement('div');
  document.body.appendChild(container);
  act(() => {
    createRoot(container).render(
      <InlineLegend colors={['green', 'red']} formatValue={defaultFormatValue} mutedColor="gray" segments={segments} testID="lg" textColor="black" />
    );
  });
  return container;
}

function find(container: HTMLElement, testID: string): HTMLElement | null {
  return container.querySelector<HTMLElement>(`[data-testid="${testID}"]`);
}

describe('InlineLegend', () => {
  it('with a segment of three in four, shows the count bold and the percent muted', () => {
    const container = renderLegend();

    const count = find(container, 'lg-legend-pass-count');
    const percent = find(container, 'lg-legend-pass-percent');

    expect({ count: count?.textContent, muted: percent?.style.color, percent: percent?.textContent, weight: count?.style.fontWeight }).toEqual({
      count: '3',
      muted: 'rgb(128, 128, 128)',
      percent: '75%',
      weight: '700',
    });
  });

  it('with a datum icon, renders the icon inside its item', () => {
    const container = renderLegend();

    const icon = find(container, 'lg-legend-pass')?.querySelector('[data-testid="icon-pass"]');

    expect(icon?.textContent).toBe('ok');
  });

  it('with two segments, names each item by its full legend line', () => {
    const container = renderLegend();

    const labels = ['pass', 'fail'].map((key) => find(container, `lg-legend-${key}`)?.getAttribute('aria-label'));

    expect(labels).toEqual(['Pass · 3 · 75%', 'Fail · 1 · 25%']);
  });
});
