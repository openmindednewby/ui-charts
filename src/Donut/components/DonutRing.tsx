import React from 'react';

import { Circle, G, Svg } from 'react-native-svg';

import { RING_CENTER, RING_CIRCUMFERENCE, RING_RADIUS, RING_SIZE, RING_START_ROTATION, RING_STROKE } from '../constants';
import type { DonutDatum, DonutSegment } from '../../internal/types';

export interface DonutRingProps {
  segments: ReadonlyArray<DonutSegment<DonutDatum>>;
  colors: readonly string[];
  trackColor: string;
}

/** The ring itself: a track circle plus one dashed arc per segment. Hidden from assistive tech. */
export const DonutRing = ({ segments, colors, trackColor }: DonutRingProps): React.ReactElement => (
  <Svg aria-hidden height={RING_SIZE} width={RING_SIZE}>
    <G origin={`${RING_CENTER}, ${RING_CENTER}`} rotation={RING_START_ROTATION}>
      <Circle cx={RING_CENTER} cy={RING_CENTER} fill="none" r={RING_RADIUS} stroke={trackColor} strokeWidth={RING_STROKE} />
      {segments.map((segment, i) => {
        const length = segment.fraction * RING_CIRCUMFERENCE;
        return (
          <Circle
            key={segment.datum.key}
            cx={RING_CENTER}
            cy={RING_CENTER}
            fill="none"
            r={RING_RADIUS}
            stroke={colors[i]}
            strokeDasharray={`${length} ${RING_CIRCUMFERENCE - length}`}
            strokeDashoffset={-segment.startFraction * RING_CIRCUMFERENCE}
            strokeWidth={RING_STROKE}
          />
        );
      })}
    </G>
  </Svg>
);
