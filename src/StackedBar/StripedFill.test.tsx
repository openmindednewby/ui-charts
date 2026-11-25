import { act } from 'react';

import { createRoot } from 'react-dom/client';

import { StripedFill } from './StripedFill';

jest.mock('react-native-svg', () => {
  const { createElement } = jest.requireActual<typeof import('react')>('react');
  const tag = (name: string) => ({ children, testID: _testID, patternTransform: _t, patternUnits: _u, ...rest }: Record<string, unknown>) => createElement(name, rest, children as never);
  return { Defs: tag('defs'), Line: tag('line'), Pattern: tag('pattern'), Rect: tag('rect'), Svg: tag('svg') };
});

function render(): HTMLElement {
  const container = document.createElement('div');
  document.body.appendChild(container);
  act(() => {
    createRoot(container).render(<StripedFill color="navy" id="bar-stripes-unknown" />);
  });
  return container;
}

describe('StripedFill', () => {
  it('with an id, fills its box from the pattern of that id', () => {
    const container = render();

    const fill = container.querySelector('rect[fill="url(#bar-stripes-unknown)"]');

    expect(fill).not.toBeNull();
  });
});
