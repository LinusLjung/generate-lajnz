import runScript from './runScript';

type Files = string[];
type Variables = Record<string, string>;
export type ScriptArgs = [string, Variables, Files];

function runPostAddScript(file: string, isTs: boolean, ...args: ScriptArgs) {
  runScript(file, isTs, ...args);
}

export default runPostAddScript;
