import { act } from 'react';

import { createRoot } from 'react-dom/client';

import { BarColumn } from './BarColumn';

function renderColumn(textWidth: number): HTMLElement {
  const container = document.createElement('div');
  document.body.appendChild(container);
  act(() => {
    createRoot(container).render(
      <BarColumn
        color="currentColor"
        fraction={0.5}
        label="11-01"
        mutedColor="currentColor"
        testID="col"
        textColor="currentColor"
        textWidth={textWidth}
        valueText="205"
      />
    );
  });
  return container;
}

function boxWidthOf(container: HTMLElement, testID: string): string | undefined {
  return container.querySelector<HTMLElement>(`[data-testid="${testID}"]`)?.parentElement?.style.width;
}

describe('BarColumn', () => {
  it('with a label slot wider than the column, sizes the label box to the slot', () => {
    const container = renderColumn(48);

    const width = boxWidthOf(container, 'col-label');

    expect(width).toBe('48px');
  });

  it('with a label slot wider than the column, sizes the value box to the slot', () => {
    const container = renderColumn(48);

    const width = boxWidthOf(container, 'col-value');

    expect(width).toBe('48px');
  });
});
