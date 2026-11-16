import { segmentColor } from './segmentColor';

const PALETTE = ['primary', 'secondary'];

describe('segmentColor', () => {
  it('with an own colour, returns that colour', () => {
    const datum = { key: 'a', label: 'A', value: 1, color: 'own' };

    const color = segmentColor(datum, 0, PALETTE);

    expect(color).toBe('own');
  });

  it('with no own colour past the palette end, cycles back to the start', () => {
    const datum = { key: 'c', label: 'C', value: 1 };

    const color = segmentColor(datum, 2, PALETTE);

    expect(color).toBe('primary');
  });

  it('with no own colour and an empty palette, returns an empty string', () => {
    const datum = { key: 'a', label: 'A', value: 1 };

    const color = segmentColor(datum, 0, []);

    expect(color).toBe('');
  });
});
