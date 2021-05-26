import config from '../config/config';
import Application from '../application';
import getPlatformResult from '../getPlatformResult';
import logger from '../logger';

const rotateKeys = {
  do: async (cmd: { config: string }) => {
    const cfg = config.read(cmd.config);

    logger.info('Rotating Keys...');
    const platformResult = await getPlatformResult(cfg, logger);

    logger.info('Rotating application Keys...');
    const app = new Application(cfg, platformResult);
    try {
      await app.rotateKeys();
    } catch (e) {
      logger.error(`Could not rotate application Keys: ${e.message}`);
      process.exit(-1);
    }
    logger.success('Done');
  },
};

export default rotateKeys;
