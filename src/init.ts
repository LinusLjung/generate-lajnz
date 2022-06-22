import { LiftoffEnv } from 'liftoff';
import { RcType } from './types';
import fs from 'fs/promises';
import fsSync from 'fs';

const FOLDER_NAME = '.glz';

async function makeDir(path: string): Promise<void> {
  if (fsSync.existsSync(path)) {
    return;
  }

  return fs.mkdir(path);
}

async function init(config: RcType, { configBase }: LiftoffEnv): Promise<void> {
  const folderPath = `${configBase}/${FOLDER_NAME}`;

  makeDir(folderPath);

  await Promise.all(
    Object.keys(config.types).map(async (type) => {
      const path = `${folderPath}/${type}`;

      return makeDir(path);
    }),
  );
}

export { FOLDER_NAME };

export default init;
