import { act } from 'react';

import { createRoot } from 'react-dom/client';

import { UiProvider } from '@dloizides/ui-feedback';
import type { UiTheme } from '@dloizides/ui-feedback';

import { GroupedColumnChart } from './GroupedColumnChart';
import { SeriesStyle } from './SeriesStyle';
import type { ColumnGroup, ColumnSeries } from './types';

const theme: UiTheme = {
  colors: { background: 'white', border: 'silver', surface: 'white', surfaceElevated: 'white', text: 'black', textSecondary: 'gray' },
  palette: { primary: { '500': 'navy' } },
  semantic: { error: { '500': 'red' } },
};
const series: ColumnSeries[] = [
  { color: 'teal', key: 'in', label: 'In' },
  { color: 'olive', key: 'out', label: 'Out', style: SeriesStyle.Outlined, total: 7 },
];
const groups: ColumnGroup[] = [
  { key: 'g1', label: 'A', values: { in: 10, out: 5 } },
  { key: 'g2', label: 'B', values: { in: 20 } },
];
const toggle = { hint: 'Switches the view', showChart: 'Show chart', showTable: 'Show table' };

function render(groupList: readonly ColumnGroup[] = groups): HTMLElement {
  const container = document.createElement('div');
  document.body.appendChild(container);
  act(() => {
    createRoot(container).render(
      <UiProvider t={(key) => key} theme={theme}>
        <GroupedColumnChart emptyText="Nothing yet" groups={groupList} label="Flows" series={series} testID="g" toggle={toggle} />
      </UiProvider>
    );
  });
  return container;
}

const byId = (container: HTMLElement, id: string): HTMLElement | null => container.querySelector<HTMLElement>(`[data-testid="${id}"]`);

describe('GroupedColumnChart', () => {
  it('with two series, shows each legend total: the summed one and the given one', () => {
    const container = render();

    const texts = [byId(container, 'g-legend-in')?.textContent, byId(container, 'g-legend-out')?.textContent];

    expect(texts).toEqual(['In 30', 'Out 7']);
  });

  it('with an outlined series, draws its bar with a border and no fill', () => {
    const container = render();

    const style = byId(container, 'g-bar-g1-out')?.style;

    expect({ border: style?.borderTopColor, fill: style?.backgroundColor }).toEqual({ border: 'rgba(128,128,0,1.00)', fill: '' });
  });

  it('with a missing value, draws that bar at 0 height and the largest at full height', () => {
    const container = render();

    const heights = [byId(container, 'g-bar-g2-out')?.style.height, byId(container, 'g-bar-g2-in')?.style.height];

    expect(heights).toEqual(['0%', '100%']);
  });

  it('with the toggle pressed, swaps the columns for a table and relabels the toggle', () => {
    const container = render();

    act(() => {
      byId(container, 'g-toggle')?.click();
    });

    expect({
      columns: byId(container, 'g-group-g1'),
      label: byId(container, 'g-toggle')?.getAttribute('aria-label'),
      row: byId(container, 'g-row-g2')?.textContent,
    }).toEqual({ columns: null, label: 'Show chart', row: 'B200' });
  });

  it('with no groups, shows the empty text and no toggle', () => {
    const container = render([]);

    const shown = { empty: byId(container, 'g-empty')?.textContent, toggle: byId(container, 'g-toggle') };

    expect(shown).toEqual({ empty: 'Nothing yet', toggle: null });
  });
});
