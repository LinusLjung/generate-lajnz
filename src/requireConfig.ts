import fs from 'fs';
import { RcType } from './types';

export const EXTENSIONS_TO_REQUIRE = ['.json', '.js'] as const;

function requireConfig(configPath: string): RcType {
  if (EXTENSIONS_TO_REQUIRE.some((extension) => configPath.endsWith(extension))) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(configPath);
  }

  return JSON.parse(fs.readFileSync(configPath).toString());
}

export default requireConfig;
