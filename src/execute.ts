import inquirer from 'inquirer';
import { LiftoffEnv } from 'liftoff';
import path from 'path';
import add from './actions/add';
import { getArgs } from './getArgs';
import getTypeFields from './getTypeFields';
import init from './init';
import { RcType } from './types';
import verifyType from './verifyType';

const args = getArgs();

async function getAnwsers(availableActions: string[], availableTypes: string[]) {
  return inquirer.prompt<Record<'action' | 'type' | 'name', string>>(
    [
      { type: 'list', name: 'action', message: 'Choose action', choices: availableActions },
      { type: 'list', name: 'type', message: 'Choose type', choices: availableTypes },
      { name: 'name' },
    ],
    args,
  );
}

async function getVariables(variableNames: string[]): Promise<Record<string, string>> {
  if (!variableNames?.length) {
    return {};
  }

  console.log('Provide values for variables');
  return inquirer.prompt<Record<keyof typeof variableNames, string>>(
    variableNames.map((name) => ({
      name,
    })),
  );
}

async function execute(config: RcType, env: LiftoffEnv) {
  if (args.action === 'init') {
    return init(config, env);
  }

  getAnwsers([], []);

  // console.log('config', config);
  // console.log('env', env);

  const availableTypes = Object.keys(config.types);

  const answers = await getAnwsers(['add'], availableTypes);

  const { configBase } = env;

  if (!configBase) {
    console.error('Error: Could not find the folder of the config file');
    process.exit(1);
  }

  const { action, name, type } = answers;

  // console.log(action, name, type);

  if (!verifyType(config, type)) {
    console.error(`Error: Could not find type with name ${type}`);
    console.log(`Available types are:\n${availableTypes.join('\n')}`);
    process.exit(1);
  }

  const [rootDir, variables] = getTypeFields<[string, string[]]>(config, type, ['rootDir', 'variables']);

  const variableValues = {
    name,
    // Ignore 'name' from variables and use the name from the first anwser
    ...(await getVariables(variables.filter((name) => name === 'name'))),
  };

  add(path.join(configBase, '.glz', type), rootDir, variableValues);

  if (action === 'remove') {
    throw new Error('Not implemented');
  }
}

export default execute;
