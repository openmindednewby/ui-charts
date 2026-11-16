import React, { Children } from 'react';

import { childKey } from './childKey';

describe('childKey', () => {
  it('with keyed elements from Children.toArray, returns each element key', () => {
    const children = Children.toArray([<span key="volume" />, <span key="backlog" />]);

    const keys = children.map((child, index) => childKey(child, index));

    expect(keys).toEqual(['.$volume', '.$backlog']);
  });

  it('with a text child that has no key, falls back to a cell key from its position', () => {
    const child = 'plain text';

    const key = childKey(child, 2);

    expect(key).toBe('cell-2');
  });
});
