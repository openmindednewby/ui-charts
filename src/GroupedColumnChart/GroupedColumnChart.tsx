import React, { useMemo, useState } from 'react';

import { StyleSheet, View } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { categoricalPalette } from '../Donut/utils/categoricalPalette';
import type { CategoricalTheme } from '../Donut/utils/categoricalPalette';
import { ChartFrame } from '../internal/ChartFrame';
import { defaultFormatValue } from '../internal/labels';
import { ChartView } from './ChartView';
import { GroupedColumns } from './components/GroupedColumns';
import { GroupedTable } from './components/GroupedTable';
import { SeriesLegend } from './components/SeriesLegend';
import { TableToggle } from './components/TableToggle';
import { GROUPED_GAP } from './constants';
import type { ColumnGroup, ColumnSeries, GroupedValueFormatter, SeriesLegendText, TableToggleLabels } from './types';
import { groupedMax, groupedSummary, resolveSeries } from './utils/groupedScale';

const styles = StyleSheet.create({
  body: { gap: GROUPED_GAP },
});

const defaultLegendText: SeriesLegendText = (series, totalText) => `${series.label} ${totalText}`;

export interface GroupedColumnChartProps {
  groups: readonly ColumnGroup[];
  series: readonly ColumnSeries[];
  label: string;
  emptyText: string;
  heading?: React.ReactNode;
  meta?: React.ReactNode;
  formatValue?: GroupedValueFormatter;
  palette?: readonly string[];
  max?: number;
  legendText?: SeriesLegendText;
  toggle?: TableToggleLabels;
  testID?: string;
}

/** Grouped columns, one bar per series (filled or outlined), with a totals legend and an optional table view. */
export const GroupedColumnChart = ({
  groups,
  series,
  label,
  emptyText,
  heading,
  meta,
  formatValue = defaultFormatValue,
  palette,
  max,
  legendText = defaultLegendText,
  toggle,
  testID = 'grouped-column-chart',
}: GroupedColumnChartProps): React.ReactElement => {
  const { theme } = useUi();
  const [view, setView] = useState(ChartView.Chart);
  const colors = useMemo(() => palette ?? categoricalPalette(theme as CategoricalTheme), [palette, theme]);
  const resolved = useMemo(() => resolveSeries(series, groups, colors, formatValue), [series, groups, colors, formatValue]);
  const summary = useMemo(() => groupedSummary(label, groups, series, formatValue), [label, groups, series, formatValue]);
  const top = groupedMax(groups, series, max);
  const handleToggle = (): void => setView((current) => (current === ChartView.Chart ? ChartView.Table : ChartView.Chart));
  const isEmpty = groups.length === 0 || series.length === 0;
  return (
    <View style={styles.body}>
      <ChartFrame bodyStyle={styles.body} emptyText={emptyText} heading={heading} isEmpty={isEmpty} meta={meta} summary={summary} testID={testID}>
        {view === ChartView.Table ? (
          <GroupedTable borderColor={theme.colors.border} formatValue={formatValue} groups={groups} series={resolved} testID={testID} textColor={theme.colors.text} />
        ) : (
          <GroupedColumns groups={groups} labelColor={theme.colors.textSecondary} series={resolved} testID={testID} top={top} />
        )}
        <SeriesLegend legendText={legendText} series={resolved} testID={testID} textColor={theme.colors.text} />
      </ChartFrame>
      {toggle === undefined || isEmpty ? null : (
        <TableToggle borderColor={theme.colors.border} labels={toggle} onToggle={handleToggle} testID={testID} textColor={theme.colors.text} view={view} />
      )}
    </View>
  );
};
