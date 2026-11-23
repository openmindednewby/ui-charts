import { chartCardStyle } from './chartCardStyle';

describe('chartCardStyle', () => {
  it('with theme colours, returns a bordered rounded padded card in those colours', () => {
    const colors = { border: 'var(--border)', surface: 'var(--surface)' };

    const style = chartCardStyle(colors);

    expect(style).toEqual({
      backgroundColor: 'var(--surface)',
      borderColor: 'var(--border)',
      borderRadius: 12,
      borderWidth: 1,
      padding: 16,
    });
  });
});
