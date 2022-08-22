import { spawn } from 'child_process';

function runScript(file: string, isTs: boolean) {
  const processName = isTs ? 'ts-node' : 'node';
  const imports = isTs ? `import postAdd from '${file}'` : `const script = require('${file}');`;
  const code = `
    ${imports}
    script('arg1');
  `;

  const child = spawn('npx', [processName, '-e', code], {
    stdio: 'inherit',
  });

  child.on('exit', (code, signal) => {
    if (typeof code === 'number' && code > 0) {
      console.error(`Process exited with non-zero code: ${code}`);
    }

    if (signal) {
      console.error(`Process exited with signal: ${signal}`);
    }
  });
}

export default runScript;
