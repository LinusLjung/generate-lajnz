/* eslint-disable @typescript-eslint/no-explicit-any */
import getTypeFields from '../getTypeFields';
import { RcType } from '../types';

const config: RcType = {
  types: {
    package: {
      rootDir: '.',
      variables: ['var1'],
    },
    service: {
      variables: ['var1', 'var2'],
    },
  },
};

describe('getTypeField()', () => {
  it('should return all fields if no filter is applied', () => {
    expect(getTypeFields(config, 'package')).toEqual(['.', ['var1']]);
    expect(getTypeFields(config, 'service')).toEqual([['var1', 'var2']]);
  });

  it('should return the requested field', () => {
    expect(getTypeFields(config, 'package', 'rootDir')).toBe('.');
    expect(getTypeFields(config, 'package', 'variables')).toEqual(['var1']);
    expect(getTypeFields(config, 'service', 'variables')).toEqual(['var1', 'var2']);
  });

  it('should multiple fields if requested', () => {
    expect(getTypeFields(config, 'package', ['rootDir', 'variables'])).toEqual(['.', ['var1']]);
    expect(getTypeFields(config, 'service', ['variables'])).toEqual([['var1', 'var2']]);
  });

  it('should resolve fields to null if they are missing', () => {
    expect(getTypeFields(config, 'package', '_' as any)).toBe(null);
    expect(getTypeFields(config, 'service', '_' as any)).toEqual(null);
    expect(getTypeFields(config, 'package', ['1', '2'] as any)).toEqual([null, null]);
    expect(getTypeFields(config, 'service', ['_'] as any)).toEqual([null]);
  });

  it('should resolve fields to null if the type is missing', () => {
    expect(getTypeFields(config, '_', 'rootDir')).toBe(null);
    expect(getTypeFields(config, '_', ['rootDir'])).toEqual([null]);
    expect(getTypeFields(config, '_', ['rootDir', 'variables'])).toEqual([null, null]);
  });
});
