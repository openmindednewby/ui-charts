import { panelGridColumns, panelWidth } from './panelGridColumns';

describe('panelGridColumns', () => {
  it('with a 360 px phone width, returns one column', () => {
    const width = 328;

    const columns = panelGridColumns(width, { minColumnWidth: 420, maxColumns: 2, gap: 16 });

    expect(columns).toBe(1);
  });

  it('with a desktop content width, returns two columns', () => {
    const width = 900;

    const columns = panelGridColumns(width, { minColumnWidth: 420, maxColumns: 2, gap: 16 });

    expect(columns).toBe(2);
  });

  it('with room for more than the maximum, caps at the maximum', () => {
    const width = 3000;

    const columns = panelGridColumns(width, { minColumnWidth: 300, maxColumns: 3, gap: 16 });

    expect(columns).toBe(3);
  });

  it('with exactly two minimum columns plus one gap, returns two columns', () => {
    const width = 856;

    const columns = panelGridColumns(width, { minColumnWidth: 420, maxColumns: 4, gap: 16 });

    expect(columns).toBe(2);
  });

  it('with an unmeasured zero width, returns one column', () => {
    const width = 0;

    const columns = panelGridColumns(width, { minColumnWidth: 420, maxColumns: 2, gap: 16 });

    expect(columns).toBe(1);
  });

  it('with a maximum below one, returns one column', () => {
    const width = 2000;

    const columns = panelGridColumns(width, { minColumnWidth: 300, maxColumns: 0, gap: 16 });

    expect(columns).toBe(1);
  });
});

describe('panelWidth', () => {
  it('with two columns, splits the width after one gap', () => {
    const width = 916;

    const result = panelWidth(width, 2, 16);

    expect(result).toBe(450);
  });

  it('with one column, returns the full width', () => {
    const width = 328;

    const result = panelWidth(width, 1, 16);

    expect(result).toBe(328);
  });

  it('with an unmeasured zero width, returns undefined so the panel stretches', () => {
    const width = 0;

    const result = panelWidth(width, 2, 16);

    expect(result).toBeUndefined();
  });
});
