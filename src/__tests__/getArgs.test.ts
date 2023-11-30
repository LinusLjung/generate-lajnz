import mockArgv from 'mock-argv';
import { ArgsType, getArgs } from '../getArgs';

describe('getArgs()', () => {
  it('should return CLI arguments in a structured format', async () => {
    await mockArgv([], async () => {
      expect(getArgs()).toEqual({});
    });

    await mockArgv(['add'], async () => {
      expect(getArgs()).toEqual({ action: 'add' });
    });

    await mockArgv(['add', 'component'], async () => {
      expect(getArgs()).toEqual({
        action: 'add',
        type: 'component',
      } as ArgsType);
    });
  });
});
