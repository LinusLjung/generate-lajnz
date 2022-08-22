import fs from 'fs';
import path from 'path';
import { FOLDER_NAME, HOOKS_FOLDER_NAME, HOOK_NAMES } from '../consts';
import runPostAddScript, { ScriptArgs } from './utils/runPostAddScript';

export function getHookPath(rootDir: string, name: typeof HOOK_NAMES[keyof typeof HOOK_NAMES]) {
  const hooksDir = path.join(rootDir, FOLDER_NAME, HOOKS_FOLDER_NAME);
  const hooks = fs.readdirSync(hooksDir);

  const hook = hooks.find((hook) => path.parse(hook).name === name);

  if (!hook) {
    return null;
  }

  return { dir: hooksDir, file: path.resolve(hooksDir, hook) };
}

export function isTypescript(file: string) {
  return path.parse(file).ext === '.ts';
}

export function postAdd(rootDir: string, ...scriptArgs: ScriptArgs) {
  const hookPath = getHookPath(rootDir, HOOK_NAMES.postAdd);

  if (!hookPath) {
    return;
  }

  const { dir, file } = hookPath;

  runPostAddScript(path.resolve(dir, path.parse(file).name), isTypescript(file), ...scriptArgs);
}

export default postAdd;
