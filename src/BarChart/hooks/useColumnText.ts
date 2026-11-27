import { useMemo } from 'react';

import { ColumnTextAnchor } from '../ColumnTextAnchor';
import type { ColumnAxis } from '../types';
import { axisTickAnchor, axisTickPlan, DEFAULT_AXIS_TICKS } from '../utils/columnAxis';
import { columnLabelPlan, columnTextAnchor, columnTextBoxWidth, isColumnTextShown } from '../utils/columnLabels';

export interface ColumnTextInput {
  labels: readonly string[];
  values: readonly string[];
  plotWidth: number;
  axis?: ColumnAxis;
}

export interface ColumnText {
  showText: boolean;
  textWidth: number;
  textAnchor: ColumnTextAnchor;
}

export interface ColumnTextLayout {
  gap: number;
  textAt: (index: number) => ColumnText;
}

/** Which columns show text and how wide it sits: every n-th column in value mode, the even axis ticks in axis mode. */
export function useColumnText({ labels, values, plotWidth, axis }: ColumnTextInput): ColumnTextLayout {
  const tickCount = axis?.tickCount ?? DEFAULT_AXIS_TICKS;
  return useMemo(() => {
    const plan = columnLabelPlan({ labels, plotWidth, values: axis === undefined ? values : [] });
    if (axis === undefined) {
      const textWidth = columnTextBoxWidth(plan);
      return {
        gap: plan.gap,
        textAt: (index) => ({ showText: isColumnTextShown(index, plan.step), textAnchor: columnTextAnchor({ count: labels.length, index, plan, plotWidth }), textWidth }),
      };
    }
    const ticks = axisTickPlan({ count: labels.length, labels, plotWidth, tickCount });
    return {
      gap: plan.gap,
      textAt: (index) => ({
        showText: ticks.indices.has(index),
        textAnchor: axisTickAnchor(index, labels.length),
        textWidth: ticks.textWidth,
      }),
    };
  }, [axis, labels, plotWidth, tickCount, values]);
}
