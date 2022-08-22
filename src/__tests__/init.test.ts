import fs from 'fs/promises';
import { LiftoffEnv } from 'liftoff';
import mockFs from 'mock-fs';
import { FOLDER_NAME, HOOKS_FOLDER_NAME } from '../consts';
import init from '../init';

const PROJECT_PATH = '/project';

const mockedFs = { [PROJECT_PATH]: { '.glzrc': '' } };

function mockedInit() {
  return init(
    {
      types: {
        package: {},
        service: {},
      },
    },
    {
      configBase: PROJECT_PATH,
    } as LiftoffEnv,
  );
}

describe('init()', () => {
  afterEach(() => mockFs.restore());

  it('should setup a folder structure based on config', async () => {
    mockFs(mockedFs);

    await mockedInit();

    const content = await fs.readdir(`${PROJECT_PATH}/${FOLDER_NAME}`);

    expect(content).toIncludeSameMembers(['package', 'service', HOOKS_FOLDER_NAME]);
  });

  it('should ignore existing folders', async () => {
    mockFs({
      ...mockedFs,
      [PROJECT_PATH]: {
        [FOLDER_NAME]: {
          package: {},
        },
      },
    });

    await mockedInit();

    const content = await fs.readdir(`${PROJECT_PATH}/${FOLDER_NAME}`);

    expect(content).toIncludeSameMembers(['package', 'service', HOOKS_FOLDER_NAME]);
  });
});
