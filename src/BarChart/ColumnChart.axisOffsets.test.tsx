import { act } from 'react';

import { createRoot } from 'react-dom/client';

import { UiProvider } from '@dloizides/ui-feedback';
import type { UiTheme } from '@dloizides/ui-feedback';

import { ColumnChart } from './ColumnChart';
import type { ColumnAxis } from './types';

const theme: UiTheme = {
  colors: { background: 'white', border: 'silver', surface: 'white', surfaceElevated: 'white', text: 'black', textSecondary: 'gray' },
  palette: { primary: { '500': 'navy' } },
  semantic: { error: { '500': 'red' } },
};
const data = [
  { key: 'a', label: 'A', value: 4 },
  { key: 'b', label: 'B', value: 8 },
];

function render(axis: ColumnAxis): HTMLElement {
  const container = document.createElement('div');
  document.body.appendChild(container);
  act(() => {
    createRoot(container).render(
      <UiProvider t={(key) => key} theme={theme}>
        <ColumnChart axis={axis} data={data} emptyText="none" label="Trend" testID="c" />
      </UiProvider>
    );
  });
  return container;
}

const byId = (container: HTMLElement, id: string): HTMLElement | null => container.querySelector<HTMLElement>(`[data-testid="${id}"]`);

describe('ColumnChart axis offsets', () => {
  it('with axis.topGap 9, pads the plot row 9 px above the first bar', () => {
    const container = render({ topGap: 9 });

    const row = byId(container, 'c-y-axis')?.parentElement;

    expect(row?.style.paddingTop).toBe('9px');
  });

  it('with axis.baselineOffset 6, lifts the baseline 6 px above the label row on the y-axis and the bars', () => {
    const container = render({ baselineOffset: 6 });

    const bar = byId(container, 'c-bar-a')?.firstElementChild as HTMLElement | null;

    expect({ axis: byId(container, 'c-y-axis')?.style.marginBottom, area: bar?.style.marginBottom }).toEqual({ axis: '24px', area: '6px' });
  });

  it('without topGap and baselineOffset, leaves the layout unchanged', () => {
    const container = render({});

    const bar = byId(container, 'c-bar-a')?.firstElementChild as HTMLElement | null;

    expect({ pad: byId(container, 'c-y-axis')?.parentElement?.style.paddingTop, area: bar?.style.marginBottom }).toEqual({ pad: '', area: '' });
  });
});
