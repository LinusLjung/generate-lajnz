import fsSync from 'fs';
import fs from 'fs/promises';
import { LiftoffEnv } from 'liftoff';
import { FOLDER_NAME, HOOKS_FOLDER_NAME } from './consts';
import { RcType } from './types';

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
    [...Object.keys(config.types), HOOKS_FOLDER_NAME].map(async (type) => {
      const path = `${folderPath}/${type}`;

      return makeDir(path);
    }),
  );
}

export default init;
