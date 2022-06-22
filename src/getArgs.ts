import minimist from 'minimist';

export type ArgsType = {
  action: string;
  type: string;
};

export function getArgs(): ArgsType {
  const {
    _: [action, type],
  } = minimist(process.argv.slice(2));

  return {
    action,
    type,
  };
}
