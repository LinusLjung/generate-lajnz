import validateConfig from '../validateConfig';

jest.mock('../.glzrc.schema.json', () => ({
  $schema: 'http://json-schema.org/draft-04/schema#',
  type: 'object',
  properties: {
    test: {
      type: 'number',
    },
  },
}));

describe('validateConfig', () => {
  it('should validate the config based on the schema', () => {
    expect(
      validateConfig({
        test: 1,
      } as any),
    ).toBe(true);
  });

  it('should throw if the config is invalid', () => {
    expect(() =>
      validateConfig({
        test: '1',
      } as any),
    ).toThrow();
  });
});
