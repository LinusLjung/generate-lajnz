import minimist from 'minimist';
import { ActionType, PromptType } from './types';

export type ArgsType = PromptType;

export function getArgs(): ArgsType {
  const {
    _: [action, type, name],
  } = minimist(process.argv.slice(2));

  return {
    action: action as ActionType,
    type,
    name,
  };
}
