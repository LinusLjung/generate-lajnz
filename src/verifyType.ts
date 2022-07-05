import { RcType } from './types';

function verifyType(config: RcType, type: string): boolean {
  return !!config?.types?.[type];
}

export default verifyType;
