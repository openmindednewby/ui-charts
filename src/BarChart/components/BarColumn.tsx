import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { COLUMN_AREA_HEIGHT, COLUMN_RADIUS, LABEL_FONT_SIZE, VALUE_FONT_SIZE } from '../constants';

const styles = StyleSheet.create({
  area: { height: COLUMN_AREA_HEIGHT, justifyContent: 'flex-end' },
  bar: { borderTopLeftRadius: COLUMN_RADIUS, borderTopRightRadius: COLUMN_RADIUS },
  column: { flexBasis: 0, flexGrow: 1, minWidth: 0 },
  label: { fontSize: LABEL_FONT_SIZE, textAlign: 'center' },
  value: { fontSize: VALUE_FONT_SIZE, fontVariant: ['tabular-nums'], fontWeight: '600', textAlign: 'center' },
});

export interface BarColumnProps {
  label: string;
  valueText: string;
  fraction: number;
  color: string;
  textColor: string;
  mutedColor: string;
  testID: string;
}

/** One vertical bar: the value on top, a bar of `fraction` of the plot height, the label underneath. */
export const BarColumn = ({ label, valueText, fraction, color, textColor, mutedColor, testID }: BarColumnProps): React.ReactElement => (
  <View role="listitem" style={styles.column} testID={testID}>
    <View style={styles.area}>
      <Text style={[styles.value, { color: textColor }]}>
        {valueText}
      </Text>
      <View aria-hidden style={[styles.bar, { backgroundColor: color, height: fraction * COLUMN_AREA_HEIGHT }]} />
    </View>
    <Text style={[styles.label, { color: mutedColor }]}>
      {label}
    </Text>
  </View>
);
