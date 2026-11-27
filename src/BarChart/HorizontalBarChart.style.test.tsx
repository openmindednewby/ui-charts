import React, { act } from 'react';

import { createRoot } from 'react-dom/client';

import { UiProvider, type UiTheme, type UiValue } from '@dloizides/ui-feedback';

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
const DATA: readonly BarDatum[] = [{ key: 'low', label: 'Low', value: 3 }];
const ID = 'risk';

function renderChart(extra: Partial<React.ComponentProps<typeof HorizontalBarChart>>): HTMLElement {
  const container = document.createElement('div');
  document.body.appendChild(container);
  act(() => {
    createRoot(container).render(
      <UiProvider t={t} theme={theme}>
        <HorizontalBarChart data={DATA} emptyText="None" label="Risk" testID={ID} {...extra} />
      </UiProvider>,
    );
  });
  return container;
}

function parts(container: HTMLElement): { row: HTMLElement; label: HTMLElement; track: HTMLElement; fill: HTMLElement; value: HTMLElement } {
  const row = container.querySelector<HTMLElement>(`[data-testid="${ID}-bar-low"]`) as HTMLElement;
  const track = row.children[1] as HTMLElement;
  return {
    row,
    label: row.children[0] as HTMLElement,
    track,
    fill: track.children[0] as HTMLElement,
    value: container.querySelector<HTMLElement>(`[data-testid="${ID}-bar-low-value"]`) as HTMLElement,
  };
}

describe('HorizontalBarChart style props', () => {
  it('with a barRadius of 2, rounds the track and the fill by 2 px', () => {
    const { track, fill } = parts(renderChart({ barRadius: 2 }));

    expect([track.style.borderTopLeftRadius, fill.style.borderTopLeftRadius]).toEqual(['2px', '2px']);
  });

  it('without barRadius, rounds by half the thickness', () => {
    const { track, fill } = parts(renderChart({ barThickness: 8 }));

    expect([track.style.borderTopLeftRadius, fill.style.borderTopLeftRadius]).toEqual(['4px', '4px']);
  });

  it('with labelFontSize 11 and valueFontSize 15, sizes the label and the value text', () => {
    const { label, value } = parts(renderChart({ labelFontSize: 11, valueFontSize: 15 }));

    expect([label.style.fontSize, value.style.fontSize]).toEqual(['11px', '15px']);
  });

  it('without font size props, sets no inline size so the stylesheet 13 px applies', () => {
    const { label, value } = parts(renderChart({}));

    expect([label.style.fontSize, value.style.fontSize]).toEqual(['', '']);
  });

  it('with a labelWidth of 70, fixes the label column and leaves the track flexing', () => {
    const { label, track } = parts(renderChart({ labelWidth: 70 }));

    expect([label.style.width, label.style.flexGrow, track.style.flexGrow]).toEqual(['70px', '0', '']);
  });

  it('without labelWidth, sets no inline width so the stylesheet 96 px applies', () => {
    const { label } = parts(renderChart({}));

    expect(label.style.width).toBe('');
  });
});
