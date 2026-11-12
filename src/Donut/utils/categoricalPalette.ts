import { PALETTE_SHADE } from '../constants';
import { MIN_CVD_NEIGHBOUR_DISTANCE, MIN_PERCEPTUAL_DISTANCE } from '../data/colorMath';
import { CATEGORICAL_STEPS } from '../data/categoricalSteps';
import type { PaletteGroup } from '../PaletteGroup';

import { derivedColors } from './derivedColors';
import { cvdViews, hexToLinearRgb, linearRgbToOklab, oklabDistance, oklabHue } from './oklab';
import type { Vec3 } from './oklab';

type Scale = Readonly<Record<string, string | undefined>> | undefined;

export interface CategoricalTheme {
  palette?: Readonly<Record<string, Scale>>;
  semantic?: Readonly<Record<string, Scale>>;
}

interface Candidate {
  color: string;
  lab?: Vec3;
  cvd?: Vec3[];
}

function stepColor(theme: CategoricalTheme, group: PaletteGroup, scale: string, shade: string): string | undefined {
  const value = theme[group]?.[scale]?.[shade];
  return value !== undefined && value !== '' ? value : undefined;
}

function toCandidate(color: string): Candidate {
  const rgb = hexToLinearRgb(color);
  return rgb === undefined ? { color } : { color, lab: linearRgbToOklab(rgb), cvd: cvdViews(rgb) };
}

function farFromAll(candidate: Candidate, picked: readonly Candidate[]): boolean {
  const { lab } = candidate;
  if (lab === undefined) return picked.every((p) => p.color !== candidate.color);
  return picked.every((p) => p.lab === undefined || oklabDistance(lab, p.lab) >= MIN_PERCEPTUAL_DISTANCE);
}

function cvdDistinct(candidate: Candidate, previous: Candidate | undefined): boolean {
  const views = candidate.cvd;
  const prior = previous?.cvd;
  if (views === undefined || prior === undefined) return true;
  return views.every((view, i) => {
    const seen = prior[i];
    return seen === undefined || oklabDistance(view, seen) >= MIN_CVD_NEIGHBOUR_DISTANCE;
  });
}

function themeColors(theme: CategoricalTheme): string[] {
  const steps = CATEGORICAL_STEPS.map((step) => stepColor(theme, step.group, step.scale, step.shade));
  const fallbacks = CATEGORICAL_STEPS.map((step) => stepColor(theme, step.group, step.scale, PALETTE_SHADE));
  return [...steps, ...fallbacks].filter((color): color is string => color !== undefined);
}

function pickDistinct(candidates: Candidate[]): string[] {
  const picked: Candidate[] = [];
  let pool = candidates;
  for (;;) {
    pool = pool.filter((candidate) => farFromAll(candidate, picked));
    const next = pool.find((candidate) => cvdDistinct(candidate, picked[picked.length - 1]));
    if (next === undefined) return picked.map((candidate) => candidate.color);
    picked.push(next);
    pool = pool.filter((candidate) => candidate !== next);
  }
}

/** The theme's slice palette in fixed order, no colour within OKLab distance of an earlier one, neighbours CVD-distinct. */
export function categoricalPalette(theme: CategoricalTheme): string[] {
  const fromTheme = themeColors(theme).map(toCandidate);
  const anchor = fromTheme.find((candidate) => candidate.lab !== undefined)?.lab;
  const derived = anchor === undefined ? [] : derivedColors(oklabHue(anchor)).map(toCandidate);
  return pickDistinct([...fromTheme, ...derived]);
}
