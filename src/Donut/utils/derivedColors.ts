import {
  DERIVED_CHROMA_STEP,
  DERIVED_HUE_OFFSETS,
  DERIVED_LIGHTNESS,
  DERIVED_MAX_CHROMA,
  DERIVED_MIN_CHROMA,
} from '../data/colorMath';
import { linearRgbToHex, oklchToLinearRgb } from './oklab';
import type { Vec3 } from './oklab';

function inGamutAtMostChroma(lightness: number, hue: number): Vec3 | undefined {
  for (let chroma = DERIVED_MAX_CHROMA; chroma >= DERIVED_MIN_CHROMA; chroma -= DERIVED_CHROMA_STEP) {
    const rgb = oklchToLinearRgb(lightness, chroma, hue);
    if (rgb !== undefined) return rgb;
  }
  return undefined;
}

/** Extra slice colours spread around the OKLCH wheel from an anchor hue, for themes with too few distinct colours. */
export function derivedColors(anchorHue: number): string[] {
  return DERIVED_LIGHTNESS.flatMap((lightness) =>
    DERIVED_HUE_OFFSETS.map((offset) => inGamutAtMostChroma(lightness, anchorHue + offset)),
  )
    .filter((rgb): rgb is Vec3 => rgb !== undefined)
    .map(linearRgbToHex);
}
