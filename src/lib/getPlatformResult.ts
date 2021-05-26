import Platform, { PlatformResult } from './platform';
import { ILogger } from './logger';
import { Config } from './config/validateConfig/types';

const getPlatformResult = async (cfg: Config, logger?: ILogger): Promise<PlatformResult> => {
  const platform = new Platform(cfg);
  let platformResult;
  try {
    platformResult = await platform.output();
  } catch (e) {
    logger && logger.error(`Could not get output from platform: ${e.message}`);
    process.exit(-1);
  }
  logger && logger.success('Done');

  return platformResult;
};

export default getPlatformResult;
