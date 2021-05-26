import chalk from 'chalk';

export interface ILogger {
  success: (msg: string) => any;
  error: (msg: string) => any;
  info: (msg: string) => any;
}

const logger: ILogger = {
  success: (msg: string) => {
    console.log(chalk.green(msg));
  },
  error: (msg: string) => {
    console.log(chalk.red(msg));
  },
  info: (msg: string) => {
    console.log(chalk.yellow(msg));
  },
};

export default logger;
