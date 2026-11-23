import React, { Children, useCallback, useState } from 'react';

import { StyleSheet, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { chartCardStyle } from '../ChartCard/utils/chartCardStyle';
import { PanelVariant } from './PanelVariant';
import { childKey } from './utils/childKey';
import { panelGridColumns, panelWidth } from './utils/panelGridColumns';

const DEFAULT_MIN_COLUMN_WIDTH = 420;
const DEFAULT_MAX_COLUMNS = 2;
const DEFAULT_GAP = 16;

const styles = StyleSheet.create({
  cell: { minWidth: 0 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', width: '100%' },
  stretch: { width: '100%' },
});

export interface ChartPanelGridProps {
  children: React.ReactNode;
  minColumnWidth?: number;
  maxColumns?: number;
  gap?: number;
  variant?: PanelVariant;
  testID?: string;
}

/** Lays panels out by its own measured width: one column on a phone, up to `maxColumns` when each fits `minColumnWidth`. */
export const ChartPanelGrid = ({
  children,
  minColumnWidth = DEFAULT_MIN_COLUMN_WIDTH,
  maxColumns = DEFAULT_MAX_COLUMNS,
  gap = DEFAULT_GAP,
  variant = PanelVariant.Plain,
  testID = 'chart-panel-grid',
}: ChartPanelGridProps): React.ReactElement => {
  const { theme } = useUi();
  const [width, setWidth] = useState(0);
  const handleLayout = useCallback((event: LayoutChangeEvent): void => setWidth(event.nativeEvent.layout.width), []);
  const columns = panelGridColumns(width, { gap, maxColumns, minColumnWidth });
  const cellWidth = panelWidth(width, columns, gap);
  const isCard = variant === PanelVariant.Card;
  const card = isCard ? chartCardStyle({ border: theme.colors.border, surface: theme.colors.surfaceElevated }) : null;

  return (
    <View onLayout={handleLayout} style={[styles.grid, { gap }]} testID={testID}>
      {Children.toArray(children).map((child, index) => (
        <View
          key={childKey(child, index)}
          style={[styles.cell, card, cellWidth === undefined ? styles.stretch : { width: cellWidth }]}
          testID={`${testID}-cell-${index}`}
        >
          {child}
        </View>
      ))}
    </View>
  );
};
