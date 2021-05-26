import ospath from 'ospath';
import path from 'path';

type ProjectConfig = {
  project: string;
};

class Project {
  private readonly name: string;

  constructor(cfg: ProjectConfig) {
    this.name = cfg.project;
  }

  path() {
    return path.join(ospath.data(), 'polkadot-secure-validator', 'build', this.name);
  }
}

export default Project;
