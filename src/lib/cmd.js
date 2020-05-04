const { Buffer } = require('buffer');
const { spawn } = require('child_process');


module.exports = {
  splitCommandAndArgs: function (command) {
    const regex = new RegExp('"[^"]+"|[\\S]+', 'g');
    return command.match(regex).map(s => s.replace(/"/g, ''));
  }, exec: async (command, options={}) => {
    return new Promise((resolve, reject) => {
      let items = module.exports.splitCommandAndArgs(command);

      const child = spawn(items[0], items.slice(1), options);
      if(options.detached) {
        child.unref();
        resolve(child.pid);
        return;
      }
      let match = false;
      let output = new Buffer.from('');

      child.stdout.on('data', (data) => {
        if (options.matcher && options.matcher.test(data)) {
          match = true;
          child.kill('SIGTERM');
          resolve();
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
          console.error(`Command execution failed with code: ${code}`);
          reject(new Error(code));
        }
        else {
          resolve(output);
        }
      });
    });
  }
}
