import { act } from 'react';

import { createRoot } from 'react-dom/client';

import { UiProvider, type UiTheme, type UiValue } from '@dloizides/ui-feedback';

import { StackedBar } from './StackedBar';
import type { DonutDatum } from '../internal/types';

jest.mock('react-native-svg', () => {
  const { createElement } = jest.requireActual<typeof import('react')>('react');
  const tag = (name: string) => ({ children, testID: _testID, patternTransform: _t, patternUnits: _u, ...rest }: Record<string, unknown>) => createElement(name, rest, children as never);
  return { Defs: tag('defs'), Line: tag('line'), Pattern: tag('pattern'), Rect: tag('rect'), Svg: tag('svg') };
});

const theme: UiTheme = {
  colors: { background: '#ffffff', surface: '#f7f7f7', surfaceElevated: '#ffffff', text: '#111111', textSecondary: '#666666', border: '#dddddd' },
  palette: { primary: { '500': '#1f6feb' } },
  semantic: { error: { '500': '#ae2012' } },
};
const t: UiValue['t'] = (key) => key;
const SEGMENTS: readonly DonutDatum[] = [
  { key: 'stated', label: 'Stated', value: 6 },
  { key: 'unknown', label: 'Not stated', value: 4, striped: true },
];

function segmentStyles(): CSSStyleDeclaration[] {
  const container = document.createElement('div');
  document.body.appendChild(container);
  act(() => {
    createRoot(container).render(
      <UiProvider t={t} theme={theme}>
        <StackedBar emptyText="None" label="Stated" segments={SEGMENTS} />
      </UiProvider>,
    );
  });
  const stack = container.querySelector('[aria-hidden="true"]') as HTMLElement;
  return Array.from(stack.children).map((child) => getComputedStyle(child));
}

describe('StackedBar segments', () => {
  it('with a striped segment next to a solid one, every segment shares the stack by grow only', () => {
    const styles = segmentStyles();

    expect(styles.map((s) => [s.flexBasis, s.minWidth])).toEqual([['0px', '0px'], ['0px', '0px']]);
  });
});
