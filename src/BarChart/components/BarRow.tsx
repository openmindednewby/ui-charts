import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import {
  BAR_RADIUS,
  BAR_THICKNESS,
  FULL_PERCENT,
  LABEL_FONT_SIZE,
  ROW_GAP,
  ROW_LABEL_WIDTH,
  ROW_VALUE_WIDTH,
  VALUE_FONT_SIZE,
} from '../constants';

const styles = StyleSheet.create({
  fill: { borderRadius: BAR_RADIUS, height: BAR_THICKNESS },
  label: { flexShrink: 1, fontSize: LABEL_FONT_SIZE, width: ROW_LABEL_WIDTH },
  row: { alignItems: 'center', flexDirection: 'row', gap: ROW_GAP },
  track: { borderRadius: BAR_RADIUS, flexGrow: 1, flexShrink: 1, height: BAR_THICKNESS, minWidth: 0 },
  value: { fontSize: VALUE_FONT_SIZE, fontVariant: ['tabular-nums'], textAlign: 'right', width: ROW_VALUE_WIDTH },
});

export interface BarRowProps {
  label: string;
  valueText: string;
  fraction: number;
  color: string;
  trackColor: string;
  textColor: string;
  testID: string;
}

/** One horizontal bar: label, a track with a fill of `fraction`, and the value as text. */
export const BarRow = ({ label, valueText, fraction, color, trackColor, textColor, testID }: BarRowProps): React.ReactElement => (
  <View role="row" style={styles.row} testID={testID}>
    <Text role="cell" style={[styles.label, { color: textColor }]}>
      {label}
    </Text>
    <View aria-hidden style={[styles.track, { backgroundColor: trackColor }]}>
      <View style={[styles.fill, { backgroundColor: color, width: `${fraction * FULL_PERCENT}%` }]} />
    </View>
    <Text role="cell" style={[styles.value, { color: textColor }]}>
      {valueText}
    </Text>
  </View>
);
