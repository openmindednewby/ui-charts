# Changelog

## 1.1.0

- `Donut` default slice colours now come from `categoricalPalette(theme)`: 14 theme scale steps (primary, secondary, accent, success, warning, error, info) with hue changing and lightness alternating each step, deduplicated, so 12+ slices never share a colour when the theme ramps differ. Was primary/secondary/accent 500 only (FINREG-REPORT-1 S2 "palette repeats navy").
- `Donut` `hideLabel`: keeps `label` for the accessible summary but hides the visible heading, for apps that render their own (FINREG-REPORT-1 S1 "heading twice").

## 1.0.0

- `Donut`: ring plus legend table, theme palette colours, accessible summary. Moved from finreg-web `MasterDonut` (FINREG-REPORT-1 "Master reporting: filters, export, drill-in").
- Helpers: `toDonutSegments`, `legendLine`, `percentLabel`, `donutSummary`, `segmentColor`.
