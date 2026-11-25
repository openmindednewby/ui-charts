import React from 'react';

import { Defs, Line, Pattern, Rect, Svg } from 'react-native-svg';

const STRIPE_PITCH = 6;
const STRIPE_WIDTH = 2;
const STRIPE_ANGLE = 45;

export interface StripedFillProps {
  id: string;
  color: string;
}

/** Diagonal hatch filling its box: the colour as stripes over whatever sits behind, for a "not known" share. */
export const StripedFill = ({ id, color }: StripedFillProps): React.ReactElement => (
  <Svg aria-hidden height="100%" testID={id} width="100%">
    <Defs>
      <Pattern height={STRIPE_PITCH} id={id} patternTransform={`rotate(${STRIPE_ANGLE})`} patternUnits="userSpaceOnUse" width={STRIPE_PITCH} x="0" y="0">
        <Line stroke={color} strokeWidth={STRIPE_WIDTH} x1="0" x2="0" y1="0" y2={STRIPE_PITCH} />
      </Pattern>
    </Defs>
    <Rect fill={`url(#${id})`} height="100%" width="100%" x="0" y="0" />
  </Svg>
);
