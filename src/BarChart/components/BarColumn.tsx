import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { COLUMN_AREA_HEIGHT, COLUMN_RADIUS, LABEL_FONT_SIZE, LABEL_LINE_HEIGHT, VALUE_FONT_SIZE } from '../constants';

const styles = StyleSheet.create({
  area: { height: COLUMN_AREA_HEIGHT, justifyContent: 'flex-end' },
  bar: { borderTopLeftRadius: COLUMN_RADIUS, borderTopRightRadius: COLUMN_RADIUS },
  column: { flexBasis: 0, flexGrow: 1, minWidth: 0 },
  label: { fontSize: LABEL_FONT_SIZE, lineHeight: LABEL_LINE_HEIGHT, textAlign: 'center' },
  textBox: { alignItems: 'center', minHeight: LABEL_LINE_HEIGHT, overflow: 'visible' },
  value: {
    fontSize: VALUE_FONT_SIZE,
    fontVariant: ['tabular-nums'],
    fontWeight: '600',
    lineHeight: LABEL_LINE_HEIGHT,
    textAlign: 'center',
  },
});

export interface BarColumnProps {
  label: string;
  valueText: string;
  fraction: number;
  color: string;
  textColor: string;
  mutedColor: string;
  testID: string;
  showText?: boolean;
  textWidth?: number;
}

/** One vertical bar: the value on top, a bar of `fraction` of the plot height, the label underneath, each on one line. */
export const BarColumn = ({
  label,
  valueText,
  fraction,
  color,
  textColor,
  mutedColor,
  testID,
  showText = true,
  textWidth,
}: BarColumnProps): React.ReactElement => {
  const box = textWidth !== undefined && textWidth > 0 ? { alignSelf: 'center' as const, width: textWidth } : null;
  return (
    <View role="listitem" style={styles.column} testID={testID}>
      <View style={styles.area}>
        <View style={[styles.textBox, box]}>
          {showText ? (
            <Text numberOfLines={1} style={[styles.value, { color: textColor }]} testID={`${testID}-value`}>
              {valueText}
            </Text>
          ) : null}
        </View>
        <View aria-hidden style={[styles.bar, { backgroundColor: color, height: fraction * COLUMN_AREA_HEIGHT }]} />
      </View>
      <View style={[styles.textBox, box]}>
        {showText ? (
          <Text numberOfLines={1} style={[styles.label, { color: mutedColor }]} testID={`${testID}-label`}>
            {label}
          </Text>
        ) : null}
      </View>
    </View>
  );
};
