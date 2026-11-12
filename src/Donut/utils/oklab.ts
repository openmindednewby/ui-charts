import { CVD_SIMULATIONS, LMS_TO_OKLAB, LMS_TO_RGB, OKLAB_TO_LMS, RGB_TO_LMS } from '../data/colorMath';
import type { Matrix3 } from '../data/colorMath';

export type Vec3 = readonly [number, number, number];

const HEX_PATTERN = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const SHORT_HEX_LENGTH = 3;
const CHANNEL_MAX = 255;
const HEX_RADIX = 16;
const GAMMA_KNEE = 0.04045;
const LINEAR_KNEE = 0.0031308;
const LINEAR_SLOPE = 12.92;
const GAMMA_OFFSET = 0.055;
const GAMMA = 2.4;
const DEGREES_HALF_TURN = 180;
const GAMUT_EPSILON = 1e-4;

function multiply(m: Matrix3, v: Vec3): Vec3 {
  return [
    m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
    m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
    m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2],
  ];
}

function toLinear(channel: number): number {
  return channel <= GAMMA_KNEE ? channel / LINEAR_SLOPE : ((channel + GAMMA_OFFSET) / (1 + GAMMA_OFFSET)) ** GAMMA;
}

function toGamma(channel: number): number {
  return channel <= LINEAR_KNEE ? channel * LINEAR_SLOPE : (1 + GAMMA_OFFSET) * channel ** (1 / GAMMA) - GAMMA_OFFSET;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/** Parses a #rgb, #rrggbb or #rrggbbaa colour to linear sRGB; undefined for any other form. */
export function hexToLinearRgb(color: string): Vec3 | undefined {
  const match = HEX_PATTERN.exec(color.trim());
  if (match === null) return undefined;
  const raw = match[1] ?? '';
  const digits = raw.length === SHORT_HEX_LENGTH ? [...raw].map((d) => d + d).join('') : raw;
  const channel = (i: number): number => toLinear(parseInt(digits.slice(i * 2, i * 2 + 2), HEX_RADIX) / CHANNEL_MAX);
  return [channel(0), channel(1), channel(2)];
}

/** Converts linear sRGB to OKLab. */
export function linearRgbToOklab(rgb: Vec3): Vec3 {
  const lms = multiply(RGB_TO_LMS, rgb);
  return multiply(LMS_TO_OKLAB, [Math.cbrt(lms[0]), Math.cbrt(lms[1]), Math.cbrt(lms[2])]);
}

/** Euclidean distance between two OKLab colours. */
export function oklabDistance(a: Vec3, b: Vec3): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

/** The OKLab colour as seen under each simulated colour-vision deficiency (protan, deutan, tritan). */
export function cvdViews(rgb: Vec3): Vec3[] {
  return CVD_SIMULATIONS.map((matrix) => {
    const seen = multiply(matrix, rgb);
    return linearRgbToOklab([clamp01(seen[0]), clamp01(seen[1]), clamp01(seen[2])]);
  });
}

/** OKLCH hue in degrees. */
export function oklabHue(lab: Vec3): number {
  return (Math.atan2(lab[2], lab[1]) * DEGREES_HALF_TURN) / Math.PI;
}

/** Converts OKLCH to linear sRGB, or undefined when it falls outside the sRGB gamut. */
export function oklchToLinearRgb(lightness: number, chroma: number, hueDegrees: number): Vec3 | undefined {
  const radians = (hueDegrees * Math.PI) / DEGREES_HALF_TURN;
  const lms = multiply(OKLAB_TO_LMS, [lightness, chroma * Math.cos(radians), chroma * Math.sin(radians)]);
  const rgb = multiply(LMS_TO_RGB, [lms[0] ** 3, lms[1] ** 3, lms[2] ** 3]);
  const inGamut = rgb.every((c) => c >= -GAMUT_EPSILON && c <= 1 + GAMUT_EPSILON);
  return inGamut ? [clamp01(rgb[0]), clamp01(rgb[1]), clamp01(rgb[2])] : undefined;
}

/** Formats linear sRGB as #rrggbb. */
export function linearRgbToHex(rgb: Vec3): string {
  const hex = rgb.map((c) => Math.round(clamp01(toGamma(c)) * CHANNEL_MAX).toString(HEX_RADIX).padStart(2, '0'));
  return `#${hex.join('')}`;
}
