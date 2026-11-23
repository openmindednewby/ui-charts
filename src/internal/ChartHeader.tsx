import React from 'react';

import { StyleSheet, Text, View } from 'react-native';
import type { StyleProp, TextStyle } from 'react-native';

export const HEADER_TITLE_FONT_SIZE = 15;
export const HEADER_META_FONT_SIZE = 13;
const HEADER_GAP = 8;
const TITLE_TEXT: TextStyle = { fontSize: HEADER_TITLE_FONT_SIZE, fontWeight: '700' };
const META_TEXT: TextStyle = { fontSize: HEADER_META_FONT_SIZE };

const styles = StyleSheet.create({
  meta: { fontVariant: ['tabular-nums'] },
  metaBox: { marginLeft: 'auto' },
  row: { alignItems: 'center', columnGap: HEADER_GAP, flexDirection: 'row', flexWrap: 'wrap' },
  title: { flexShrink: 1 },
});

export interface ChartHeaderProps {
  heading?: React.ReactNode;
  meta?: React.ReactNode;
  textColor: string;
  mutedColor: string;
  testID: string;
}

function asText(node: React.ReactNode, style: StyleProp<TextStyle>, testID: string): React.ReactNode {
  if (typeof node !== 'string' && typeof node !== 'number') return node;
  return (
    <Text style={style} testID={testID}>
      {node}
    </Text>
  );
}

/** The chart title row: a string heading becomes the styled title, a string meta a muted figure on the right. */
export const ChartHeader = ({ heading, meta, textColor, mutedColor, testID }: ChartHeaderProps): React.ReactElement | null => {
  if (heading === undefined && meta === undefined) return null;
  return (
    <View style={styles.row} testID={`${testID}-header`}>
      {asText(heading, [styles.title, TITLE_TEXT, { color: textColor }], `${testID}-title`)}
      {meta === undefined ? null : (
        <View style={styles.metaBox}>{asText(meta, [styles.meta, META_TEXT, { color: mutedColor }], `${testID}-meta`)}</View>
      )}
    </View>
  );
};
