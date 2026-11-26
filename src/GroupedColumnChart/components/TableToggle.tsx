import React from 'react';

import { Pressable, StyleSheet, Text } from 'react-native';

import { ChartView } from '../ChartView';
import { GROUPED_FONT_SIZE, MIN_HIT_SIZE, OUTLINE_WIDTH, TOGGLE_PADDING } from '../constants';
import type { TableToggleLabels } from '../types';

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: OUTLINE_WIDTH,
    justifyContent: 'center',
    minHeight: MIN_HIT_SIZE,
    minWidth: MIN_HIT_SIZE,
    paddingHorizontal: TOGGLE_PADDING,
  },
  text: { fontSize: GROUPED_FONT_SIZE, fontWeight: '600' },
});

export interface TableToggleProps {
  view: ChartView;
  labels: TableToggleLabels;
  onToggle: () => void;
  textColor: string;
  borderColor: string;
  testID: string;
}

/** Switches between the chart and its table; the label names the view it opens. */
export const TableToggle = ({ view, labels, onToggle, textColor, borderColor, testID }: TableToggleProps): React.ReactElement => {
  const text = view === ChartView.Chart ? labels.showTable : labels.showChart;
  return (
    <Pressable
      accessibilityHint={labels.hint}
      accessibilityLabel={text}
      accessibilityRole="button"
      onPress={onToggle}
      style={[styles.button, { borderColor }]}
      testID={`${testID}-toggle`}
    >
      <Text style={[styles.text, { color: textColor }]}>{text}</Text>
    </Pressable>
  );
};
