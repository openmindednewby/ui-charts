import React from 'react';

import { StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { ChartHeader } from './ChartHeader';

const FRAME_GAP = 12;
const EMPTY_FONT_SIZE = 13;

const styles = StyleSheet.create({
  empty: { fontSize: EMPTY_FONT_SIZE },
  root: { gap: FRAME_GAP, minWidth: 0 },
});

export interface ChartFrameProps {
  heading?: React.ReactNode;
  meta?: React.ReactNode;
  summary: string;
  emptyText: string;
  isEmpty: boolean;
  bodyStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  testID: string;
}

/** The shell every chart shares: a title row (heading + meta), then the figure (named by `summary`) or the empty text. */
export const ChartFrame = ({ heading, meta, summary, emptyText, isEmpty, bodyStyle, children, testID }: ChartFrameProps): React.ReactElement => {
  const { theme } = useUi();
  return (
    <View style={styles.root} testID={testID}>
      <ChartHeader heading={heading} meta={meta} mutedColor={theme.colors.textSecondary} testID={testID} textColor={theme.colors.text} />
      {isEmpty ? (
        <Text style={[styles.empty, { color: theme.colors.textSecondary }]} testID={`${testID}-empty`}>
          {emptyText}
        </Text>
      ) : (
        <View aria-label={summary} role="figure" style={bodyStyle}>
          {children}
        </View>
      )}
    </View>
  );
};
