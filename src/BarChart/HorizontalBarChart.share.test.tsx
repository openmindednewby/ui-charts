import React, { act } from 'react';

import { createRoot } from 'react-dom/client';

import { UiProvider, type UiTheme, type UiValue } from '@dloizides/ui-feedback';

import { ChartTitle } from '../internal/ChartTitle';
import { HorizontalBarChart } from './HorizontalBarChart';
import type { BarDatum } from './types';

const theme: UiTheme = {
  colors: {
    background: '#ffffff',
    surface: '#f7f7f7',
    surfaceElevated: '#ffffff',
    text: '#111111',
    textSecondary: '#666666',
    border: '#dddddd',
  },
  palette: { primary: { '500': '#1f6feb' } },
  semantic: { error: { '500': '#ae2012' } },
};
const t: UiValue['t'] = (key) => key;
const DATA: readonly BarDatum[] = [
  { key: 'low', label: 'Low', value: 3 },
  { key: 'high', label: 'High', value: 1 },
];
const ID = 'risk';

function renderChart(element: React.ReactElement): HTMLElement {
  const container = document.createElement('div');
  document.body.appendChild(container);
  act(() => {
    createRoot(container).render(
      <UiProvider t={t} theme={theme}>
        {element}
      </UiProvider>,
    );
  });
  return container;
}

function byId(container: HTMLElement, testID: string): HTMLElement | null {
  return container.querySelector(`[data-testid="${testID}"]`);
}

describe('HorizontalBarChart', () => {
  it('with showShare, renders the count then each bar share of the total', () => {
    const container = renderChart(<HorizontalBarChart showShare data={DATA} emptyText="None" label="Risk" testID={ID} />);

    expect(byId(container, `${ID}-bar-low-value`)?.textContent).toBe('3 75%');
    expect(byId(container, `${ID}-bar-high-share`)?.textContent).toBe(' 25%');
  });

  it('without showShare, renders the count alone', () => {
    const container = renderChart(<HorizontalBarChart data={DATA} emptyText="None" label="Risk" testID={ID} />);

    expect(byId(container, `${ID}-bar-low-value`)?.textContent).toBe('3');
    expect(byId(container, `${ID}-bar-low-share`)).toBeNull();
  });

  it('with a barThickness of 8, draws the track 8 px tall with a 4 px radius', () => {
    const container = renderChart(<HorizontalBarChart barThickness={8} data={DATA} emptyText="None" label="Risk" testID={ID} />);

    const track = byId(container, `${ID}-bar-low`)?.children[1] as HTMLElement;
    expect([track.style.height, track.style.borderRadius]).toEqual(['8px', '4px']);
  });
});

describe('ChartTitle', () => {
  it('with weight 600, renders the heading at 600 in the 15 px title size', () => {
    const container = renderChart(<ChartTitle testID="title" text="By decision" weight="600" />);

    expect([byId(container, 'title')?.style.fontWeight, byId(container, 'title')?.style.fontSize]).toEqual(['600', '15px']);
  });
});
