#!/usr/bin/env node
import execute from './execute';
import getConfig from './getConfig';

getConfig().then(({ config, env }) => execute(config, env));
