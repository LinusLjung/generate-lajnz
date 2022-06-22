import requireConfig from '../requireConfig';

const jsonFileResponse = { json: true };

jest.mock('fs', () => ({
  readFileSync: () => ({
    toString() {
      return JSON.stringify(jsonFileResponse);
    },
  }),
}));

describe('getConfig()', () => {
  it('should throw if the path is missing', () => {
    expect(() => requireConfig(void 0 as unknown as string)).toThrow();
  });

  it('should resolve CommonJS modules', () => {
    const jsResponse = { js: true };
    const jsonResponse = { json: true };

    jest.mock('test.js', () => ({ ...jsResponse }), { virtual: true });
    jest.mock('test.json', () => ({ ...jsonResponse }), { virtual: true });

    expect(requireConfig('test.js')).toEqual(jsResponse);
    expect(requireConfig('test.json')).toEqual(jsonResponse);
  });

  it('should parse other files as JSON', () => {
    const jsonSpy = jest.spyOn(JSON, 'parse');

    expect(requireConfig('.testrc')).toEqual(jsonFileResponse);

    expect(jsonSpy).toHaveBeenCalledTimes(1);
  });
});
