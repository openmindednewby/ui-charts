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
  valueStrong: { fontWeight: '700' },
  share: { fontWeight: '400' },
});

export interface BarRowProps {
  label: string;
  valueText: string;
  fraction: number;
  color: string;
  trackColor: string;
  textColor: string;
  testID: string;
  /** Bar height in px. Default 10. */
  thickness?: number;
  /** The bar's share of the total ("61%"); when set the count turns bold and the share follows it muted. */
  shareText?: string;
  mutedColor?: string;
}

/** One horizontal bar: label, a track with a fill of `fraction`, and the value as text. */
export const BarRow = ({
  label,
  valueText,
  fraction,
  color,
  trackColor,
  textColor,
  testID,
  thickness = BAR_THICKNESS,
  shareText,
  mutedColor = textColor,
}: BarRowProps): React.ReactElement => (
  <View role="listitem" style={styles.row} testID={testID}>
    <Text style={[styles.label, { color: textColor }]}>
      {label}
    </Text>
    <View aria-hidden style={[styles.track, { backgroundColor: trackColor, borderRadius: thickness / 2, height: thickness }]}>
      <View style={[styles.fill, { backgroundColor: color, borderRadius: thickness / 2, height: thickness, width: `${fraction * FULL_PERCENT}%` }]} />
    </View>
    <Text style={[styles.value, { color: textColor }, shareText === undefined ? undefined : styles.valueStrong]} testID={`${testID}-value`}>
      {valueText}
      {shareText === undefined ? null : (
        <Text style={[styles.share, { color: mutedColor }]} testID={`${testID}-share`}>
          {` ${shareText}`}
        </Text>
      )}
    </Text>
  </View>
);
