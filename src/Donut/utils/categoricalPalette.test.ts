import { CATEGORICAL_STEPS, LIGHT_SHADES } from '../data/categoricalSteps';

import { categoricalPalette } from './categoricalPalette';

const SHADES = ['300', '500', '600', '700'];
const MIN_DISTINCT = 12;

function scale(name: string): Record<string, string> {
  return Object.fromEntries(SHADES.map((shade) => [shade, `${name}-${shade}`]));
}

const THEME = {
  palette: { primary: scale('primary'), secondary: scale('secondary'), accent: scale('accent') },
  semantic: { success: scale('success'), warning: scale('warning'), error: scale('error'), info: scale('info') },
};

describe('categoricalPalette', () => {
  it('with a full theme, returns 12 colours with no repeat among them', () => {
    const palette = categoricalPalette(THEME);

    expect(new Set(palette.slice(0, MIN_DISTINCT)).size).toBe(MIN_DISTINCT);
  });

  it('with a full theme, starts with the dark primary step', () => {
    const palette = categoricalPalette(THEME);

    expect(palette[0]).toBe('primary-700');
  });

  it('with two scales sharing a value, lists that value once', () => {
    const theme = { ...THEME, semantic: { ...THEME.semantic, info: { ...scale('info'), '300': 'warning-300' } } };

    const palette = categoricalPalette(theme);

    expect(palette.filter((color) => color === 'warning-300')).toHaveLength(1);
  });

  it('with only 500 shades, falls back to each scale 500 once', () => {
    const theme = { palette: { primary: { '500': 'p' }, secondary: { '500': 's' } }, semantic: { error: { '500': 'e' } } };

    const palette = categoricalPalette(theme);

    expect(palette).toEqual(['p', 's', 'e']);
  });

  it('with an empty theme, returns no colours', () => {
    const theme = {};

    const palette = categoricalPalette(theme);

    expect(palette).toEqual([]);
  });
});

describe('CATEGORICAL_STEPS', () => {
  it('for every neighbour pair, changes both hue and lightness band', () => {
    const pairs = CATEGORICAL_STEPS.slice(1).map((step, i) => [CATEGORICAL_STEPS[i], step] as const);

    const clashes = pairs.filter(([a, b]) => a.scale === b.scale || LIGHT_SHADES.includes(a.shade) === LIGHT_SHADES.includes(b.shade));

    expect(clashes).toEqual([]);
  });

  it('within the first 12 steps, never repeats a scale and shade pair', () => {
    const keys = CATEGORICAL_STEPS.slice(0, MIN_DISTINCT).map((step) => `${step.scale}-${step.shade}`);

    const unique = new Set(keys);

    expect(unique.size).toBe(MIN_DISTINCT);
  });
});
