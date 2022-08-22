jest.mock('../utils/runScript');
import mockFs from 'mock-fs';
import path from 'path';
import { FOLDER_NAME, HOOKS_FOLDER_NAME, HOOK_NAMES } from '../../consts';
import postAdd, { getHookPath, isTypescript } from '../postAdd';
import runScript from '../utils/runScript';

const ROOT_DIR = '/project';

describe('postAdd', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    mockFs.restore();
  });

  describe('getHookPath()', () => {
    it('should return the path', () => {
      const mockedFs = { [ROOT_DIR]: { [FOLDER_NAME]: { [HOOKS_FOLDER_NAME]: { [HOOK_NAMES.postAdd]: '' } } } };

      mockFs(mockedFs);

      const { dir, file } = getHookPath(ROOT_DIR, HOOK_NAMES.postAdd) ?? {};

      expect(dir).toBe(path.join(ROOT_DIR, FOLDER_NAME, HOOKS_FOLDER_NAME));
      expect(file).toBe(path.join(dir as string, HOOK_NAMES.postAdd));
    });

    it("should return null if the file can't be found", () => {
      const mockedFs = { [ROOT_DIR]: { [FOLDER_NAME]: { [HOOKS_FOLDER_NAME]: {} } } };

      mockFs(mockedFs);

      expect(getHookPath(ROOT_DIR, HOOK_NAMES.postAdd)).toBe(null);
    });
  });

  describe('isTypescript()', () => {
    it.each([
      ['file.ts', true],
      ['/path/to/file.ts', true],
      ['file.js', false],
      ['file.tsx', false],
      ['file.ats', false],
      ['path/to/.ts/file.ats', false],
    ])('should return true if file is ts, (%s)', (file, expected) => {
      expect(isTypescript(file)).toBe(expected);
    });

    it.each([[null], [undefined], [{}]])('should throw error for if input is not string', (file) => {
      expect(() => isTypescript(file as string)).toThrow();
    });
  });

  describe('postAdd()', () => {
    it('should run the script', () => {
      const mockedFs = { [ROOT_DIR]: { [FOLDER_NAME]: { [HOOKS_FOLDER_NAME]: { [`${HOOK_NAMES.postAdd}.ts`]: '' } } } };

      mockFs(mockedFs);
      postAdd(ROOT_DIR);

      expect(runScript).toHaveBeenCalledTimes(1);
      expect(runScript).toHaveBeenLastCalledWith(
        path.join(ROOT_DIR, FOLDER_NAME, HOOKS_FOLDER_NAME, HOOK_NAMES.postAdd),
        true,
      );
    });

    it('should handle missing path', () => {
      const mockedFs = { [ROOT_DIR]: { [FOLDER_NAME]: { [HOOKS_FOLDER_NAME]: {} } } };

      mockFs(mockedFs);
      postAdd(ROOT_DIR);

      expect(runScript).not.toHaveBeenCalled();
    });
  });
});
