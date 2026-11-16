import { isValidElement } from 'react';
import type { ReactNode } from 'react';

/** A stable key for one grid cell: the child element key (set by `Children.toArray`), else one from its position. */
export function childKey(child: ReactNode, index: number): string {
  if (isValidElement(child) && child.key !== null) return String(child.key);
  return `cell-${index}`;
}
