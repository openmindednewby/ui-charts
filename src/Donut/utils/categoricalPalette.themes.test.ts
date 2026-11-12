import { MIN_CVD_NEIGHBOUR_DISTANCE, MIN_PERCEPTUAL_DISTANCE } from '../data/colorMath';

import { categoricalPalette } from './categoricalPalette';
import { cvdViews, hexToLinearRgb, linearRgbToOklab, oklabDistance } from './oklab';

const MIN_COLOURS = 11;

const FINREG_NAVY = { '300': '#427dca', '500': '#123159', '600': '#0e2747', '700': '#0c1e34' };
const FINREG_TEAL = { '300': '#94e1d3', '500': '#41d9bd', '600': '#26bca0', '700': '#1f8a76' };
const WARNING = { '300': '#f3c268', '500': '#ee9b00', '600': '#be7c00', '700': '#8b5c04' };

const FINREG_LIGHT = {
  palette: { primary: FINREG_NAVY, secondary: FINREG_NAVY, accent: FINREG_NAVY },
  semantic: {
    success: { '300': '#38dbb9', '500': '#0b6b57', '600': '#095646', '700': '#083f33' },
    warning: WARNING,
    error: { '300': '#df7068', '500': '#b42318', '600': '#901c13', '700': '#6a1711' },
    info: FINREG_NAVY,
  },
};

const FINREG_DARK = {
  palette: { primary: FINREG_TEAL, secondary: FINREG_TEAL, accent: FINREG_TEAL },
  semantic: {
    error: { '300': '#df7068', '500': '#b42318', '600': '#FFB4AB', '700': '#FFB4AB' },
    info: { '300': '#427dca', '500': '#41D9BD', '600': '#41D9BD', '700': '#41D9BD' },
    success: { '300': '#38dbb9', '500': '#41D9BD', '600': '#41D9BD', '700': '#41D9BD' },
    warning: { '300': '#f3c268', '500': '#ee9b00', '600': '#ee9b00', '700': '#ee9b00' },
  },
};

const DEFAULT_LIGHT = {
  palette: {
    primary: { '300': '#24caed', '500': '#005f73', '600': '#004c5c', '700': '#023843' },
    secondary: { '300': '#c2e1d6', '500': '#94d2bd', '600': '#62bd9e', '700': '#429579' },
    accent: { '300': '#32eead', '500': '#008d5c', '600': '#00714a', '700': '#025237' },
  },
  semantic: {
    success: { '300': '#48e1e4', '500': '#0a9396', '600': '#087678', '700': '#085658' },
    warning: WARNING,
    error: { '300': '#e16a5e', '500': '#ae2012', '600': '#8b1a0e', '700': '#66150d' },
    info: { '300': '#24caed', '500': '#005f73', '600': '#004c5c', '700': '#023843' },
  },
};

const THEMES = [
  ['FinReg light', FINREG_LIGHT],
  ['FinReg dark', FINREG_DARK],
  ['default light', DEFAULT_LIGHT],
] as const;

function lab(color: string): ReturnType<typeof linearRgbToOklab> {
  const rgb = hexToLinearRgb(color);
  if (rgb === undefined) throw new Error(`not hex: ${color}`);
  return linearRgbToOklab(rgb);
}

function closePairs(palette: readonly string[]): string[] {
  return palette.flatMap((a, i) =>
    palette.slice(i + 1).filter((b) => oklabDistance(lab(a), lab(b)) < MIN_PERCEPTUAL_DISTANCE).map((b) => `${a}/${b}`),
  );
}

function cvdClashes(palette: readonly string[]): string[] {
  return palette.slice(1).flatMap((color, i) => {
    const previous = palette[i];
    const [a, b] = [hexToLinearRgb(previous), hexToLinearRgb(color)];
    if (a === undefined || b === undefined) return [`${previous}/${color}`];
    const prior = cvdViews(a);
    const close = cvdViews(b).some((view, k) => oklabDistance(view, prior[k]) < MIN_CVD_NEIGHBOUR_DISTANCE);
    return close ? [`${previous}/${color}`] : [];
  });
}

describe('categoricalPalette with real theme tokens', () => {
  it.each(THEMES)('with the %s theme, returns at least 11 colours', (_name, theme) => {
    const palette = categoricalPalette(theme);

    expect(palette.length).toBeGreaterThanOrEqual(MIN_COLOURS);
  });

  it.each(THEMES)('with the %s theme, has no pair under the OKLab threshold', (_name, theme) => {
    const palette = categoricalPalette(theme);

    expect(closePairs(palette)).toEqual([]);
  });

  it.each(THEMES)('with the %s theme, keeps adjacent slices distinct under protan, deutan and tritan', (_name, theme) => {
    const palette = categoricalPalette(theme);

    expect(cvdClashes(palette)).toEqual([]);
  });

  it.each(THEMES)('with the %s theme, returns the same order on every call', (_name, theme) => {
    const first = categoricalPalette(theme);

    const second = categoricalPalette(theme);

    expect(second).toEqual(first);
  });

  it('with the FinReg light theme, keeps only one of the near-identical dark navies', () => {
    const darkNavies = [FINREG_NAVY['500'], FINREG_NAVY['600'], FINREG_NAVY['700']];

    const palette = categoricalPalette(FINREG_LIGHT);

    expect(palette.filter((color) => darkNavies.includes(color))).toEqual([FINREG_NAVY['700']]);
  });

  it('with the default light theme, starts with the dark primary step', () => {
    const palette = categoricalPalette(DEFAULT_LIGHT);

    expect(palette[0]).toBe(DEFAULT_LIGHT.palette.primary['700']);
  });
});
