import { PaletteGroup } from '../PaletteGroup';

export interface CategoricalStep {
  group: PaletteGroup;
  scale: string;
  shade: string;
}

export const CATEGORICAL_STEPS: readonly CategoricalStep[] = [
  { group: PaletteGroup.Palette, scale: 'primary', shade: '700' },
  { group: PaletteGroup.Semantic, scale: 'warning', shade: '300' },
  { group: PaletteGroup.Palette, scale: 'secondary', shade: '600' },
  { group: PaletteGroup.Semantic, scale: 'success', shade: '300' },
  { group: PaletteGroup.Palette, scale: 'accent', shade: '700' },
  { group: PaletteGroup.Semantic, scale: 'info', shade: '300' },
  { group: PaletteGroup.Semantic, scale: 'error', shade: '600' },
  { group: PaletteGroup.Palette, scale: 'primary', shade: '300' },
  { group: PaletteGroup.Semantic, scale: 'success', shade: '700' },
  { group: PaletteGroup.Palette, scale: 'secondary', shade: '300' },
  { group: PaletteGroup.Semantic, scale: 'warning', shade: '700' },
  { group: PaletteGroup.Palette, scale: 'accent', shade: '300' },
  { group: PaletteGroup.Semantic, scale: 'info', shade: '700' },
  { group: PaletteGroup.Semantic, scale: 'error', shade: '300' },
];

export const LIGHT_SHADES: readonly string[] = ['50', '100', '200', '300', '400'];
