import React from 'react';

import { StyleSheet, Text, View } from 'react-native';
import type { ViewStyle } from 'react-native';

import { ColumnTextAnchor } from '../ColumnTextAnchor';
import { COLUMN_AREA_HEIGHT, COLUMN_RADIUS, LABEL_FONT_SIZE, LABEL_LINE_HEIGHT, VALUE_FONT_SIZE } from '../constants';
import { useChartText } from '../../ChartText';

const styles = StyleSheet.create({
  area: { height: COLUMN_AREA_HEIGHT, justifyContent: 'flex-end' },
  bar: { borderTopLeftRadius: COLUMN_RADIUS, borderTopRightRadius: COLUMN_RADIUS },
  column: { flexBasis: 0, flexGrow: 1, minWidth: 0 },
  label: { fontSize: LABEL_FONT_SIZE, lineHeight: LABEL_LINE_HEIGHT },
  textBox: { alignItems: 'center', minHeight: LABEL_LINE_HEIGHT, overflow: 'visible' },
  value: {
    fontSize: VALUE_FONT_SIZE,
    fontVariant: ['tabular-nums'],
    fontWeight: '600',
    lineHeight: LABEL_LINE_HEIGHT,
    textAlign: 'center',
  },
});

const ANCHOR_SELF: Record<ColumnTextAnchor, ViewStyle['alignSelf']> = {
  [ColumnTextAnchor.Start]: 'flex-start',
  [ColumnTextAnchor.Center]: 'center',
  [ColumnTextAnchor.End]: 'flex-end',
};

const ANCHOR_TEXT: Record<ColumnTextAnchor, 'left' | 'center' | 'right'> = {
  [ColumnTextAnchor.Start]: 'left',
  [ColumnTextAnchor.Center]: 'center',
  [ColumnTextAnchor.End]: 'right',
};

export interface BarColumnProps {
  label: string;
  valueText: string;
  fraction: number;
  color: string;
  textColor: string;
  mutedColor: string;
  testID: string;
  showText?: boolean;
  showValue?: boolean;
  textWidth?: number;
  textAnchor?: ColumnTextAnchor;
}

/** One vertical bar: the value on top (unless `showValue` is false), a bar of `fraction` of the plot height, the label underneath. */
export const BarColumn = ({
  label,
  valueText,
  fraction,
  color,
  textColor,
  mutedColor,
  testID,
  showText = true,
  showValue = true,
  textWidth,
  textAnchor = ColumnTextAnchor.Center,
}: BarColumnProps): React.ReactElement => {
  const { numeral } = useChartText();
  const box = textWidth !== undefined && textWidth > 0 ? { alignSelf: ANCHOR_SELF[textAnchor], width: textWidth } : null;
  return (
    <View role="listitem" style={styles.column} testID={testID}>
      <View style={styles.area}>
        {showValue ? (
          <View style={[styles.textBox, box]}>
            {showText ? (
              <Text numberOfLines={1} style={[styles.value, numeral, { color: textColor }]} testID={`${testID}-value`}>
                {valueText}
              </Text>
            ) : null}
          </View>
        ) : null}
        <View aria-hidden style={[styles.bar, { backgroundColor: color, height: fraction * COLUMN_AREA_HEIGHT }]} />
      </View>
      <View style={[styles.textBox, box]}>
        {showText ? (
          <Text numberOfLines={1} style={[styles.label, { color: mutedColor, textAlign: ANCHOR_TEXT[textAnchor] }]} testID={`${testID}-label`}>
            {label}
          </Text>
        ) : null}
      </View>
    </View>
  );
};
