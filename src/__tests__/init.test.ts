import { LiftoffEnv } from 'liftoff';
import mock from 'mock-fs';
import init, { FOLDER_NAME } from '../init';
import fs from 'fs/promises';

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
  it('should setup a folder structure based on config', async () => {
    mock(mockedFs);

    await mockedInit();

    const content = await fs.readdir(`${PROJECT_PATH}/${FOLDER_NAME}`);

    expect(content).toEqual(['package', 'service']);
  });

  it('should ignore existing folders', async () => {
    mock({
      ...mockedFs,
      [PROJECT_PATH]: {
        [FOLDER_NAME]: {
          package: {},
        },
      },
    });

    console.log(await fs.readdir(`${PROJECT_PATH}/${FOLDER_NAME}`));

    await mockedInit();

    const content = await fs.readdir(`${PROJECT_PATH}/${FOLDER_NAME}`);

    console.log(content);

    expect(content).toEqual(['package', 'service']);
  });

  afterEach(() => mock.restore());
});
