import { validate } from 'jsonschema';
import schema from './.glzrc.schema.json';
import { RcType } from './types';

function validateConfig(config: RcType): boolean {
  return validate(config, schema, { throwAll: true, nestedErrors: true }).valid;
}

export default validateConfig;
