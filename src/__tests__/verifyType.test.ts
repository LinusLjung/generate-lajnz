import { RcType } from '../types';
import verifyType from '../verifyType';

const config: RcType = {
  types: {
    package: {
      rootDir: '.',
      variables: ['var1'],
    },
  },
};

describe('verifyType()', () => {
  it('it should check for the existence of the requested type', () => {
    expect(verifyType(config, 'package')).toBe(true);
    expect(verifyType(config, 'rootDir')).toBe(false);
    expect(verifyType(config, 'types')).toBe(false);
    expect(verifyType(config, 'service')).toBe(false);
  });
});
