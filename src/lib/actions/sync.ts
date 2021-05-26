import config from '../config/config';
import Application from '../application';
import logger from '../logger';
import getPlatformResult from '../getPlatformResult';

const sync = {
  do: async (cmd: { config: string }) => {
    const cfg = config.read(cmd.config);

    logger.info('Syncing platform...');
    const platformResult = await getPlatformResult(cfg, logger);

    logger.info('Syncing application...');
    const app = new Application(cfg, platformResult);
    try {
      await app.sync();
    } catch (e) {
      logger.error(`Could not sync application: ${e.message}`);
      process.exit(-1);
    }
    logger.success('Done');
  },
};

export default sync;
