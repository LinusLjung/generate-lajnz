import ejs from 'ejs';
import fs from 'fs/promises';
import glob from 'glob';
import os from 'os';
import path from 'path';
import copy from 'recursive-copy';
import TargetExistsError from './utils/TargetExistsError';

async function copyToTmp(dir: string): Promise<string> {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'glz-'));

  await copy(dir, tmpDir);

  return tmpDir;
}

function getFiles(dir: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    glob(path.join(dir, '**/*'), (err, matches) => {
      if (err) {
        return reject(err);
      }
      resolve(matches);
    });
  });
}

async function isDir(path: string) {
  return fs.lstat(path).then((stats) => stats.isDirectory());
}

export function replaceFilenameVariables(files: string[], variables: Record<string, string>): [string, string][] {
  return files
    .filter((file) => !!file.match(/{{.*}}/))
    .reduce<[string, string][]>(
      (acc, file) => [
        ...acc,
        [
          file,
          Object.entries(variables)
            .filter(([, value]) => value)
            .reduce((file, [key, value]) => file.replaceAll(`{{${key}}}`, value), file),
        ],
      ],
      [],
    );
}

export async function renameFiles(files: string[], variables: Record<string, string>) {
  const filesToRename = replaceFilenameVariables(files, variables);

  for (const [file, newFile] of filesToRename) {
    if (await isDir(file)) {
      await fs.mkdir(newFile);
      continue;
    }

    await fs.copyFile(file, newFile);
  }

  for (const [file, newFile] of [...filesToRename].reverse()) {
    // Don't delete files that couldn't be renamed
    if (file === newFile) {
      continue;
    }

    if (await isDir(file)) {
      fs.rmdir(file);
      continue;
    }

    await fs.rm(file);
  }

  return filesToRename.map(([, newFile]) => newFile);
}

export async function renderFile(file: string, variables: Record<string, string>) {
  try {
    await fs.writeFile(file, await ejs.renderFile(file, variables));
  } catch (e) {
    if ((e as Error).name !== 'ReferenceError') {
      throw e;
    }
  }
}

export function compileFiles(files: string[], variables: Record<string, string>): Promise<string[]> {
  return Promise.all(
    files.map(async (file) => {
      if (!file.endsWith('.ejs')) {
        return file;
      }

      return renderFile(file, variables).then(async () => {
        const newFileName = file.replace(/\.ejs$/, '');

        await fs.rename(file, newFileName);

        return newFileName;
      });
    }),
  );
}

export async function copyToProject(tmpDir: string, targetDir: string) {
  const exists = await targetExists(targetDir);

  if (exists) {
    throw new TargetExistsError(targetDir);
  }

  await copy(tmpDir, targetDir);
}

async function targetExists(target: string) {
  let exists = true;

  try {
    await fs.stat(target);
  } catch (e) {
    // If it throws, it hopefully means the folder doesn't exist, which is what we want
    exists = false;
  }

  return exists;
}

async function add(filesDir: string, targetDir: string, variables: { name: string } & Record<string, string>) {
  const exists = await targetExists(targetDir);

  if (exists) {
    throw new TargetExistsError(targetDir);
  }

  const tmpDir = await copyToTmp(filesDir);
  let files = await getFiles(tmpDir);
  files = await compileFiles(files, variables);
  await renameFiles(files, variables);
  await copyToProject(tmpDir, path.join(targetDir, variables.name));
}

export default add;
