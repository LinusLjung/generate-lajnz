import fs from 'fs';
import LiftOff, { LiftoffEnv } from 'liftoff';
import path from 'path';
import requireConfig from './requireConfig';
import { RcType } from './types';
import validateConfig from './validateConfig';

const CONFIG_NAME = '.glzrc';

const { name } = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json')).toString());

function getConfig(): Promise<{ config: RcType; env: LiftoffEnv }> {
  return new Promise((resolve, reject) => {
    new LiftOff({
      name: 'Generate Lajnz',
      processTitle: 'glz',
      moduleName: name,
      configName: CONFIG_NAME,
      extensions: {
        '': null,
        '.json': null,
        '.js': null,
      },
    }).prepare({}, (env) => {
      const { configPath } = env;

      if (!configPath) {
        return reject(new Error(`Could not find ${CONFIG_NAME}`));
      }

      const config = requireConfig(configPath);

      if (!validateConfig(config)) {
        return reject(new Error(`${CONFIG_NAME} contains invalid data`));
      }

      resolve({ config, env });
    });
  });
}

export default getConfig;
