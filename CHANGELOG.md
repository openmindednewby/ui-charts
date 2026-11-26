# Changelog

## 1.8.0

- `ChartTextProvider` (opt-in): `numeralFontFamily` sets one font family (e.g. the theme mono) on every chart number (bar values, column values, y-axis ticks, header meta, inline legend counts and percents, grouped table cells); `legendMarker: LegendMarker.Dot` draws round table-legend and series-legend markers. Outside a provider nothing changes. Hook `useChartText`, helper `markerRadius` (MODC-1 residual "chart mono numerals + legend dots").

## 1.7.0

- `GroupedColumnChart`: grouped multi-series columns (`groups` with a value per `series` key), each series `SeriesStyle.Filled` or `SeriesStyle.Outlined`, a legend with each series total (own `total` or the sum; text via `legendText`), and a chart/table switch when `toggle` labels are given (44px hit box). Colours: series `color`, else `palette`, else the theme categorical palette. Atoms `GroupedColumns`, `SeriesLegend`, `GroupedTable`, `TableToggle`; helpers `groupedMax`, `groupedSummary`, `groupValue`, `resolveSeries`, `seriesTotal` (INV-TAX-2). `ColumnChart` is unchanged.

## 1.5.0

- `HorizontalBarChart` `rowGap` (vertical gap between rows in px, default 6) and `trackWidth` (fixed track width in px, the label takes the remaining space; default the track fills the row); `BarRow` gains `trackWidth` (MODC-1 dashboard tune). Defaults unchanged.

## 1.4.0

- `HorizontalBarChart` `barThickness` (bar height in px, radius half of it; default 10) and `showShare` (bold count followed by the muted share of the total); `BarRow` gains `thickness`, `shareText`, `mutedColor` (MODC-1 D-MC-728).
- `ChartTitle` is exported: a chart heading with its own `weight` and `size` (for a 15/600 heading pass `weight="600"`) (MODC-1 D-MC-728).

## 1.3.0

- `ChartCard` (atom) and `ChartPanelGrid` `variant={PanelVariant.Card}`: each panel on a card surface (theme `surfaceElevated` fill, 1px `border`, 12px radius, 16px padding); default stays plain (MODC-1 G-1).
- Chart title row: a string `heading` now renders as a 15px/700 title in the theme text colour, and `ColumnChart`, `HorizontalBarChart` and `StackedBar` take a `meta` slot shown right-aligned and muted at 13px (string) or as given (node, e.g. a badge) (MODC-1 G-5).
- `ColumnChart` axis mode (`axis={{ tickCount }}`): a 0..max y-axis, no value above each column, and `tickCount` (default 3) evenly spaced x labels, first and last included, fewer when they would not fit; helpers `axisTickPlan`, `axisTickAnchor`; `BarColumn` gains `showValue` and `textAnchor` (MODC-1 G-6, TEXT-FIT-1). Value mode is unchanged.
- Inline legend: `DonutLegend` `variant={LegendVariant.Inline}` (and `StackedBar` `legendVariant`) lays items on one wrapping row: dot, the datum `icon` if set, label, bold count, muted percent; helper `legendParts` (MODC-1 G-8).

## 1.2.2

- `ColumnChart` value and date labels are no longer cut to stubs ("1.", "7..") on RN-web: a one-line Text gets `maxWidth: 100%` there, so its own width was capped at the column width. The width now sits on the box around the text, centred on the column and as wide as its label slot (`columnTextBoxWidth`: slot width x shown-label step). MODC-1 visual-qa, TEXT-FIT-1.

## 1.2.1

- `ColumnChart` value and date labels stay on one line (`numberOfLines` 1, fixed text box centred on the column); a crowded plot measures its width, shrinks the column gap and shows text on every n-th column only, so labels never overlap; labels over `maxLabelLength` (default 12) end with an ellipsis. Was one character per line at 30 columns in a 488 px card (MODC-1 visual-qa, TEXT-FIT-1). The accessible summary still lists every value.

## 1.2.0

- `HorizontalBarChart` and `ColumnChart` (molecules) built from the `BarRow` and `BarColumn` atoms, with a heading slot, empty state and list semantics; helpers `scaleBars`, `barSummary` (MODC-1 "Module C unified console", AC-UI-4, AC-MC-8).
- `StackedBar` (molecule): one bar split into theme-coloured segments plus a legend.
- `ChartPanelGrid` (organism): responsive grid of chart panels built on ui-layout `Section`, stable child keys; helpers `panelGridColumns`, `panelWidth`.
- `defaultFormatValue` is one shared formatter used by every chart.

## 1.1.1

- `categoricalPalette` drops any colour within OKLab distance 0.12 of one already picked (was exact-value dedup, so FinReg kept near-identical navies for CHF/GBP and Draft/Awaiting/Returned), keeps each neighbour distinct under protan, deutan and tritan simulation, and tops up from hues derived around the theme anchor when the theme has too few distinct colours; order stays deterministic (FINREG-REPORT-1 S2 "palette repeats navy").

## 1.1.0

- `Donut` default slice colours now come from `categoricalPalette(theme)`: 14 theme scale steps (primary, secondary, accent, success, warning, error, info) with hue changing and lightness alternating each step, deduplicated, so 12+ slices never share a colour when the theme ramps differ. Was primary/secondary/accent 500 only (FINREG-REPORT-1 S2 "palette repeats navy").
- `Donut` `hideLabel`: keeps `label` for the accessible summary but hides the visible heading, for apps that render their own (FINREG-REPORT-1 S1 "heading twice").

## 1.0.0

- `Donut`: ring plus legend table, theme palette colours, accessible summary. Moved from finreg-web `MasterDonut` (FINREG-REPORT-1 "Master reporting: filters, export, drill-in").
- Helpers: `toDonutSegments`, `legendLine`, `percentLabel`, `donutSummary`, `segmentColor`.
