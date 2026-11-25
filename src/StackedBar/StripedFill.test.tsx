import { act } from 'react';

import { createRoot } from 'react-dom/client';

import { StripedFill } from './StripedFill';

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
