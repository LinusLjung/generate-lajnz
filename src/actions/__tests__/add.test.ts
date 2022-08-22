import mockFs from 'mock-fs';
import fs from 'fs';
import { renameFiles, compileFiles, replaceFilenameVariables, copyToProject, renderFile } from '../add';
import glob from 'glob';
import path from 'path';

describe('add', () => {
  describe('replaceFilenameVariables()', () => {
    it.each([
      [[], {}, []],
      [[], { name: '1', name2: '2' }, []],
      [
        ['/src/{{name}}/{{name2}}.ts', '/src/{{name4}}/{{name4}}/{{name4}}.ts', '/src/dir/{{name3}}.ts'],
        {},
        [
          ['/src/{{name}}/{{name2}}.ts', '/src/{{name}}/{{name2}}.ts'],
          ['/src/{{name4}}/{{name4}}/{{name4}}.ts', '/src/{{name4}}/{{name4}}/{{name4}}.ts'],
          ['/src/dir/{{name3}}.ts', '/src/dir/{{name3}}.ts'],
        ],
      ],
      [
        ['/src/{{name}}/{{name2}}.ts', '/src/{{name4}}/{{name4}}/{{name4}}.ts', '/src/dir/{{name3}}.ts'],
        { name: '', name2: '', name3: '', name4: '' },
        [
          ['/src/{{name}}/{{name2}}.ts', '/src/{{name}}/{{name2}}.ts'],
          ['/src/{{name4}}/{{name4}}/{{name4}}.ts', '/src/{{name4}}/{{name4}}/{{name4}}.ts'],
          ['/src/dir/{{name3}}.ts', '/src/dir/{{name3}}.ts'],
        ],
      ],
      [
        [
          '/src',
          '/src/{{name}}',
          '/src/{{name}}.ts',
          '/src/{{name}}/{{name}}.ts',
          '/src/{{name}}/{{name2}}',
          '/src/{{name}}/{{name2}}/{{name3}}.ts',
          '/src/{{name}}/{{name4}}.ts',
          '/src/{{name2}}.ts.ejs',
          '/src/{{name3}}.ts.ejs',
          '/src/index.ts',
        ],
        { name: '1', name2: '2', name3: '3', name4: '4' },
        [
          ['/src/{{name}}', '/src/1'],
          ['/src/{{name}}.ts', '/src/1.ts'],
          ['/src/{{name}}/{{name}}.ts', '/src/1/1.ts'],
          ['/src/{{name}}/{{name2}}', '/src/1/2'],
          ['/src/{{name}}/{{name2}}/{{name3}}.ts', '/src/1/2/3.ts'],
          ['/src/{{name}}/{{name4}}.ts', '/src/1/4.ts'],
          ['/src/{{name2}}.ts.ejs', '/src/2.ts.ejs'],
          ['/src/{{name3}}.ts.ejs', '/src/3.ts.ejs'],
        ],
      ],
    ])('should replace variables in folder and file names', (files, variables, expected) => {
      expect(replaceFilenameVariables(files, variables)).toEqual(expected);
    });
  });

  describe('renameFiles()', () => {
    afterEach(() => mockFs.restore());

    it('should rename files in folder based on variables', async () => {
      const files = [
        '/src',
        '/src/{{name}}',
        '/src/{{name}}.ts',
        '/src/{{name}}/{{name}}.ts',
        '/src/{{name}}/{{name2}}',
        '/src/{{name}}/{{name2}}/{{name3}}.ts',
        '/src/{{name}}/{{name4}}.ts',
        '/src/{{name2}}.ts.ejs',
        '/src/{{name3}}.ts.ejs',
        '/src/index.ts',
      ];
      const variables = { name: '1', name2: '2' };

      mockFs({
        '/src': {
          '{{name}}': {
            '{{name}}.ts': '',
            '{{name2}}': {
              '{{name3}}.ts': '',
            },
            '{{name4}}.ts': '',
          },
          '{{name}}.ts': '',
          '{{name4}}': { '{{name4}}': { '{{name4}}.ts': '' } },
          '{{name2}}.ts.ejs': '',
          '{{name3}}.ts.ejs': '',
          'index.ts': '',
        },
      });

      await renameFiles(files, variables);

      const [srcContent, srcNameContent, srcNameName2Content] = await Promise.all([
        fs.promises.readdir('/src'),
        fs.promises.readdir('/src/1'),
        fs.promises.readdir('/src/1/2'),
      ]);

      expect(srcContent).toEqual(
        expect.arrayContaining(['1', '1.ts', '{{name4}}', '2.ts.ejs', '{{name3}}.ts.ejs', 'index.ts']),
      );
      expect(srcNameContent).toEqual(expect.arrayContaining(['1.ts', '2', '{{name4}}.ts']));
      expect(srcNameName2Content).toEqual(expect.arrayContaining(['{{name3}}.ts']));
    });
  });

  describe('compileFiles()', () => {
    afterEach(() => mockFs.restore());

    function getMock(): [string[], string, Record<string, string>] {
      const variables = {
        name1: '1',
        name2: '2',
      };
      const files = ['/src/1.ts', '/src/2/2.ts.ejs'];
      const fileOneContent = "console.log('<%= name1 %>');";

      mockFs({
        '/src': {
          '1.ts': fileOneContent,
          '2': {
            '2.ts.ejs': "console.log('<%= name2 %>');",
          },
        },
      });

      return [files, fileOneContent, variables];
    }

    it('should replace variables in template files', async () => {
      const [files, fileOneContent, variables] = getMock();

      await compileFiles(files, variables);

      expect(fs.readFileSync('/src/1.ts', { encoding: 'utf8' })).toBe(fileOneContent);
      expect(fs.readFileSync('/src/2/2.ts', { encoding: 'utf8' })).toBe("console.log('2');");
      expect(() => {
        fs.readFileSync('/src/2/2.ts.ejs');
      }).toThrow();
    });

    it('should return the list of files', async () => {
      const [files, , variables] = getMock();

      expect(await compileFiles(files, variables)).toEqual(['/src/1.ts', '/src/2/2.ts']);
    });
  });

  describe('renderFile()', () => {
    afterEach(() => mockFs.restore());

    it('should handle missing variables gracefully', async () => {
      const FILE_NAME = '/file.ts.ejs';
      mockFs({
        [FILE_NAME]: "console.log('<%= test1 %>');",
      });

      expect(renderFile(FILE_NAME, {})).resolves.not.toThrow();
    });
  });

  describe('copyToProject()', () => {
    afterEach(() => mockFs.restore());

    const TMP_FOLDER = '/tmp/glz';
    const SOURCE_FOLDER = '/src';
    const TARGET_FOLDER = path.join(SOURCE_FOLDER, 'target');

    it('should copy all files from tmp folder to target folder', async () => {
      function getFiles(dir: string): Promise<string[]> {
        return new Promise((resolve) => {
          glob(path.join(dir, '**/*'), (_err, matches) => {
            resolve(matches.map((match) => match.replace(dir, '')));
          });
        });
      }

      mockFs({
        [TMP_FOLDER]: {
          dir1: {
            file1: 'file 1',
            dir2: {
              file2: 'file 2',
            },
          },
          file3: 'file 3',
        },
        [SOURCE_FOLDER]: {},
      });

      const mockFiles = await getFiles(TMP_FOLDER);

      await copyToProject(TMP_FOLDER, TARGET_FOLDER);

      const targetFiles = await getFiles(TARGET_FOLDER);

      expect(targetFiles).toEqual(expect.arrayContaining(mockFiles));
    });

    it('should throw if the target folder already exists', async () => {
      mockFs({
        [TMP_FOLDER]: {
          dir1: {},
        },
        [TARGET_FOLDER]: {},
      });

      await expect(() => copyToProject(TMP_FOLDER, TARGET_FOLDER)).rejects.toThrow();
    });
  });
});
