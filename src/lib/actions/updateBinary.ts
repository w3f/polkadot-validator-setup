import config from '../config/config';
import Application from '../application';
import getPlatformResult from '../getPlatformResult';
import logger from '../logger';

const updateBinary = {
  do: async (cmd: { config: string }) => {
    const cfg = config.read(cmd.config);

    logger.info('Updating binary...');
    const platformResult = await getPlatformResult(cfg, logger);

    logger.info('Updating application binary...');
    const app = new Application(cfg, platformResult);
    try {
      await app.updateBinary();
    } catch (e) {
      logger.error(`Could not update application binary: ${e.message}`);
      process.exit(-1);
    }
    logger.success('Done');
  },
};

export default updateBinary;
