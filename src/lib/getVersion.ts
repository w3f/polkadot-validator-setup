// eslint-disable-next-line @typescript-eslint/no-var-requires
import packageJSON from '../../package.json';

const getVersion = (): string => packageJSON.version;

export default getVersion;
