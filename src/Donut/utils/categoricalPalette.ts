import { PALETTE_SHADE } from '../constants';
import { CATEGORICAL_STEPS } from '../data/categoricalSteps';
import type { PaletteGroup } from '../PaletteGroup';

type Scale = Readonly<Record<string, string | undefined>> | undefined;

export interface CategoricalTheme {
  palette?: Readonly<Record<string, Scale>>;
  semantic?: Readonly<Record<string, Scale>>;
}

function stepColor(theme: CategoricalTheme, group: PaletteGroup, scale: string, shade: string): string | undefined {
  const value = theme[group]?.[scale]?.[shade];
  return value !== undefined && value !== '' ? value : undefined;
}

/** The theme's categorical slice palette: each step's colour once, in order, then each scale's 500 shade if unused. */
export function categoricalPalette(theme: CategoricalTheme): string[] {
  const steps = CATEGORICAL_STEPS.map((step) => stepColor(theme, step.group, step.scale, step.shade));
  const fallbacks = CATEGORICAL_STEPS.map((step) => stepColor(theme, step.group, step.scale, PALETTE_SHADE));
  const colors = [...steps, ...fallbacks].filter((color): color is string => color !== undefined);
  return [...new Set(colors)];
}
