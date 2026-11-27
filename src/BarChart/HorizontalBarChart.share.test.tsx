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

  it('with a shareTotal of 400, divides each count by it instead of the shown sum', () => {
    const container = renderChart(<HorizontalBarChart showShare data={DATA} emptyText="None" label="Risk" shareTotal={400} testID={ID} />);

    expect(byId(container, `${ID}-bar-low-value`)?.textContent).toBe('3 1%');
  });

  it('without showShare, renders the count alone', () => {
    const container = renderChart(<HorizontalBarChart data={DATA} emptyText="None" label="Risk" testID={ID} />);

    expect(byId(container, `${ID}-bar-low-value`)?.textContent).toBe('3');
    expect(byId(container, `${ID}-bar-low-share`)).toBeNull();
  });

  it('with a barThickness of 8, draws the track 8 px tall with a 4 px radius', () => {
    const container = renderChart(<HorizontalBarChart barThickness={8} data={DATA} emptyText="None" label="Risk" testID={ID} />);

    const track = byId(container, `${ID}-bar-low`)?.children[1] as HTMLElement;
    expect([track.style.height, track.style.borderTopLeftRadius, track.style.borderBottomRightRadius]).toEqual(['8px', '4px', '4px']);
  });

  it('with a rowGap of 13, spaces the rows 13 px apart', () => {
    const container = renderChart(<HorizontalBarChart data={DATA} emptyText="None" label="Risk" rowGap={13} testID={ID} />);

    const list = byId(container, `${ID}-bar-low`)?.parentElement as HTMLElement;
    expect(list.style.gap).toBe('13px');
  });

  it('with a trackWidth of 86, fixes the track at 86 px and lets the label grow', () => {
    const container = renderChart(<HorizontalBarChart data={DATA} emptyText="None" label="Risk" testID={ID} trackWidth={86} />);

    const [label, track] = Array.from(byId(container, `${ID}-bar-low`)?.children ?? []) as HTMLElement[];
    expect([track.style.width, track.style.flexGrow, label.style.flexGrow]).toEqual(['86px', '0', '1']);
  });

  it('without trackWidth, lets the track fill the row', () => {
    const container = renderChart(<HorizontalBarChart data={DATA} emptyText="None" label="Risk" testID={ID} />);

    const track = byId(container, `${ID}-bar-low`)?.children[1] as HTMLElement;
    expect(track.style.width).toBe('');
  });
});

describe('ChartTitle', () => {
  it('with weight 600, renders the heading at 600 in the 15 px title size', () => {
    const container = renderChart(<ChartTitle testID="title" text="By decision" weight="600" />);

    expect([byId(container, 'title')?.style.fontWeight, byId(container, 'title')?.style.fontSize]).toEqual(['600', '15px']);
  });

  it('with a valueWidth of 40 and a valueGap of 33, sizes the value column and its gap', () => {
    const container = renderChart(<HorizontalBarChart data={DATA} emptyText="None" label="Risk" testID={ID} valueGap={33} valueWidth={40} />);

    const value = byId(container, `${ID}-bar-low-value`) as HTMLElement;
    expect([value.style.width, (value.parentElement as HTMLElement).style.gap]).toEqual(['40px', '33px']);
  });

  it('without valueWidth and valueGap, sets no inline override so the stylesheet 64 px and 10 px apply', () => {
    const container = renderChart(<HorizontalBarChart data={DATA} emptyText="None" label="Risk" testID={ID} />);

    const value = byId(container, `${ID}-bar-low-value`) as HTMLElement;
    expect([value.style.width, (value.parentElement as HTMLElement).style.gap]).toEqual(['', '']);
  });
});
