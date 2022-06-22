import { getArgs } from './getArgs';
import { RcType } from './types';
import inquirer from 'inquirer';
import { LiftoffEnv } from 'liftoff';
import init from './init';

const args = getArgs();

async function execute(config: RcType, env: LiftoffEnv) {
  if (args.action === 'init') {
    return init(config, env);
  }

  inquirer
    .prompt(
      [
        { type: 'list', name: 'action', message: 'Choose action', choices: ['add', 'remove'] },
        { type: 'list', name: 'target', message: 'Choose target', choices: ['package', 'component'] },
      ],
      args,
    )
    .then(console.log);
}

export default execute;
