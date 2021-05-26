import config from '../config/config';
import Application from '../application';
import getPlatformResult from '../getPlatformResult';
import logger from '../logger';

const restoreDB = {
  do: async (cmd: { config: string }) => {
    const cfg = config.read(cmd.config);

    logger.info('Restoring Database...');
    const platformResult = await getPlatformResult(cfg, logger);

    logger.info('Restoring application Database...');
    const app = new Application(cfg, platformResult);
    try {
      await app.restoreDB();
    } catch (e) {
      logger.error(`Could not restore application database: ${e.message}`);
      process.exit(-1);
    }
    logger.success('Done');
  },
};

export default restoreDB;
