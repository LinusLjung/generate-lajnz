import fs from 'fs';
import os from 'os';
import copy from 'recursive-copy';
import path from 'path';
import glob from 'glob';

async function copyToTmp(dir: string): string {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'glz'));

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

function renameFiles(files: string[], variables?: Record<string, string>) {
  const filesToRename = files
    .map((file) => file.match(/\{\{([^}]+)/))
    .filter<RegExpMatchArray>((match) => !!match)
    .map((match: RegExpMatchArray) => ({ variable: match[1], input: match. }));
}

function renderFiles() {}

function copyToProject() {}

async function add(filesDir: string, targetDir: string, variables?: Record<string, string>) {
  const tmpDir = await copyToTmp(filesDir);
  const files = await getFiles(tmpDir);
  renameFiles(files);
  console.log(await getFiles(tmpDir));
}

export default add;
