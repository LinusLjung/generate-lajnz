import validateConfig from '../validateConfig';

describe('validateConfig', () => {
  it('should validate the config based on the schema', () => {
    expect(
      validateConfig({
        types: {},
      }),
    ).toBe(true);

    expect(
      validateConfig({
        types: {
          package: {},
          service: {
            rootDir: '',
            variables: [],
          },
          _______: {},
        },
      }),
    ).toBe(true);
  });

  it('should throw if the config is invalid', () => {
    expect(() => validateConfig({} as any)).toThrow();
    expect(() =>
      validateConfig({
        types: {
          package: {},
          service: {
            rootDir: true as any,
          },
        },
      }),
    ).toThrow();
  });
});
