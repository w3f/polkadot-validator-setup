import config from '../config/config';
import Platform from '../platform';
import logger from '../logger';

const plan = {
  do: async (cmd: { config: string }) => {
    const cfg = config.read(cmd.config);

    logger.info('Calculating plan...');
    const platform = new Platform(cfg);

    try {
      await platform.plan();
    } catch (e) {
      logger.error(`Could not calculate plan: ${e.message}`);
      process.exit(-1);
    }
    logger.success('Done');
  },
};

export default plan;
