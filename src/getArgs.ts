import minimist from 'minimist';

export type ArgsType = {
  action: string;
  type: string;
  name: string;
};

export function getArgs(): ArgsType {
  const {
    _: [action, type, name],
  } = minimist(process.argv.slice(2));

  return {
    action,
    type,
    name,
  };
}
