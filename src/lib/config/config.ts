import path from 'path';
import files from '../files';
import logger from '../logger';
import validateUserOptions from './validateConfig';
import { Config } from './validateConfig/types';

const config = {
  read: (rawCfgPath: string): Config => {
    const cfgPath = path.resolve(process.cwd(), rawCfgPath);
    const dto = files.readJSON(cfgPath);
    const { error } = validateUserOptions(dto);

    if (error) {
      logger.error('Configuration error! See config/main.json');
      logger.error(error.errors.join('\n'));
      throw error;
    }

    return dto as Config;
  },
};

export default config;
