import React, { act } from 'react';

import { createRoot } from 'react-dom/client';

import { BarRow } from '../BarChart/components/BarRow';
import { DonutLegend } from '../Donut/components/DonutLegend';
import { InlineLegend } from '../Donut/components/InlineLegend';
import { SWATCH_RADIUS, SWATCH_SIZE } from '../Donut/constants';
import { toDonutSegments } from '../internal/segments';
import { ChartTextProvider } from './ChartTextProvider';
import { LegendMarker } from './LegendMarker';

const MONO = 'IBM Plex Mono';
const COLORS = ['c0', 'c1'];
const SEGMENTS = toDonutSegments([
  { key: 'a', label: 'Alpha', value: 3 },
  { key: 'b', label: 'Beta', value: 1 },
]);
const format = (value: number): string => String(value);

function mount(element: React.ReactElement): HTMLElement {
  const container = document.createElement('div');
  document.body.appendChild(container);
  act(() => {
    createRoot(container).render(element);
  });
  return container;
}

const styleOf = (root: HTMLElement, testID: string): CSSStyleDeclaration => {
  const node = root.querySelector<HTMLElement>(`[data-testid="${testID}"]`);
  if (node === null) throw new Error(`missing ${testID}`);
  return node.style;
};

const inline = <InlineLegend colors={COLORS} formatValue={format} mutedColor="m" segments={SEGMENTS} testID="t" textColor="x" />;
const table = <DonutLegend colors={COLORS} formatValue={format} segments={SEGMENTS} testID="t" textColor="x" />;

describe('ChartTextProvider', () => {
  it('with a numeral font family, sets it on legend counts and percents', () => {
    const root = mount(<ChartTextProvider numeralFontFamily={MONO}>{inline}</ChartTextProvider>);

    const families = [styleOf(root, 't-legend-a-count').fontFamily, styleOf(root, 't-legend-a-percent').fontFamily];

    expect(families).toEqual([MONO, MONO]);
  });

  it('without a provider, leaves the legend count font inherited', () => {
    const root = mount(inline);

    const family = styleOf(root, 't-legend-a-count').fontFamily;

    expect(family).toBe('');
  });

  it('with a numeral font family, sets it on the bar value', () => {
    const root = mount(
      <ChartTextProvider numeralFontFamily={MONO}>
        <BarRow color="c" fraction={0.5} label="L" testID="bar" textColor="x" trackColor="t" valueText="12" />
      </ChartTextProvider>,
    );

    const family = styleOf(root, 'bar-value').fontFamily;

    expect(family).toBe(MONO);
  });

  it('with the dot marker, rounds the table legend marker to a circle', () => {
    const root = mount(<ChartTextProvider legendMarker={LegendMarker.Dot}>{table}</ChartTextProvider>);

    const radius = styleOf(root, 't-legend-a-marker').borderTopLeftRadius;

    expect(radius).toBe(`${SWATCH_SIZE / 2}px`);
  });

  it('without a provider, keeps the square table legend marker', () => {
    const root = mount(table);

    const radius = styleOf(root, 't-legend-a-marker').borderTopLeftRadius;

    expect(radius).toBe(`${SWATCH_RADIUS}px`);
  });
});
