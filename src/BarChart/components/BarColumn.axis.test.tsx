import { act } from 'react';

import { createRoot } from 'react-dom/client';

import { ColumnTextAnchor } from '../ColumnTextAnchor';
import { BarColumn } from './BarColumn';

function renderAxisColumn(textAnchor: ColumnTextAnchor, plotHeight?: number): HTMLElement {
  const container = document.createElement('div');
  document.body.appendChild(container);
  act(() => {
    createRoot(container).render(
      <BarColumn
        color="currentColor"
        fraction={0.5}
        label="23 Nov"
        mutedColor="currentColor"
        plotHeight={plotHeight}
        showValue={false}
        testID="col"
        textAnchor={textAnchor}
        textColor="currentColor"
        textWidth={50}
        valueText="205"
      />
    );
  });
  return container;
}

describe('BarColumn axis mode', () => {
  it('with showValue false, renders no value above the column', () => {
    const container = renderAxisColumn(ColumnTextAnchor.Center);

    const value = container.querySelector('[data-testid="col-value"]');

    expect(value).toBeNull();
  });

  it('with an end anchor, right-aligns the label on the column end', () => {
    const container = renderAxisColumn(ColumnTextAnchor.End);

    const label = container.querySelector<HTMLElement>('[data-testid="col-label"]');

    expect({ align: label?.style.textAlign, self: label?.parentElement?.style.alignSelf }).toEqual({ align: 'right', self: 'flex-end' });
  });

  it('with plotHeight 40 and fraction 0.5, draws a 20 px bar in a 40 px plot', () => {
    const container = renderAxisColumn(ColumnTextAnchor.Center, 40);

    const bar = container.querySelector<HTMLElement>('[data-testid="col"]')?.firstElementChild?.lastElementChild as HTMLElement | null;

    expect({ bar: bar?.style.height, plot: (bar?.parentElement as HTMLElement | null)?.style.height }).toEqual({ bar: '20px', plot: '40px' });
  });

  it('without plotHeight, keeps the 96 px default plot', () => {
    const container = renderAxisColumn(ColumnTextAnchor.Center);

    const plot = container.querySelector<HTMLElement>('[data-testid="col"]')?.firstElementChild as HTMLElement | null;

    expect(plot?.style.height).toBe('96px');
  });
});
