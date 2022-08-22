#!/usr/bin/env node
import execute from './execute';
import getConfig from './getConfig';
export { ScriptArgs as PostAddScriptArgs } from './hooks/utils/runPostAddScript';

getConfig().then(({ config: config, env }) => execute(config, env));
