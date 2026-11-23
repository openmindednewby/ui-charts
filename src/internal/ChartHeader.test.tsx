import { act } from 'react';

import { createRoot } from 'react-dom/client';

import { ChartHeader } from './ChartHeader';

function renderHeader(heading: React.ReactNode, meta?: React.ReactNode): HTMLElement {
  const container = document.createElement('div');
  document.body.appendChild(container);
  act(() => {
    createRoot(container).render(<ChartHeader heading={heading} meta={meta} mutedColor="gray" testID="h" textColor="black" />);
  });
  return container;
}

function styleOf(container: HTMLElement, testID: string): CSSStyleDeclaration | undefined {
  return container.querySelector<HTMLElement>(`[data-testid="${testID}"]`)?.style;
}

describe('ChartHeader', () => {
  it('with a string heading, renders it as a 15px bold title', () => {
    const container = renderHeader('Screenings per day');

    const style = styleOf(container, 'h-title');

    expect({ size: style?.fontSize, weight: style?.fontWeight }).toEqual({ size: '15px', weight: '700' });
  });

  it('with a string meta, renders it as a 13px muted figure', () => {
    const container = renderHeader('Screenings per day', '358 screenings');

    const style = styleOf(container, 'h-meta');

    expect({ color: style?.color, size: style?.fontSize }).toEqual({ color: 'rgb(128, 128, 128)', size: '13px' });
  });

  it('with a node heading, renders the node as given and no styled title', () => {
    const container = renderHeader(<span data-testid="own">Own</span>);

    const own = container.querySelector('[data-testid="own"]');

    expect({ own: own?.textContent, title: styleOf(container, 'h-title') }).toEqual({ own: 'Own', title: undefined });
  });

  it('with no heading and no meta, renders nothing', () => {
    const container = renderHeader(undefined);

    const header = container.querySelector('[data-testid="h-header"]');

    expect(header).toBeNull();
  });
});
