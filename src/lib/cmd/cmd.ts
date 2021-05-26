import { Buffer } from 'buffer';
import { spawn } from 'child_process';
import logger from '../logger';

export type Options = {
  cwd?: string;
  verbose?: boolean;
  detached?: boolean;
  matcher?: RegExp;
};

const cmd = {
  splitCommandAndArgs: function (command: string): string[] {
    const regex = new RegExp('"[^"]+"|[\\S]+', 'g');
    const matches = command.match(regex);

    if (!matches) return [];

    return matches.map((s) => s.replace(/"/g, ''));
  },
  exec: async (command: string, options: Options) => {
    return new Promise<any>((resolve, reject) => {
      const items = cmd.splitCommandAndArgs(command);

      const child = spawn(items[0], items.slice(1), options);
      if (options.detached) {
        child.unref();
        resolve(child.pid);
        return;
      }
      let match = false;
      let output = Buffer.from('') as Buffer;

      child.stdout.on('data', (data) => {
        if (options.matcher && options.matcher.test(data)) {
          match = true;
          child.kill('SIGTERM');
          resolve(undefined);
          return;
        }
        output = Buffer.concat([output, data]);
        if (options.verbose) {
          console.log(data.toString());
        }
      });

      child.stderr.on('data', (data) => {
        output = Buffer.concat([output, data]);
        if (options.verbose) {
          console.log(data.toString());
        }
      });

      child.on('close', (code) => {
        if (code !== 0 && !match) {
          logger.error(`Command execution failed with code: ${code}`);
          reject(new Error(`${code}`));
        } else {
          resolve(output);
        }
      });
    });
  },
};

export default cmd;
