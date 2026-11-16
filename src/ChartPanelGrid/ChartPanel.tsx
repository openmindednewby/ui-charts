import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

const PANEL_PADDING = 16;
const PANEL_RADIUS = 12;
const PANEL_BORDER_WIDTH = 1;
const PANEL_GAP = 10;
const PANEL_TITLE_FONT_SIZE = 15;

const styles = StyleSheet.create({
  panel: {
    borderRadius: PANEL_RADIUS,
    borderWidth: PANEL_BORDER_WIDTH,
    flexGrow: 1,
    gap: PANEL_GAP,
    minWidth: 0,
    padding: PANEL_PADDING,
  },
  title: { fontSize: PANEL_TITLE_FONT_SIZE, fontWeight: '600' },
});

export interface ChartPanelProps {
  title: string;
  children: React.ReactNode;
  testID?: string;
}

/** A titled card holding one chart (pass the chart with `hideLabel`) and any action under it. */
export const ChartPanel = ({ title, children, testID = 'chart-panel' }: ChartPanelProps): React.ReactElement => {
  const { theme } = useUi();
  return (
    <View
      aria-label={title}
      role="region"
      style={[styles.panel, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
      testID={testID}
    >
      <Text role="heading" style={[styles.title, { color: theme.colors.text }]} testID={`${testID}-title`}>
        {title}
      </Text>
      {children}
    </View>
  );
};
