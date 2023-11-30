import { spawn } from 'child_process';

function runScript(file: string, isTs: boolean, ...args: unknown[]) {
  const imports = isTs ? `import script from '${file}'` : `const script = require('${file}');`;
  const code = `
    ${imports}
    script(...${JSON.stringify(args)});
  `;

  const spawnArgs: [string, string[]] = isTs ? ['npx', ['ts-node']] : ['node', []];

  spawnArgs[1].push('-e', code);

  const child = spawn(...spawnArgs, {
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
