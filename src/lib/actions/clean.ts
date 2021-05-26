import config from '../config/config';
import Platform from '../platform';
import logger from '../logger';

const clean = {
  do: async (cmd: { config: string }) => {
    const cfg = config.read(cmd.config);

    logger.info('Cleaning platform...');
    const platform = new Platform(cfg);
    try {
      await platform.clean();
    } catch (e) {
      logger.error(`Could not clean platform: ${e.message}`);
      process.exit(-1);
    }
    logger.success('Done');
  },
};

export default clean;
