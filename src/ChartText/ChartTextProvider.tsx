import React, { createContext, useContext, useMemo } from 'react';

import type { TextStyle } from 'react-native';

import { LegendMarker } from './LegendMarker';

export interface ChartTextOptions {
  numeralFontFamily?: string;
  legendMarker?: LegendMarker;
}

export interface ChartText {
  numeral: TextStyle | undefined;
  legendMarker: LegendMarker;
}

const DEFAULT_TEXT: ChartText = { numeral: undefined, legendMarker: LegendMarker.Square };

const ChartTextContext = createContext<ChartText>(DEFAULT_TEXT);

export interface ChartTextProviderProps extends ChartTextOptions {
  children: React.ReactNode;
}

/** Opt-in chart text look for every chart below: a numeral font family (e.g. the theme's mono) and the legend marker shape. */
export const ChartTextProvider = ({ numeralFontFamily, legendMarker = LegendMarker.Square, children }: ChartTextProviderProps): React.ReactElement => {
  const value = useMemo<ChartText>(
    () => ({ numeral: numeralFontFamily === undefined ? undefined : { fontFamily: numeralFontFamily }, legendMarker }),
    [numeralFontFamily, legendMarker],
  );
  return <ChartTextContext.Provider value={value}>{children}</ChartTextContext.Provider>;
};

/** The chart text look in scope; outside a provider numerals keep the inherited font and legends draw squares. */
export const useChartText = (): ChartText => useContext(ChartTextContext);

/** The corner radius of a legend marker of `size` px for the marker shape. */
export const markerRadius = (marker: LegendMarker, size: number, squareRadius: number): number =>
  marker === LegendMarker.Dot ? size / 2 : squareRadius;
