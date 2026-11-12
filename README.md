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
