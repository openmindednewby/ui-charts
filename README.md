# @dloizides/ui-charts

Chart components for the dloizides RN-web portals. First component: `Donut`.

```tsx
import { Donut } from '@dloizides/ui-charts';

<Donut
  label={FM('report.byStatus')}
  emptyText={FM('report.noData')}
  segments={[{ key: 'paid', label: 'Paid', value: 3 }, { key: 'failed', label: 'Failed', value: 1 }]}
  formatValue={(value) => String(value)}
  testID="report-status-donut"
/>
```

| Prop | Type | Notes |
|---|---|---|
| `segments` | `DonutDatum[]` | `key`, `label`, `value`, optional `color` |
| `label` | `string` | heading and start of the accessible summary |
| `emptyText` | `string` | shown when the total is 0 |
| `formatValue` | `(value, datum) => string` | legend value, default `String(value)` |
| `palette` | `string[]` | slice colours; default theme `primary/secondary/accent` 500 |
| `testID` | `string` | default `donut` |

Accessibility: the ring is `aria-hidden`; the body is a `figure` labelled with every slice; the legend is a `table` with one row per slice, so the data is readable without the ring.

Peers: `react-native-svg >= 13`, `@dloizides/ui-feedback` (theme via `useUi`).

## Exports by layer (UI-ATOMIC-1)

| Layer | Export | Job |
|---|---|---|
| Atom | `BarRow` | one horizontal bar: label, track, value |
| Atom | `BarColumn` | one vertical column: value, bar, label |
| Molecule | `HorizontalBarChart` | list of `BarRow`s with a heading slot and empty state |
| Molecule | `ColumnChart` | row of `BarColumn`s with a heading slot and empty state |
| Molecule | `StackedBar` | one bar split into theme-coloured segments plus a legend |
| Molecule | `Donut`, `DonutRing`, `DonutLegend` | ring plus legend table |
| Organism | `ChartPanelGrid` | responsive grid of chart panels (panels are ui-layout `Section`) |

Helpers: `scaleBars`, `barSummary` (bars), `panelGridColumns`, `panelWidth` (grid columns by width), `defaultFormatValue` (shared by every chart), `toDonutSegments`, `legendLine`, `percentLabel`, `donutSummary`, `segmentColor`, `categoricalPalette`.

```tsx
import { ChartPanelGrid, HorizontalBarChart } from '@dloizides/ui-charts';

<HorizontalBarChart
  label={FM('charts.leadsBySource')}
  emptyText={FM('charts.noData')}
  data={[{ key: 'web', label: 'Web', value: 12 }, { key: 'referral', label: 'Referral', value: 5 }]}
  testID="leads-by-source"
/>
```
